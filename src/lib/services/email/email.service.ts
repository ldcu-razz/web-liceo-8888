import type { PostEmail } from "$lib/models/email/email.type";
import type { Transporter } from "nodemailer";
import nodemailer from "nodemailer";
import { SMTP_FROM_NAME, SMTP_FROM_EMAIL, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_SECURE } from "$env/static/private";

class EmailService {
  private transport: Transporter | null = null;

  private async getTransporter(): Promise<Transporter> {
    if (!this.transport) {
      this.transport = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: SMTP_SECURE === 'true',
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASSWORD
        }
      });
    }
    
    return this.transport;
  }

	async sendEmail(options: PostEmail): Promise<boolean> {
		try {
			const transporter = await this.getTransporter();

			await transporter.sendMail({
				from: `"${SMTP_FROM_NAME}" <${SMTP_FROM_EMAIL}>`,
				to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
				subject: options.subject,
				text: options.text,
				html: options.html
			});

			return true;
		} catch (error) {
			console.error('Email sending failed:', error);
			return false;
		}
	}

  async verifyConnection(): Promise<boolean> {
		try {
			const transporter = await this.getTransporter();
			await transporter.verify();
			return true;
		} catch (error) {
			console.error('SMTP connection failed:', error);
			return false;
		}
	}
}

export const emailService = new EmailService();