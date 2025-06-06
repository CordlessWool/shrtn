import mustache from 'mustache';
import juice from 'juice';
import { THEME } from '$lib/helper/defaults';
import VERIFICATION_TEMPLATE from './templates/verification.html?raw';
import * as m from '$lib/paraglide/messages';
import { initMailgun } from './provider/mailgun';
import { initPostmark } from './provider/postmark';
import { env } from '$env/dynamic/private';
import type { MailProvider } from './provider/types';
import { initMailpit } from './provider/mailpit';
import { initSMTP } from './provider/smtp';
import assert from 'node:assert';

const getProvider = (): MailProvider => {
	switch (env.MAIL_PROVIDER?.toUpperCase()) {
		case 'MAILGUN':
			return initMailgun();
		case 'SMTP':
			return initSMTP();
		case 'POSTMARK':
			return initPostmark();
		default:
		case 'MAILPIT':
			return initMailpit();
	}
};

const provider = getProvider();

const defaultFrom = env.MAIL_FROM ?? `noreply@example.com`;

export const sendVerificationMail = async (to: string, key: string, theme: THEME = THEME.DARK) => {
	const html = mustache.render(VERIFICATION_TEMPLATE, {
		bg: theme === THEME.DARK ? '#27272a' : '#f4f4f5',
		color: theme === THEME.DARK ? '#e4e4e7' : '#27272a',
		accent: theme === THEME.DARK ? '#115e59' : '#2dd4bf',
		headline: m.verification_mail_headline(),
		body: m.verification_mail_body(),
		key
	});
	const htmlWithInlineStyles = juice(html);
	assert(defaultFrom, 'Env MAIL_FROM is required!');
	await provider.mail({
		from: defaultFrom,
		to,
		subject: m.verification(),
		html: htmlWithInlineStyles
	});
};
