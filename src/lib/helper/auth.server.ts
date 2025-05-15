import { getDB, schema } from '$lib/server/db';
import * as auth from '$lib/server/auth';
import type { RequestEvent } from '@sveltejs/kit';
import { createUUID } from './identifiers';

export const createAndLoginTempUser = async (event: RequestEvent) => {
	const db = getDB();
	const userId = createUUID();
	const user = {
		id: userId,
		temp: true,
		email: null,
		lastSeen: new Date(),
		createdAt: new Date()
	};
	await db.insert(schema.user).values([user]).run();

	const sessionToken = auth.generateSessionToken();
	const session = await auth.createSession(sessionToken, userId);
	auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	return { user, session } satisfies App.Locals;
};

export const loginUser = async (event: RequestEvent, userId: string) => {
	const sessionToken = auth.generateSessionToken();
	const session = await auth.createSession(sessionToken, userId);
	auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
};
