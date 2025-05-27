import { env } from '$env/dynamic/private';
import assert from 'node:assert';

assert(env.ORIGIN, 'Please set env ORIGIN to your domain');

export const ORIGIN = env.ORIGIN;
