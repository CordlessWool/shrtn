import type { RequestHandler } from './$types';
import { eq, and, gte, or, isNull } from 'drizzle-orm';
import { getDB, schema } from '$lib/server/db';
import { error, redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	const db = getDB();
	const { shorten } = params;
	const data = await db
		.select({
			link: schema.link.url
		})
		.from(schema.link)
		.where(
			and(
				eq(schema.link.id, shorten),
				or(gte(schema.link.expiresAt, new Date()), isNull(schema.link.expiresAt))
			)
		)
		.get();
	if (data == null) {
		error(404);
	}
	redirect(302, data.link);
};
