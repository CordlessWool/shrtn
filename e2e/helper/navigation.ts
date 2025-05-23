import type { TestFunction } from './general';

export const goto =
	(path: string): TestFunction =>
	async ({ page }) => {
		await page.goto(path);
	};
