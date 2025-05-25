import { getDB, schema } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Link } from '$lib/definitions';

export const GET: RequestHandler = async ({ params }) => {
	const db = getDB();
	const { shorten } = params;
	const link = await db
		.select({
			url: schema.link.url,
			key: schema.link.id,
			password: schema.link.passphrase,
			callLimit: schema.link.callLimit,
			calls: schema.link.calls,
			createdAt: schema.link.createdAt,
			expiresAt: schema.link.expiresAt
		})
		.from(schema.link)
		.where(eq(schema.link.id, shorten))
		.get();
	if (!link) {
		return error(404, 'Not Found');
	}
	const { password, ...rest } = link;
	return json({ ...rest, hasPassphrase: !!password } satisfies Link);
};
