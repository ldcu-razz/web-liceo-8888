const LICEO_LOGO_URL = 'https://vgmzjnlqktwyntqegaeo.supabase.co/storage/v1/object/sign/files/liceo-8888-smtp-assets/liceo-logo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83OTBhMTZjMi03OWQwLTQwMmYtOGIxZi1kYzlhMzFhZTk4YTMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJmaWxlcy9saWNlby04ODg4LXNtdHAtYXNzZXRzL2xpY2VvLWxvZ28ucG5nIiwiaWF0IjoxNzY4NTc0ODkzLCJleHAiOjQ5MjIxNzQ4OTN9.KRl2auzP1vNfd-DkIQfADIffSqK2Hn1LWS3Tq0a08NQ';
const TODAY_YEAR = new Date().getFullYear();


export const TICKET_IN_PROGRESS_HTML_TEMPLATE = (TICKET_ID: string, TICKET_TITLE: string) => `
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Liceo 8888 - Ticket Status In Progress</title>

      <style>
        @media only screen and (max-width: 640px) {
          .email-container {
            padding: 60px 15px !important;
          }
          
          .content-wrapper {
            width: 100% !important;
            max-width: 100% !important;
          }
          
          .content-padding {
            padding: 40px 24px !important;
          }
          
          .logo-section {
            padding: 0 0 32px 0 !important;
          }
          
          .logo-img {
            height: 60px !important;
          }
          
          .heading {
            font-size: 24px !important;
            margin: 0 0 16px 0 !important;
          }
          
          .description {
            font-size: 15px !important;
            margin: 0 0 24px 0 !important;
          }
          
          .button {
            padding: 14px 32px !important;
            font-size: 15px !important;
            display: block !important;
            text-align: center !important;
          }
          
          .footer-padding {
            padding: 24px 20px !important;
          }
          
          .footer-text {
            font-size: 13px !important;
          }
          
          .status-badge {
            font-size: 11px !important;
            padding: 6px 14px !important;
          }
          
          .ticket-info {
            padding: 16px !important;
          }
        }
      </style>
    </head>
    <body>
      <div style="margin: 0; padding: 2rem; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" class="email-container" style="background-color: #f5f5f5; padding: 80px 20px;">
          <tbody>
          <tr>
            <td align="center">
              <!-- Logo Section -->
              <table width="600" cellpadding="0" cellspacing="0" border="0" class="content-wrapper" style="max-width: 600px; width: 100%; margin: 0 auto;">
                <tbody>
                <tr>
                  <td align="center" class="logo-section" style="padding: 0 0 40px 0;">
                    <img src="${LICEO_LOGO_URL}" alt="Liceo 8888" class="logo-img" style="height: 80px; width: auto; display: block; margin: 0 auto; max-width: 100%;">
                  </td>
                </tr>
                </tbody>
              </table>

              <table width="600" cellpadding="0" cellspacing="0" border="0" class="content-wrapper" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border-radius: 16px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); margin: 0 auto;">
                <tbody>
                <tr>
                  <td class="content-padding" style="padding: 60px 50px;">
                    <div style="text-align: center; margin-bottom: 24px;">
                      <span class="status-badge" style="display: inline-block; padding: 8px 20px; background-color: #fcb100; color: #1A1A1A; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 20px;">
                        In Progress
                      </span>
                    </div>

                    <h1 class="heading" style="margin: 0 0 24px 0; font-size: 32px; font-weight: 700; color: #1A1A1A; line-height: 1.2; text-align: center;">
                      Your Ticket is Now In Progress
                    </h1>

                    <p class="description" style="margin: 0 0 32px 0; font-size: 16px; color: #5E5E5E; line-height: 1.6; text-align: center;">
                      Great news! The team has started working on your ticket. We'll keep you updated on the progress and notify you once it's resolved.
                    </p>
                    <div class="ticket-info" style="background-color: #F9FAFB; border-left: 4px solid #830b14; padding: 20px; border-radius: 8px; margin-bottom: 32px;">
                      <p style="margin: 0 0 8px 0; font-size: 12px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                        Ticket CODE
                      </p>
                      <p style="margin: 0 0 16px 0; font-size: 18px; color: #1A1A1A; font-weight: 700;">
                        ${TICKET_ID}
                      </p>
                      <p style="margin: 0 0 8px 0; font-size: 12px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                        Subject
                      </p>
                      <p style="margin: 0; font-size: 16px; color: #1A1A1A; font-weight: 500;">
                        ${TICKET_TITLE}
                      </p>
                    </div>

                    <!-- Additional Info -->
                    <p style="margin: 0; font-size: 14px; color: #5E5E5E; line-height: 1.6; text-align: center;">
                      You can track the progress of your ticket anytime by logging in to the Liceo8888 platform.
                    </p>
                  </td>
                </tr>
                </tbody>
              </table>

              <!-- Copyright Footer -->
              <table width="600" cellpadding="0" cellspacing="0" border="0" class="content-wrapper" style="max-width: 600px; width: 100%; margin: 30px auto 0 auto;">
                <tbody>
                <tr>
                  <td style="padding: 20px 0; text-align: center;">
                    <p style="margin: 0 0 8px 0; font-size: 12px; color: #FFFFFF; line-height: 1.5;">
                      © ${TODAY_YEAR} Liceo 8888. All rights reserved.
                    </p>
                  </td>
                </tr>
                </tbody>
              </table>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </body>
  </html>

`;

export const TICKET_DONE_HTML_TEMPLATE = (TICKET_ID: string, TICKET_TITLE: string) => `
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Liceo 8888 - Ticket Status Done</title>

      <style>
        @media only screen and (max-width: 640px) {
          .email-container {
            padding: 60px 15px !important;
          }
          
          .content-wrapper {
            width: 100% !important;
            max-width: 100% !important;
          }
          
          .content-padding {
            padding: 40px 24px !important;
          }
          
          .logo-section {
            padding: 0 0 32px 0 !important;
          }
          
          .logo-img {
            height: 60px !important;
          }
          
          .heading {
            font-size: 24px !important;
            margin: 0 0 16px 0 !important;
          }
          
          .description {
            font-size: 15px !important;
            margin: 0 0 24px 0 !important;
          }
          
          .button {
            padding: 14px 32px !important;
            font-size: 15px !important;
            display: block !important;
            text-align: center !important;
          }
          
          .footer-padding {
            padding: 24px 20px !important;
          }
          
          .footer-text {
            font-size: 13px !important;
          }
          
          .status-badge {
            font-size: 11px !important;
            padding: 6px 14px !important;
          }
          
          .ticket-info {
            padding: 16px !important;
          }
        }
      </style>
    </head>
    <body>
      <div style="margin: 0; padding: 2rem; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" class="email-container" style="background-color: #f5f5f5; padding: 80px 20px;">
          <tbody>
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" border="0" class="content-wrapper" style="max-width: 600px; width: 100%; margin: 0 auto;">
                <tbody>
                <tr>
                  <td align="center" class="logo-section" style="padding: 0 0 40px 0;">
                    <img src="${LICEO_LOGO_URL}" alt="Liceo 8888" class="logo-img" style="height: 80px; width: auto; display: block; margin: 0 auto; max-width: 100%;">
                  </td>
                </tr>
                </tbody>
              </table>

              <table width="600" cellpadding="0" cellspacing="0" border="0" class="content-wrapper" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border-radius: 16px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); margin: 0 auto;">
                <tbody>
                <tr>
                  <td class="content-padding" style="padding: 60px 50px;">
                    <div style="text-align: center; margin-bottom: 24px;">
                      <span class="status-badge" style="display: inline-block; padding: 8px 20px; background-color: {SUCCESS_COLOR}; color: #FFFFFF; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 20px;">
                        ✓ Done
                      </span>
                    </div>

                    <h1 class="heading" style="margin: 0 0 24px 0; font-size: 32px; font-weight: 700; color: #1A1A1A; line-height: 1.2; text-align: center;">
                      Your Ticket Has Been Resolved!
                    </h1>

                    <p class="description" style="margin: 0 0 32px 0; font-size: 16px; color: #5E5E5E; line-height: 1.6; text-align: center;">
                      Excellent news! Your ticket has been successfully resolved. The actions have been completed and your issue should now be taken care of.
                    </p>

                    <div class="ticket-info" style="background-color: #F9FAFB; border-left: 4px solid {SUCCESS_COLOR}; padding: 20px; border-radius: 8px; margin-bottom: 32px;">
                      <p style="margin: 0 0 8px 0; font-size: 12px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                        Ticket ID
                      </p>
                      <p style="margin: 0 0 16px 0; font-size: 18px; color: #1A1A1A; font-weight: 700;">
                        ${TICKET_ID}
                      </p>
                      <p style="margin: 0 0 8px 0; font-size: 12px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                        Subject
                      </p>
                      <p style="margin: 0; font-size: 16px; color: #1A1A1A; font-weight: 500;">
                        ${TICKET_TITLE}
                      </p>
                    </div>

                    <p style="margin: 0; font-size: 14px; color: #5E5E5E; line-height: 1.6; text-align: center;">
                      If you have any questions or need further assistance, feel free to reach out. We're always here to help!
                    </p>
                  </td>
                </tr>
                </tbody>
              </table>

              <table width="600" cellpadding="0" cellspacing="0" border="0" class="content-wrapper" style="max-width: 600px; width: 100%; margin: 30px auto 0 auto; background-color: {SECONDARY_COLOR}; border-radius: 16px;">
                <tbody>
                <tr>
                  <td class="footer-padding" style="padding: 30px 50px; text-align: center;">
                    <p class="footer-text" style="margin: 0; font-size: 14px; color: #1A1A1A; line-height: 1.6; font-weight: 600;">
                      Thank you for your patience and for using Liceo 8888!
                    </p>
                  </td>
                </tr>
                </tbody>
              </table>

              <table width="600" cellpadding="0" cellspacing="0" border="0" class="content-wrapper" style="max-width: 600px; width: 100%; margin: 30px auto 0 auto;">
                <tbody>
                <tr>
                  <td style="padding: 20px 0; text-align: center;">
                    <p style="margin: 0 0 8px 0; font-size: 12px; color: #FFFFFF; line-height: 1.5;">
                      © ${TODAY_YEAR} Liceo 8888. All rights reserved.
                    </p>
                  </td>
                </tr>
                </tbody>
              </table>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </body>
  </html>

`;

export const TICKET_NEW_COMMENT_HTML_TEMPLATE = (TICKET_ID: string, TICKET_TITLE: string, COMMENTER_NAME: string, COMMENT_PREVIEW: string) => `
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Liceo 8888 - Ticket Status Done</title>

      <style>
        @media only screen and (max-width: 640px) {
          .email-container {
            padding: 60px 15px !important;
          }
          
          .content-wrapper {
            width: 100% !important;
            max-width: 100% !important;
          }
          
          .content-padding {
            padding: 40px 24px !important;
          }
          
          .logo-section {
            padding: 0 0 32px 0 !important;
          }
          
          .logo-img {
            height: 60px !important;
          }
          
          .heading {
            font-size: 24px !important;
            margin: 0 0 16px 0 !important;
          }
          
          .description {
            font-size: 15px !important;
            margin: 0 0 24px 0 !important;
          }
          
          .button {
            padding: 14px 32px !important;
            font-size: 15px !important;
            display: block !important;
            text-align: center !important;
          }
          
          .footer-padding {
            padding: 24px 20px !important;
          }
          
          .footer-text {
            font-size: 13px !important;
          }
          
          .status-badge {
            font-size: 11px !important;
            padding: 6px 14px !important;
          }
          
          .ticket-info {
            padding: 16px !important;
          }
          
          .comment-box {
            padding: 16px !important;
          }
        }
      </style>
    </head>
    <body>
      <div style="margin: 0; padding: 2rem; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" class="email-container" style="background-color: #f5f5f5; padding: 80px 20px;">
          <tbody>
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" border="0" class="content-wrapper" style="max-width: 600px; width: 100%; margin: 0 auto;">
                <tbody>
                <tr>
                  <td align="center" class="logo-section" style="padding: 0 0 40px 0;">
                    <img src="${LICEO_LOGO_URL}" alt="Liceo 8888" class="logo-img" style="height: 80px; width: auto; display: block; margin: 0 auto; max-width: 100%;">
                  </td>
                </tr>
                </tbody>
              </table>

              <table width="600" cellpadding="0" cellspacing="0" border="0" class="content-wrapper" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border-radius: 16px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); margin: 0 auto;">
                <tbody>
                <tr>
                  <td class="content-padding" style="padding: 60px 50px;">
                    <div style="text-align: center; margin-bottom: 24px;">
                      <span class="status-badge" style="display: inline-block; padding: 8px 20px; background-color: #3B82F6; color: #FFFFFF; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border-radius: 20px;">
                        💬 New Comment
                      </span>
                    </div>

                    <h1 class="heading" style="margin: 0 0 24px 0; font-size: 32px; font-weight: 700; color: #1A1A1A; line-height: 1.2; text-align: center;">
                      New Comment on Your Ticket
                    </h1>

                    <p class="description" style="margin: 0 0 32px 0; font-size: 16px; color: #5E5E5E; line-height: 1.6; text-align: center;">
                      <strong>${COMMENTER_NAME}</strong> has added a new comment to your ticket. Check out what they said below.
                    </p>

                    <div class="ticket-info" style="background-color: #F9FAFB; border-left: 4px solid #830b14; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
                      <p style="margin: 0 0 8px 0; font-size: 12px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                        Ticket Code
                      </p>
                      <p style="margin: 0 0 16px 0; font-size: 18px; color: #1A1A1A; font-weight: 700;">
                        ${TICKET_ID}
                      </p>
                      <p style="margin: 0 0 8px 0; font-size: 12px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                        Subject
                      </p>
                      <p style="margin: 0; font-size: 16px; color: #1A1A1A; font-weight: 500;">
                        ${TICKET_TITLE}
                      </p>
                    </div>

                    <div class="comment-box" style="background-color: #F0F9FF; border-left: 4px solid {COMMENT_COLOR}; padding: 20px; border-radius: 8px; margin-bottom: 32px;">
                      <p style="margin: 0 0 12px 0; font-size: 12px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
                        Comment Preview
                      </p>
                      <p style="margin: 0; font-size: 15px; color: #374151; line-height: 1.6; font-style: italic;">
                        "${COMMENT_PREVIEW}"
                      </p>
                    </div>

                    <hr style="margin: 40px 0; border: none; border-top: 1px solid #E5E5E5;">

                    <p style="margin: 0; font-size: 14px; color: #5E5E5E; line-height: 1.6; text-align: center;">
                      You can view the full conversation and reply by logging in to the Liceo8888 platform.
                    </p>
                  </td>
                </tr>
                </tbody>
              </table>

              <table width="600" cellpadding="0" cellspacing="0" border="0" class="content-wrapper" style="max-width: 600px; width: 100%; margin: 30px auto 0 auto;">
                <tbody>
                <tr>
                  <td style="padding: 20px 0; text-align: center;">
                    <p style="margin: 0 0 8px 0; font-size: 12px; color: #FFFFFF; line-height: 1.5;">
                      © ${TODAY_YEAR} Liceo 8888. All rights reserved.
                    </p>
                  </td>
                </tr>
                </tbody>
              </table>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </body>
  </html>

`;

export const VERIFY_USER_ACCOUNT_HTML_TEMPLATE = (VERIFICATION_LINK: string) => `
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Liceo 8888 - Verify Account</title>

      <style>
        @media only screen and (max-width: 640px) {
          .email-container {
            padding: 60px 15px !important;
          }
          
          .content-wrapper {
            width: 100% !important;
            max-width: 100% !important;
          }
          
          .content-padding {
            padding: 40px 24px !important;
          }
          
          .logo-section {
            padding: 0 0 32px 0 !important;
          }
          
          .logo-img {
            height: 60px !important;
          }
          
          .heading {
            font-size: 24px !important;
            margin: 0 0 16px 0 !important;
          }
          
          .description {
            font-size: 15px !important;
            margin: 0 0 24px 0 !important;
          }
          
          .button {
            padding: 14px 32px !important;
            font-size: 15px !important;
            display: block !important;
            text-align: center !important;
          }
          
          .footer-padding {
            padding: 24px 20px !important;
          }
          
          .footer-text {
            font-size: 13px !important;
          }
        }
      </style>
    </head>
    <body>
      <div style="margin: 0; padding: 2rem; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" class="email-container" style="background-color: {PRIMARY_COLOR}; padding: 80px 20px;">
          <tbody>
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" border="0" class="content-wrapper" style="max-width: 600px; width: 100%; margin: 0 auto;">
                <tbody>
                <tr>
                  <td align="center" class="logo-section" style="padding: 0 0 40px 0;">
                    <img src="${LICEO_LOGO_URL}" alt="Liceo 8888" class="logo-img" style="height: 80px; width: auto; display: block; margin: 0 auto; max-width: 100%;">
                  </td>
                </tr>
                </tbody>
              </table>

              <table width="600" cellpadding="0" cellspacing="0" border="0" class="content-wrapper" style="max-width: 600px; width: 100%; background-color: #FFFFFF; border-radius: 16px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); margin: 0 auto;">
                <tbody>
                <tr>
                  <td class="content-padding" style="padding: 60px 50px;">
                    <h1 class="heading" style="margin: 0 0 24px 0; font-size: 32px; font-weight: 700; color: #1A1A1A; line-height: 1.2;">
                      Verify your email address
                    </h1>

                    <p class="description" style="margin: 0 0 32px 0; font-size: 16px; color: #5E5E5E; line-height: 1.6;">
                      Thanks for signing up! To complete your registration and start using your account, please verify your email address by clicking the button below.
                    </p>

                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tbody>
                      <tr>
                        <td align="center">
                          <a href="${VERIFICATION_LINK}" class="button" style="display: inline-block; padding: 16px 40px; background-color: #830b14; color: #FFFFFF; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 12px; letter-spacing: 0.2px; min-width: 200px; text-align: center;">
                            Verify Email Address
                          </a>
                        </td>
                      </tr>
                      </tbody>
                    </table>

                    <hr style="margin: 40px 0; border: none; border-top: 1px solid #E5E5E5;">
                    <p style="margin: 0 0 12px 0; font-size: 14px; color: #5E5E5E; line-height: 1.6;">
                      If the button doesn't work, copy and paste this link into your browser:
                    </p>
                    <p style="margin: 0; font-size: 13px; color: {PRIMARY_COLOR}; word-break: break-all; line-height: 1.6;">
                      ${VERIFICATION_LINK}
                    </p>
                  </td>
                </tr>
                </tbody>
              </table>

              <table width="600" cellpadding="0" cellspacing="0" border="0" class="content-wrapper" style="max-width: 600px; width: 100%; margin: 30px auto 0 auto; background-color: #fcb100; border-radius: 16px;">
                <tbody>
                <tr>
                  <td class="footer-padding" style="padding: 30px 50px; text-align: center;">
                    <p class="footer-text" style="margin: 0; font-size: 14px; color: #1A1A1A; line-height: 1.6;">
                      If you didn't create an account with us, you can safely ignore this email.
                    </p>
                  </td>
                </tr>
                </tbody>
              </table>

              <table width="600" cellpadding="0" cellspacing="0" border="0" class="content-wrapper" style="max-width: 600px; width: 100%; margin: 30px auto 0 auto;">
                <tbody>
                <tr>
                  <td style="padding: 20px 0; text-align: center;">
                    <p style="margin: 0 0 8px 0; font-size: 12px; color: #FFFFFF; line-height: 1.5;">
                      © ${TODAY_YEAR} Liceo 8888. All rights reserved.
                    </p>
                  </td>
                </tr>
                </tbody>
              </table>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </body>
  </html>

`;