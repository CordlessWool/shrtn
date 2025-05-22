import { type TestFunction } from './general';

export const enterPassphrase =
	(pw: string): TestFunction =>
	async ({ page }) => {
		await page.getByPlaceholder('Secret').fill(pw);
	};

export const sendPassphraseForm =
	(): TestFunction =>
	async ({ page }) => {
		await page.getByTitle('Redirect to Website').click();
	};
