<script lang="ts">
	import { Input, InputFrame, Button } from '$lib/comp/form';
	import { LogIn, Mail } from 'lucide-svelte';
	import type { PageData } from './$types';
	import { superForm } from 'sveltekit-superforms/client';
	import { valibotClient } from 'sveltekit-superforms/adapters';
	import { LoginMailSchema } from '$lib/helper/form';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import ThemeHiddenInput from '$lib/comp/ThemeHiddenInput.svelte';
	import * as m from '$lib/paraglide/messages';

	const { data }: { data: PageData } = $props();

	onMount(() => {
		if (data.user && !data.user.temp) {
			goto('/');
		}
	});

	const { form, errors, enhance, message } = superForm(data.form, {
		applyAction: true,
		validators: valibotClient(LoginMailSchema)
	});
</script>

<main>
	<section>
		<h1>{m.sign_in()}</h1>
		<form method="POST" use:enhance action="?/mail" class="inputs">
			<InputFrame
				for="mail"
				label={m.email()}
				info={m.email_info()}
				error={$errors.email?.[0] || $message}
			>
				<Mail />
				<Input id="mail" name="email" bind:value={$form.email} />
				<Button type="submit" title={m.send_verification()}>
					<LogIn size={16} />
				</Button>
			</InputFrame>
			<ThemeHiddenInput />
		</form>
	</section>
</main>

<style lang="postcss">
	@reference "tailwindcss/theme";
	main {
		@apply flex flex-col items-center justify-center gap-3 p-3 md:p-7;
	}

	h1 {
		@apply mb-7 text-3xl font-bold;
	}

	.inputs {
		@apply rounded-md border-2 border-zinc-300;
		@apply p-3;
	}

	:global(.dark) {
		.inputs {
			@apply border-zinc-700;
		}
	}
</style>
