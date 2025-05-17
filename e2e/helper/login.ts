import { expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { type TestFunction, combine } from './general';
import { goto } from './navigation';
import assert from 'node:assert';

const handleMailpitResponseError = (res: Response) => {
	if (res.status >= 400) {
		const message = res.statusText;
		throw new Error(`Failed to get Messages from MAILPIT: ${message}`);
	}
};

const getMailpitUrl = (path: string) => new URL(path, process.env.MAILPIT_DOMAIN);

export const enterSignInAndSendMail =
	(mail: string = faker.internet.email()): TestFunction =>
	async ({ page }) => {
		const input = page.getByLabel('e-mail');
		await expect(input).toBeVisible();
		input.fill(mail);
		await page.locator('form button[type=submit]').click();
	};

export const findIdByMail = async (mail: string) => {
	const url = getMailpitUrl('/api/v1/search');
	url.searchParams.append('query', `to:"${mail}"`);
	const response = await fetch(url);

	handleMailpitResponseError(response);

	const data = await response.json();
	if (data.messages.length === 0) {
		console.info({ url });
		throw new Error(`Couldn't find a message with the mail: ${mail}`);
	}

	const {
		messages: [{ ID }]
	} = data;

	return ID;
};

export const deleteMailpitMail = async (...ids: string[]) => {
	const url = getMailpitUrl('/api/v1/messages');
	await fetch(url, {
		method: 'DELETE',
		body: JSON.stringify({ IDs: [...ids] })
	});
};

export const getVerificationCode = async (mail: string) => {
	const id = await findIdByMail(mail);
	const url = new URL(`/api/v1/message/${id}`, process.env.MAILPIT_DOMAIN);
	const response = await fetch(url, {
		headers: {
			accept: 'application/json'
		}
	});

	handleMailpitResponseError(response);
	const { HTML: html } = await response.json();
	const code = /<.*class="code"[^>]*>(\w*)<\/.*>/.exec(html);
	await deleteMailpitMail(id);

	assert(code, 'Could not find Code');

	return code[1];
};

export const enterVerificationCode =
	(mail: string): TestFunction =>
	async ({ page }) => {
		const input = page.locator('input[name="key"]');
		await expect(input).toBeVisible();
		const code = await getVerificationCode(mail);
		await input.fill(code);
		await page.getByTitle('verify').click();
	};

export const login = (mail: string = faker.internet.email()): TestFunction =>
	combine(goto('/login'), enterSignInAndSendMail(mail), enterVerificationCode(mail));

export const hasSignOut =
	(): TestFunction =>
	async ({ page }) => {
		await expect(page.getByTitle('Sign out')).toBeVisible();
	};
