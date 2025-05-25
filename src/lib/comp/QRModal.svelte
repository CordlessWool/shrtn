<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { onMount } from 'svelte';
	import Modal from './Modal.svelte';
	import { Download, LoaderCircle, X } from 'lucide-svelte';
	import QRCode from 'qrcode';
	import { Button } from './form';
	import AnchorButton from './navigating/AnchorButton.svelte';

	type Props = {
		show: boolean;
		name?: string;
		value: string;
	};

	let { show = $bindable(true), name, value }: Props = $props();

	let canvasRef: HTMLCanvasElement | null = null;

	const getQRCode = async (url: string) => {
		const qrCode = await QRCode.toDataURL(url, { errorCorrectionLevel: 'H' });
		const [header, base64] = qrCode.split(',');
		if (!header) throw new Error('Invalid QR code');
		const mime = header.match(/data:(.*);base64/)?.[1];
		if (!mime) throw new Error('Invalid MIME type');
		// 2. Decode base64 to raw binary
		const binary = atob(base64);
		const len = binary.length;
		const buf = new Uint8Array(len);
		for (let i = 0; i < len; i++) {
			buf[i] = binary.charCodeAt(i);
		}

		const blob = new Blob([buf], { type: mime });
		const blobUrl = URL.createObjectURL(blob);
		const filename = `${name || 'qr-code'}.${mime.split('/')[1]}`;

		return [blobUrl, filename];
	};

	const close = () => {
		show = false;
	};

	onMount(() => {
		QRCode.toCanvas(canvasRef, value); // Initialize QR code generation here
	});
</script>

<Modal bind:show>
	<div class="modal-content">
		<canvas bind:this={canvasRef}></canvas>
		<div class="actions">
			{#await getQRCode(value)}
				<LoaderCircle class="animate-spin" />
			{:then [dataLink, filename]}
				<AnchorButton href={dataLink} download={filename} transparent title={m.download_qr_code()}>
					<Download />
				</AnchorButton>
			{/await}
			<Button onclick={close} transparent danger title={m.close()}>
				<X />
			</Button>
		</div>
	</div>
</Modal>

<style lang="postcss">
	@reference 'tailwindcss/theme';

	.modal-content {
		@apply flex flex-col items-center justify-center gap-3 p-5;
	}

	:global(.dark) {
		.modal-content {
			@apply bg-zinc-800;
		}
	}

	.actions {
		@apply flex justify-center gap-2;
	}
</style>
