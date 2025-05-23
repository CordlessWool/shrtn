import { expect, test } from '@playwright/test';
import { addLinkAndTest } from './helper/shortener';
import { goto } from './helper/navigation';
import { combine } from './helper/general';

test('home page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('h1')).toBeVisible();
});

test('enter a invalid URL', combine(goto('/'), addLinkAndTest()));
