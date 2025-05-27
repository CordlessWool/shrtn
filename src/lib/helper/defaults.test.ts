import { expect, describe, test } from 'vitest';
import { TTL_STEPS, toTTLSTEP } from './defaults';

describe('toTTLSteps', () => {
	test('default value', () => {
		const STEP = undefined;
		expect(toTTLSTEP(STEP, TTL_STEPS.WEEK)).toBe(TTL_STEPS.WEEK);
	});

	test('empty string to be undefined', () => {
		const STEP = '';
		expect(toTTLSTEP(STEP, TTL_STEPS.YEAR)).toBeUndefined();
	});

	test('undefined default value, returns undefined if value is undefined', () => {
		const STEP = undefined;
		expect(toTTLSTEP(STEP)).toBeUndefined();
	});

	test.each([
		['HOUR', TTL_STEPS.HOUR],
		['WEEK', TTL_STEPS.WEEK],
		['MONTH', TTL_STEPS.MONTH],
		['YEAR', TTL_STEPS.YEAR]
	])('Return on valid value %s | %d', (text, step) => {
		expect(toTTLSTEP(text)).toBe(step);
	});

	test('Invalid value throws error', () => {
		expect(() => toTTLSTEP('INVALID')).toThrow();
	});
});
