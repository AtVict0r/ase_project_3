const { Pool } = require('pg');
const pool = new Pool({
    user: 'admin',
    host: 'Localhost',
    database: 'se_micro',
    password: 'database_admin',
    port: 5432,
})
pool.query('SELECT * FROM movies', (err, res) => {
    console.log(err, res);
    pool.end();
})