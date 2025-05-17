import type { TestFunction } from './general';

export const goto =
	(path: string): TestFunction =>
	async ({ page }) => {
		console.log({ path });
		await page.goto(path);
	};
