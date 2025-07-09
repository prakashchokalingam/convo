# Form Builder Test Cases

**Status**: 🚧 Implemented, Needs Testing (Settings completion needed)

## Test Case 1: Drag and Drop Field Ordering

### When

- User has form with multiple fields
- Drags field to new position in builder

### Then

- Field reorders visually
- Form schema updates accordingly
- Preview reflects new order

### Verify

- [ ] Smooth drag and drop interaction
- [ ] Visual feedback during drag
- [ ] Order persists after save
- [ ] Preview updates in real-time
- [ ] No field data loss during reorder

## Test Case 2: Field Properties Editing

### When

- User clicks on form field
- Modifies properties in side panel

### Then

- Changes apply immediately to preview
- All field configurations available
- Validation rules enforced

### Verify

- [ ] Label and placeholder text updates
- [ ] Required field toggle works
- [ ] Field type changes (with data migration warnings)
- [ ] Validation rules (min/max length, patterns)
- [ ] Help text and descriptions
- [ ] Conditional logic configuration

## Test Case 3: Field Addition and Removal

### When

- User adds new field from component palette
- Removes existing field

### Then

- New fields appear with sensible defaults
- Removed fields clean up properly
- Form schema remains valid

### Verify

- [ ] All supported field types available
- [ ] New fields have unique IDs
- [ ] Default properties applied
- [ ] Field removal confirmation for existing data
- [ ] Undo functionality for accidental removal

## Test Case 4: Form Settings Configuration (⚠️ HIGH PRIORITY)

### When

- User accesses form settings
- Configures form-level options

### Then

- Settings apply to entire form
- Changes reflected in public form
- Proper validation and limits

### Verify

- [ ] Form title and description
- [ ] Submit button text customization
- [ ] Success/error message configuration
- [ ] Submission limits (responses per IP, time-based)
- [ ] Form availability scheduling
- [ ] Notification settings
- [ ] Redirect after submission

## Test Case 5: Conversational Mode Toggle

### When

- User enables conversational mode
- Previews form in chat interface

### Then

- Form transforms to chat-like experience
- Question flow follows logical order
- All data still captured correctly

### Verify

- [ ] Toggle switches between static/conversational
- [ ] Questions appear one at a time
- [ ] Progress indicator shows completion
- [ ] Branching logic works in conversation
- [ ] Same data structure maintained

## Test Case 6: Form Preview and Testing

### When

- User clicks preview button
- Tests form submission flow

### Then

- Accurate preview of public form
- Test submissions don't count toward limits
- Easy return to editing mode

### Verify

- [ ] Preview matches exact public form appearance
- [ ] Mobile responsive preview
- [ ] Test mode clearly indicated
- [ ] Test data easily distinguished
- [ ] Quick edit access from preview

## Test Case 7: Form Publishing and URL Generation

### When

- User publishes form
- System generates public URL

### Then

- Form accessible at `forms.convo.ai/{type}/{formId}`
- Proper subdomain routing
- SEO-friendly URLs

### Verify

- [ ] Unique, shareable URLs generated
- [ ] Form type categorization (contact, survey, etc.)
- [ ] Embed code generation
- [ ] Social media preview optimization
- [ ] URL accessibility from builder

## Test Case 8: Form Duplication and Templates

### When

- User duplicates existing form
- Saves form as template

### Then

- Complete copy created with new ID
- Template available for reuse
- No data conflicts

### Verify

- [ ] All fields and settings copied
- [ ] New unique form ID assigned
- [ ] Response data not copied
- [ ] Template categorization
- [ ] Template sharing permissions

## Test Case 9: Bulk Operations and Form Management

### When

- User manages multiple forms
- Performs bulk actions

### Then

- Efficient form organization
- Bulk operations complete successfully
- No data corruption

### Verify

- [ ] Multiple form selection
- [ ] Bulk delete with confirmation
- [ ] Bulk status changes (draft/published)
- [ ] Form search and filtering
- [ ] Sort by date, name, responses
