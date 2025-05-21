<script>
	import * as m from '$lib/paraglide/messages';
	import { page } from '$app/state';
	import { localizeHref, getLocale } from '$lib/paraglide/runtime';
	import { Github } from 'lucide-svelte';
	import { env } from '$env/dynamic/public';
</script>

<footer>
	<a
		data-sveltekit-reload
		rel="alternate"
		hreflang="en"
		href={localizeHref(page.url.pathname, { locale: 'en' })}>EN</a
	>
	<a
		data-sveltekit-reload
		rel="alternate"
		hreflang="de"
		href={localizeHref(page.url.pathname, { locale: 'de' })}>DE</a
	>
	<a
		data-sveltekit-reload
		rel="alternate"
		hreflang="sp"
		href={localizeHref(page.url.pathname, { locale: 'sp' })}>SP</a
	>
	<a
		title={m.github_link_title()}
		href="https://github.com/CordlessWool/shrtn"
		target="_blank"
		rel="noopener noreferrer"><Github /></a
	>
	<span>{m.made_with_love()} <a href="https://dropanote.de">CordlessWool</a></span>
	{#if env[`PUBLIC_LINK_TERMS_${getLocale().toUpperCase()}`]}
		<a
			href={env[`PUBLIC_LINK_TERMS_${getLocale().toUpperCase()}`]}
			target="_blank"
			rel="noopener noreferrer">{m.terms_of_use()}</a
		>
	{:else if env['PUBLIC_LINK_TERMS']}
		<a href={env['PUBLIC_LINK_TERMS']} target="_blank" rel="noopener noreferrer">Terms of Use</a>
	{/if}
	{#if env[`PUBLIC_LINK_TERMS_${getLocale().toUpperCase()}`]}
		<a
			href={env[`PUBLIC_LINK_IMPRINT_${getLocale().toUpperCase()}`]}
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
