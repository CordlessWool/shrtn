<script lang="ts">
	import Header from '$lib/comp/Header.svelte';
	let { children } = $props();
	import * as m from '$lib/paraglide/messages';
</script>

<svelte:head>
	<title>{m.title()}</title>
	<meta name="description" content={m.meta_description()} />
	<meta name="keywords" content={m.meta_keywords()} />
</svelte:head>
<Header></Header>

{@render children()}
