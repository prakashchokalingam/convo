import { Resend } from 'resend';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
}

export interface InvitationEmailData {
  inviteeEmail: string;
  inviterName: string;
  workspaceName: string;
  workspaceDescription?: string;
  role: 'admin' | 'member' | 'viewer';
  invitationUrl: string;
  expiresAt: Date;
}

export interface WelcomeEmailData {
  userName: string;
  workspaceName: string;
  workspaceUrl: string;
}

// Default sender configuration
const DEFAULT_FROM = process.env.RESEND_FROM_EMAIL || 'ConvoForms <noreply@convo.ai>';

/**
 * Send an email using Resend
 */
export async function sendEmail({ to, subject, html, text, from = DEFAULT_FROM }: EmailOptions) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.warn('RESEND_API_KEY not configured, email will not be sent');
      return { success: false, error: 'Email service not configured' };
    }

    const result = await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
    });

    // eslint-disable-next-line no-console
    console.log('✅ Email sent successfully:', { to, subject, id: result.data?.id });
    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Send workspace invitation email
 */
export async function sendInvitationEmail(data: InvitationEmailData) {
  const subject = `You're invited to join ${data.workspaceName} on ConvoForms`;

  const html = generateInvitationEmailHTML(data);
  const text = generateInvitationEmailText(data);

  return sendEmail({
    to: data.inviteeEmail,
    subject,
    html,
    text,
  });
}

/**
 * Send welcome email for new workspace members
 */
export async function sendWelcomeEmail(data: WelcomeEmailData) {
  const subject = `Welcome to ${data.workspaceName}!`;

  const html = generateWelcomeEmailHTML(data);
  const text = generateWelcomeEmailText(data);

  return sendEmail({
    to: data.userName,
    subject,
    html,
    text,
  });
}

/**
 * Generate HTML for invitation email
 */
function generateInvitationEmailHTML(data: InvitationEmailData): string {
  const roleDescriptions = {
    admin: 'manage workspace settings, members, and all forms',
    member: 'create, edit, and manage forms and responses',
    viewer: 'view forms and responses',
  };

  const roleEmojis = {
    admin: '🛡️',
    member: '👤',
    viewer: '👁️',
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Workspace Invitation</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
        .content { padding: 40px 30px; }
        .workspace-info { background-color: #f1f5f9; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .role-badge { display: inline-block; background-color: #e2e8f0; color: #475569; padding: 6px 12px; border-radius: 20px; font-size: 14px; font-weight: 500; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
        .footer { background-color: #f8fafc; padding: 20px 30px; text-align: center; color: #64748b; font-size: 14px; }
        .expiry-warning { background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 12px; margin: 20px 0; color: #92400e; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 28px;">You're Invited!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Join your team on ConvoForms</p>
        </div>
        
        <div class="content">
          <p>Hi there!</p>
          
          <p><strong>${data.inviterName}</strong> has invited you to collaborate on <strong>${data.workspaceName}</strong>.</p>
          
          <div class="workspace-info">
            <h3 style="margin-top: 0; color: #1e293b;">📋 ${data.workspaceName}</h3>
            ${data.workspaceDescription ? `<p style="margin-bottom: 0; color: #64748b;">${data.workspaceDescription}</p>` : ''}
          </div>
          
          <p>You've been assigned the role of:</p>
          <div class="role-badge">
            ${roleEmojis[data.role]} ${data.role.charAt(0).toUpperCase() + data.role.slice(1)} 
          </div>
          <p style="font-size: 14px; color: #64748b; margin-top: 8px;">
            As a ${data.role}, you can ${roleDescriptions[data.role]}.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.invitationUrl}" class="cta-button">Accept Invitation</a>
          </div>
          
          <div class="expiry-warning">
            ⏰ <strong>This invitation expires on ${data.expiresAt.toLocaleDateString()}</strong> - be sure to accept it soon!
          </div>
          
          <p style="color: #64748b; font-size: 14px;">
            If you can't click the button above, copy and paste this link into your browser:<br>
            <a href="${data.invitationUrl}" style="color: #667eea; word-break: break-all;">${data.invitationUrl}</a>
          </p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          
          <p style="color: #64748b; font-size: 14px;">
            ConvoForms helps teams create beautiful, conversational forms that feel more like natural conversations. 
            Perfect for surveys, feedback, lead generation, and more.
          </p>
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} Convo. All rights reserved.</p>
          <p>If you didn't expect this invitation, you can safely ignore this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate plain text for invitation email
 */
function generateInvitationEmailText(data: InvitationEmailData): string {
  return `
You're invited to join ${data.workspaceName} on ConvoForms!

Hi there!

${data.inviterName} has invited you to collaborate on ${data.workspaceName}.

${data.workspaceDescription ? `About this workspace: ${data.workspaceDescription}` : ''}

Your role: ${data.role.charAt(0).toUpperCase() + data.role.slice(1)}

Accept your invitation: ${data.invitationUrl}

This invitation expires on ${data.expiresAt.toLocaleDateString()}.

If you can't click the link above, copy and paste it into your browser.

---
Convo - Create beautiful, conversational forms
© ${new Date().getFullYear()} Convo. All rights reserved.

If you didn't expect this invitation, you can safely ignore this email.
  `.trim();
}

/**
 * Generate HTML for welcome email
 */
function generateWelcomeEmailHTML(data: WelcomeEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to ${data.workspaceName}!</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 40px 30px; text-align: center; }
        .content { padding: 40px 30px; }
        .cta-button { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
        .footer { background-color: #f8fafc; padding: 20px 30px; text-align: center; color: #64748b; font-size: 14px; }
        .feature-list { background-color: #f0fdfa; border-radius: 8px; padding: 20px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 28px;">🎉 Welcome to the team!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">You're now part of ${data.workspaceName}</p>
        </div>
        
        <div class="content">
          <p>Hi ${data.userName}!</p>
          
          <p>Welcome to <strong>${data.workspaceName}</strong>! We're excited to have you as part of the team.</p>
          
          <div class="feature-list">
            <h3 style="margin-top: 0; color: #065f46;">🚀 What you can do now:</h3>
            <ul style="margin-bottom: 0;">
              <li>Create beautiful, conversational forms</li>
              <li>Collaborate with your team members</li>
              <li>Analyze responses and insights</li>
              <li>Customize your workspace settings</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.workspaceUrl}" class="cta-button">Go to Workspace</a>
          </div>
          
          <p>If you have any questions or need help getting started, don't hesitate to reach out to your team or check our documentation.</p>
          
          <p>Happy form building! 🎯</p>
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} Convo. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate plain text for welcome email
 */
function generateWelcomeEmailText(data: WelcomeEmailData): string {
  return `
Welcome to ${data.workspaceName}!

Hi ${data.userName}!

Welcome to ${data.workspaceName}! We're excited to have you as part of the team.

What you can do now:
- Create beautiful, conversational forms
- Collaborate with your team members  
- Analyze responses and insights
- Customize your workspace settings

Get started: ${data.workspaceUrl}

If you have any questions or need help getting started, don't hesitate to reach out to your team or check our documentation.

Happy form building!

---
Convo
© ${new Date().getFullYear()} Convo. All rights reserved.
  `.trim();
}

// Email status types for database
export type EmailStatus = 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced';

// Utility to get environment info for debugging
export function getEmailServiceInfo() {
  return {
    configured: !!process.env.RESEND_API_KEY,
    fromEmail: process.env.RESEND_FROM_EMAIL || DEFAULT_FROM,
    environment: process.env.NODE_ENV,
  };
}
