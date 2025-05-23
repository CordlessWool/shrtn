import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	projects: [
		{
			name: 'local',
			use: {
				...devices['Desktop Chrome'],
				baseURL: 'http://localhost:4173'
			}
		}
	],

	testDir: 'e2e'
});
