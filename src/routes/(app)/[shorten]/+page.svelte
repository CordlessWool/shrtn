<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageProps } from './$types';
	import Outdated from './Outdated.svelte';
	import Passphrase from './Passphrase.svelte';
	import Unsecure from './Unsecure.svelte';
	import { page } from '$app/state';
	import { isSecure } from '$lib/security';

	const { data }: PageProps = $props();
	const secure = false;

	onMount(() => {
		if (data.code === 302 && isSecure(page.url) && data.redirect) {
			window.location.replace(data.redirect);
		}
	});
</script>

<main class="flex flex-col items-center justify-center">
	{#if data.code === 302 && secure === false}
		<Unsecure link={data.redirect} />
	{:else if data.code === 401}
		<Passphrase {...data} />
		<!-- {:else if data.code === 200}
		<Bot link={data.link} /> -->
	{:else}
		<Outdated />
	{/if}
</main>
