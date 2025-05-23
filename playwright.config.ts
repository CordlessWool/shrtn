import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	reporter: process.env.CI ? 'dot' : 'list',
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
