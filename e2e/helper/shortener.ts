import { expect, type Page } from '@playwright/test';
import { faker } from '@faker-js/faker';

type TestFunction = (args: { page: Page }) => Promise<void>;
export const combine =
	(...fus: Array<TestFunction>): TestFunction =>
	async ({ page }) => {
		for (const fu of fus) {
			await fu({ page });
		}
	};

export const goto =
	(path: string): TestFunction =>
	async ({ page }) => {
		await page.goto(path);
	};

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
