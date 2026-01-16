<script lang="ts">
	let TICKET_ID = 'TICKET-12345';
	let TICKET_TITLE = 'Sample Ticket Title';
	let TICKET_LINK = 'https://example.com/tickets/12345';
	
	const PRIMARY_COLOR = '#830b14';
	const SECONDARY_COLOR = '#fcb100';
	const SUCCESS_COLOR = '#10B981'; // Green for completed status
	const LOGO_URL = 'https://vgmzjnlqktwyntqegaeo.supabase.co/storage/v1/object/sign/files/liceo-8888-smtp-assets/liceo-logo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83OTBhMTZjMi03OWQwLTQwMmYtOGIxZi1kYzlhMzFhZTk4YTMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJmaWxlcy9saWNlby04ODg4LXNtdHAtYXNzZXRzL2xpY2VvLWxvZ28ucG5nIiwiaWF0IjoxNzY4NTc0ODkzLCJleHAiOjQ5MjIxNzQ4OTN9.KRl2auzP1vNfd-DkIQfADIffSqK2Hn1LWS3Tq0a08NQ';
	const todaysYear = new Date().getFullYear();
</script>

<svelte:head>
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
</svelte:head>

<div style="margin: 0; padding: 2rem; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: {PRIMARY_COLOR};">
	<table width="100%" cellpadding="0" cellspacing="0" border="0" class="email-container" style="background-color: {PRIMARY_COLOR}; padding: 80px 20px;">
		<tbody>
		<tr>
			<td align="center">
				<table width="600" cellpadding="0" cellspacing="0" border="0" class="content-wrapper" style="max-width: 600px; width: 100%; margin: 0 auto;">
					<tbody>
					<tr>
						<td align="center" class="logo-section" style="padding: 0 0 40px 0;">
							<img src={LOGO_URL} alt="Liceo 8888" class="logo-img" style="height: 80px; width: auto; display: block; margin: 0 auto; max-width: 100%;">
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
									{TICKET_ID}
								</p>
								<p style="margin: 0 0 8px 0; font-size: 12px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">
									Subject
								</p>
								<p style="margin: 0; font-size: 16px; color: #1A1A1A; font-weight: 500;">
									{TICKET_TITLE}
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
								© {todaysYear} Liceo 8888. All rights reserved.
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
