import { expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { type TestFunction, combine } from './general';

export const fillLinkIntoInput =
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

export const addLink = (link: string) => combine(fillLinkIntoInput(link), submitShortenerForm());

export const addLinkAndTest = (link: string = faker.internet.url()) =>
	combine(addLink(link), ({ page }) =>
		expect(page.locator(`section a[href="${link}"]`)).toBeVisible()
	);
