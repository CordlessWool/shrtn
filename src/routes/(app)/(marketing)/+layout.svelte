<script lang="ts">
	import Markdown from '$lib/comp/Markdown.svelte';

	let { children } = $props();
</script>

<Markdown>
	{@render children()}
</Markdown>
