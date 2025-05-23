<script lang="ts">
	import { localizeHref } from '$lib/paraglide/runtime';
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	type Props = {
		children: Snippet;
		transparent?: boolean;
		href: string;
	} & HTMLAnchorAttributes;

	const { children, transparent = false, href, ...props }: Props = $props();
</script>

<a href={localizeHref(href)} class:button={true} class:transparent {...props}>
	{@render children()}
</a>

<style lang="postcss">
	@import '../form/Button.css';
</style>
