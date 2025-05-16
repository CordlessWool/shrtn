import { defineConfig } from 'drizzle-kit';

const getDataForLibSQLDatabase = () => {
	if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL or DATABASE_ID is not set');
	return { dbCredentials: { url: process.env.DATABASE_URL } };
};

const getDataForD1Database = () => {
	return {
		dialect: 'sqlite',
		driver: 'd1-http',
		out: 'drizzle',
		migrationsTable: '__drizzle_migrations',
		dbCredentials: {
			accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
			databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
			token: process.env.CLOUDFLARE_D1_TOKEN!
		}
	};
};

const defineDatabase = () => {
	const type = process.env.DATABASE_TYPE?.toLowerCase();
	switch (type) {
		case 'libsql':
			return getDataForLibSQLDatabase();
		case 'd1':
			return getDataForD1Database();
		default:
			throw new Error('Invalid DATABASE_TYPE');
	}
};

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',

	...defineDatabase(),

	verbose: true,
	strict: true,
	dialect: 'sqlite'
});
