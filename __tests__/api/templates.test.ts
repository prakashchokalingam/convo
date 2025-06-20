import { auth } from '@clerk/nextjs';
import { db } from '@/lib/db';
import { getUserWorkspaceRole, checkWorkspacePermission } from '@/lib/rbac';
import { createId } from '@paralleldrive/cuid2';

// Import handlers - THIS IS A GUESS. Actual imports depend on project structure.
// Assuming named exports from the route files.
import { POST as createTemplateHandler } from '@/app/api/templates/route';
// For [id] routes, Next.js typically expects handler files in /api/templates/[id]/route.ts
// If PUT and DELETE are in the same file:
import { PUT as updateTemplateHandler, DELETE as deleteTemplateHandler }
    from '@/app/api/templates/[id]/route';
import { POST as cloneTemplateHandler }
    from '@/app/api/templates/[id]/clone/route';


// --- Mocks ---
// Using vi from Vitest for mocking
import { vi } from 'vitest';

vi.mock('@clerk/nextjs', () => ({
  auth: vi.fn(),
}));

const mockDbInstance = {
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  values: vi.fn().mockReturnThis(),
  returning: vi.fn(),
  update: vi.fn().mockReturnThis(),
  set: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  eq: vi.fn((col, val) => ({ column: col, value: val, operator: 'eq' })),
  and: vi.fn((...args) => ({ conditions: args, operator: 'and' })),
  or: vi.fn((...args) => ({ conditions: args, operator: 'or' })),
};
vi.mock('@/lib/db', () => ({
  db: mockDbInstance,
}));
vi.mock('@/lib/db/schema', () => ({
    templates: { name: 'templates_table_mock' },
    workspaceMembers: { name: 'workspaceMembers_table_mock' },
}));


vi.mock('@/lib/rbac', () => ({
  getUserWorkspaceRole: vi.fn(),
  checkWorkspacePermission: vi.fn(),
}));

vi.mock('@paralleldrive/cuid2', () => ({
  createId: vi.fn().mockReturnValue('new-cuid-id-from-mock'),
}));

async function callApiHandler(handler: Function, requestOptions: {
    method?: string,
    body?: any,
    params?: any,
    query?: any,
    userId?: string | null
}) {
    const { method = 'GET', body = {}, params = {}, query = {}, userId = 'test-user-id' } = requestOptions;
    (auth as ReturnType<typeof vi.fn>).mockReturnValue({ userId }); // Use Vitest mock type
    let req = {
        method,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => body,
        url: `http://localhost/api/test?${new URLSearchParams(query).toString()}`,
    } as any;
    const response = await handler(req, { params });
    const responseBody = await response.json();
    return { status: response.status, body: responseBody };
}


describe('Templates API Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Use vi.clearAllMocks for Vitest
    (auth as ReturnType<typeof vi.fn>).mockReturnValue({ userId: 'test-user-id' });
    (getUserWorkspaceRole as ReturnType<typeof vi.fn>).mockResolvedValue('member');
    (checkWorkspacePermission as ReturnType<typeof vi.fn>).mockResolvedValue(false);
    mockDbInstance.returning.mockImplementation((fields?: Record<string, any>) => Promise.resolve(fields ? [{...fields, id: 'new-template-id', name: 'Test Template'}] : [{ id: 'new-template-id', name: 'Test Template' }]));
    mockDbInstance.select.mockReturnThis();
    mockDbInstance.from.mockReturnThis();
    mockDbInstance.where.mockReturnThis();
    mockDbInstance.limit.mockResolvedValue([]);
    mockDbInstance.set.mockReturnThis();
  });

  describe('POST /api/templates (Create Workspace Template)', () => {
    const requestBody = {
      name: 'Test Template',
      formSchema: {},
      workspaceId: 'ws-1',
    };

    it('SUCCEEDS (201) if user has create_template permission', async () => {
      (getUserWorkspaceRole as ReturnType<typeof vi.fn>).mockResolvedValue('admin');
      (checkWorkspacePermission as ReturnType<typeof vi.fn>).mockResolvedValue(true);

      const { status, body } = await callApiHandler(createTemplateHandler, {
        method: 'POST',
        body: requestBody,
        userId: 'user-with-permission',
      });

      expect(status).toBe(201);
      expect(body.template).toBeDefined();
      expect(body.template.name).toBe(requestBody.name);
      expect(createId).toHaveBeenCalled();
      expect(mockDbInstance.insert).toHaveBeenCalledWith(expect.any(Object));
      expect(mockDbInstance.values).toHaveBeenCalledWith(expect.objectContaining({
        id: 'new-cuid-id-from-mock',
        name: requestBody.name,
        workspaceId: requestBody.workspaceId,
        createdBy: 'user-with-permission',
      }));
    });

    it('FAILS (403) if user does not have create_template permission', async () => {
      (getUserWorkspaceRole as ReturnType<typeof vi.fn>).mockResolvedValue('member');
      (checkWorkspacePermission as ReturnType<typeof vi.fn>).mockResolvedValue(false);

      const { status, body } = await callApiHandler(createTemplateHandler, {
        method: 'POST',
        body: requestBody,
        userId: 'user-without-permission',
      });

      expect(status).toBe(403);
      expect(body.error).toContain("Insufficient permissions");
    });

    it('FAILS (403) if user is not a member of the workspace', async () => {
      (getUserWorkspaceRole as ReturnType<typeof vi.fn>).mockResolvedValue(null);

      const { status, body } = await callApiHandler(createTemplateHandler, {
        method: 'POST',
        body: requestBody,
        userId: 'user-not-in-workspace',
      });

      expect(status).toBe(403);
      expect(body.error).toContain("Access denied");
    });
  });

  describe('PUT /api/templates/[id] (Edit Workspace Template)', () => {
    const templateId = 'tpl-ws-1';
    const workspaceId = 'ws-1';
    const mockTemplate = { id: templateId, name: 'Original Name', workspaceId, isGlobal: false, formSchema: {} };
    const requestBody = { name: 'Updated Name' };

    it('FAILS (403) if template is global', async () => {
      mockDbInstance.limit.mockResolvedValueOnce([{ ...mockTemplate, isGlobal: true }]);
      const { status, body } = await callApiHandler(updateTemplateHandler, {
        method: 'PUT',
        params: { id: templateId },
        body: requestBody,
      });
      expect(status).toBe(403);
      expect(body.error).toContain("Global templates cannot be modified");
    });

    it('SUCCEEDS (200) if user has edit_template permission', async () => {
      mockDbInstance.limit.mockResolvedValueOnce([mockTemplate]);
      (getUserWorkspaceRole as ReturnType<typeof vi.fn>).mockResolvedValue('admin');
      (checkWorkspacePermission as ReturnType<typeof vi.fn>).mockResolvedValue(true);
      mockDbInstance.returning.mockResolvedValueOnce([{ ...mockTemplate, ...requestBody }]);

      const { status, body } = await callApiHandler(updateTemplateHandler, {
        method: 'PUT',
        params: { id: templateId },
        body: requestBody,
      });
      expect(status).toBe(200);
      expect(body.template.name).toBe(requestBody.name);
      expect(mockDbInstance.update).toHaveBeenCalledWith(expect.any(Object));
      expect(mockDbInstance.set).toHaveBeenCalledWith(expect.objectContaining(requestBody));
    });

    it('FAILS (403) if user does not have edit_template permission', async () => {
      mockDbInstance.limit.mockResolvedValueOnce([mockTemplate]);
      (getUserWorkspaceRole as ReturnType<typeof vi.fn>).mockResolvedValue('member');
      (checkWorkspacePermission as ReturnType<typeof vi.fn>).mockResolvedValue(false);
      const { status, body } = await callApiHandler(updateTemplateHandler, {
        method: 'PUT',
        params: { id: templateId },
        body: requestBody,
      });
      expect(status).toBe(403);
      expect(body.error).toContain("Insufficient permissions");
    });

    it('FAILS (403) if user is not a member of the workspace', async () => {
      mockDbInstance.limit.mockResolvedValueOnce([mockTemplate]);
      (getUserWorkspaceRole as ReturnType<typeof vi.fn>).mockResolvedValue(null);
      const { status, body } = await callApiHandler(updateTemplateHandler, {
        method: 'PUT',
        params: { id: templateId },
        body: requestBody,
      });
      expect(status).toBe(403);
      expect(body.error).toContain("Access denied");
    });
  });

  describe('DELETE /api/templates/[id] (Delete Workspace Template)', () => {
    const templateId = 'tpl-ws-1';
    const workspaceId = 'ws-1';
    const mockTemplate = { id: templateId, name: 'To Delete', workspaceId, isGlobal: false };

    it('FAILS (403) if template is global', async () => {
      mockDbInstance.limit.mockResolvedValueOnce([{ ...mockTemplate, isGlobal: true }]);
      const { status, body } = await callApiHandler(deleteTemplateHandler, {
        method: 'DELETE',
        params: { id: templateId },
      });
      expect(status).toBe(403);
      expect(body.error).toContain("Global templates cannot be deleted");
    });

    it('SUCCEEDS (200) if user has delete_template permission', async () => {
      mockDbInstance.limit.mockResolvedValueOnce([mockTemplate]);
      (getUserWorkspaceRole as ReturnType<typeof vi.fn>).mockResolvedValue('admin');
      (checkWorkspacePermission as ReturnType<typeof vi.fn>).mockResolvedValue(true);
      mockDbInstance.delete.mockResolvedValueOnce({ affectedRows: 1 });

      const { status, body } = await callApiHandler(deleteTemplateHandler, {
        method: 'DELETE',
        params: { id: templateId },
      });
      expect(status).toBe(200);
      expect(body.success).toBe(true);
      expect(mockDbInstance.delete).toHaveBeenCalledWith(expect.any(Object));
    });

    it('FAILS (403) if user does not have delete_template permission', async () => {
      mockDbInstance.limit.mockResolvedValueOnce([mockTemplate]);
      (getUserWorkspaceRole as ReturnType<typeof vi.fn>).mockResolvedValue('member');
      (checkWorkspacePermission as ReturnType<typeof vi.fn>).mockResolvedValue(false);
      const { status, body } = await callApiHandler(deleteTemplateHandler, {
        method: 'DELETE',
        params: { id: templateId },
      });
      expect(status).toBe(403);
      expect(body.error).toContain("Insufficient permissions");
    });

    it('FAILS (403) if user is not a member of the workspace', async () => {
        mockDbInstance.limit.mockResolvedValueOnce([mockTemplate]);
        (getUserWorkspaceRole as ReturnType<typeof vi.fn>).mockResolvedValue(null);
        const { status, body } = await callApiHandler(deleteTemplateHandler, {
            method: 'DELETE',
            params: { id: templateId },
        });
        expect(status).toBe(403);
        expect(body.error).toContain("Access denied");
    });
  });

  describe('POST /api/templates/[id]/clone (Clone Template)', () => {
    const globalTemplateId = 'tpl-global-1';
    const wsTemplateId = 'tpl-ws-b-1';
    const targetWorkspaceId = 'ws-a';
    const sourceWorkspaceIdB = 'ws-b';
    const userId = 'user-clone-test';

    const mockGlobalTemplate = { id: globalTemplateId, name: 'Global Test', isGlobal: true, formSchema: {}, cloneCount: 0 };
    const mockWsTemplateB = { id: wsTemplateId, name: 'WS B Template', workspaceId: sourceWorkspaceIdB, isGlobal: false, formSchema: {}, cloneCount: 0 };

    beforeEach(() => {
        (createId as ReturnType<typeof vi.fn>).mockReturnValue('cloned-cuid-id');
        mockDbInstance.returning.mockImplementation((fields?: Record<string, any>) => Promise.resolve(fields ? [{...fields, id: 'cloned-cuid-id'}] : [{id: 'cloned-cuid-id'}]));
        mockDbInstance.update.mockReturnThis();
        mockDbInstance.set.mockResolvedValue({ affectedRows: 1 });
    });

    describe('Cloning Global Template', () => {
      it('SUCCEEDS (201) if user has create_template in target workspace', async () => {
        mockDbInstance.limit.mockResolvedValueOnce([mockGlobalTemplate]);
        (getUserWorkspaceRole as ReturnType<typeof vi.fn>).mockImplementation(async (uid, wsId) =>
            wsId === targetWorkspaceId ? 'member' : null
        );
        (checkWorkspacePermission as ReturnType<typeof vi.fn>).mockImplementation(async (uid, wsId, res, act) =>
            wsId === targetWorkspaceId && res === 'templates' && act === 'create'
        );

        const { status, body } = await callApiHandler(cloneTemplateHandler, {
          method: 'POST',
          params: { id: globalTemplateId },
          body: { workspaceId: targetWorkspaceId },
          userId,
        });

        expect(status).toBe(201);
        expect(body.template.id).toBe('cloned-cuid-id');
        expect(body.template.workspaceId).toBe(targetWorkspaceId);
        expect(body.template.isGlobal).toBe(false);
        expect(body.template.originalTemplateId).toBe(globalTemplateId);
        expect(mockDbInstance.set).toHaveBeenCalledWith(expect.objectContaining({ cloneCount: 1 }));
      });

      it('FAILS (403) if user lacks create_template in target workspace', async () => {
        mockDbInstance.limit.mockResolvedValueOnce([mockGlobalTemplate]);
        (getUserWorkspaceRole as ReturnType<typeof vi.fn>).mockResolvedValue('member');
        (checkWorkspacePermission as ReturnType<typeof vi.fn>).mockResolvedValue(false);
        const { status, body } = await callApiHandler(cloneTemplateHandler, {
            method: 'POST', params: { id: globalTemplateId }, body: { workspaceId: targetWorkspaceId }, userId,
        });
        expect(status).toBe(403);
        expect(body.error).toContain("Insufficient permissions");
      });

      it('FAILS (403) if user not member of target workspace', async () => {
        mockDbInstance.limit.mockResolvedValueOnce([mockGlobalTemplate]);
        (getUserWorkspaceRole as ReturnType<typeof vi.fn>).mockImplementation(async (uid, wsId) =>
            wsId === targetWorkspaceId ? null : 'member'
        );
        const { status, body } = await callApiHandler(cloneTemplateHandler, {
            method: 'POST', params: { id: globalTemplateId }, body: { workspaceId: targetWorkspaceId }, userId,
        });
        expect(status).toBe(403);
        expect(body.error).toContain("Access denied to target workspace");
      });
    });

    describe('Cloning Workspace Template (into same workspace)', () => {
      it('SUCCEEDS (201) if user has create_template in the workspace', async () => {
        mockDbInstance.limit.mockResolvedValueOnce([{...mockWsTemplateB, workspaceId: targetWorkspaceId}]);
        (getUserWorkspaceRole as ReturnType<typeof vi.fn>).mockResolvedValue('member');
        (checkWorkspacePermission as ReturnType<typeof vi.fn>).mockResolvedValue(true);

        const { status, body } = await callApiHandler(cloneTemplateHandler, {
            method: 'POST', params: { id: wsTemplateId }, body: { workspaceId: targetWorkspaceId }, userId,
        });
        expect(status).toBe(201);
        expect(body.template.workspaceId).toBe(targetWorkspaceId);
      });

      it('FAILS (403) if user lacks create_template in the workspace', async () => {
        mockDbInstance.limit.mockResolvedValueOnce([{...mockWsTemplateB, workspaceId: targetWorkspaceId}]);
        (getUserWorkspaceRole as ReturnType<typeof vi.fn>).mockResolvedValue('member');
        (checkWorkspacePermission as ReturnType<typeof vi.fn>).mockResolvedValue(false);
        const { status, body } = await callApiHandler(cloneTemplateHandler, {
            method: 'POST', params: { id: wsTemplateId }, body: { workspaceId: targetWorkspaceId }, userId,
        });
        expect(status).toBe(403);
        expect(body.error).toContain("Insufficient permissions");
      });
    });

    describe('Cloning Workspace Template (into different workspace)', () => {
      it('SUCCEEDS (201) if user has create_template in target AND is member of source ws', async () => {
        mockDbInstance.limit.mockResolvedValueOnce([mockWsTemplateB]);
        (getUserWorkspaceRole as ReturnType<typeof vi.fn>).mockImplementation(async (uid, wsId) => {
            if (wsId === targetWorkspaceId) return 'member';
            if (wsId === sourceWorkspaceIdB) return 'member';
            return null;
        });
        (checkWorkspacePermission as ReturnType<typeof vi.fn>).mockImplementation(async (uid, wsId, res, act) =>
            wsId === targetWorkspaceId && res === 'templates' && act === 'create'
        );
        const { status, body } = await callApiHandler(cloneTemplateHandler, {
            method: 'POST', params: { id: wsTemplateId }, body: { workspaceId: targetWorkspaceId }, userId,
        });
        expect(status).toBe(201);
        expect(body.template.workspaceId).toBe(targetWorkspaceId);
      });

      it('FAILS (403) if user lacks create_template in target workspace', async () => {
        mockDbInstance.limit.mockResolvedValueOnce([mockWsTemplateB]);
        (getUserWorkspaceRole as ReturnType<typeof vi.fn>).mockImplementation(async () => 'member');
        (checkWorkspacePermission as ReturnType<typeof vi.fn>).mockResolvedValue(false);
        const { status, body } = await callApiHandler(cloneTemplateHandler, {
            method: 'POST', params: { id: wsTemplateId }, body: { workspaceId: targetWorkspaceId }, userId,
        });
        expect(status).toBe(403);
        expect(body.error).toContain("Insufficient permissions to create template in target workspace");
      });

      it('FAILS (403) if user not member of source workspace', async () => {
        mockDbInstance.limit.mockResolvedValueOnce([mockWsTemplateB]);
        (getUserWorkspaceRole as ReturnType<typeof vi.fn>).mockImplementation(async (uid, wsId) => {
            if (wsId === targetWorkspaceId) return 'member';
            if (wsId === sourceWorkspaceIdB) return null;
            return null;
        });
        (checkWorkspacePermission as ReturnType<typeof vi.fn>).mockResolvedValue(true);
        const { status, body } = await callApiHandler(cloneTemplateHandler, {
            method: 'POST', params: { id: wsTemplateId }, body: { workspaceId: targetWorkspaceId }, userId,
        });
        expect(status).toBe(403);
        expect(body.error).toContain("Access denied to source template's workspace");
      });
    });
  });
});
