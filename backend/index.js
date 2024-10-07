const express = require('express');
const multer = require('multer');
const cors = require('cors');
const passport = require('passport');

const pool = require('./db');

const app = express();
const PORT = 3000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.listen(PORT, () => {
    console.log("server is running on 3000");
});

//fetch first 7 suggested images
app.get('/topSuggestedImages', async (req, res) => {
    // Offset is a concept used in pagination to specify where to start retrieving data from a database.
    // It works in conjunction with the limit, which defines how many records to retrieve.
    // Together, they allow you to fetch subsets of data, often used in "Load More" or "Next Page" functionality.
    const limit = parseInt(req.query.limit) || 6;
    const offset = parseInt(req.query.offset) || 0;
    try {
        const result = await pool.query('SELECT * FROM "suggestedImages" ORDER BY id LIMIT $1 OFFSET $2', [limit, offset]);
        console.log(result.rows);

        return res.status(200).json(result.rows);
    } catch (error) {
        console.log("Error while fetching top suggested image", error);
        return res.status(500).send('Server error');

    }
})
