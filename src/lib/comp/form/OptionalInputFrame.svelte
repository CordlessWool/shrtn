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
		children: Snippet;
	};
	let active = $state(false);
	let { label, required, for: forInput, children }: Props = $props();
</script>

{#if required || active}
	<div in:fade>
		<InputFrame small {label} for={forInput}>
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
