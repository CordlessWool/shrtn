import { env } from '$env/dynamic/private';
import nodemailer from 'nodemailer';
import type { MailData, MailProvider } from './types';
import assert from 'node:assert';

const mail = (transporter: nodemailer.Transporter) => {
	return async (data: MailData) => {
		try {
			const info = await transporter.sendMail(data);
			if (info.rejected.length > 0) {
				throw new Error(` Message rejected: ${info.rejected.join(', ')}`);
			}
		} catch (error) {
			throw new Error(`Error on sending mail via SMTP: ${error}`);
		}
	};
};

export const initSMTP = (): MailProvider => {
	assert(env.MAIL_HOST, 'MAIL_HOST is not set');

	const hasAuth = env.MAIL_USER && env.MAIL_PASS;
	const isSecure = env.MAIL_SECURE ? Boolean(env.MAIL_SECURE) : hasAuth;

	const transporter = nodemailer.createTransport({
		host: env.MAIL_HOST,
		port: env.MAIL_PORT,
		secure: isSecure,
		auth: hasAuth
			? {
					user: env.MAIL_USER,
					pass: env.MAIL_PASS
				}
			: undefined
	});
	return {
		mail: mail(transporter)
	};
};
