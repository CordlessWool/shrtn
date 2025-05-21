<script lang="ts">
	const { children, ...props } = $props();
</script>

<select {...props}>
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
