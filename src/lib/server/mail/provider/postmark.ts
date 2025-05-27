import { env } from '$env/dynamic/private';
import assert from 'node:assert';
import type { MailData, MailProvider } from './types';

const mail = (meta: { token: string; url: string; stream?: string }) => {
	const url = new URL(`/email`, meta.url);
	return async (data: MailData) => {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Postmark-Server-Token': meta.token
			},
			body: JSON.stringify({
				From: data.from,
				To: data.to,
				Subject: data.subject,
				HtmlBody: data.html,
				MessageStream: meta.stream
			})
		});
		if (response.status >= 400) {
			console.error(response.statusText);
			console.error(await response.text());
			throw new Error('Error on sending mail with Postmark');
		}
	};
};

export const initPostmark = (): MailProvider => {
	assert(env.POSTMARK_API_TOKEN, 'POSTMARK_API_TOKEN is required');

	const client = {
		token: env.POSTMARK_API_TOKEN,
		url: 'https://api.postmarkapp.com',
		stream: env.POSTMARK_STREAM
	};

	return {
		mail: mail(client)
	};
};
