import { getDB, schema } from '$lib/server/db';
import * as auth from '$lib/server/auth';
import type { RequestEvent } from '@sveltejs/kit';
import { createUUID } from './identifiers';
import { env } from '$env/dynamic/private';

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

export const isAuthenticated = (locals: App.Locals) => !!(locals.user && !locals.user.temp);

export const isAllowedEmail = ((): ((email: string) => boolean) => {
	if (env.ALLOWED_LOGIN_EMAILS) {
		const allowedEmails = env.ALLOWED_LOGIN_EMAILS.split(';').map((email) =>
			email.trim().toLowerCase()
		);
		return (email: string) => allowedEmails.includes(email.toLowerCase());
	} else if (env.ALLOWED_LOGIN_DOMAINS) {
		const allowedDomains = env.ALLOWED_LOGIN_DOMAINS.split(';').map((domain) =>
			domain.trim().toLowerCase()
		);
		return (email: string) =>
			allowedDomains.some((domain) => email.toLowerCase().endsWith(`@${domain}`));
	}

	return () => true;
})();
