import { eq, and, gte, or, isNull, sql } from 'drizzle-orm';
import { getDB, schema } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';
import { isbot } from 'isbot';
import { isExpired } from '$lib/helper/date';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { PassphraseSchema } from '$lib/helper/form';
import type { Actions, PageServerLoad } from './$types';

import * as m from '$lib/paraglide/messages';

const incrementCalls = (id: string) =>
	getDB()
		.update(schema.link)
		.set({ calls: sql`coalesce(${schema.link.calls}, 0) + 1` })
		.where(eq(schema.link.id, id))
		.run();

export const load: PageServerLoad = async ({ params, request, url }) => {
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
	if (data.callLimit != null && (data.calls ?? 0) >= data.callLimit) {
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
	if (data.callLimit != null && !isbot(request.headers.get('User-Agent'))) {
		await incrementCalls(shorten);
	}
	return redirect(302, data.link);
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
			.select({
				url: schema.link.url,
				callLimit: schema.link.callLimit
			})
			.from(schema.link)
			.where(and(eq(schema.link.id, shorten), eq(schema.link.passphrase, form.data.passphrase)))
			.get();

		if (!result) {
			return setError(form, 'passphrase', m.shrtn_passphrase_invalid());
		}
		if (result.callLimit != null) {
			await incrementCalls(shorten);
		}

		return redirect(302, result.url);
	}
} satisfies Actions;
