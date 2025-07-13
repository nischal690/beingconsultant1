import { NextRequest, NextResponse } from "next/server";
import { updateCoachingScheduledDate } from "@/lib/firebase/firestore";

// Verify Calendly webhook signature
const verifyCalendlySignature = (request: NextRequest): boolean => {
  try {
    // Get the Calendly signature from the request headers
    const calendlySignature = request.headers.get('calendly-webhook-signature');
    
    if (!calendlySignature) {
      console.error('[Calendly Webhook] Missing signature header');
      return false;
    }
    
    // Get the webhook secret from environment variables
    const webhookSecret = process.env.CALENDLY_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.error('[Calendly Webhook] Missing webhook secret in environment variables');
      return false;
    }
    
    // In a production environment, you would:
    // 1. Get the request body as a string
    // 2. Create an HMAC using the webhook secret
    // 3. Compare the computed signature with the one in the header
    
    // For example (using crypto):
    // const crypto = require('crypto');
    // const requestBody = await request.text(); // Get the raw request body
    // const hmac = crypto.createHmac('sha256', webhookSecret);
    // hmac.update(requestBody);
    // const computedSignature = hmac.digest('hex');
    // return computedSignature === calendlySignature;
    
    // For now, if we have both the signature and secret, we'll accept it
    // TODO: Implement proper signature verification before going to production
    console.warn('[Calendly Webhook] Using simplified signature verification - implement full verification for production');
    return true;
  } catch (error) {
    console.error('[Calendly Webhook] Error verifying signature:', error);
    return false;
  }
};

export async function POST(request: NextRequest) {
  try {
    // Verify the webhook signature
    if (!verifyCalendlySignature(request)) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    // Parse the webhook payload
    const payload = await request.json();
    console.log("[Calendly Webhook] Received event:", payload.event);

    // Handle invitee.created event
    if (payload.event === "invitee.created") {
      const { event, payload: eventPayload } = payload;
      const {
        uri: eventUri,
        name: eventName,
        scheduled_at: scheduledDate,
        invitee: {
          email: inviteeEmail,
          first_name: firstName,
          last_name: lastName,
          questions_and_answers: questionsAndAnswers,
        },
      } = eventPayload;

      // Extract user ID and transaction ID from custom questions
      // Assuming you've added these as custom questions in your Calendly event type
      let userId = null;
      let transactionId = null;
      let programId = null;

      if (questionsAndAnswers && Array.isArray(questionsAndAnswers)) {
        for (const qa of questionsAndAnswers) {
          if (qa.question.toLowerCase().includes("user id")) {
            userId = qa.answer;
          } else if (qa.question.toLowerCase().includes("transaction id")) {
            transactionId = qa.answer;
          } else if (qa.question.toLowerCase().includes("program id")) {
            programId = qa.answer;
          }
        }
      }

      // If we have the necessary information, update the coaching record
      if (userId && (transactionId || programId)) {
        const scheduledDateObj = new Date(scheduledDate);
        
        const result = await updateCoachingScheduledDate(
          userId,
          programId || "", // Use programId if available, otherwise empty string
          {
            scheduledDate: scheduledDateObj,
            eventUri,
            eventName,
            inviteeEmail,
            additionalInfo: {
              inviteeFirstName: firstName,
              inviteeLastName: lastName,
              questionsAndAnswers,
            },
          },
          transactionId // Pass transactionId if programId is not available
        );

        if (result.success) {
          console.log("[Calendly Webhook] Successfully updated coaching record");
          return NextResponse.json({ success: true });
        } else {
          console.error("[Calendly Webhook] Error updating coaching record:", result.error);
          return NextResponse.json(
            { error: "Failed to update coaching record" },
            { status: 500 }
          );
        }
      } else {
        console.error("[Calendly Webhook] Missing required information", {
          userId,
          transactionId,
          programId,
        });
        return NextResponse.json(
          { error: "Missing required information" },
          { status: 400 }
        );
      }
    }

    // Return success for other event types
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Calendly Webhook] Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
