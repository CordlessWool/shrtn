import type { LayoutServerLoad } from './$types';
import { isAuthenticated } from '$lib/helper/auth.server';
import { redirect } from '@sveltejs/kit';
import { privateInstance } from '$lib/helper/env';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (privateInstance && !isAuthenticated(locals)) {
		// Redirect to login page
		redirect(302, '/login');
	}

	return {};
};
