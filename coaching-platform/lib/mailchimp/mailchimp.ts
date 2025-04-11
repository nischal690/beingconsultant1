import { createHash } from 'crypto';

// Mailchimp API types
interface MailchimpConfig {
  apiKey: string;
  serverPrefix: string;
  audienceId: string;
}

interface MailchimpMember {
  email_address: string;
  status: 'subscribed' | 'unsubscribed' | 'cleaned' | 'pending' | 'transactional';
  merge_fields?: Record<string, any>;
  tags?: string[];
}

interface MailchimpCampaign {
  type: 'regular';
  recipients: {
    list_id: string;
    segment_opts?: {
      match: 'all' | 'any';
      conditions: Array<{
        condition_type: string;
        op: string;
        field: string;
        value: string;
      }>;
    };
  };
  settings: {
    subject_line: string;
    title: string;
    from_name: string;
    reply_to: string;
    template_id?: number;
  };
}

// Mailchimp API client
export class MailchimpClient {
  private config: MailchimpConfig;

  constructor(config: MailchimpConfig) {
    this.config = config;
  }

  private getHeaders() {
    const auth = Buffer.from(`any:${this.config.apiKey}`).toString('base64');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${auth}`
    };
  }

  private getBaseUrl() {
    return `https://${this.config.serverPrefix}.api.mailchimp.com/3.0`;
  }

  // Get MD5 hash of lowercase email for Mailchimp API
  private getMemberHash(email: string): string {
    return createHash('md5').update(email.toLowerCase()).digest('hex');
  }

  // Add or update a member in the audience
  async addOrUpdateMember(email: string, firstName: string, lastName: string, tags: string[] = []): Promise<any> {
    const memberHash = this.getMemberHash(email);
    const url = `${this.getBaseUrl()}/lists/${this.config.audienceId}/members/${memberHash}`;
    
    const data: MailchimpMember = {
      email_address: email,
      status: 'subscribed',
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      },
      tags
    };

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        // Try to get detailed error information from the response
        const errorText = await response.text();
        let errorInfo = `Status: ${response.status} ${response.statusText}`;
        
        try {
          // Try to parse the error as JSON
          const errorJson = JSON.parse(errorText);
          errorInfo = `${errorInfo}, Details: ${JSON.stringify(errorJson)}`;
        } catch (parseError) {
          // If parsing fails, use the raw text
          if (errorText) {
            errorInfo = `${errorInfo}, Response: ${errorText}`;
          }
        }
        
        throw new Error(`Mailchimp API error: ${errorInfo}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding/updating member to Mailchimp:', error);
      throw error;
    }
  }

  // Schedule an email to be sent after a delay
  async scheduleEmail(
    email: string, 
    templateId: number, 
    subject: string, 
    fromName: string, 
    replyTo: string,
    scheduledTime: Date
  ): Promise<any> {
    // 1. Create a campaign
    const campaign = await this.createCampaign({
      type: 'regular',
      recipients: {
        list_id: this.config.audienceId,
        segment_opts: {
          match: 'all',
          conditions: [{
            condition_type: 'EmailAddress',
            op: 'is',
            field: 'EMAIL',
            value: email
          }]
        }
      },
      settings: {
        subject_line: subject,
        title: `Automated Follow-up: ${subject}`,
        from_name: fromName,
        reply_to: replyTo,
        template_id: templateId
      }
    });

    // 2. Schedule the campaign
    if (campaign.id) {
      return await this.scheduleCampaign(campaign.id, scheduledTime);
    }
    
    throw new Error('Failed to create campaign');
  }

  // Create a new campaign
  private async createCampaign(campaignData: MailchimpCampaign): Promise<any> {
    const url = `${this.getBaseUrl()}/campaigns`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(campaignData)
      });

      if (!response.ok) {
        // Try to get detailed error information from the response
        const errorText = await response.text();
        let errorInfo = `Status: ${response.status} ${response.statusText}`;
        
        try {
          // Try to parse the error as JSON
          const errorJson = JSON.parse(errorText);
          errorInfo = `${errorInfo}, Details: ${JSON.stringify(errorJson)}`;
        } catch (parseError) {
          // If parsing fails, use the raw text
          if (errorText) {
            errorInfo = `${errorInfo}, Response: ${errorText}`;
          }
        }
        
        throw new Error(`Mailchimp API error: ${errorInfo}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating Mailchimp campaign:', error);
      throw error;
    }
  }

  // Schedule a campaign to be sent at a specific time
  private async scheduleCampaign(campaignId: string, scheduleTime: Date): Promise<any> {
    const url = `${this.getBaseUrl()}/campaigns/${campaignId}/actions/schedule`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          schedule_time: scheduleTime.toISOString()
        })
      });

      if (!response.ok) {
        // Try to get detailed error information from the response
        const errorText = await response.text();
        let errorInfo = `Status: ${response.status} ${response.statusText}`;
        
        try {
          // Try to parse the error as JSON
          const errorJson = JSON.parse(errorText);
          errorInfo = `${errorInfo}, Details: ${JSON.stringify(errorJson)}`;
        } catch (parseError) {
          // If parsing fails, use the raw text
          if (errorText) {
            errorInfo = `${errorInfo}, Response: ${errorText}`;
          }
        }
        
        throw new Error(`Mailchimp API error: ${errorInfo}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error scheduling Mailchimp campaign:', error);
      throw error;
    }
  }
}

// Create a singleton instance of the Mailchimp client
let mailchimpClient: MailchimpClient | null = null;

export function getMailchimpClient(): MailchimpClient {
  if (!mailchimpClient) {
    // Get config from environment variables
    const apiKey = process.env.MAILCHIMP_API_KEY || '';
    const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX || '';
    const audienceId = process.env.MAILCHIMP_AUDIENCE_ID || '';
    
    if (!apiKey || !serverPrefix || !audienceId) {
      throw new Error('Mailchimp configuration is missing. Please check your environment variables.');
    }
    
    mailchimpClient = new MailchimpClient({
      apiKey,
      serverPrefix,
      audienceId
    });
  }
  
  return mailchimpClient;
}
