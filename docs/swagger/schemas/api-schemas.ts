/**
 * OpenAPI Schema Definitions
 * 
 * This file defines OpenAPI schemas that correspond to the database models
 * and API request/response structures. These schemas are used for automatic
 * documentation generation and validation.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     # =========================================================================
 *     # CORE ENTITIES
 *     # =========================================================================
 *     User:
 *       type: object
 *       description: User profile information from Clerk authentication
 *       properties:
 *         id:
 *           type: string
 *           description: Clerk user ID
 *           example: "user_2NiWrEwuDBCQ7XiZpFxGD7CpYKx"
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: "john.doe@example.com"
 *         firstName:
 *           type: string
 *           description: User's first name
 *           example: "John"
 *         lastName:
 *           type: string
 *           description: User's last name
 *           example: "Doe"
 *         username:
 *           type: string
 *           description: Unique username for workspace URLs
 *           example: "johndoe"
 *         avatarUrl:
 *           type: string
 *           format: uri
 *           description: URL to user's profile picture
 *           example: "https://img.clerk.dev/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yTmlXckV3dURCQ1E3WGladG9Yem5jYkE1WUQifQ"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Account creation timestamp
 *           example: "2024-01-15T10:30:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last profile update timestamp
 *           example: "2024-01-20T14:45:00Z"
 *       required: [id, email, createdAt, updatedAt]
 *
 *     Workspace:
 *       type: object
 *       description: Workspace for organizing forms and team collaboration
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique workspace identifier
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         name:
 *           type: string
 *           description: Workspace display name
 *           example: "Acme Corp Forms"
 *           maxLength: 100
 *         slug:
 *           type: string
 *           description: URL-friendly workspace identifier
 *           example: "acme-corp"
 *           pattern: "^[a-z0-9-]+$"
 *           maxLength: 50
 *         type:
 *           type: string
 *           enum: [personal, team]
 *           description: Workspace type
 *           example: "team"
 *         ownerId:
 *           type: string
 *           description: Owner's user ID
 *           example: "user_2NiWrEwuDBCQ7XiZpFxGD7CpYKx"
 *         description:
 *           type: string
 *           description: Workspace description
 *           example: "Customer feedback and lead generation forms"
 *           maxLength: 500
 *         avatarUrl:
 *           type: string
 *           format: uri
 *           description: Workspace logo/avatar URL
 *           example: "https://example.com/logo.png"
 *         settings:
 *           type: object
 *           description: Workspace configuration settings
 *           properties:
 *             theme:
 *               type: string
 *               enum: [light, dark]
 *               default: light
 *             timezone:
 *               type: string
 *               example: "UTC"
 *             notifications:
 *               type: object
 *               properties:
 *                 email:
 *                   type: boolean
 *                   default: true
 *                 browser:
 *                   type: boolean
 *                   default: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Workspace creation timestamp
 *           example: "2024-01-15T10:30:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last workspace update timestamp
 *           example: "2024-01-20T14:45:00Z"
 *       required: [id, name, slug, type, ownerId, createdAt, updatedAt]
 *
 *     WorkspaceMember:
 *       type: object
 *       description: User membership in a workspace with role-based permissions
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique membership identifier
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         workspaceId:
 *           type: string
 *           format: uuid
 *           description: Associated workspace ID
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         userId:
 *           type: string
 *           description: Member's user ID
 *           example: "user_2NiWrEwuDBCQ7XiZpFxGD7CpYKx"
 *         role:
 *           type: string
 *           enum: [owner, admin, member, viewer]
 *           description: Member's role and permissions
 *           example: "member"
 *         invitedBy:
 *           type: string
 *           description: User ID who sent the invitation
 *           example: "user_2NiWrEwuDBCQ7XiZpFxGD7CpYKx"
 *         invitedAt:
 *           type: string
 *           format: date-time
 *           description: Invitation timestamp
 *           example: "2024-01-15T10:30:00Z"
 *         joinedAt:
 *           type: string
 *           format: date-time
 *           description: When user joined the workspace
 *           example: "2024-01-15T11:00:00Z"
 *         lastSeenAt:
 *           type: string
 *           format: date-time
 *           description: Last activity timestamp
 *           example: "2024-01-20T14:45:00Z"
 *         user:
 *           $ref: '#/components/schemas/User'
 *       required: [id, workspaceId, userId, role, createdAt, updatedAt]
 *
 *     Form:
 *       type: object
 *       description: Form definition with fields and settings
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique form identifier
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         workspaceId:
 *           type: string
 *           format: uuid
 *           description: Parent workspace ID
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         createdBy:
 *           type: string
 *           description: Creator's user ID
 *           example: "user_2NiWrEwuDBCQ7XiZpFxGD7CpYKx"
 *         title:
 *           type: string
 *           description: Form title
 *           example: "Customer Feedback Survey"
 *           maxLength: 200
 *         description:
 *           type: string
 *           description: Form description
 *           example: "Help us improve our service by sharing your feedback"
 *           maxLength: 1000
 *         prompt:
 *           type: string
 *           description: AI generation prompt used to create this form
 *           example: "Create a customer feedback form with rating and comment fields"
 *         isConversational:
 *           type: boolean
 *           description: Whether form uses conversational mode
 *           example: false
 *           default: false
 *         isPublished:
 *           type: boolean
 *           description: Whether form is published and accepting responses
 *           example: true
 *           default: false
 *         config:
 *           $ref: '#/components/schemas/FormConfig'
 *         settings:
 *           $ref: '#/components/schemas/FormSettings'
 *         version:
 *           type: integer
 *           description: Form version number
 *           example: 1
 *           default: 1
 *         publishedAt:
 *           type: string
 *           format: date-time
 *           description: When form was published
 *           example: "2024-01-15T12:00:00Z"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Form creation timestamp
 *           example: "2024-01-15T10:30:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last form update timestamp
 *           example: "2024-01-20T14:45:00Z"
 *         # Computed fields
 *         responseCount:
 *           type: integer
 *           description: Total number of responses (computed field)
 *           example: 142
 *           readOnly: true
 *       required: [id, workspaceId, createdBy, title, config, createdAt, updatedAt]
 *
 *     FormConfig:
 *       type: object
 *       description: Form structure and field definitions
 *       properties:
 *         fields:
 *           type: array
 *           description: Array of form fields
 *           items:
 *             $ref: '#/components/schemas/FormField'
 *         settings:
 *           $ref: '#/components/schemas/FormDisplaySettings'
 *         styling:
 *           $ref: '#/components/schemas/FormStyling'
 *       required: [fields]
 *
 *     FormField:
 *       type: object
 *       description: Individual form field definition
 *       properties:
 *         id:
 *           type: string
 *           description: Unique field identifier
 *           example: "field_1"
 *         type:
 *           type: string
 *           enum: [text, email, phone, select, multiselect, textarea, number, date, file, signature, rating]
 *           description: Field input type
 *           example: "text"
 *         label:
 *           type: string
 *           description: Field label displayed to users
 *           example: "Full Name"
 *           maxLength: 200
 *         placeholder:
 *           type: string
 *           description: Placeholder text
 *           example: "Enter your full name"
 *           maxLength: 200
 *         required:
 *           type: boolean
 *           description: Whether field is required
 *           example: true
 *           default: false
 *         order:
 *           type: integer
 *           description: Field display order
 *           example: 1
 *           minimum: 0
 *         options:
 *           type: array
 *           description: Options for select/multiselect fields
 *           items:
 *             type: string
 *           example: ["Option 1", "Option 2", "Option 3"]
 *         validation:
 *           $ref: '#/components/schemas/FieldValidation'
 *       required: [id, type, label, required, order]
 *
 *     FieldValidation:
 *       type: object
 *       description: Field validation rules
 *       properties:
 *         minLength:
 *           type: integer
 *           description: Minimum character length
 *           example: 2
 *           minimum: 0
 *         maxLength:
 *           type: integer
 *           description: Maximum character length
 *           example: 100
 *           minimum: 1
 *         pattern:
 *           type: string
 *           description: RegEx validation pattern
 *           example: "^[A-Za-z\\s]+$"
 *         min:
 *           type: number
 *           description: Minimum numeric value
 *           example: 0
 *         max:
 *           type: number
 *           description: Maximum numeric value
 *           example: 100
 *
 *     FormDisplaySettings:
 *       type: object
 *       description: Form display and behavior settings
 *       properties:
 *         submitText:
 *           type: string
 *           description: Custom submit button text
 *           example: "Send Feedback"
 *           default: "Submit"
 *         redirectUrl:
 *           type: string
 *           format: uri
 *           description: URL to redirect after submission
 *           example: "https://example.com/thank-you"
 *         emailNotifications:
 *           type: boolean
 *           description: Send email notifications for responses
 *           example: true
 *           default: false
 *         collectEmail:
 *           type: boolean
 *           description: Automatically collect submitter email
 *           example: true
 *           default: false
 *         requireAuth:
 *           type: boolean
 *           description: Require user authentication to submit
 *           example: false
 *           default: false
 *
 *     FormStyling:
 *       type: object
 *       description: Form visual customization
 *       properties:
 *         backgroundColor:
 *           type: string
 *           description: Background color (hex)
 *           example: "#ffffff"
 *           pattern: "^#[0-9a-fA-F]{6}$"
 *         textColor:
 *           type: string
 *           description: Text color (hex)
 *           example: "#333333"
 *           pattern: "^#[0-9a-fA-F]{6}$"
 *         buttonColor:
 *           type: string
 *           description: Button color (hex)
 *           example: "#007bff"
 *           pattern: "^#[0-9a-fA-F]{6}$"
 *         fontFamily:
 *           type: string
 *           description: Font family
 *           example: "Inter, sans-serif"
 *
 *     FormSettings:
 *       type: object
 *       description: Form behavior and integration settings
 *       properties:
 *         allowMultipleSubmissions:
 *           type: boolean
 *           description: Allow multiple submissions from same user
 *           example: false
 *           default: true
 *         collectAnalytics:
 *           type: boolean
 *           description: Collect analytics data
 *           example: true
 *           default: true
 *         enableCaptcha:
 *           type: boolean
 *           description: Enable CAPTCHA protection
 *           example: false
 *           default: false
 *         webhookUrl:
 *           type: string
 *           format: uri
 *           description: Webhook URL for response notifications
 *           example: "https://api.example.com/webhook"
 *
 *     FormResponse:
 *       type: object
 *       description: User response to a form
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique response identifier
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         formId:
 *           type: string
 *           format: uuid
 *           description: Associated form ID
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         workspaceId:
 *           type: string
 *           format: uuid
 *           description: Associated workspace ID
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         data:
 *           type: object
 *           description: Response data (field ID -> value mapping)
 *           example:
 *             field_1: "John Doe"
 *             field_2: "john@example.com"
 *             field_3: 4
 *           additionalProperties: true
 *         isComplete:
 *           type: boolean
 *           description: Whether response is complete
 *           example: true
 *           default: false
 *         submitterEmail:
 *           type: string
 *           format: email
 *           description: Submitter's email address
 *           example: "john@example.com"
 *         submitterName:
 *           type: string
 *           description: Submitter's name
 *           example: "John Doe"
 *         metadata:
 *           $ref: '#/components/schemas/ResponseMetadata'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Response creation timestamp
 *           example: "2024-01-15T10:30:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last response update timestamp
 *           example: "2024-01-20T14:45:00Z"
 *       required: [id, formId, workspaceId, data, createdAt, updatedAt]
 *
 *     ResponseMetadata:
 *       type: object
 *       description: Additional metadata about the response submission
 *       properties:
 *         ipAddress:
 *           type: string
 *           description: Submitter's IP address (anonymized)
 *           example: "192.168.1.xxx"
 *         userAgent:
 *           type: string
 *           description: Browser user agent string
 *           example: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
 *         referrer:
 *           type: string
 *           format: uri
 *           description: Page that referred to the form
 *           example: "https://example.com/contact"
 *         submissionTime:
 *           type: integer
 *           description: Time spent filling form (seconds)
 *           example: 120
 *         deviceInfo:
 *           $ref: '#/components/schemas/DeviceInfo'
 *
 *     DeviceInfo:
 *       type: object
 *       description: Device and browser information
 *       properties:
 *         browser:
 *           type: string
 *           description: Browser name and version
 *           example: "Chrome 91.0.4472.124"
 *         os:
 *           type: string
 *           description: Operating system
 *           example: "Windows 10"
 *         device:
 *           type: string
 *           description: Device type
 *           example: "Desktop"
 *         viewport:
 *           type: object
 *           description: Browser viewport dimensions
 *           properties:
 *             width:
 *               type: integer
 *               example: 1920
 *             height:
 *               type: integer
 *               example: 1080
 *
 *     WorkspaceInvitation:
 *       type: object
 *       description: Invitation to join a workspace
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique invitation identifier
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         workspaceId:
 *           type: string
 *           format: uuid
 *           description: Target workspace ID
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         email:
 *           type: string
 *           format: email
 *           description: Invitee's email address
 *           example: "newmember@example.com"
 *         role:
 *           type: string
 *           enum: [admin, member, viewer]
 *           description: Role to assign when invitation is accepted
 *           example: "member"
 *         invitedBy:
 *           type: string
 *           description: User ID who sent the invitation
 *           example: "user_2NiWrEwuDBCQ7XiZpFxGD7CpYKx"
 *         token:
 *           type: string
 *           description: Unique invitation token
 *           example: "inv_abc123def456"
 *         expiresAt:
 *           type: string
 *           format: date-time
 *           description: Invitation expiration timestamp
 *           example: "2024-01-22T10:30:00Z"
 *         status:
 *           type: string
 *           enum: [pending, accepted, expired, revoked]
 *           description: Current invitation status
 *           example: "pending"
 *         emailStatus:
 *           type: string
 *           enum: [pending, sent, delivered, failed, bounced]
 *           description: Email delivery status
 *           example: "delivered"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Invitation creation timestamp
 *           example: "2024-01-15T10:30:00Z"
 *       required: [id, workspaceId, email, role, invitedBy, token, expiresAt, status]
 *
 *     # =========================================================================
 *     # REQUEST/RESPONSE SCHEMAS
 *     # =========================================================================
 *     CreateWorkspaceRequest:
 *       type: object
 *       description: Request to create a new workspace
 *       properties:
 *         name:
 *           type: string
 *           description: Workspace name
 *           example: "Acme Corp Forms"
 *           minLength: 1
 *           maxLength: 100
 *         slug:
 *           type: string
 *           description: URL-friendly workspace identifier
 *           example: "acme-corp"
 *           pattern: "^[a-z0-9-]+$"
 *           minLength: 2
 *           maxLength: 50
 *         description:
 *           type: string
 *           description: Workspace description
 *           example: "Customer feedback and lead generation forms"
 *           maxLength: 500
 *         type:
 *           type: string
 *           enum: [personal, team]
 *           description: Workspace type
 *           example: "team"
 *           default: "team"
 *       required: [name, slug]
 *
 *     UpdateWorkspaceRequest:
 *       type: object
 *       description: Request to update workspace details
 *       properties:
 *         name:
 *           type: string
 *           description: New workspace name
 *           example: "Updated Workspace Name"
 *           minLength: 1
 *           maxLength: 100
 *         description:
 *           type: string
 *           description: New workspace description
 *           example: "Updated description"
 *           maxLength: 500
 *         settings:
 *           type: object
 *           description: Workspace settings
 *           properties:
 *             theme:
 *               type: string
 *               enum: [light, dark]
 *             timezone:
 *               type: string
 *               example: "America/New_York"
 *
 *     CreateFormRequest:
 *       type: object
 *       description: Request to create a new form
 *       properties:
 *         title:
 *           type: string
 *           description: Form title
 *           example: "Customer Feedback Survey"
 *           minLength: 1
 *           maxLength: 200
 *         description:
 *           type: string
 *           description: Form description
 *           example: "Help us improve our service"
 *           maxLength: 1000
 *         isConversational:
 *           type: boolean
 *           description: Enable conversational mode
 *           example: false
 *           default: false
 *         prompt:
 *           type: string
 *           description: AI generation prompt (for AI-generated forms)
 *           example: "Create a customer feedback form with rating and comment fields"
 *           maxLength: 2000
 *       required: [title]
 *
 *     UpdateFormRequest:
 *       type: object
 *       description: Request to update form details
 *       properties:
 *         title:
 *           type: string
 *           description: New form title
 *           example: "Updated Form Title"
 *           minLength: 1
 *           maxLength: 200
 *         description:
 *           type: string
 *           description: New form description
 *           example: "Updated description"
 *           maxLength: 1000
 *         config:
 *           $ref: '#/components/schemas/FormConfig'
 *         isConversational:
 *           type: boolean
 *           description: Enable/disable conversational mode
 *           example: true
 *         isPublished:
 *           type: boolean
 *           description: Publish/unpublish form
 *           example: true
 *
 *     InviteMemberRequest:
 *       type: object
 *       description: Request to invite a user to workspace
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Invitee's email address
 *           example: "newmember@example.com"
 *         role:
 *           type: string
 *           enum: [admin, member, viewer]
 *           description: Role to assign
 *           example: "member"
 *           default: "member"
 *       required: [email, role]
 *
 *     UpdateMemberRequest:
 *       type: object
 *       description: Request to update member role
 *       properties:
 *         role:
 *           type: string
 *           enum: [admin, member, viewer]
 *           description: New role to assign
 *           example: "admin"
 *       required: [role]
 *
 *     # =========================================================================
 *     # API RESPONSE WRAPPERS
 *     # =========================================================================
 *     WorkspaceListResponse:
 *       type: object
 *       description: List of workspaces response
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             allOf:
 *               - $ref: '#/components/schemas/Workspace'
 *               - type: object
 *                 properties:
 *                   role:
 *                     type: string
 *                     enum: [owner, admin, member, viewer]
 *                     description: Current user's role in this workspace
 *         message:
 *           type: string
 *           example: "Workspaces retrieved successfully"
 *       required: [success, data]
 *
 *     WorkspaceResponse:
 *       type: object
 *       description: Single workspace response
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Workspace'
 *         message:
 *           type: string
 *           example: "Workspace retrieved successfully"
 *       required: [success, data]
 *
 *     FormListResponse:
 *       type: object
 *       description: Paginated list of forms response
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Form'
 *         pagination:
 *           $ref: '#/components/schemas/PaginationMeta'
 *         message:
 *           type: string
 *           example: "Forms retrieved successfully"
 *       required: [success, data, pagination]
 *
 *     SingleFormEntityResponse:
 *       type: object
 *       description: API response wrapper for a single Form entity.
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/Form'
 *         message:
 *           type: string
 *           example: "Form retrieved successfully"
 *       required: [success, data]
 *
 *     ResponseListResponse:
 *       type: object
 *       description: Paginated list of form responses
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/FormResponse'
 *         pagination:
 *           $ref: '#/components/schemas/PaginationMeta'
 *         message:
 *           type: string
 *           example: "Responses retrieved successfully"
 *       required: [success, data, pagination]
 *
 *     MemberListResponse:
 *       type: object
 *       description: List of workspace members response
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/WorkspaceMember'
 *         message:
 *           type: string
 *           example: "Members retrieved successfully"
 *       required: [success, data]
 *
 *     InvitationListResponse:
 *       type: object
 *       description: List of workspace invitations response
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/WorkspaceInvitation'
 *         message:
 *           type: string
 *           example: "Invitations retrieved successfully"
 *       required: [success, data]
 */

export {}; // Make this a module
