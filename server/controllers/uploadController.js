const multer = require('multer');
const { upload, uploadImageBuffer, isCloudinaryConfigured, MAX_FILE_SIZE } = require('../services/uploadService');

const FIELD_NAME = 'image';

//Turns Multer errors into 400/413 responses instead of a generic 500
const MULTER_ERROR_MESSAGES = {
    LIMIT_FILE_SIZE: `Image is too large (max ${MAX_FILE_SIZE / (1024 * 1024)} MB)`,
    LIMIT_FILE_COUNT: 'Only one image can be uploaded at a time',
    LIMIT_UNEXPECTED_FILE: `Send the image in a form field named "${FIELD_NAME}"`,
    LIMIT_UNEXPECTED_FILE_TYPE: 'Only JPEG, PNG, WebP and GIF images are allowed',
};

const parseSingleImage = (req, res, next) => {
    upload.single(FIELD_NAME)(req, res, (err) => {
        if (!err) return next();
        if (err instanceof multer.MulterError) {
            const status = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
            return res.status(status).json({ message: MULTER_ERROR_MESSAGES[err.code] || 'Invalid upload' });
        }
        //e.g. a malformed multipart body
        res.status(400).json({ message: 'Invalid upload' });
    });
};

const uploadImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: `No image provided (use form field "${FIELD_NAME}")` });
    }
    if (!isCloudinaryConfigured()) {
        console.error('Upload failed: Cloudinary credentials are not set in .env');
        return res.status(503).json({ message: 'Image uploads are not configured on the server' });
    }

    try {
        //One folder per user keeps uploads organised in Cloudinary
        const result = await uploadImageBuffer(req.file.buffer, req.user.id);
        res.status(201).json({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes,
        });
    } catch (error) {
        //Cloudinary answers 400 when the file isn't really an image
        if (error.http_code === 400) {
            return res.status(400).json({ message: 'The file could not be processed as an image' });
        }
        console.error('Cloudinary upload failed:', error.message || error);
        res.status(502).json({ message: 'Image upload failed, please try again' });
    }
};

module.exports = { parseSingleImage, uploadImage };
