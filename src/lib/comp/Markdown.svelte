<script>
	let { children } = $props();
</script>

<div class="markdown">
	{@render children()}
</div>

<style lang="postcss">
	@reference 'tailwindcss/theme';
	.markdown :global {
		@apply hyphens-auto;

		a,
		a.link {
			@apply text-teal-800 underline decoration-dotted underline-offset-4 transition-colors duration-200 dark:text-teal-300;
		}

		a:hover,
		a:focus,
		a:focus-visible,
		a.link:hover,
		a.link:focus {
			@apply text-teal-900 focus:no-underline dark:text-teal-200;
		}

		p {
			@apply mt-1 mb-3;
		}

		ul {
			@apply ml-7 list-disc;
		}

		ol {
			@apply ml-7 list-decimal;
		}
		li {
			@apply mt-1;
		}

		code {
			@apply rounded-md bg-zinc-50 px-2 py-1 dark:bg-zinc-900;
		}

		pre {
			@apply relative mb-5 overflow-auto rounded-md bg-zinc-50 px-7 py-5 dark:bg-zinc-900;
		}

		pre code {
			@apply bg-zinc-50 font-mono text-sm font-normal dark:bg-zinc-900;
			@apply block;
			/* @apply flex flex-col; */
		}

		/* pre code span {
			counter-increment: linenumber;
			position: relative;
		}

		pre code span::before {
			content: counter(linenumber);
			position: absolute;
			left: -2.5em;
			width: 2em;
			text-align: right;
			color: #6b7280;
		} */

		table {
			@apply mt-4 mb-4 w-full border-collapse;
		}

		th,
		td {
			@apply border border-zinc-300 p-2 dark:border-zinc-500;
		}

		img {
			@apply my-4 h-auto max-w-full;
		}

		hr {
			@apply my-11 border-t border-zinc-300 dark:border-zinc-500;
		}
	}
</style>
