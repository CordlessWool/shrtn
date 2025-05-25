import type { Actions, PageServerLoad } from './$types';
import { fail, message, setError, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { getDB, schema } from '$lib/server/db';
import { error, redirect } from '@sveltejs/kit';
import { emptyStringToNull, getLinkSchema, getString } from '$lib/helper/form';
import { createAndLoginTempUser } from '$lib/helper/auth.server';
import { and, eq, gte, isNull, or } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { SHORTEN_LENGTH } from '$lib/helper/defaults';
import type { Link as LinkSchema } from '$lib/server/db/schema';
import { ORIGIN } from '$lib/server/defaults.js';
import type { Link } from '$lib/definitions';
import { localizeHref } from '$lib/paraglide/runtime';
import { env } from '$env/dynamic/public';
import { isPublicLink } from '$lib/helper/link';

import * as m from '$lib/paraglide/messages';

const saveLink = async (data: LinkSchema, counter = 5) => {
	const db = getDB();
	try {
		await db.insert(schema.link).values([data]).run();
		return data.id;
	} catch (err) {
		if (
			err != null &&
			typeof err === 'object' &&
			!Array.isArray(err) &&
			'code' in err &&
			err.code === 'SQLITE_CONSTRAINT_PRIMARYKEY'
		) {
			const id = nanoid(SHORTEN_LENGTH - (counter - 10));
			return saveLink({ ...data, id }, counter - 1);
		} else {
			throw err;
		}
	}
};

export const load: PageServerLoad = async ({ locals, request }) => {
	const db = getDB();
	const origin = ORIGIN || request.headers.get('origin');
	if (!origin) {
		error(400, 'Origin header is missing');
	}
	const form = superValidate(valibot(getLinkSchema(!!locals.user && !locals.user.temp)));
	if (!locals.user) {
		return {
			links: [] as Link[],
			form: await form,
			origin
		};
	}

	const data = await db
		.select({
			url: schema.link.url,
			key: schema.link.id,
			passphrase: schema.link.passphrase,
			calls: schema.link.calls,
			callLimit: schema.link.callLimit,
			createdAt: schema.link.createdAt,
			expiresAt: schema.link.expiresAt
		})
		.from(schema.link)
		.where(
			and(
				eq(schema.link.userId, locals.user.id),
				or(gte(schema.link.expiresAt, new Date()), isNull(schema.link.expiresAt))
			)
		)
		.all();

	return {
		origin,
		links: data.map((link) => ({
			key: link.key,
			url: link.url,
			hasPassphrase: !!link.passphrase,
			calls: link.calls,
			callLimit: link.callLimit,
			createdAt: link.createdAt,
			expiresAt: link.expiresAt
		})),
		form: await form
	};
};

export const actions = {
	add: async (event) => {
		const { locals, request } = event;
		let { user } = locals;

		if (user == null) {
			// create tmp user
			({ user } = await createAndLoginTempUser(event));
		}

		const LinkSchema = getLinkSchema(!user.temp);
		const form = await superValidate(request, valibot(LinkSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		if (env.PUBLIC_FEATURE_PRIVATE_LINKS !== 'on' && !(await isPublicLink(form.data.link))) {
			return message(form, m.invalid_private_link(), { status: 400 });
		}

		const { ttl, link: url, short, passphrase, callLimit } = form.data;
		const expiresAt = ttl == null ? null : new Date(Date.now() + ttl);
		const id = await saveLink({
			id: short || nanoid(SHORTEN_LENGTH),
			userId: user.id,
			url,
			passphrase: emptyStringToNull(passphrase) ?? null,
			callLimit: callLimit ?? null,
			calls: null,
			createdAt: new Date(),
			expiresAt
		});

		redirect(302, localizeHref(`/link/${id}`));
	},
	remove: async ({ locals, request }) => {
		const { user } = locals;
		const db = getDB();
		if (user == null) {
			return error(401, 'Not Authenticated');
		}

		const data = await request.formData();
		const key = getString(data.get('key'));
		await db
			.delete(schema.link)
			.where(and(eq(schema.link.id, key), eq(schema.link.userId, user.id)))
			.run();
		return { success: true };
	}
} satisfies Actions;
