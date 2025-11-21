import { env } from '$env/dynamic/private';
import { version } from '../../../../package.json' with { type: 'json' };

export const googleSafeBrowsing = async (url: string): Promise<boolean> => {
	if (env.GOOGLE_SAFE_BROWSING_API_KEY === undefined) {
		console.warn('GOOGLE_SAFE_BROWSING_API_KEY is not defined');
		return true;
	}

	const googleSafeBrowsing = new URL('https://safebrowsing.googleapis.com/v4/threatMatches:find');
	googleSafeBrowsing.searchParams.append('key', env.GOOGLE_SAFE_BROWSING_API_KEY);

	const response = await fetch(googleSafeBrowsing, {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			client: {
				clientId: 'shrtn',
				clientVersion: version
			},
			threatInfo: {
				platformTypes: ['ANY_PLATFORM'],
				threatTypes: [
					'MALWARE',
					'SOCIAL_ENGINEERING',
					'UNWANTED_SOFTWARE',
					'POTENTIALLY_HARMFUL_APPLICATION'
				],
				threatEntryTypes: ['URL'],
				threatEntries: [{ url }]
			}
		})
	});
	if (!response.ok) {
		console.error('API Error:', response.status, await response.text());
		return false;
	}

	const result = await response.json();
	return typeof result === 'object' && (result.matches == null || result.matches?.length === 0);
};
