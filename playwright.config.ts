import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	reporter: [[process.env.CI ? 'dot' : 'list'], ['html', { outputFolder: 'test-results' }]],
	use: {
		headless: false,
		screenshot: 'only-on-failure',
		video: 'on-first-retry',
		trace: 'retain-on-failure'
	},
	retries: 2,
	projects: [
		{
			name: 'local',
			use: {
				...devices['Desktop Chrome'],
				baseURL: 'http://localhost:4173',
				permissions: ['clipboard-read', 'clipboard-write'],
				locale: 'en'
			}
		}
	],

	testDir: 'e2e'
});
