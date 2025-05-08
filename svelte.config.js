import nodeAdapter from '@sveltejs/adapter-node';
import cloudflareAdapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const getAdapter = (env) => {
	if (env && env.toUpperCase() === 'CLOUDFLARE') {
		return cloudflareAdapter();
	}

	return nodeAdapter({
		dynamic_origin: true
	});
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: getAdapter(process.env.BUILD_FOR)
	}
};

export default config;
