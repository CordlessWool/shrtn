import { mdsvex } from 'mdsvex';
import nodeAdapter from '@sveltejs/adapter-node';
import cloudflareAdapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const { BUILD_FOR } = process.env;

const getAdapter = (env) => {
	if (env && env.toUpperCase() === 'CLOUDFLARE') {
		return cloudflareAdapter();
	}

	return nodeAdapter({ dynamic_origin: true });
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess(), mdsvex()],
	kit: { adapter: getAdapter(BUILD_FOR) },
	extensions: ['.svelte', '.svx']
};

export default config;
