import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

async function resetDatabase() {
    const client = new Client({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    try {
        console.log('🔄 Conectando a la base de datos...');
        await client.connect();
        console.log('✅ Conectado!');

        console.log('🗑️  Eliminando tablas relacionadas con cars...');

        // Eliminar en orden para evitar problemas de foreign keys
        await client.query('DROP TABLE IF EXISTS "review_failure_tags_failure_tag" CASCADE');
        await client.query('DROP TABLE IF EXISTS "review_reactions" CASCADE');
        await client.query('DROP TABLE IF EXISTS "review_reports" CASCADE');
        await client.query('DROP TABLE IF EXISTS "reviews" CASCADE');
        await client.query('DROP TABLE IF EXISTS "photos" CASCADE');
        await client.query('DROP TABLE IF EXISTS "favorite_cars" CASCADE');
        await client.query('DROP TABLE IF EXISTS "cars" CASCADE');

        console.log('✅ Tablas eliminadas exitosamente!');
        console.log('');
        console.log('🔄 Ahora reinicia el servidor backend (Ctrl+C y luego npm run dev)');
        console.log('   TypeORM recreará automáticamente todas las tablas con el schema correcto.');

        await client.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        await client.end();
        process.exit(1);
    }
}

resetDatabase();
