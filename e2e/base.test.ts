import { expect, test } from '@playwright/test';
import {
	addLinkAndTest,
	copyLink,
	enterLink,
	enterPassword,
	submitShortenerForm
} from './helper/shortener';
import { goto, gotoClipboardContent, pageIs } from './helper/navigation';
import { combine } from './helper/general';
import { faker } from '@faker-js/faker';
import { validateErrorMessageOn } from './helper/form';
import { sendPassphraseForm, enterPassphrase } from './helper/passphrase';

test('home page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('h1')).toBeVisible();
});

test('enter a invalid URL', combine(goto('/'), addLinkAndTest()));

const RANDOM_PASSWORD = faker.internet.password();
const RANDOM_URL = 'https://shrtn.io'; // random URL failed of error page
test(
	'set password and check if it validate',
	combine(
		goto('/'),
		enterPassword(RANDOM_PASSWORD),
		enterLink(RANDOM_URL),
		submitShortenerForm(),
		copyLink(),
		gotoClipboardContent(),
		enterPassphrase('some random value'),
		sendPassphraseForm(),
		validateErrorMessageOn('passphrase', 'Invalid secret'),
		enterPassphrase(RANDOM_PASSWORD),
		sendPassphraseForm(),
		pageIs(RANDOM_URL)
	)
);
