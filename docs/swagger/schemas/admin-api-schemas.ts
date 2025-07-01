/**
 * @swagger
 * components:
 *   schemas:
 *     AdminStatsResponse:
 *       type: object
 *       description: Response for admin statistics API.
 *       properties:
 *         totalUsers:
 *           type: integer
 *           description: Total number of registered users.
 *           example: 150
 *         totalWorkspaces:
 *           type: integer
 *           description: Total number of created workspaces.
 *           example: 200
 *         activeSubscriptions:
 *           type: integer
 *           description: Total number of active subscriptions.
 *           example: 75
 *       required:
 *         - totalUsers
 *         - totalWorkspaces
 *         - activeSubscriptions
 *
 *     ErrorResponse:
 *       type: object
 *       description: Generic error response structure.
 *       properties:
 *         error:
 *           type: string
 *           description: A description of the error.
 *           example: "Resource not found"
 *       required:
 *         - error
 */
import { z } from 'zod';

// These Zod schemas are for type safety and can be used for validation,
// but the OpenAPI schema definitions above are what swagger-jsdoc will parse.
// For more complex setups, a tool like zod-to-openapi might be used to generate
// the OpenAPI schemas directly from Zod schemas.

export const AdminStatsResponseSchema = z.object({
  totalUsers: z.number().int().min(0).describe('Total number of registered users.'),
  totalWorkspaces: z.number().int().min(0).describe('Total number of created workspaces.'),
  activeSubscriptions: z.number().int().min(0).describe('Total number of active subscriptions.'),
});
export type AdminStatsResponse = z.infer<typeof AdminStatsResponseSchema>;

export const ErrorResponseSchema = z.object({
  error: z.string().describe('A description of the error.'),
});
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

export {}; // Make this a module
