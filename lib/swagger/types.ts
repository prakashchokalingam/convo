import type { OpenAPIV3 } from 'openapi-types';

type JSONValue =
    | string
    | number
    | boolean
    | null
    | JSONValue[]
    | { [key: string]: JSONValue };

/**
 * Common TypeScript types for the Swagger documentation system
 */

export interface ApiRoute {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  filePath: string;
  handler: string;
  jsDocComment?: string;
}

export interface RouteDiscoveryResult {
  routes: ApiRoute[];
  totalRoutes: number;
  scannedFiles: string[];
}

export interface SchemaDefinition {
  name: string;
  schema: OpenAPIV3.SchemaObject;
  description?: string;
}

export interface GenerationResult {
  spec: OpenAPIV3.Document;
  routes: ApiRoute[];
  schemas: SchemaDefinition[];
  timestamp: string;
  version: string;
}

/**
 * Common schema types used across the API
 */
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  type: 'default' | 'team';
  ownerId: string;
  description?: string;
  avatarUrl?: string;
  settings: Record<string, JSONValue>;
  createdAt: string;
  updatedAt: string;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: string;
  lastSeenAt?: string;
  user?: User;
}

export interface Form {
  id: string;
  userId: string;
  workspaceId?: string;
  name: string;
  description?: string;
  config: FormConfig;
  isPublished: boolean;
  isConversational: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FormConfig {
  fields: FormField[];
  settings: FormSettings;
  styling?: FormStyling;
}

export interface FormField {
  id: string;
  type:
    | 'text'
    | 'email'
    | 'phone'
    | 'select'
    | 'multiselect'
    | 'textarea'
    | 'number'
    | 'date'
    | 'file'
    | 'signature';
  label: string;
  placeholder?: string;
  required: boolean;
  order: number;
  options?: string[];
  validation?: FieldValidation;
}

export interface FormSettings {
  submitText?: string;
  redirectUrl?: string;
  emailNotifications?: boolean;
  collectEmail?: boolean;
  requireAuth?: boolean;
}

export interface FormStyling {
  backgroundColor?: string;
  textColor?: string;
  buttonColor?: string;
  fontFamily?: string;
}

export interface FieldValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  min?: number;
  max?: number;
}

export interface FormResponse {
  id: string;
  formId: string;
  userId?: string;
  responses: Record<string, JSONValue>;
  metadata: ResponseMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface ResponseMetadata {
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  submissionTime: number;
  deviceInfo?: DeviceInfo;
}

export interface DeviceInfo {
  browser?: string;
  os?: string;
  device?: string;
  viewport?: {
    width: number;
    height: number;
  };
}

export interface Invitation {
  id: string;
  workspaceId: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  invitedBy: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsageStats {
  workspaceId: string;
  period: 'day' | 'week' | 'month' | 'year';
  startDate: string;
  endDate: string;
  metrics: UsageMetrics;
}

export interface UsageMetrics {
  formsCreated: number;
  responsesReceived: number;
  membersAdded: number;
  storageUsed: number;
  apiCalls: number;
}

/**
 * API Response wrappers
 */
export interface ApiResponse<T = JSONValue> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ApiError[];
}

export interface PaginatedResponse<T = JSONValue> extends ApiResponse<T[]> {
  pagination: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  field?: string;
  details?: Record<string, JSONValue>;
}

/**
 * Request types for API endpoints
 */
export interface CreateWorkspaceRequest {
  name: string;
  slug: string;
  description?: string;
  type?: 'default' | 'team';
}

export interface UpdateWorkspaceRequest {
  name?: string;
  description?: string;
  settings?: Record<string, JSONValue>;
}

export interface CreateFormRequest {
  name: string;
  description?: string;
  workspaceId?: string;
  isConversational?: boolean;
}

export interface UpdateFormRequest {
  name?: string;
  description?: string;
  config?: FormConfig;
  isConversational?: boolean;
  isPublished?: boolean;
}

export interface InviteMemberRequest {
  email: string;
  role: 'admin' | 'member' | 'viewer';
}

export interface UpdateMemberRequest {
  role: 'admin' | 'member' | 'viewer';
}

/**
 * Utility types for documentation generation
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface EndpointDocumentation {
  method: HttpMethod;
  path: string;
  summary: string;
  description?: string;
  tags: string[];
  parameters?: OpenAPIV3.ParameterObject[];
  requestBody?: OpenAPIV3.RequestBodyObject;
  responses: Record<string, OpenAPIV3.ResponseObject>;
  security?: OpenAPIV3.SecurityRequirementObject[];
}

export interface SchemaGenerationOptions {
  includeExamples: boolean;
  generateFromZod: boolean;
  includeValidation: boolean;
  excludeInternal: boolean;
}

export interface DocumentationConfig {
  version: string;
  title: string;
  description: string;
  baseUrl: string;
  outputPath: string;
  includeRoutes: string[];
  excludeRoutes: string[];
  schemaOptions: SchemaGenerationOptions;
}
