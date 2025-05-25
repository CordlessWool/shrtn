<script lang="ts">
	import { localizeHref } from '$lib/paraglide/runtime';
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	type Props = {
		children: Snippet;
		transparent?: boolean;
		href: string;
		download?: string;
	} & HTMLAnchorAttributes;

	const { children, transparent = false, href, download, ...props }: Props = $props();
</script>

<a
	href={download ? href : localizeHref(href)}
	class:button={true}
	class:transparent
	{...props}
	{download}
>
	{@render children()}
</a>

<style lang="postcss">
	@import '../form/Button.css';
</style>
