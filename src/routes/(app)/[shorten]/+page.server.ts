import { eq, and, gte, or, isNull } from 'drizzle-orm';
import { getDB, schema } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import { isbot } from 'isbot';
import { isExpired } from '$lib/helper/date';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { PassphraseSchema } from '$lib/helper/form';
import type { Actions, PageServerLoad } from './$types';

import * as m from '$lib/paraglide/messages';

export const load: PageServerLoad = async ({ params, request }) => {
	const db = getDB();
	const { shorten } = params;
	const data = await db
		.select({
			link: schema.link.url,
			passphrase: schema.link.passphrase,
			calls: schema.link.calls,
			callLimit: schema.link.callLimit,
			expiresAt: schema.link.expiresAt
		})
		.from(schema.link)
		.where(
			and(
				eq(schema.link.id, shorten),
				or(gte(schema.link.expiresAt, new Date()), isNull(schema.link.expiresAt))
			)
		)
		.get();
	if (data == null || (data.expiresAt && isExpired(data.expiresAt, new Date()))) {
		return {
			code: 404
		};
	}
	if (data.passphrase != null) {
		const form = await superValidate(valibot(PassphraseSchema));
		return {
			code: 401,
			form
		};
	}
	if (data.callLimit != null) {
		if (data.callLimit > (data.calls ?? 0)) {
			return {
				code: 403
			};
		} else if (!isbot(request.headers.get('User-Agent'))) {
			await db.update(schema.link).set({
				calls: data.calls ?? 0 + 1
			});
		}
	}
	redirect(302, data.link);
};

export const actions = {
	passphrase: async ({ request, params }) => {
		const { shorten } = params;
		const db = getDB();
		const form = await superValidate(request, valibot(PassphraseSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const result = await db
			.select({ url: schema.link.url })
			.from(schema.link)
			.where(and(eq(schema.link.id, shorten), eq(schema.link.passphrase, form.data.passphrase)))
			.get();

		if (!result) {
			return setError(form, 'passphrase', m.shrtn_passphrase_invalid());
		}
		return redirect(302, result.url);
	}
} satisfies Actions;
