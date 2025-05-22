<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		for?: string;
		label?: string;
		large?: boolean;
		small?: boolean;
		children: Snippet;
		info?: string;
		error?: string;
	};

	const { label, children, info, large, small, error, ...props }: Props = $props();
</script>

<div class="frame" class:large class:small class:error>
	{#if label && props.for}
		<label for={props.for}>{label}</label>
	{/if}
	<div class="inputs">
		{@render children()}
	</div>
	{#if error}
		<small>{error}</small>
	{:else if info}
		<small>{info}</small>
	{:else}
		<small>&nbsp;</small>
	{/if}
</div>

<style lang="postcss">
	@reference "tailwindcss/theme";
	.frame {
		@apply grid gap-0;
	}
	label {
		@apply pl-1 text-zinc-600;
	}
	small {
		@apply pl-1 text-zinc-600;
	}

	.error .inputs {
		@apply ring-1 ring-red-500;
	}

	:global(.dark) {
		label {
			@apply text-zinc-400;
		}
		small {
			@apply text-zinc-400;
		}

		.inputs {
			@apply bg-zinc-700;
			@apply border-zinc-600;
		}
	}

	.inputs {
		@apply flex flex-row flex-nowrap items-center gap-3;
		@apply w-full px-3 py-2;
		@apply bg-zinc-200;
		@apply rounded-md border-zinc-500;
	}

	.small {
		label {
			@apply text-xs;
		}

		small {
			@apply text-xs;
		}

		.inputs {
			@apply max-w-fit p-1;
		}
	}

	.large {
		.inputs {
			@apply px-5 py-3;
		}
	}
</style>
