import { drizzle as drizzleLibSQL, type LibSQLDatabase } from 'drizzle-orm/libsql';
import { building } from '$app/environment';
import { env } from '$env/dynamic/private';
import { drizzle as drizzleD1, type DrizzleD1Database } from 'drizzle-orm/d1';
export * as schema from './schema';

const getDatabaseURL = () => {
	if (building) {
		return ':memory:';
	}
	if (!env.DATABASE_URL) {
		throw new Error('DATABASE_URL is not set');
	}
	return env.DATABASE_URL;
};

let db: LibSQLDatabase | DrizzleD1Database;

const createDatabase = () => {
	const type = env.DATABASE_TYPE?.toLowerCase() ?? 'libsql';
	if (type === 'd1') {
		return drizzleD1(env.SHRTN_D1);
	} else {
		return drizzleLibSQL({
			connection: {
				url: getDatabaseURL(),
				authToken: env.DATABASE_AUTH_TOKEN
			}
		});
	}
};

export const getDB = () => {
	if (!db) {
		db = createDatabase();
	}
	return db;
};
