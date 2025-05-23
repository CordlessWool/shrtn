import { expect, type Page } from '@playwright/test';
import 'dotenv/config';

export type TestFunction = (args: { page: Page }) => Promise<void>;

const mapStore = new Map();
export const store = <T = unknown>(key: string | symbol, value?: T) => {
	if (value) {
		mapStore.set(key, value);
	}
	return mapStore.get(key);
};

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const combine =
	(...fus: Array<TestFunction>): TestFunction =>
	async ({ page }) => {
		for (const fu of fus) {
			await fu({ page });
		}
	};

export const hasHeadline =
	(level: string = 'h1', content?: string): TestFunction =>
	async ({ page }) => {
		const headline = page.locator(level);
		await expect(headline).toBeVisible();
		if (content) {
			await expect(headline).toContainText(content);
		}
	};
