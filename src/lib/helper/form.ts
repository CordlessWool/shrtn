import {
	DAY_IN_MS,
	HOUR_IN_MS,
	MAX_TTL_TEMP,
	MAX_TTL_USER,
	MONTH_IN_MS,
	TTL_STEPS,
	WEEK_IN_MS,
	YEAR_IN_MS,
	SHORTEN_LENGTH,
	THEME
} from '$lib/helper/defaults';
import { nanoid } from 'nanoid';

import * as v from 'valibot';
import * as m from '$lib/paraglide/messages';
import { env } from '$env/dynamic/public';
import { isIPv4, isIPv4InRange, isIPv6, isPrivateIPv4, isPrivateIPv6 } from './link';

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
	[HOUR_IN_MS, 'anhour'],
	[DAY_IN_MS, 'aday'],
	[WEEK_IN_MS, 'aweek'],
	[MONTH_IN_MS, 'amonth'],
	[YEAR_IN_MS, 'ayear'],
	[Infinity, 'forever']
] as const;

export const emptyStringToNull = (str: string | undefined | null) =>
	str?.trim() === '' ? null : str;

export const ttlFromStep = (step: TTL_STEPS): number => {
	return TTLs[step][0];
};

const ttlMapFromStep = (step: TTL_STEPS) => {
	return TTLs.slice(0, step + 1) as [number, (typeof TTLs)[number][1]][];
};
const getTTLTempUser = () => ttlMapFromStep(MAX_TTL_TEMP);
const getTTLUser = () => ttlMapFromStep(MAX_TTL_USER);

export const getTTLs = (loggedin: boolean) => (loggedin ? getTTLUser() : getTTLTempUser());
export const couldTLLInfinit = (loggedin: boolean) =>
	(loggedin ? MAX_TTL_USER : MAX_TTL_TEMP) === TTL_STEPS.EVER;

const LinkValueSchema = v.pipe(
	v.string(),
	v.trim(),
	v.minLength(2, m.error_link_min_lenght),
	v.transform((url) => (url.match(/^[A-Za-z]+:\/\//) ? url : `https://${url}`)),
	v.url(m.error_invalid_url),
	v.custom<string>((value: unknown) => {
		if (env.PUBLIC_FEATURE_PRIVATE_LINKS !== 'on' && typeof value === 'string') {
			const { hostname } = new URL(value);
			if (isIPv4(hostname)) {
				return !isPrivateIPv4(hostname);
			} else if (isIPv6(hostname)) {
				return !isPrivateIPv6(hostname);
			}
		}
		return true;
	}, m.invalid_private_link)
);

const LinkSchemaBase = v.object({
	link: LinkValueSchema,
	passphrase: v.optional(v.pipe(v.string(), v.trim())),
	callLimit: v.optional(
		v.pipe(v.number(m.invalid_number), v.integer(), v.minValue(1, m.invalid_minVlaue))
	),
	short: v.pipe(
		v.fallback(v.pipe(v.string(), v.trim(), v.minLength(1)), () => nanoid(SHORTEN_LENGTH))
	)
});

export const LinkSchemaSignedUp = v.object({
	...LinkSchemaBase.entries,
	ttl: v.pipe(
		v.optional(v.number(), ttlFromStep(MAX_TTL_USER)),
		v.maxValue(ttlFromStep(MAX_TTL_USER))
	)
});

export const LinkSchemaTemp = v.object({
	...LinkSchemaBase.entries,
	ttl: v.pipe(
		v.optional(v.number(), ttlFromStep(MAX_TTL_TEMP)),
		v.maxValue(ttlFromStep(MAX_TTL_TEMP))
	)
});

export const getLinkSchema = (loggedin: boolean) =>
	loggedin ? LinkSchemaSignedUp : LinkSchemaTemp;

export const PassphraseSchema = v.object({
	passphrase: v.pipe(v.string(), v.trim(), v.minLength(1))
});

export type PassphraseSchemaOutput = v.InferOutput<typeof PassphraseSchema>;

export const LoginMailSchema = v.object({
	email: v.pipe(v.string(), v.trim(), v.email(m.error_invalid_email)),
	theme: v.optional(v.pipe(v.number(), v.enum(THEME)))
});

export const VerificationSchema = v.object({
	key: v.pipe(v.string(), v.trim(), v.minLength(1, m.error_empty_key), v.toLowerCase())
});

export const ThemeSchema = v.object({
	theme: v.optional(v.pipe(v.number(), v.enum(THEME)))
});
