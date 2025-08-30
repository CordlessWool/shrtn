<script lang="ts">
	import type { Link } from '$lib/definitions.js';
	import { onMount } from 'svelte';
	import { ClockFading, Copy, Trash2, Lock, QrCode, MousePointerClick } from 'lucide-svelte';
	import { Button } from '$lib/comp/form';
	import { enhance } from '$app/forms';
	import { slide } from 'svelte/transition';
	import * as m from '$lib/paraglide/messages.js';
	import QRCodeModel from '$lib/comp/QRModal.svelte';

	type Props = Link & {
		origin: string;
		deletePath: string;
		ondeleted: (key: string) => void;
	};

	const {
		url,
		key,
		origin,
		expiresAt,
		hasPassphrase,
		callLimit,
		calls,
		deletePath,
		ondeleted
	}: Props = $props();
	let showModal = $state(false);
	const shrtnUrl = new URL(key, origin);
	const { hostname } = new URL(url);
	const favicon = `https://icons.duckduckgo.com/ip3/${hostname}.ico`;

	const calcTimeLeft = (expiresAt: Date) => {
		const now = new Date();
		const diff = expiresAt.getTime() - now.getTime();
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));
		const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
		const seconds = Math.floor((diff % (1000 * 60)) / 1000);
		return { days, hours, minutes, seconds };
	};

	const getExpiresInText = (expiresAt: Date | null) => {
		if (!expiresAt) return m.expires_never();
		const { days, hours, minutes } = calcTimeLeft(expiresAt);
		if (days > 70) return m.expires_months({ number: Math.floor(days / 30) });
		if (days > 14) return m.expires_weeks({ number: Math.floor(days / 7) });
		if (days > 2) return m.expires_days({ number: days });
		if (hours > 2) return m.expires_hours({ number: days * 24 + hours });
		return m.expires_minutes({ number: hours * 60 + minutes });
	};

	let expiresText = $state(getExpiresInText(expiresAt));

	onMount(() => {
		if (expiresAt != null) {
			const interval = setInterval(() => {
				if (expiresAt.getTime() <= Date.now()) {
					clearInterval(interval);
					ondeleted(key);
					return;
				}

				expiresText = getExpiresInText(expiresAt);
			}, 11000);
			return () => clearInterval(interval);
		}
	});
</script>

{#if showModal}
	<QRCodeModel bind:show={showModal} name="shrtn_qr_{key}" value={shrtnUrl.href} />
{/if}

<section transition:slide>
	<a href={url} target="_blank" class="link">
		<img src={favicon} alt={`Icon of ${hostname}`} />
		<div class="shorted">
			{shrtnUrl.hostname}{shrtnUrl.pathname}
		</div>
		<p class="tourl">
			{url}
		</p>
	</a>

	<div class="options">
		{#if expiresAt}
			<div title={m.expires_in() + ' ' + expiresText}>
				<ClockFading />
				{expiresText}
			</div>
		{/if}
		{#if callLimit}
			<div title={m.clicks_left({ left: callLimit - (calls ?? 0), limit: callLimit })}>
				<MousePointerClick />
				{callLimit - (calls ?? 0)}
			</div>
		{/if}
		{#if hasPassphrase}
			<div title={m.protected_link()}>
				<Lock />
			</div>
		{/if}
	</div>

	<div class="actions">
		<Button
			onclick={() => navigator.clipboard.writeText(shrtnUrl.href)}
			transparent
			title={m.copy_link()}
		>
			<Copy />
		</Button>
		<Button
			onclick={() => (showModal = true)}
			download="shrtn_qr_{key}"
			transparent
			title={m.generate_qr_code()}
		>
			<QrCode />
		</Button>
		{#if deletePath}
			<form
				class="col-start-2"
				method="POST"
				action={deletePath}
				use:enhance={() => {
					return ({ result }) => {
						if (result.type === 'success') {
							ondeleted(key);
						}
					};
				}}
			>
				<Button type="submit" outline danger title={m.delete_link()}>
					<Trash2 />
				</Button>
				<input name="key" value={key} hidden />
			</form>
		{/if}
	</div>
</section>

<style lang="postcss">
	@reference "tailwindcss";
	section {
		@apply grid grid-flow-col grid-rows-3 items-center gap-x-3;
		@apply w-full rounded-md bg-zinc-200 p-3;
		grid-template-columns: 1fr auto;
	}

	:global(.dark) section {
		@apply bg-zinc-700;
	}

	.link {
		@apply grid grid-rows-2 gap-x-2;
		grid-template-columns: auto 1fr;
		@apply row-span-2;
		@apply relative overflow-hidden;
		img {
			@apply row-span-2 w-12 items-center justify-center p-1;
		}
		.shorted {
			@apply font-bold;
		}
		.tourl {
			@apply ml-1 overflow-hidden text-xs text-nowrap text-ellipsis;
		}
	}

	.expires {
		@apply text-xs;
		@apply self-end;
	}

	.actions {
		@apply grid grid-cols-2 gap-5;
		@apply row-span-3;
		@apply justify-self-end;
	}

	.options {
		@apply flex flex-row flex-wrap gap-5;
		@apply text-sm;

		div {
			@apply flex flex-row items-center gap-1;
		}

		:global svg {
			height: 1rem;
			width: 1rem;
		}
	}
</style>
