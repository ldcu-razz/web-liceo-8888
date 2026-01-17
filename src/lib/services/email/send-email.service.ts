import { TICKET_DONE_HTML_TEMPLATE, TICKET_IN_PROGRESS_HTML_TEMPLATE, TICKET_NEW_COMMENT_HTML_TEMPLATE, VERIFY_USER_ACCOUNT_HTML_TEMPLATE, WELCOME_USER_HTML_TEMPLATE } from "$lib/constants/email.constants";
import { TABLES } from "$lib/constants/tables.constants";
import type { GetTicketComment } from "$lib/models/tickets/ticket-comments.type";
import type { GetTicket, Ticket } from "$lib/models/tickets/tickets.type";
import { supabase } from "$lib/supabase/client";
import { emailService } from "./email.service";
import type { Users } from "$lib/models/users/users.type";
import { BASE_URL } from "$env/static/private";
import { VERIFY_EMAIL } from "$lib/constants/routes.constants";

export async function sendEmailToUserVerifyEmail(user: Users, verificationToken: string): Promise<boolean> {
  try {
    const verificationLink = `${BASE_URL}${VERIFY_EMAIL}?token=${verificationToken}`;
    const html = VERIFY_USER_ACCOUNT_HTML_TEMPLATE(verificationLink);
    const result = emailService.sendEmail({
      to: [user.email],
      subject: 'Verify Your Email Address',
      text: '',
      html: html
    });
    return result;
  } catch (error) {
    console.error(error);
    return Promise.resolve(false);
  }
}

export async function sendEmailToUserWelcomeEmail(fullname: string, email: string): Promise<boolean> {
  try {
    const html = WELCOME_USER_HTML_TEMPLATE(fullname);
    const result = emailService.sendEmail({
      to: [email],
      subject: 'Welcome to Liceo 8888',
      text: '',
      html: html
    });
    return result;
  } catch (error) {
    console.error(error);
    return Promise.resolve(false);
  }
}

export async function sendEmailToUserUpdateTicketToInProgress(reportedById: string, ticket: GetTicket): Promise<boolean> {
  try {
    const { data: userAssignedTo, error: userAssignedToError } = await supabase.from(TABLES.USERS).select('id,email').eq('id', reportedById).single();
    if (userAssignedToError) {
      console.error(userAssignedToError);
      return Promise.resolve(false);
    }

    const sendToUserEmails = [userAssignedTo.email];
    const html = TICKET_IN_PROGRESS_HTML_TEMPLATE(ticket.code, ticket.title);
    const result = emailService.sendEmail({
        to: sendToUserEmails,
        subject: `Ticket ${ticket.code} Has Been Started`,
        text: '',
        html: html
    });
    return result;  
  } catch (error) {
    console.error(error);
    return Promise.resolve(false);
  }
}

export async function sendEmailToUserUpdateTicketToDone(reportedById: string, ticket: GetTicket): Promise<boolean> {
  try {

    const { data: userReportedBy, error: userReportedByError } = await supabase.from(TABLES.USERS).select('id,email').eq('id', reportedById).single();
    if (userReportedByError) {
      console.error(userReportedByError);
      return Promise.resolve(false);
    }

    const sendToUserEmails = [userReportedBy.email];
    const html = TICKET_DONE_HTML_TEMPLATE(ticket.code, ticket.title);
    const result = emailService.sendEmail({
        to: sendToUserEmails,
        subject: `Ticket ${ticket.code} Has Been Resolved`,
        text: '',
        html: html
    });
    return result;
  } catch (error) {
    console.error(error);
    return Promise.resolve(false);
  }
}

export async function sendEmailToUserUpdateTicketComment(comment: GetTicketComment): Promise<boolean> {
  try {

    const { data: ticket, error: ticketError } = await supabase.from(TABLES.TICKETS).select('*').eq('id', comment.ticket_id).single();
    if (ticketError) {
      console.error(ticketError);
      return Promise.resolve(false);
    }
    const ticketTypedData = ticket as Ticket;

    const { data: userReportedBy, error: userReportedByError } = await supabase.from(TABLES.USERS).select('id,email').eq('id', ticketTypedData.reported_by).single();
    if (userReportedByError) {
      console.error(userReportedByError);
      return Promise.resolve(false);
    }

    const userReportedByTypedData = userReportedBy as Users;

    const sendToUserEmails = [userReportedBy.email];
    const html = TICKET_NEW_COMMENT_HTML_TEMPLATE(ticketTypedData.code, ticketTypedData.title, userReportedByTypedData.firstname, comment.comment);
    const result = emailService.sendEmail({
        to: sendToUserEmails,
        subject: `Ticket ${ticket.code} Has a New Comment`,
        text: '',
        html: html
    });
    return result;
  } catch (error) {
    console.error(error);
    return Promise.resolve(false);
  }
}