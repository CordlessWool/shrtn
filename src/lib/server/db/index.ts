import { drizzle, LibSQLDatabase } from 'drizzle-orm/libsql';
import { building } from '$app/environment';
import { env } from '$env/dynamic/private';
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

let db: LibSQLDatabase;

export const getDB = () => {
	if (!db) {
		db = drizzle({
			connection: {
				url: getDatabaseURL(),
				authToken: env.DATABASE_AUTH_TOKEN
			}
		});
	}
	return db;
};
