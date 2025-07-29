const functions = require('firebase-functions');
const { https } = require('firebase-functions');
const next = require('next');
const path = require('path');
const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
admin.initializeApp();

const nextjsDistDir = path.join('..', '.next');

const nextjsServer = next({
  dev: false,
  conf: {
    distDir: nextjsDistDir,
  },
});
const nextjsHandle = nextjsServer.getRequestHandler();

exports.nextjs = https.onRequest((req, res) => {
  return nextjsServer.prepare()
    .then(() => nextjsHandle(req, res))
    .catch(error => {
      console.error('Error during request handling:', error);
      res.status(500).send('Internal Server Error');
    });
});

// Send welcome email when a new user is created
exports.sendWelcomeEmail = functions.auth.user().onCreate((user) => {
  // Don't send an email if it's an anonymous user or no email is available
  if (!user.email || !user.providerData || user.providerData.length === 0) {
    console.log('No email available for user or anonymous user');
    return null;
  }

  // Get user's first name if available
  let firstName = '';
  if (user.displayName) {
    const nameParts = user.displayName.split(' ');
    firstName = nameParts[0] || '';
  } else if (user.email) {
    // Extract name from email as fallback (e.g., john@example.com -> John)
    firstName = user.email.split('@')[0].split('.')[0];
    // Capitalize first letter
    firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  }

  // Create a welcome email in the mail collection
  return admin.firestore().collection('mail').add({
    to: user.email,
    message: {
      subject: 'Welcome to the Being Consultant Community',
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to Being Consultant</title>
  <style>
    /* General resets */
    body, table, td, a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    table, td { mso-table-lspace:0pt; mso-table-rspace:0pt; }
    img { -ms-interpolation-mode:bicubic; border:0; height:auto; line-height:100%; outline:none; text-decoration:none; }
    body { margin:0; padding:0; width:100% !important; height:100% !important; }
    /* Container */
    .email-container { max-width:600px; margin:0 auto; }
    /* Button */
    .btn { display:inline-block; padding:12px 24px; background-color:#0F4C5C; color:#ffffff; text-decoration:none; border-radius:4px; }
    /* Mobile */
    @media screen and (max-width: 600px) {
      .email-container { width:100% !important; }
    }
  </style>
</head>
<body style="background-color:#f4f4f4; padding:20px 0; font-family:Arial, sans-serif; color:#333333;">

  <table border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center">
        <!--[if mso]>
        <table border="0" cellspacing="0" cellpadding="0" width="600"><tr><td>
        <![endif]-->
        <table class="email-container" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#ffffff; border-radius:6px; overflow:hidden;">
          
          <!-- Header / Logo -->
          <tr>
            <td align="center" style="padding: 30px 0; background-color:#0F4C5C;">
              <img src="https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/unnamed%20(1).png?alt=media&token=842dff21-a873-4039-b713-16aff46b0b82" alt="Being Consultant" width="120" style="display:block;"/>
            </td>
          </tr>

          <!-- Hero / Title -->
          <tr>
            <td style="padding:30px 40px 20px;">
              <h1 style="margin:0; font-size:24px; line-height:1.3; color:#0F4C5C;">Master the Consulting Journey</h1>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding:0 40px 20px;">
              <p style="margin:0 0 16px; font-size:16px; line-height:1.5;">
                <strong>Dear ${firstName || 'Consultant'},</strong>
              </p>
              <p style="margin:0 0 16px; font-size:16px; line-height:1.5;">
                Congratulations on taking the first step toward a rewarding career in consulting! We're thrilled to welcome you to <strong>Being Consultant</strong>—the only community built to guide you end‑to‑end on your consulting journey.
              </p>
            </td>
          </tr>

          <!-- Content Steps -->
          <tr>
            <td style="padding:0 40px 20px;">
              <ol style="margin:0 0 16px; padding-left:20px; font-size:16px; line-height:1.5;">
                <li><strong>Explore the GRITS Framework</strong><br/>
                  Master Goals, Research, Insights, Tactics & Strategy with your personalized roadmap.
                </li>
                <li style="margin-top:12px;"><strong>Log In & Dive In</strong><br/>
                  Access on‑demand lessons, track progress, and start practicing cases.
                </li>
                <li style="margin-top:12px;"><strong>Join Our Live Sessions</strong><br/>
                  Weekly workshops with former consultants from McKinsey, BCG, and Bain.
                </li>
                <li style="margin-top:12px;"><strong>Connect & Collaborate</strong><br/>
                  Share cases, swap insights, and build your network in our community forums.
                </li>
              </ol>
            </td>
          </tr>

          <!-- Button -->
          <tr>
            <td align="center" style="padding:0 40px 30px;">
              <a href="https://app.beingconsultant.com/auth/login" class="btn">Login to Your Dashboard</a>
            </td>
          </tr>

          <!-- Benefits -->
          <tr>
            <td style="padding:0 40px 30px; font-size:16px; line-height:1.5;">
              <p style="margin:0 0 8px;"><strong>As part of Being Consultant, you'll also enjoy:</strong></p>
              <ul style="margin:0; padding-left:20px;">
                <li>24/7 access to a library of curated case studies</li>
                <li>Monthly office hours with industry experts</li>
                <li>Interview readiness checklists & mock‑interview feedback</li>
                <li>Exclusive job board featuring top consulting openings</li>
              </ul>
            </td>
          </tr>

          <!-- Closing -->
          <tr>
            <td style="padding:0 40px 30px; font-size:16px; line-height:1.5;">
              <p style="margin:0 0 16px;">
                Thank you for joining us. We can't wait to see the amazing milestones you'll achieve. If you have any questions or need support, just reply to this email or reach out at <a href="mailto:support@beingconsultant.com">support@beingconsultant.com</a>.
              </p>
              <p style="margin:0;">See you on the inside!</p>
              <p style="margin:16px 0 0;"><strong>Warm regards,</strong><br/>Gaurav<br/>Founder &amp; CEO, Being Consultant</p>
            </td>
          </tr>

          <!-- Footer Socials -->
          <tr>
            <td style="padding:20px 40px; border-top:1px solid #e0e0e0; font-size:12px; text-align:center; color:#888888;">
              Follow us on<br/>
              <a href="#" style="margin:0 5px; text-decoration:none; color:#0F4C5C;">🌐</a>
              <a href="#" style="margin:0 5px; text-decoration:none; color:#0F4C5C;">LinkedIn</a>
              <a href="#" style="margin:0 5px; text-decoration:none; color:#0F4C5C;">Instagram</a>
              <a href="#" style="margin:0 5px; text-decoration:none; color:#0F4C5C;">YouTube</a>
              <a href="#" style="margin:0 5px; text-decoration:none; color:#0F4C5C;">Spotify</a>
            </td>
          </tr>

          <!-- Footer Logo -->
          <tr>
            <td align="center" style="padding:10px 0 30px;">
              <img src="https://firebasestorage.googleapis.com/v0/b/beingconsultant-e5c75.firebasestorage.app/o/Beingconsultantmaillogo.png?alt=media&token=00a48ee1-0aa6-45d5-b9a1-a164beb11688" alt="Being Consultant" width="60" style="display:block;"/>
            </td>
          </tr>

        </table>
        <!--[if mso]>
        </td></tr></table>
        <![endif]-->
      </td>
    </tr>
  </table>

</body>
</html>`
    }
  }).then(() => {
    console.log('Welcome email sent to:', user.email);
    return null;
  }).catch(error => {
    console.error('Error sending welcome email:', error);
    return null;
  });
});

// Send email notification when a user purchases a coaching program
exports.sendPurchaseConfirmation = functions.firestore
  .document('users/{userId}/coaching/{programId}')
  .onCreate((snapshot, context) => {
    const programData = snapshot.data();
    const userId = context.params.userId;
    
    // Get user email
    return admin.firestore().collection('users').doc(userId).get()
      .then(userDoc => {
        if (!userDoc.exists) {
          console.log('No user found with ID:', userId);
          return null;
        }
        
        const userData = userDoc.data();
        const userEmail = userData.email;
        
        if (!userEmail) {
          console.log('No email found for user:', userId);
          return null;
        }
        
        // Send confirmation email
        return admin.firestore().collection('mail').add({
          to: userEmail,
          message: {
            subject: `Your Purchase: ${programData.name}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #333;">Purchase Confirmation</h1>
                <p>Thank you for purchasing ${programData.name}!</p>
                <p>Purchase Details:</p>
                <ul>
                  <li><strong>Program:</strong> ${programData.name}</li>
                  <li><strong>Amount:</strong> ${programData.currency || 'USD'} ${programData.amount}</li>
                  <li><strong>Date:</strong> ${new Date(programData.paymentDate).toLocaleDateString()}</li>
                </ul>
                <p>You can access your program in your dashboard.</p>
                <p>If you have any questions, feel free to reach out to our support team.</p>
                <p>Best regards,<br>The Being Consultant Team</p>
              </div>
            `
          }
        });
      })
      .then(() => {
        console.log('Purchase confirmation email sent for program:', context.params.programId);
        return null;
      })
      .catch(error => {
        console.error('Error sending purchase confirmation email:', error);
        return null;
      });
  });
