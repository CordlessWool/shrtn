import type { RequestHandler } from './$types';
import { getDB, schema } from '$lib/server/db/index.js';
import { and, eq, lte, notExists } from 'drizzle-orm';

const cleanup = async () => {
	const db = getDB();
	const now = new Date();
	// Remove expired links, magic links and sessions
	await db.delete(schema.link).where(lte(schema.link.expiresAt, now)).run();
	await db.delete(schema.magicLink).where(lte(schema.magicLink.expiresAt, now)).run();
	await db.delete(schema.session).where(lte(schema.session.expiresAt, now)).run();
	// Remove temp users that have nothing left referencing them
	await db
		.delete(schema.user)
		.where(
			and(
				eq(schema.user.temp, true),
				notExists(db.select().from(schema.link).where(eq(schema.link.userId, schema.user.id))),
				notExists(
					db.select().from(schema.session).where(eq(schema.session.userId, schema.user.id))
				),
				notExists(
					db.select().from(schema.magicLink).where(eq(schema.magicLink.userId, schema.user.id))
				)
			)
		)
		.run();
};

export const GET: RequestHandler = ({ platform }) => {
	const task = cleanup().catch((err) => console.error('cleanup failed', err));
	// workers cancel pending promises after the response unless registered
	platform?.context?.waitUntil(task);

	return new Response('', { status: 204 });
};
