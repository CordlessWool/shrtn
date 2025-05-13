import Mailgun from 'mailgun.js';
import { Interfaces } from 'mailgun.js/definitions';
import { env } from '$env/dynamic/private';
import type { MailData } from './types';

const mail = (client: Interfaces.IMailgunClient) => {
	const domain = env.MAILGUN_DOMAIN;
	return async (data: MailData) => {
		const response = await client.messages.create(domain, data);
		if (response.status >= 400) {
			throw new Error('Error on sending mail with Mailgun');
		}
	};
};

export const initMailgun = () => {
	const mailgun = new Mailgun(FormData);
	const client = mailgun.client({
		username: 'api',
		key: env.MAILGUN_API_KEY!,
		url: env.MAILGUN_URL
	});
	return {
		mail: mail(client)
	};
};
