<script lang="ts">
	import { superForm, type SuperValidated } from 'sveltekit-superforms/client';
	import { Button, Input, InputFrame } from '$lib/comp/form';
	import { Key, Shield } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages';
	import type { PassphraseSchemaOutput } from '$lib/helper/form';

	type Props = {
		form: SuperValidated<PassphraseSchemaOutput>;
	};
	const props: Props = $props();

	const { form, enhance, errors, submitting } = superForm(props.form);
</script>

<main class="flex flex-col items-center justify-center">
	<Shield size={72} />
	<h1 class="mb-4 text-2xl font-bold">{m.shrtn_passphrase_headline()}</h1>
	<p>{m.shrtn_passphrase_subline()}</p>

	<form class="flex flex-col items-center gap-3" action="?/passphrase" method="POST" use:enhance>
		<InputFrame info={m.shrtn_passphrase_info()} error={$errors.passphrase?.[0]}>
			<Input
				type="password"
				id="passphrase-input"
				name="passphrase"
				bind:value={$form.passphrase}
				placeholder="*****"
			/>
			<Button disabled={$submitting} class="text-lg" title={m.redirect_to()}><Key /></Button>
		</InputFrame>
	</form>
</main>

<style lang="postcss">
	/* Add your styles here */
	@reference 'tailwindcss/theme';
	h1 {
		@apply text-4xl font-bold;
		@apply mt-5;
	}

	p {
		@apply mb-11;
	}
</style>
