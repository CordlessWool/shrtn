import type { Page } from '@playwright/test';
import 'dotenv/config';

export type TestFunction = (args: { page: Page }) => Promise<void>;

export const combine =
	(...fus: Array<TestFunction>): TestFunction =>
	async ({ page }) => {
		for (const fu of fus) {
			await fu({ page });
		}
	};
