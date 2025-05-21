<script lang="ts">
	import { type Snippet } from 'svelte';
	import InputFrame from './InputFrame.svelte';
	import Button from './Button.svelte';
	import { X as XIcon, Plus } from 'lucide-svelte';

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
	<InputFrame small {label} for={forInput}>
		<Button transparent disabled={required} onclick={() => (active = false)}
			><XIcon size={16} /></Button
		>
		{@render children()}
	</InputFrame>
{:else}
	<Button transparent onclick={() => (active = true)}>
		<Plus />
		{label}
	</Button>
{/if}
