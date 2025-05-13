import { expect, test } from '@playwright/test';
import { hasSignOut, login } from './helper/login';
import { combine } from './helper/general';

test('home page has expected h1', async ({ page }) => {
	await page.goto('/login');
	await expect(page.locator('h1')).toBeVisible();
	expect(page.locator('h1')).toContainText('Sign in');
});

test('login', combine(login(), hasSignOut()));
