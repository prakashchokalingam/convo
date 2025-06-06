# Feature Specifications

## 1. AI Form Generation

### Input
User provides a natural language prompt describing their form needs.

**Example prompts:**
- "Create a job application form with name, email, resume upload, and years of experience"
- "I need a feedback form for my restaurant with rating, favorite dish, and suggestions"
- "Build a contact form for my real estate business"

### Output
JSON schema that defines the form structure:

```json
{
  "fields": [
    {
      "id": "field_1",
      "type": "text",
      "label": "Full Name",
      "placeholder": "John Doe",
      "required": true,
      "validation": {
        "minLength": 2,
        "maxLength": 50
      }
    },
    {
      "id": "field_2",
      "type": "email",
      "label": "Email Address",
      "placeholder": "john@example.com",
      "required": true
    },
    {
      "id": "field_3",
      "type": "file",
      "label": "Resume",
      "accept": ".pdf,.doc,.docx",
      "required": true
    },
    {
      "id": "field_4",
      "type": "number",
      "label": "Years of Experience",
      "min": 0,
      "max": 50,
      "required": true
    }
  ],
  "settings": {
    "title": "Job Application Form",
    "description": "Please fill out all required fields",
    "submitText": "Submit Application",
    "successMessage": "Thank you! We'll review your application."
  }
}
```

## 2. Conversational Mode

### How it works
1. User toggles "Conversational Mode" for any form
2. Form transforms into a chat-like interface
3. Questions are asked one at a time
4. Natural transitions between questions
5. Progress indicator shows completion status

### Conversation Flow Example
```
Bot: "Hi! Let's get your job application started. What's your full name?"
User: "John Doe"
Bot: "Nice to meet you, John! What's the best email to reach you at?"
User: "john@example.com"
Bot: "Great! Now, could you upload your resume? (PDF, DOC, or DOCX format)"
User: [Uploads file]
Bot: "Perfect! Last question - how many years of experience do you have?"
User: "5"
Bot: "Thank you for completing the application! We'll review it and get back to you soon."
```

## 3. Form Builder Features

### Drag & Drop
- Reorder fields by dragging
- Add new fields from sidebar
- Delete fields with confirmation

### Field Types (MVP)
1. **Text Input**
   - Single line text
   - Validation: min/max length, regex pattern
   
2. **Email Input**
   - Email validation built-in
   - Placeholder support
   
3. **Select Dropdown**
   - Multiple options
   - Optional placeholder
   - Single selection
   
4. **Radio Buttons**
   - Multiple options
   - Single selection
   - Vertical or horizontal layout
   
5. **Checkbox**
   - Single checkbox for yes/no
   - Multiple checkboxes for multi-select

### Field Properties
- Label (required)
- Placeholder text
- Help text
- Required/Optional
- Validation rules
- Default values

## 4. Analytics Dashboard

### Basic Metrics
- Total views
- Total starts (someone began filling)
- Total completions
- Completion rate (%)
- Average time to complete
- Drop-off points

### AI Insights (Pro/Enterprise)
- "Most users drop off at the email field"
- "Completion rate increases 40% in conversational mode"
- "Peak submission times: Weekdays 2-4 PM"
- "Suggested improvements based on user behavior"

## 5. Embeddable Forms

### Embed Options
1. **Direct Link**
   - `https://convoforms.com/f/[form-id]`
   - Branded or white-label options

2. **iFrame Embed**
   ```html
   <iframe src="https://convoforms.com/embed/[form-id]" 
           width="100%" 
           height="600">
   </iframe>
   ```

3. **JavaScript Widget**
   ```html
   <div id="convoform-[form-id]"></div>
   <script src="https://convoforms.com/widget.js"></script>
   ```

4. **Popup Trigger**
   - Button that opens form in modal
   - Exit intent trigger
   - Time-based trigger

## 6. Response Management

### Features
- View all responses in table format
- Export to CSV
- Search and filter responses
- Mark as read/unread
- Add internal notes
- Email notifications for new responses

## 7. Integrations (Post-MVP)

### Priority Integrations
1. **Zapier** - Connect to 5000+ apps
2. **Webhooks** - Send data anywhere
3. **Google Sheets** - Auto-populate spreadsheets
4. **Slack** - Notifications for new responses
5. **Email** - Auto-responders

## 8. Templates Library

### Launch Templates
1. **Contact Form**
   - Name, Email, Message
   - Perfect for websites

2. **Job Application**
   - Personal info, Experience, Resume
   - For recruiting

3. **Feedback Survey**
   - Rating, Comments, Contact info
   - For customer feedback

4. **Event Registration**
   - Name, Email, Attendance options
   - For events/webinars

5. **Lead Generation**
   - Name, Company, Interest level
   - For sales teams
