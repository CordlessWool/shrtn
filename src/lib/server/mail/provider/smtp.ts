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
	assert(env.MAIL_USER, 'MAIL_USER is not set');
	assert(env.MAIL_PASSWORD, 'MAIL_PASSWORD is not set');
	const transporter = nodemailer.createTransport({
		host: env.MAIL_HOST,
		port: env.MAIL_PORT,
		secure: env.MAIL_SECURE ? Boolean(env.MAIL_SECURE) : true,
		auth: {
			user: env.MAIL_USER,
			pass: env.MAIL_PASSWORD
		}
	});
	return {
		mail: mail(transporter)
	};
};
