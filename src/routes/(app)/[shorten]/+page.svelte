<script lang="ts">
	import type { PageData } from './$types';
	import Bot from './Bot.svelte';
	import Outdated from './Outdated.svelte';
	import Passphrase from './Passphrase.svelte';

	const { data }: { data: PageData } = $props();
</script>

<main class="flex flex-col items-center justify-center">
	{#if data.code === 401}
		<Passphrase {...data} />
	{:else if data.code === 200}
		<Bot link={data.link} />
	{:else}
		<Outdated />
	{/if}
</main>
