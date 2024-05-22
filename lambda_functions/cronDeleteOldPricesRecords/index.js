const { Pool } = require("pg")

exports.handler = async (event) => {
    const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    })

    const query =
        'DELETE FROM public.prices_history WHERE "snapshotDate" < NOW() - INTERVAL \'7 days\'';
    try {
        const result = await pool.query(query)
        await pool.end()
        return {
            statusCode: 200,
            body: JSON.stringify("Old records deleted successfully"),
        }
    } catch (err) {
        console.error("Error during database query execution:", err)
        return {
            statusCode: 500,
            body: JSON.stringify("Error executing the query"),
        }
    }
}
