# Mailchimp Integration for Automated Follow-up Emails

This document explains how to set up and configure the Mailchimp integration for sending automated follow-up emails 24 hours after a user signs up.

## Overview

The integration uses Mailchimp's API to:
1. Add new users to a Mailchimp audience when they sign up
2. Schedule a follow-up email to be sent 24 hours after signup
3. Use a Mailchimp template for the email content

## Required Environment Variables

Add the following variables to your `.env.local` file:

```
# Mailchimp API Configuration
MAILCHIMP_API_KEY=your_mailchimp_api_key
MAILCHIMP_SERVER_PREFIX=us1  # This is the prefix in your Mailchimp API URL (e.g., us1, us2)
MAILCHIMP_AUDIENCE_ID=your_audience_id
MAILCHIMP_WELCOME_TEMPLATE_ID=12345  # Template ID for the welcome email
MAILCHIMP_REPLY_TO_EMAIL=support@beingconsultant.com
```

## Setting Up Mailchimp

1. **Create a Mailchimp Account**: If you don't already have one, sign up at [mailchimp.com](https://mailchimp.com)

2. **Get API Key**:
   - Go to Account > Extras > API keys
   - Create a new API key with appropriate permissions
   - Copy the API key to your `.env.local` file

3. **Find Your Server Prefix**:
   - Look at the URL when you're logged into Mailchimp
   - It will be something like `https://us1.admin.mailchimp.com/`
   - The prefix is the part between `https://` and `.admin.mailchimp.com/` (e.g., `us1`)

4. **Create an Audience**:
   - Go to Audience > Audience dashboard
   - Create a new audience or use an existing one
   - Find the Audience ID by going to Audience settings > Audience name and defaults
   - The Audience ID is listed as "Audience ID" near the bottom of the page

5. **Create an Email Template**:
   - Go to Brand > Templates
   - Create a new template or use an existing one
   - Note the template ID from the URL when editing the template
   - The template ID is the number in the URL after `/templates/edit/`

## Testing the Integration

To test the integration:
1. Sign up for a new account on your application
2. Check your Mailchimp audience to verify the user was added
3. Check the Campaigns section in Mailchimp to see the scheduled email

## Troubleshooting

If emails are not being scheduled:
1. Check the browser console for any errors
2. Verify that all environment variables are correctly set
3. Check the server logs for API errors
4. Verify that the Mailchimp template ID exists and is accessible

## Additional Configuration

You can modify the scheduling time by changing the `scheduleHours` parameter in the `scheduleFollowupEmail` function call.
