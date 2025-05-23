import type { TestFunction } from './general';
import { expect } from '@playwright/test';

export const goto =
	(path: string): TestFunction =>
	async ({ page }) => {
		await page.goto(path);
	};

export const gotoClipboardContent =
	() =>
	async ({ page }) => {
		const link = await page.evaluate(() => navigator.clipboard.readText());
		await page.goto(link);
	};

export const pageIs =
	(url: string): TestFunction =>
	async ({ page }) => {
		await expect(page).toHaveURL(url);
	};
