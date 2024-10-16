const AWS = require('aws-sdk');
const fs = require('fs');

require('dotenv').config();

// configure AWS S3
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
})

// upload Images to S3 function 
const uploadToS3 = (file) => {
    const fileStream = fs.createReadStream(file.path);
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.originalname, // File name you want to save as in S3
        Body: fileStream,
        ContentType: file.mimetype,
    }

    return s3.upload(params).promise();
}


const deleteImageFromS3 = async (key) => {
    const params = {
        Bucket: "meme-generator-new",
        Key: key // The file key in S3 (e.g., "cat.jpeg")
    };

    try {
        await s3.deleteObject(params).promise();
        console.log(`File ${key} deleted successfully from S3`);
    } catch (err) {
        console.error("Error deleting the file from S3", err);
        throw new Error("Failed to delete the file from S3");
    }
};

module.exports = { uploadToS3, s3, deleteImageFromS3 };
