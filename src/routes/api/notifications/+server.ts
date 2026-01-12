import { TABLES } from '$lib/constants/tables.constants';
import type {
	GetNotifications,
	GetNotificationsPaginated,
	PostNotifications,
	PutNotifications
} from '$lib/models/notifications/notifications.type';
import { supabase } from '$lib/supabase/client';

export const GET = async ({ url }) => {
	const page = Number(url.searchParams.get('page')) || 1;
	const size = Number(url.searchParams.get('size')) || 20;
	const notifyToId = url.searchParams.get('notify_to');

	let queryBuilder = supabase
		.from(TABLES.NOTIFICATIONS)
		.select('*')
		.order('createdAt', { ascending: false });
	let countQueryBuilder = supabase
		.from(TABLES.NOTIFICATIONS)
		.select('*', { count: 'exact', head: true });

	if (notifyToId) {
		queryBuilder = queryBuilder.eq('notify_to', notifyToId);
		countQueryBuilder = countQueryBuilder.eq('notify_to', notifyToId);
	}

	if (size && page) {
		queryBuilder = queryBuilder.range((page - 1) * size, page * size - 1);
		countQueryBuilder = countQueryBuilder.range((page - 1) * size, page * size - 1);
	}

	const { data, error } = await queryBuilder.overrideTypes<GetNotifications[]>();
	if (error) {
		return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	}

	const { count, error: countError } = await countQueryBuilder;
	if (countError) {
		return new Response(JSON.stringify({ error: countError.message }), { status: 500 });
	}

	const { count: countUnreadNotifications, error: countUnreadNotificationsError } = await supabase
		.from(TABLES.NOTIFICATIONS)
		.select('*', { count: 'exact', head: true })
		.eq('mark_as_read', false)
		.eq('notify_to', notifyToId);
	if (countUnreadNotificationsError) {
		return new Response(JSON.stringify({ error: countUnreadNotificationsError.message }), {
			status: 500
		});
	}

	const payloadData: GetNotificationsPaginated = {
		data,
		count: count || 0,
		unread_count: countUnreadNotifications || 0,
		page,
		size
	};

	return new Response(JSON.stringify(payloadData), { status: 200 });
};

export const POST = async ({ request }) => {
	const body = (await request.json()) as PostNotifications;
	const { data, error } = await supabase
		.from(TABLES.NOTIFICATIONS)
		.insert(body)
		.select()
		.overrideTypes<GetNotifications[]>();

	if (error) {
		console.error('error', error);
		return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	}
	return new Response(JSON.stringify(data), { status: 200 });
};

export const PUT = async ({ request }) => {
	const body = (await request.json()) as PutNotifications;
	const { id } = body;

	const { data, error } = await supabase
		.from(TABLES.NOTIFICATIONS)
		.update(body)
		.eq('id', id)
		.select()
		.single()
		.overrideTypes<GetNotifications>();
	if (error) {
		return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	}
	return new Response(JSON.stringify(data), { status: 200 });
};
