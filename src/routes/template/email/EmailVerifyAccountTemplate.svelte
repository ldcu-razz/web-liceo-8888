<script lang="ts">
	let VERIFICATION_LINK = 'https://example.com/verify?token=XXXXX';
	
	const PRIMARY_COLOR = '#830b14';
	const SECONDARY_COLOR = '#fcb100';
	const LOGO_URL = 'https://vgmzjnlqktwyntqegaeo.supabase.co/storage/v1/object/sign/files/liceo-8888-smtp-assets/liceo-logo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV83OTBhMTZjMi03OWQwLTQwMmYtOGIxZi1kYzlhMzFhZTk4YTMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJmaWxlcy9saWNlby04ODg4LXNtdHAtYXNzZXRzL2xpY2VvLWxvZ28ucG5nIiwiaWF0IjoxNzY4NTc0ODkzLCJleHAiOjQ5MjIxNzQ4OTN9.KRl2auzP1vNfd-DkIQfADIffSqK2Hn1LWS3Tq0a08NQ';
  const todaysYear = new Date().getFullYear();
</script>

<svelte:head>
	<style>
		/* Responsive styles for mobile devices */
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
										<a href={VERIFICATION_LINK} class="button" style="display: inline-block; padding: 16px 40px; background-color: {PRIMARY_COLOR}; color: #FFFFFF; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 12px; letter-spacing: 0.2px; min-width: 200px; text-align: center;">
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
								{VERIFICATION_LINK}
							</p>
						</td>
					</tr>
					</tbody>
				</table>

				<table width="600" cellpadding="0" cellspacing="0" border="0" class="content-wrapper" style="max-width: 600px; width: 100%; margin: 30px auto 0 auto; background-color: {SECONDARY_COLOR}; border-radius: 16px;">
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