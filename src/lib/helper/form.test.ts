import { expect, describe, test } from 'vitest';
import { ttlFromStep } from './form';
import { HOUR_IN_MS, DAY_IN_MS, YEAR_IN_MS, TTL_STEPS } from './defaults';

describe('ttlFromStep', () => {
	test.each([
		[TTL_STEPS.HOUR, HOUR_IN_MS],
		[TTL_STEPS.DAY, DAY_IN_MS],
		[TTL_STEPS.YEAR, YEAR_IN_MS]
	])('step %d returns %d ms', (step, ms) => {
		expect(ttlFromStep(step)).toBe(ms);
	});

	test('undefined step (EVER) returns undefined', () => {
		expect(ttlFromStep(undefined)).toBeUndefined();
	});
});
