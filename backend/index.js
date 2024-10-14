const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const cors = require("cors");
const cookie = require("cookie-parser");

const passport = require("passport");

const pool = require("./db");
const { JWT_SECRET, saltRounds } = require("./utils/constants");
const { uploadToS3, s3 } = require("./aws");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true, // Allow credentials (cookies)
    })
);
app.use(express.json());
app.use(cookie()); //Middleware to parse cookies.

// multer
const upload = multer({ dest: "uploads/" });

app.listen(PORT, () => {
    console.log("server is running on 3000");
});

//fetch first 7 suggested images
app.get("/topSuggestedImages", async (req, res) => {
    // Offset is a concept used in pagination to specify where to start retrieving data from a database.
    // It works in conjunction with the limit, which defines how many records to retrieve.
    // Together, they allow you to fetch subsets of data, often used in "Load More" or "Next Page" functionality.
    const limit = parseInt(req.query.limit) || 6;
    const offset = parseInt(req.query.offset) || 0;
    try {
        const result = await pool.query(
            'SELECT * FROM "suggestedImages" ORDER BY id LIMIT $1 OFFSET $2',
            [limit, offset]
        );

        const total = parseInt(result.rowCount);

        const hasMore = offset + limit < total;

        return res.status(200).json({ images: result.rows, total, hasMore });
    } catch (error) {
        console.log("Error while fetching top suggested image", error);
        return res.status(500).send("Server error");
    }
});

// Login Route
app.post(
    "/login",
    [
        body("email").isEmail().withMessage("Please enter a valid email"),
        body("password").exists().withMessage("Password is required"),
    ],
    async (req, res) => {
        const errors = validationResult(req.body);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        try {
            const result = await pool.query("SELECT * FROM users WHERE email = $1", [
                email,
            ]);
            if (result.rowCount === 0) {
                return res.status(400).json({ message: "Invalid Email Id" });
            }

            const user = result.rows[0];

            // Check if password matches
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ msg: "Check your creds" });
            }

            // Generate JWT token
            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                },
                JWT_SECRET,
                { expiresIn: "1h" }
            );

            // Set the token as HttpOnly cookie
            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
            });

            return res.status(200).json({
                user: {
                    email: user.email,
                    role: user.role,
                },
            });
        } catch (err) {
            console.log(err);
            res.status(500).send("Server Error");
        }
    }
);

app.post("/logout", (req, res) => {
    res.clearCookie("token"); // Clear the cookie on logout
    return res.status(200).json({ message: "Logged out successfully" });
});

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) return res.sendStatus(401); // No token, unauthorized

    jwt.verify(token, "your-secret-key", (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// protected route
app.get("/dashboard", authenticateToken, (req, res) => {
    res.json({ message: "Welcome to the dashboard!", user: req.user });
});

// generate pre-signed URL
app.get("/generate-presigned-url", (req, res) => {
    const { fileName, fileType } = req.query;

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Expires: 180, // URL expiry time in seconds 
        ContentType: fileType,
        ACL: "public-read", // Optional: public or private access
    };

    s3.getSignedUrl("putObject", params, (err, url) => {
        if (err) {
            console.error("Error generating pre-signed URL", err);
            return res.status(500).send("Error generating pre-signed URL");
        }

        res.json({ url }); // Send the URL to the frontend
    });
});

app.post("/upload-image", async (req, res) => {
    const { imgName, tag, imgLink } = req.body;

    const query = `INSERT INTO "suggestedImages" ("imgName", "tag", "imgLink") VALUES ($1, $2, $3) RETURNING *`;
    const values = [imgName, tag, imgLink];
    try {
        const result = await pool.query(query, values);

        res
            .status(200)
            .json({ message: "Image saved successfully", data: result.rows[0] });
    } catch (err) {
        console.log(err, "Error while uploading s3 link in db");
        res.status(500).send("Error Error while uploading s3 link in db");
    }
});

// delete a particular image
app.delete("/delete-image/:id", async (req, res) => {
    console.log(req.params);

    const id = req.params.id;
    const img = req.body.img;

    console.log(id, img);

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: img,
    };

    try {
        await s3.deleteObject(params).promise()
        const query = `DELETE FROM "suggestedImages" WHERE id = $1 RETURNING *`;
        const values = [id];

        const res = await pool.query(query, values);
        console.log(res.rows);

        // if (res.rowCount > 0) {
        //     console.log("Image record deleted from the database");
        //     return res.send(200).message({ message: "Image deleted", image: res.rows[0] });
        // } else {
        //     console.log("No image found with the given ID");
        //     return null;
        // }

    } catch (error) {
        console.error("Error deleting the file from S3", error);
        throw new Error("Failed to delete the file from S3");
    }


})


app.get("/get-images", async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM "suggestedImages"');
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching images:", error);
        res.status(500).json({ error: "Error fetching images from database" });
    }
});

app.get("/get-all-admins", async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT "email","role" FROM "users" WHERE "role" = $1',
            ["admin"]
        );
        res.json(result.rows);
    } catch (err) {
        console.log("Error fetching all admins", err);
        res.status(500).json({ error: "Error fetching admins from DB" });
    }
});

app.post("/create-new-admin", async (req, res) => {
    const { name, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query =
        'INSERT INTO "users" ("email","role", "password","name") VALUES ($1,$2,$3,$4) RETURNING *';
    const values = [email, role, hashedPassword, name];
    try {
        const result = await pool.query(query, values);
        res
            .status(200)
            .json({ message: "Admin created successfully", data: result.rows[0] });
    } catch (err) {
        console.log(err, "Error creating new admin");
    }
});
