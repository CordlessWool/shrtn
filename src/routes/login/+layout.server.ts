import { publicOnlyInstance } from '$lib/helper/env';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from '../(app)/$types';

export const load: LayoutServerLoad = async () => {
	if (publicOnlyInstance) {
		error(404, 'Not Found');
	}
	return;
};
