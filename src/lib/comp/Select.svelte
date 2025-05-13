<script lang="ts">
	const { children, ...props } = $props();
</script>

<select {...props}>
	{@render children()}
</select>

<style lang="postcss">
	@reference "tailwindcss/theme";
	select {
		@apply border-0 py-3 px-1;
		@apply bg-zinc-200 rounded-md;
		@apply cursor-pointer outline-none;
		@apply ring-0;
	}

	:global(.dark) select {
		@apply bg-zinc-700 text-gray-200;
	}
</style>
