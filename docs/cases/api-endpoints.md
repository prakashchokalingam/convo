# API Endpoints Test Cases

**Status**: 🚧 Implemented, Needs Testing

## Test Case 1: Form Generation API (`/api/forms/generate`)

### When

- POST request with natural language prompt
- Valid authentication header

### Then

- AI processes prompt via Gemini API
- Returns structured form schema
- Proper error handling for invalid inputs

### Verify

- [ ] Accepts POST requests only
- [ ] Requires authentication
- [ ] Validates prompt length (min 10, max 500 chars)
- [ ] Returns JSON schema with fields array
- [ ] Handles Gemini API timeouts gracefully
- [ ] Rate limiting per user/workspace
- [ ] Response time under 30 seconds

## Test Case 2: Form CRUD Operations (`/api/forms`)

### When

- Various HTTP methods for form management
- Proper authentication and workspace context

### Then

- Complete form lifecycle management
- Data validation and security
- Workspace isolation enforced

### Verify

- [ ] **GET `/api/forms`**: Lists workspace forms
- [ ] **POST `/api/forms`**: Creates new form
- [ ] **GET `/api/forms/[id]`**: Retrieves specific form
- [ ] **PUT `/api/forms/[id]`**: Updates form schema
- [ ] **DELETE `/api/forms/[id]`**: Soft deletes form
- [ ] Workspace isolation (no cross-workspace access)
- [ ] Proper pagination for large form lists

## Test Case 3: Form Responses API (`/api/forms/[id]/responses`)

### When

- Public form submission (no auth required)
- Response data collection and validation

### Then

- Response saved to database
- Validation rules enforced
- Analytics data captured

### Verify

- [ ] **POST**: Accepts form submissions without authentication
- [ ] Validates submission against form schema
- [ ] Enforces required field validation
- [ ] Handles file uploads if applicable
- [ ] Captures submission metadata (IP, timestamp, user agent)
- [ ] Respects form submission limits
- [ ] Returns appropriate success/error responses

## Test Case 4: Workspace Setup API (`/api/setup-workspace`)

### When

- New user completes onboarding
- Workspace creation with unique slug

### Then

- Workspace created in database
- User assigned as owner
- Default settings applied

### Verify

- [ ] Requires authentication
- [ ] Validates workspace name and slug
- [ ] Enforces slug uniqueness
- [ ] Creates workspace with owner role
- [ ] Returns workspace data for redirection
- [ ] Handles creation failures gracefully

## Test Case 5: Form Saving API (`/api/forms/save`)

### When

- User saves form from builder
- Form schema and settings provided

### Then

- Form data persisted correctly
- Version control if implemented
- Real-time collaboration support

### Verify

- [ ] Validates complete form schema
- [ ] Handles partial saves (draft mode)
- [ ] Updates modification timestamps
- [ ] Maintains form version history
- [ ] Supports concurrent editing protection
- [ ] Returns saved form data

## Test Case 6: Authentication Integration

### When

- API endpoints require authentication
- Clerk JWT tokens validated

### Then

- Secure access control
- User context available in handlers
- Proper error responses for unauthorized access

### Verify

- [ ] All protected endpoints validate Clerk tokens
- [ ] User ID extracted correctly from tokens
- [ ] 401 responses for invalid/missing tokens
- [ ] 403 responses for insufficient permissions
- [ ] Token refresh handling
- [ ] Rate limiting per authenticated user

## Test Case 7: Error Handling and Validation

### When

- Invalid data sent to APIs
- Server errors occur during processing

### Then

- Consistent error response format
- Helpful error messages
- Proper HTTP status codes

### Verify

- [ ] 400 for validation errors with field details
- [ ] 404 for not found resources
- [ ] 429 for rate limit exceeded
- [ ] 500 for server errors with error ID
- [ ] Consistent error response structure
- [ ] No sensitive data in error messages

## Test Case 8: File Upload Handling

### When

- Forms include file upload fields
- Users submit files via API

### Then

- Secure file processing
- Virus scanning and validation
- Proper storage and retrieval

### Verify

- [ ] File type validation (whitelist approach)
- [ ] File size limits enforced
- [ ] Virus scanning integration
- [ ] Secure file storage (S3/similar)
- [ ] File URL generation with expiry
- [ ] Cleanup of orphaned files

## Test Case 9: API Performance and Monitoring

### When

- High volume of API requests
- Performance monitoring active

### Then

- Acceptable response times
- Proper resource utilization
- Monitoring data collected

### Verify

- [ ] Response times under 2 seconds for most endpoints
- [ ] Database query optimization
- [ ] Memory usage within limits
- [ ] API metrics collected (response time, error rate)
- [ ] Logging for debugging and audit
- [ ] Graceful degradation under load

## Test Case 10: Webhook and Integration APIs

### When

- External services need to integrate
- Webhook endpoints configured

### Then

- Secure integration points
- Proper authentication for webhooks
- Event-driven notifications

### Verify

- [ ] Webhook signature verification
- [ ] Event payload validation
- [ ] Retry logic for failed webhooks
- [ ] Integration API key management
- [ ] Scope-limited API access
- [ ] Webhook delivery status tracking
