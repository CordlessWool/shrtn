<script lang="ts">
	import { type Snippet } from 'svelte';
	import InputFrame from './InputFrame.svelte';
	import Button from './Button.svelte';
	import { X as XIcon, Plus } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	type Props = {
		label: string | Snippet;
		for: string;
		required?: boolean;
		error?: string;
		onremove?: () => unknown;
		onselect?: () => unknown;
		children: Snippet;
	};

	let { label, required, for: forInput, error, onselect, onremove, children }: Props = $props();
	let active = $state(!!required);

	$effect(() => {
		if (active === false) {
			onremove?.();
		} else {
			onselect?.();
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
			{#if typeof label === 'string'}
				{label}
			{:else}
				{@render label()}
			{/if}
		</Button>
	</div>
{/if}
