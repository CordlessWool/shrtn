import { env } from '$env/dynamic/private';
import type { MailData, MailProvider } from './types';

const mail = () => {
	const domain = env.MAILPIT_DOMAIN;
	const url = new URL('/api/v1/send', domain);
	console.log({ url });
	return async ({ html, from, to, subject }: MailData) => {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				accept: 'application/json',
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				from: {
					Email: from
				},
				to: [
					{
						Email: to
					}
				],
				html,
				subject
			})
		});
		if (response.status >= 400) {
			throw new Error(`Error on sending mail with Mailpit: ${await response.text()}`);
		}
	};
};

export const initMailpit = (): MailProvider => {
	return {
		mail: mail()
	};
};
