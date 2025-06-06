import { expect } from '@playwright/test';
import { type TestFunction, combine } from './general';

export const enterLink =
	(link: string): TestFunction =>
	async ({ page }) => {
		const input = page.getByPlaceholder('https://example.com');
		await expect(input).toBeVisible();
		await input.fill(link);
	};

export const submitShortenerForm =
	(): TestFunction =>
	async ({ page }) => {
		await page.getByTitle('Create link').click();
	};

export const addLink = (link: string) => combine(enterLink(link), submitShortenerForm());

export const addLinkAndTest = (link: string = 'https://google.com') =>
	combine(addLink(link), ({ page }) =>
		expect(page.locator(`section a[href="${link}"]`)).toBeVisible()
	);

export const enterPassword =
	(pw: string): TestFunction =>
	async ({ page }) => {
		await page.getByText('Password').click();
		await page.getByLabel('Password').fill(pw);
	};

export const enterCallLimit =
	(amount: number): TestFunction =>
	async ({ page }) => {
		await page.getByText('Call Limit').click();
		await page.getByLabel('Call Limit').fill(amount.toString());
	};

export const copyLink =
	(): TestFunction =>
	async ({ page }) => {
		await page.getByTitle('Copy link').click();
	};
