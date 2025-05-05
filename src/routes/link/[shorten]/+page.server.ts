import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { localizeHref } from '$lib/paraglide/runtime';

export const load = (() => {
	redirect(302, localizeHref('/'));
}) satisfies PageServerLoad;
