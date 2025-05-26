import { env } from '$env/dynamic/public';

const INSTANCE_MODE = env.PUBLIC_INSTANCE_MODE?.toUpperCase();

export const isOn = (env: string | undefined): boolean => env?.toLowerCase() === 'on';
export const privateInstance = INSTANCE_MODE === 'PRIVATE';
export const publicOnlyInstance = INSTANCE_MODE === 'PUBLIC_ONLY';
