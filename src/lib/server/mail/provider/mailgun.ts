import { env } from '$env/dynamic/private';
import assert from 'node:assert';
import type { MailData, MailProvider } from './types';

function objectToFormData(obj: Record<string, string>) {
	const formData = new FormData();

	Object.entries(obj).forEach(([key, value]) => {
		formData.append(key, value);
	});

	return formData;
}

const mail = (meta: { username: string; key: string; url: string; domain: string }) => {
	const url = new URL(`${meta.url}/v3/${meta.domain}/messages`, meta.url);
	return async (data: MailData) => {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				Authorization: `Basic ${Buffer.from(`${meta.username}:${meta.key}`).toString('base64')}`
			},
			body: objectToFormData(data)
		});
		if (response.status >= 400) {
			console.error(response.statusText);
			console.error(await response.text());
			throw new Error('Error on sending mail with Mailgun');
		}
	};
};

export const initMailgun = (): MailProvider => {
	assert(env.MAILGUN_API_KEY, 'MAILGUN_API_KEY is required');
	assert(env.MAILGUN_URL, 'MAILGUN_URL is required');
	assert(env.MAILGUN_DOMAIN, 'MAILGUN_DOMAIN is required');

	const client = {
		username: 'api',
		key: env.MAILGUN_API_KEY!,
		url: env.MAILGUN_URL,
		domain: env.MAILGUN_DOMAIN
	};

	return {
		mail: mail(client)
	};
};
