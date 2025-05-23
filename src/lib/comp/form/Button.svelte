<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	type Props = {
		children: Snippet;
		outline?: boolean;
		error?: boolean;
		danger?: boolean;
		disabled?: boolean;
		transparent?: boolean;
	} & HTMLAttributes<HTMLButtonElement>;

	const {
		children,
		transparent = false,
		error = false,
		danger = false,
		disabled = false,
		outline = false,
		...props
	}: Props = $props();
</script>

<button
	class:outline
	disabled={error === true || disabled === true}
	class:danger={danger || error}
	class:transparent
	{...props}
>
	{@render children()}
</button>

<style lang="postcss">
	@import './Button.css';
</style>
