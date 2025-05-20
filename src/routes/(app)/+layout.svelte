<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import Header from '$lib/comp/Header.svelte';
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages';
	import { localizeHref } from '$lib/paraglide/runtime';

	const { children, data }: { children: Snippet; data: LayoutData } = $props();
</script>

<svelte:head>
	<title>{m.title()}</title>
	<meta name="description" content={m.meta_description()} />
	<meta name="keywords" content={m.meta_keywords()} />
</svelte:head>
<Header showName={page.url.pathname !== '/'}>
	{#if !data.user || data.user.temp}
		<a href={localizeHref('/login')}>{m.sign_in_link()}</a>
	{:else}
		<form method="POST" action="/login/?/logout">
			<button type="submit" title={m.sign_out()}>{m.sign_out()}</button>
		</form>
	{/if}
</Header>

{@render children()}
