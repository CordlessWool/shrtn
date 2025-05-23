<script lang="ts">
	let { children, value = $bindable(), ...props } = $props();
</script>

<select bind:value {...props}>
	{@render children()}
</select>

<style lang="postcss">
	@reference "tailwindcss/theme";
	select {
		@apply border-0;
		@apply rounded-md bg-zinc-200;
		@apply cursor-pointer outline-none;
		@apply ring-0;
	}

	:global(.dark) select {
		@apply bg-zinc-700 text-gray-200;
	}
</style>
