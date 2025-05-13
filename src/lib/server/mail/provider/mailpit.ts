import { env } from '$env/dynamic/private';
import type { MailData } from './types';

const mail = () => {
	const domain = env.MAILPIT_DOMAIN;
	return async (data: MailData) => {
		const response = await fetch();
		if (response.status >= 400) {
			throw new Error('Error on sending mail with Mailgun');
		}
	};
};

export const initMailgun = () => {
	return {
		mail: mail()
	};
};
