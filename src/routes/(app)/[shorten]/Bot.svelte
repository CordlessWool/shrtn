<script lang="ts">
	import { Shield } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages';

	const { link } = $props();
</script>

<main class="flex flex-col items-center justify-center">
	<h1 class="mb-4 text-2xl font-bold"><Shield size={48} />{m.shrtn_outdated_headline()}</h1>

	<p>{m.shrtn_outdated_subline()}</p>

	<a href={link} target="_blank" rel="noopener noreferrer">
		{link}
	</a>
</main>
