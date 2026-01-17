import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { emailService } from '$lib/services/email/email.service';
import type { PostEmail } from '$lib/models/email/email.type';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { to, subject, html, text } = await request.json() as PostEmail;

		if (!to || !subject || (!html && !text)) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		const success = await emailService.sendEmail({ to, subject, html, text });

		if (!success) {
			return json({ error: 'Failed to send email' }, { status: 500 });
		}

		return json({ success: true }, { status: 200 });
	} catch (error) {
		console.error('Email API error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};