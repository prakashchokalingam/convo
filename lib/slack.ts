// Slack notification utilities

export interface SlackBlock {
  type: string;
  text?: {
    type: string;
    text: string;
    emoji?: boolean;
  };
  accessory?: {
    type: string;
    image_url: string;
    alt_text: string;
  };
  fields?: {
    type: string;
    text: string;
  }[];
}

type JSONValue =
    | string
    | number
    | boolean
    | null
    | JSONValue[]
    | { [key: string]: JSONValue };

// Define the structure of the Slack message payload
interface SlackPayload {
  text: string;
  blocks?: SlackBlock[]; // Slack supports rich formatting with blocks
}

/**
 * Sends a notification message to a Slack channel using a webhook URL.
 *
 * @param message The plain text message to send.
 * @param details Optional structured details for richer formatting (future use).
 * @returns Promise<boolean> True if the message was sent successfully, false otherwise.
 */
export async function sendSlackNotification(
  message: string,
  _details?: Record<string, JSONValue> // For potential future structured messages
): Promise<boolean> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl) {
    // eslint-disable-next-line no-console
    console.warn('SLACK_WEBHOOK_URL is not configured. Skipping Slack notification.');
    return false;
  }

  const payload: SlackPayload = {
    text: message, // Fallback text for notifications that don't support blocks
  };

  // Example of using blocks for more structured messages, if needed later.
  // if (details) {
  //   payload.blocks = [
  //     {
  //       type: 'section',
  //       text: {
  //         type: 'mrkdwn',
  //         text: message,
  //       },
  //     },
  //     {
  //       type: 'divider',
  //     },
  //     // Add more structured blocks based on 'details' here
  //   ];
  // }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const responseBody = await response.text();
      // eslint-disable-next-line no-console
      console.error(`Error sending Slack notification: ${response.status} ${response.statusText}`, {
        responseBody,
      });
      return false;
    }

    // eslint-disable-next-line no-console
    console.log('✅ Slack notification sent successfully.');
    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('❌ Failed to send Slack notification:', error);
    return false;
  }
}

/**
 * Formats the workspace creation notification message for Slack.
 *
 * @param eventName The name of the event (e.g., "New Workspace Created").
 * @param status The status of the event (e.g., "Success").
 * @param workspaceData Object containing workspace ID, name, creator's email, and plan.
 * @returns string The formatted Slack message.
 */
export function formatWorkspaceCreationMessage(
  eventName: string,
  status: string,
  workspaceData: {
    workspaceId: string;
    workspaceName: string;
    creatorEmail: string;
    plan: string;
    emoji?: string;
  }
): string {
  const {
    workspaceId,
    workspaceName,
    creatorEmail,
    plan,
    emoji = '🎉', // Default emoji
  } = workspaceData;

  return `${emoji} ${eventName} ${status}\n1. Workspace ID: ${workspaceId}\n2. Name: ${workspaceName}\n3. Created by email: ${creatorEmail}\n4. Plan: ${plan}`;
}
