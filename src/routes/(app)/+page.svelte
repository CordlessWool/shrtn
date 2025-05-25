<script lang="ts">
	import LinkTile from '$lib/comp/LinkTile.svelte';
	import { type Link } from '$lib/definitions.js';
	import { Link as LinkIcon, Key, MousePointerClick, ClockFading, Lock } from 'lucide-svelte';
	import type { PageData } from './$types.js';
	import { couldTLLInfinit, getLinkSchema, getTTLs } from '$lib/helper/form.js';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms';
	import { SHORTEN_LENGTH } from '$lib/helper/defaults.js';
	import { nanoid } from 'nanoid';
	import * as m from '$lib/paraglide/messages.js';
	import { Input, Button, InputFrame, Select, OptionalInputFrame } from '$lib/comp/form';
	const isLoggedIn = (user: PageData['user'] | null | undefined): boolean => {
		return user != null && !user.temp;
	};
	const { data }: { data: PageData } = $props();
	let links = $state(data.links);
	const ttls = getTTLs(isLoggedIn(data.user)).reverse();
	const ttlsWithoutForever = ttls.filter(([num]) => num !== Infinity);
	const schema = getLinkSchema(isLoggedIn(data.user));
	const { form, errors, enhance, validate, submitting, message } = superForm(data.form, {
		validators: valibotClient(schema),
		resetForm: true,
		onResult: async ({ result }) => {
			$form.short = nanoid(SHORTEN_LENGTH);
			if (result.type === 'redirect') {
				const data = await loadLink(result.location);
				addLink(data);
			}
		},
		onError: () => {
			$form.short = nanoid(SHORTEN_LENGTH);
		}
	});

	const addLink = (link: Link) => {
		links.push({
			...link,
			expiresAt: link.expiresAt ? new Date(link.expiresAt) : null
		});
	};

	const loadLink = async (url: string) => {
		const response = await fetch(url);
		return (await response.json()) as Link;
	};

	const removeLink = (key: string) => {
		links = links.filter((l) => l.key !== key);
	};

	const setTtlToYear = () => {
		if ($form.ttl === Infinity) {
			$form.ttl = ttlsWithoutForever[0][0];
		}
	};

	const setTtlToInfinity = () => {
		if ($form.ttl === Infinity) {
			$form.ttl = Infinity;
		}
	};
</script>

<main>
	<h1>shrtn</h1>
	<p>{m.teaser()} - <b>{m.teaser_sub()}</b>.</p>

	<section class="links">
		<form method="POST" use:enhance action="?/add">
			<InputFrame large info={m.link_input_description()} error={$errors.link?.[0] || $message}>
				<Input
					name="link"
					placeholder={m.link_input_placeholder()}
					autocomplete="off"
					bind:value={$form.link}
				/>

				<Button type="submit" title={m.create_link()}>
					<LinkIcon size={16} class={$submitting ? 'animate-spin' : ''} />
				</Button>
			</InputFrame>
			<ul class="optional-definitions">
				<li>
					<OptionalInputFrame
						for="ttl-input"
						required={!couldTLLInfinit(isLoggedIn(data.user))}
						onselect={setTtlToYear}
						onremove={setTtlToInfinity}
					>
						{#snippet label()}
							{m.ttl()}<ClockFading />
						{/snippet}
						<Select id="ttl-input" name="ttl" bind:value={$form.ttl}>
							{#each ttlsWithoutForever as [time, text] (time)}
								<option value={time}>{m[text]()}</option>
							{/each}
						</Select>
					</OptionalInputFrame>
				</li>
				<li>
					<OptionalInputFrame
						onremove={() => ($form.callLimit = undefined)}
						for="call-limit-input"
						error={$errors.callLimit?.[0]}
					>
						{#snippet label()}
							{m.call_limit()}<MousePointerClick />
						{/snippet}
						<Input
							onkeyup={() => validate('callLimit')}
							id="call-limit-input"
							name="callLimit"
							type="number"
							placeholder="amount"
							bind:value={$form.callLimit}
							class="max-sx:!w-30"
						/>
					</OptionalInputFrame>
				</li>
				<li>
					<OptionalInputFrame
						onremove={() => ($form.passphrase = undefined)}
						for="link-passphrase-input"
					>
						{#snippet label()}
							{m.passphrase()}<Lock />
						{/snippet}

						<Input
							id="link-passphrase-input"
							name="passphrase"
							placeholder="****"
							bind:value={$form.passphrase}
							type="password"
						/>
					</OptionalInputFrame>
				</li>
			</ul>
		</form>
		{#if data}
			<hr />
			{#each links as link (link.key)}
				<LinkTile {...link} origin={data.origin} deletePath="?/remove" ondeleted={removeLink} />
			{/each}
		{/if}
	</section>
</main>

<style lang="postcss">
	@reference "tailwindcss/theme";

	:global body {
		@apply max-w-7xl;
	}

	main {
		@apply flex min-h-full flex-col items-center justify-center gap-3 p-3 md:p-7;
	}
	h1 {
		@apply text-5xl font-bold;
	}
	form,
	hr {
		@apply col-span-full;
	}

	hr {
		@apply mx-7 my-3 text-zinc-500;
	}

	.optional-definitions {
		@apply flex flex-row flex-wrap;
		@apply my-5 gap-x-5 gap-y-1;

		li {
			@apply flex flex-col;
		}
	}

	section.links {
		@apply grid gap-3 md:grid-cols-2 xl:grid-cols-3;
		@apply m-3 w-full md:m-7;
	}
</style>
