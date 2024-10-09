const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const cors = require('cors');
const passport = require('passport');

const pool = require('./db');
const { JWT_SECRET } = require('./utils/constants');
const { uploadToS3, s3 } = require('./aws');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// multer 
const upload = multer({ dest: 'uploads/' });


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
        return res.status(200).json(result.rows);
    } catch (error) {
        console.log("Error while fetching top suggested image", error);
        return res.status(500).send('Server error');

    }
})

// Login Route 
app.post('/login', [
    body('email').isEmail().withMessage("Please enter a valid email"),
    body('password').exists().withMessage("Name is required")
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        try {
            const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
            if (result.rowCount === 0) {
                return res.status(400).json({ message: "Invalid Email Id" });
            }

            const user = result.rows[0];

            // Check if password matches 
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ msg: 'Check your creds' });
            }

            // Generate JWT token 
            const token = jwt.sign({
                id: user.id,
                email: user.email,
                role: user.role
            },
                JWT_SECRET,
                { expiresIn: '1h' }
            );

            // send response to client
            res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role
                }
            });

        } catch (err) {
            console.log(err);
            res.status(500).send("Server Error");
        }
    });

// generate pre-signed URL
app.get('/generate-presigned-url', (req, res) => {
    const { fileName, fileType } = req.query;

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Expires: 60,                         // URL expiry time in seconds (e.g., 1 minute)
        ContentType: fileType,
        ACL: 'public-read',                  // Optional: public or private access
    };

    s3.getSignedUrl('putObject', params, (err, url) => {
        if (err) {
            console.error('Error generating pre-signed URL', err);
            return res.status(500).send('Error generating pre-signed URL');
        }

        res.json({ url }); // Send the URL to the frontend
    })
})