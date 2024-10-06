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

//fetch first 8 suggested images
app.get('/topSuggestedImages', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "suggestedImages" ORDER BY id LIMIT 7');
        console.log(result.rows);

        return res.status(200).json(result.rows);
    } catch (error) {
        console.log("Error while fetching top suggested image", error);
        return res.status(500).send('Server error');

    }
})
