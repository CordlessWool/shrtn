<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLDialogAttributes } from 'svelte/elements';

	type Props = {
		show?: boolean;
		children?: Snippet;
	} & HTMLDialogAttributes;

	let { show = $bindable(true), children, ...props }: Props = $props();
	let dialog: HTMLDialogElement | undefined = $state();

	$effect(() => {
		if (show) {
			dialog.showModal();
		} else {
			dialog.close();
		}
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog
	{...props}
	bind:this={dialog}
	onclose={() => (show = false)}
	onclick={(e) => {
		if (e.target === dialog) dialog.close();
	}}
>
	{@render children?.()}
</dialog>

<style lang="postcss">
	@reference 'tailwindcss/theme';
	dialog {
		@apply fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform;
		@apply rounded-md shadow-md;
	}
	dialog::backdrop {
		@apply bg-zinc-500/70;
	}

	dialog[open] {
		animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}
	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}
	dialog[open]::backdrop {
		animation: fade 0.2s ease-out;
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
