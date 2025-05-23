<script lang="ts">
	import type { Snippet } from 'svelte';
	import ToggleTheme from './ToggleTheme.svelte';
	import { localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';

	import { PUBLIC_FEATURE_MARKETING_PAGES } from '$env/static/public';
	import { isOn } from '$lib/helper/env';

	type Props = {
		children?: Snippet;
		showName?: boolean;
	};

	const { children, showName = true }: Props = $props();
</script>

<header class:name={showName}>
	{#if showName}
		<a href={localizeHref('/')} class="name">shrtn</a>
	{/if}
	<nav>
		<ToggleTheme />
		{#if isOn(PUBLIC_FEATURE_MARKETING_PAGES)}
			<a href={localizeHref('/about')}>{m.about_link()}</a>
			<a href={localizeHref('/setup')}>{m.setup_link()}</a>
		{/if}
		{@render children?.()}
	</nav>
</header>

<style lang="postcss">
	@reference "tailwindcss/theme";
	header {
		@apply flex items-center justify-end gap-3 p-3;
	}

	header.name {
		@apply justify-between;
	}

	header > .name {
		@apply justify-self-start text-2xl font-bold;
	}

	nav {
		@apply flex items-center gap-7;
	}

	nav :global {
		a:not(.button) {
			@apply cursor-pointer underline-offset-4 hover:font-bold hover:underline;
			@apply transform transition-all duration-300 ease-in-out hover:scale-105;
		}
	}
</style>
