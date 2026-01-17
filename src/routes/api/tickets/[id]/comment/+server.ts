import { TABLES } from '$lib/constants/tables.constants';
import { supabase } from '$lib/supabase/client';
import type {
	GetTicketComment,
	GetTicketCommentsPaginated,
	TicketComment
} from '$lib/models/tickets/ticket-comments.type';
import type { RequestHandler } from '@sveltejs/kit';
import { sendEmailToUserUpdateTicketComment } from '$lib/services/email/send-email.service';

export const GET: RequestHandler = async ({ params, url }) => {
	const page = Number(url.searchParams.get('page')) || 1;
	const size = Number(url.searchParams.get('size')) || 20;
	const isVisibleToPublic = url.searchParams.get('is_visible_to_public')
		? url.searchParams.get('is_visible_to_public') === 'true'
		: null;

	const { id } = params;

	let queryBuilder = supabase
		.from(TABLES.TICKET_COMMENTS)
		.select(
			`
    *,
    created_by:${TABLES.USERS}!created_by(id, firstname, lastname, username)
  `
		)
		.eq('ticket_id', id)
		.order('createdAt', { ascending: false });

	let countQueryBuilder = supabase
		.from(TABLES.TICKET_COMMENTS)
		.select('*', { count: 'exact', head: true })
		.eq('ticket_id', id);

	if (size && page) {
		queryBuilder = queryBuilder.range((page - 1) * size, page * size - 1);
		countQueryBuilder = countQueryBuilder.range((page - 1) * size, page * size - 1);
	}

	if (isVisibleToPublic !== null) {
		queryBuilder = queryBuilder.eq('is_visible_to_public', true);
		countQueryBuilder = countQueryBuilder.eq('is_visible_to_public', true);
	}

	const { data, error } = await queryBuilder.overrideTypes<GetTicketComment[]>();
	if (error) {
		return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	}

	const { count, error: countError } = await countQueryBuilder;
	if (countError) {
		return new Response(JSON.stringify({ error: countError.message }), { status: 500 });
	}

	const payloadData: GetTicketCommentsPaginated = {
		data,
		count: count || 0,
		page,
		size
	};

	return new Response(JSON.stringify(payloadData), { status: 200 });
};

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();

	const { data, error: commentError } = await supabase
		.from(TABLES.TICKET_COMMENTS)
		.insert(body)
		.select(
			`
    *,
    created_by:${TABLES.USERS}!created_by(id, firstname, lastname, username)
  `
		)
		.single()
		.overrideTypes<GetTicketComment>();

		
	if (commentError) {
		return new Response(JSON.stringify({ error: commentError.message }), { status: 500 });
	}
		
	const commentTypedData = data as GetTicketComment;

	if (commentTypedData.is_visible_to_public) {
		sendEmailToUserUpdateTicketComment(commentTypedData);
	}

	return new Response(JSON.stringify(commentTypedData), { status: 200 });
};

export const PUT: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const id = body.id;

	const { data, error } = await supabase
		.from(TABLES.TICKET_COMMENTS)
		.update({ ...body })
		.eq('id', id)
		.select(
			`
    *,
    created_by:${TABLES.USERS}!created_by(id, firstname, lastname, username)
  `
		)
		.single()
		.overrideTypes<GetTicketComment>();
	if (error) {
		return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	}
	return new Response(JSON.stringify(data), { status: 200 });
};

export const DELETE: RequestHandler = async ({ request }) => {
	const { id } = await request.json();

	const { error } = await supabase
		.from(TABLES.TICKET_COMMENTS)
		.delete()
		.eq('id', id)
		.overrideTypes<TicketComment>();
	if (error) {
		return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	}
	return new Response(JSON.stringify(true), { status: 200 });
};
