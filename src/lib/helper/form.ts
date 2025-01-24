import {
	DAY_IN_MS,
	HOUR_IN_MS,
	MAX_TTL_TEMP,
	MAX_TTL_USER,
	MONTH_IN_MS,
	TTL_STEPS,
	WEEK_IN_MS,
	YEAR_IN_MS,
	SHORTEN_LENGTH
} from '$lib/helper/defaults';
import { nanoid } from 'nanoid';

import * as v from 'valibot';

export const getString = (
	value: string | FormDataEntryValue | null,
	defaultValue?: string | (() => string)
) => {
	if (value != null) {
		const string = String(value);
		return string;
	} else if (defaultValue != null) {
		if (typeof defaultValue === 'string') {
			return defaultValue;
		}
		return defaultValue();
	}

	throw new Error('Value is required');
};

const TTLs = [
	[HOUR_IN_MS, 'a hour'],
	[DAY_IN_MS, 'a day'],
	[WEEK_IN_MS, 'a week'],
	[MONTH_IN_MS, 'a month'],
	[YEAR_IN_MS, 'a year'],
	[Infinity, 'never']
] as const;

export const ttlFromStep = (step: TTL_STEPS): number => {
	return TTLs[step][0];
};

const ttlMapFromStep = (step: TTL_STEPS): [number, string][] => {
	return TTLs.slice(0, step + 1) as [number, string][];
};
const getTTLTempUser = (): [number, string][] => ttlMapFromStep(MAX_TTL_TEMP);
const getTTLUser = (): [number, string][] => ttlMapFromStep(MAX_TTL_USER);

export const getTTLs = (loggedin: boolean) => (loggedin ? getTTLUser() : getTTLTempUser());

export const LinkSchemaSignedUp = v.object({
	link: v.pipe(v.string(), v.minLength(2)),
	ttl: v.pipe(v.optional(v.number(), HOUR_IN_MS), v.maxValue(ttlFromStep(MAX_TTL_USER))),
	short: v.pipe(
		v.optional(v.string(), () => nanoid(SHORTEN_LENGTH)),
		v.minLength(SHORTEN_LENGTH)
	)
});

export const LinkSchemaTemp = v.object({
	link: v.pipe(
		v.string(),
		v.minLength(2),
		v.trim(),
		v.transform((url) => (url.match(/^[A-Za-z]+:\/\//) ? url : `https://${url}`)),
		v.url()
	),
	ttl: v.pipe(v.optional(v.number(), HOUR_IN_MS), v.maxValue(ttlFromStep(MAX_TTL_TEMP))),
	short: v.pipe(
		v.fallback(v.pipe(v.string(), v.trim(), v.minLength(1)), () => nanoid(SHORTEN_LENGTH))
	)
});

export const getLinkSchema = (loggedin: boolean) =>
	loggedin ? LinkSchemaSignedUp : LinkSchemaTemp;

export const LoginMailSchema = v.object({
	email: v.pipe(v.string(), v.trim(), v.email())
});
