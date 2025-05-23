<script lang="ts">
	import { type Snippet } from 'svelte';
	import InputFrame from './InputFrame.svelte';
	import Button from './Button.svelte';
	import { X as XIcon, Plus } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	type Props = {
		label: string;
		for: string;
		required?: boolean;
		error?: string;
		onremove?: () => unknown;
		children: Snippet;
	};

	let { label, required, for: forInput, error, onremove, children }: Props = $props();
	let active = $state(!!required);

	$effect(() => {
		if (onremove && active === false) {
			onremove();
		}
	});
</script>

{#if required || active}
	<div in:fade>
		<InputFrame {error} small {label} for={forInput}>
			<Button transparent disabled={required} onclick={() => (active = false)}
				><XIcon size={16} /></Button
			>
			{@render children()}
		</InputFrame>
	</div>
{:else}
	<div in:fade>
		<Button transparent onclick={() => (active = true)}>
			<Plus />
			{label}
		</Button>
	</div>
{/if}
