import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';
import * as auth from '$lib/server/auth.js';
import { getDB, schema } from '$lib/server/db/index.js';
import { lte } from 'drizzle-orm';
import { HOUR_IN_MS } from '$lib/helper/defaults';
import { paraglideMiddleware } from '$lib/paraglide/server';

// creating a handle to use the paraglide middleware
const paraglideHandle: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request: localizedRequest, locale }) => {
		event.request = localizedRequest;
		return resolve(event, {
			transformPageChunk: ({ html }) => {
				return html.replace('%lang%', locale);
			}
		});
	});

const cleanupLinks = async () => {
	const db = getDB();
	// Remove expired links and magic links
	await db.delete(schema.link).where(lte(schema.link.expiresAt, new Date())).run();
	await db.delete(schema.magicLink).where(lte(schema.magicLink.expiresAt, new Date())).run();
};

setInterval(cleanupLinks, HOUR_IN_MS);

const handleAuth: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(auth.sessionCookieName);
	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await auth.validateSessionToken(sessionToken);
	if (session) {
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		auth.deleteSessionTokenCookie(event);
	}

	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};

export const handle: Handle = sequence(handleAuth, paraglideHandle);
