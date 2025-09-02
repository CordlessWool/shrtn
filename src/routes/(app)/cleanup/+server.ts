import type { RequestHandler } from './$types';
import { getDB, schema } from '$lib/server/db/index.js';
import { lte } from 'drizzle-orm';

const cleanupLinks = async () => {
	const db = getDB();
	// Remove expired links and magic links
	await db.delete(schema.link).where(lte(schema.link.expiresAt, new Date())).run();
	await db.delete(schema.magicLink).where(lte(schema.magicLink.expiresAt, new Date())).run();
};

export const GET: RequestHandler = () => {
	cleanupLinks();

	return new Response('', { status: 204 });
};
