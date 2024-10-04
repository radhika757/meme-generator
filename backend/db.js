const { Pool } = require('pg');

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "meme-generator",
    password: 'password',
    port: 5432
})

pool.connect((err, client, release) => {
    if (err) {
        console.log('Error');
        return console.error('Error connecting to the database:', err.stack);
    }
    console.log('Connected to the DB');
    release();
})

module.exports = pool;