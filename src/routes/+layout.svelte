<script lang="ts">
	import '../app.css';
	import Footer from '$lib/comp/Footer.svelte';
	let { children } = $props();
</script>

{@render children()}

<Footer />
