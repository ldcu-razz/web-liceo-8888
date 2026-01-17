<script lang="ts">
	let USER_NAME = 'John Doe';
	let LOGIN_LINK = 'https://example.com/login';
	
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
			
			.subheading {
				font-size: 18px !important;
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
			
			.feature-item {
				padding: 16px !important;
			}
		}
	</style>
</svelte:head>

<div style="margin: 0; padding: 2rem; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #830b14;">
	<table width="100%" cellpadding="0" cellspacing="0" border="0" class="email-container" style="background-color: #830b14; padding: 80px 20px;">
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
							<h1 class="heading" style="margin: 0 0 16px 0; font-size: 32px; font-weight: 700; color: #1A1A1A; line-height: 1.2; text-align: center;">
								Welcome to Liceo 8888!
							</h1>

							<p class="subheading" style="margin: 0 0 32px 0; font-size: 20px; color: #830b14; font-weight: 600; text-align: center;">
								Hello, {USER_NAME}! 👋
							</p>

							<p class="description" style="margin: 0 0 32px 0; font-size: 16px; color: #5E5E5E; line-height: 1.6; text-align: center;">
								We're excited to have you on board! Your account has been successfully created and you're all set to start using the platform.
							</p>

							<div style="background-color: #F9FAFB; padding: 30px; border-radius: 12px; margin-bottom: 32px;">
								<h2 style="margin: 0 0 20px 0; font-size: 18px; font-weight: 700; color: #1A1A1A; text-align: center;">
									What You Can Do
								</h2>
								
								<div class="feature-item" style="margin-bottom: 16px; padding: 0;">
									<p style="margin: 0; font-size: 15px; color: #374151; line-height: 1.6;">
										<strong style="color: #830b14;">📋 Submit Tickets</strong> - Report issues, complains, suggestions, etc.
									</p>
								</div>
								
								<div class="feature-item" style="margin-bottom: 16px; padding: 0;">
									<p style="margin: 0; font-size: 15px; color: #374151; line-height: 1.6;">
										<strong style="color: #830b14;">💬 Track Progress</strong> - Monitor the status of your tickets in real-time
									</p>
								</div>
								
								<div class="feature-item" style="margin-bottom: 16px; padding: 0;">
									<p style="margin: 0; font-size: 15px; color: #374151; line-height: 1.6;">
										<strong style="color: #830b14;">🔔 Get Updates</strong> - Receive notifications about your tickets
									</p>
								</div>
								
								<div class="feature-item" style="padding: 0;">
									<p style="margin: 0; font-size: 15px; color: #374151; line-height: 1.6;">
										<strong style="color: #830b14;">👥 Collaborate</strong> - Communicate us through comments
									</p>
								</div>
							</div>

							<table width="100%" cellpadding="0" cellspacing="0" border="0">
								<tbody>
								<tr>
									<td align="center">
										<a href={LOGIN_LINK} class="button" style="display: inline-block; padding: 16px 40px; background-color: #830b14; color: #FFFFFF; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 12px; letter-spacing: 0.2px; min-width: 200px; text-align: center;">
											Login to Your Account
										</a>
									</td>
								</tr>
								</tbody>
							</table>

							<hr style="margin: 40px 0; border: none; border-top: 1px solid #E5E5E5;">

							<p style="margin: 0; font-size: 14px; color: #5E5E5E; line-height: 1.6; text-align: center;">
								If you have any questions or need assistance getting started go to the College of Information Technology building for help.
							</p>
						</td>
					</tr>
					</tbody>
				</table>

				<table width="600" cellpadding="0" cellspacing="0" border="0" class="content-wrapper" style="max-width: 600px; width: 100%; margin: 30px auto 0 auto; background-color: #fcb100; border-radius: 16px;">
					<tbody>
					<tr>
						<td class="footer-padding" style="padding: 30px 50px; text-align: center;">
							<p class="footer-text" style="margin: 0; font-size: 14px; color: #1A1A1A; line-height: 1.6; font-weight: 600;">
								Ready to get started? Login now and explore everything Liceo 8888 has to offer!
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
