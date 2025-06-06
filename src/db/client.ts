import postgres from "postgres";
import EnvConfig from '../config';

export const sql = postgres({
	host: EnvConfig.get('DB_HOST'),
	port: Number(EnvConfig.get('DB_PORT')) || 5432,
	username: EnvConfig.get('DB_USER'),
	password: EnvConfig.get('DB_PASSWORD'),
	database: EnvConfig.get('DB_NAME'),
	ssl: EnvConfig.get('DB_SSL') ? "require" : undefined,
});

export async function pingDatabase() {
	try {
		await sql`SELECT 1`;
		console.log("Database Connection Status: Sucessfuly");
	} catch (error) {
		console.log('PING DATABASE ERROR!')
		throw error
		await sql.end();
		throw error;
	} finally {
		await sql.end();
	}
}