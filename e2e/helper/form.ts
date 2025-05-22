import { expect } from '@playwright/test';
import { type TestFunction } from './general';

export const validateErrorMessageOn =
	(inputName: string, value: string): TestFunction =>
	async ({ page }) => {
		const inputFrame = await page.locator(`.frame`, {
			has: page.locator(`input[name=${inputName}]`)
		});
		await expect(inputFrame.locator('small')).toHaveText(value);
	};
