<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import Header from '$lib/comp/Header.svelte';
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages';
	import { AnchorButton } from '$lib/comp/navigating';
	import { Button } from '$lib/comp/form';
	import { Key, LogOut } from 'lucide-svelte';

	const { children, data }: { children: Snippet; data: LayoutData } = $props();
</script>

<svelte:head>
	<title>{m.title()}</title>
	<meta name="description" content={m.meta_description()} />
	<meta name="keywords" content={m.meta_keywords()} />
</svelte:head>
<Header showName={page.url.pathname !== '/'}>
	{#if !data.user || data.user.temp}
		<AnchorButton href="/login" title={m.sign_in_link()}>
			<Key />
			<span class="max-sm:hidden">{m.sign_in_link()}</span>
		</AnchorButton>
	{:else}
		<form method="POST" action="/login/?/logout">
			<Button danger outline type="submit" title={m.sign_out()}>
				<LogOut />
				<span class="max-sm:hidden">{m.sign_out()}</span></Button
			>
		</form>
	{/if}
</Header>

{@render children()}
