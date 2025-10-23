<script lang="ts">
	import { ShieldAlert } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages';

	const { link } = $props();
</script>

<main class="flex flex-col items-center justify-center">
	<ShieldAlert size={48} />
	<h1 class="mb-4 text-2xl font-bold">{m.shrtn_unsecure_headline()}</h1>

	<p class="mb-17 text-center">{m.shrtn_unsecure_subline()}</p>

	<div class="text-xl">
		{m.Original_link()}:
		<a href={link} target="_blank" rel="noopener noreferrer">
			{link}
		</a>
	</div>
</main>
