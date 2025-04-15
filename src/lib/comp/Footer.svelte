<script>
	import * as m from '$lib/paraglide/messages';
	import { page } from '$app/state';
	import { i18n } from '$lib/i18n';
	import { Github } from 'lucide-svelte';
	import { languageTag } from '$lib/paraglide/runtime';
	import { env } from '$env/dynamic/public';
	import { toUpperCase } from 'valibot';
</script>

<footer>
	<a rel="alternative" hreflang="en" href={i18n.route(page.url.pathname)}>EN</a>
	<a rel="alternative" hreflang="de" href={i18n.route(page.url.pathname)}>DE</a>
	<a
		title={m.github_link_title()}
		href="https://github.com/CordlessWool/shrtn"
		target="_blank"
		rel="noopener noreferrer"><Github /></a
	>
	<span>{m.made_with_love()} <a href="https://dropanote.de">CordlessWool</a></span>
	{#if env[`PUBLIC_LINK_TERMS_${languageTag().toUpperCase()}`]}
		<a
			href={env[`PUBLIC_LINK_TERMS_${languageTag().toUpperCase()}`]}
			target="_blank"
			rel="noopener noreferrer">{m.terms_of_use()}</a
		>
	{:else if env['PUBLIC_LINK_TERMS']}
		<a href={env['PUBLIC_LINK_TERMS']} target="_blank" rel="noopener noreferrer">Terms of Use</a>
	{/if}
	{#if env[`PUBLIC_LINK_TERMS_${languageTag().toUpperCase()}`]}
		<a
			href={env[`PUBLIC_LINK_IMPRINT_${languageTag().toUpperCase()}`]}
			target="_blank"
			rel="noopener noreferrer">{m.imprint()}</a
		>
	{:else if env['PUBLIC_LINK_IMPRINT']}
		<a href={env['PUBLIC_LINK_IMPRINT']} target="_blank" rel="noopener noreferrer">Imprint</a>
	{/if}
</footer>

<style lang="postcss">
	@reference "tailwindcss/theme";
	footer {
		@apply my-3 flex flex-wrap items-center justify-center gap-y-5 text-zinc-600;
		@apply divide-x-2 divide-zinc-600;
	}

	footer > * {
		@apply px-5;
	}

	:global(.dark) {
		footer {
			@apply text-zinc-400;
		}
	}
	a {
		@apply underline-offset-4 hover:font-bold hover:underline;
		@apply transform transition-all duration-300 ease-in-out hover:scale-105;
	}
</style>
