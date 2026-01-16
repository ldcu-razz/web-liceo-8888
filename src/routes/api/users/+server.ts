import { supabase } from '$lib/supabase/client';
import type { Users } from '$lib/models/users/users.type';
import bcrypt from 'bcrypt';

export const GET = async ({ url }) => {
	const page = Number(url.searchParams.get('page')) || undefined;
	const size = Number(url.searchParams.get('size')) || undefined;
	const query = url.searchParams.get('q') || '';
	const userRoles = url.searchParams.get('userRoles');
	const userRolesArray = userRoles ? userRoles.split(',') : [];

	let queryBuilder = supabase
		.from('users')
		.select(
			'*, properties:user_properties(id, remaining_tickets_creation, bypass_ticket_creation_limit)'
		)
		.order('createdAt', { ascending: false });

	if (size && page) {
		queryBuilder = queryBuilder.range((page - 1) * size, page * size - 1);
	}

	if (query) {
		const isNumeric = !Number.isNaN(Number(query));

		const orConditions = [
			`firstname.ilike.%${query}%`,
			`lastname.ilike.%${query}%`,
			`username.ilike.%${query}%`
		];

		if (isNumeric) {
    // We use rfid_number because that is the actual column name
    // We remove Number() to keep it as a string (prevents losing leading zeros)
    orConditions.push(`rfid_number.eq.${query}`);
}

		queryBuilder = queryBuilder.or(orConditions.join(','));
	}

	if (userRolesArray.length > 0) {
		queryBuilder = queryBuilder.in('role', userRolesArray);
	}

	const { data, error } = await queryBuilder.overrideTypes<Users>();

	if (error) {
		return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	}

	let countQuery = supabase
		.from('users')
		.select('*', { count: 'exact', head: true });

	if (query) {
    const orConditions = [
        `firstname.ilike.%${query}%`,
        `lastname.ilike.%${query}%`,
        `username.ilike.%${query}%`,
        // Targeted Fix: This ensures the exact RFID is matched 
        // regardless of whether it contains letters or hyphens.
        `rfid_number.eq.${query}` 
    ];

    // REMOVE the "if (isNumeric)" block entirely to satisfy 
    // the requirement for exact RFID matching for all formats.
    queryBuilder = queryBuilder.or(orConditions.join(','));
}

	if (userRolesArray.length > 0) {
		countQuery = countQuery.in('role', userRolesArray);
	}

	const { count, error: countError } = await countQuery;

	if (countError) {
		return new Response(JSON.stringify({ error: countError.message }), { status: 500 });
	}

	return new Response(JSON.stringify({ data, count, page, size }), { status: 200 });
};

export const POST = async ({ request }) => {
	const body = await request.json();
	const password = body.password;
	const hashedPassword = await bcrypt.hash(password, 10);
	const newBody = { ...body, password: hashedPassword };

	const { data, error } = await supabase
		.from('users')
		.insert(newBody)
		.select()
		.single()
		.overrideTypes<Users>();

	if (error) {
		return new Response(JSON.stringify({ error: error.message }), { status: 500 });
	}
	return new Response(JSON.stringify(data), { status: 200 });
};
