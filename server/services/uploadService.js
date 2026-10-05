const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
//SVG is left out on purpose: it can contain scripts
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const UPLOAD_FOLDER = process.env.CLOUDINARY_FOLDER || 'monopoly';

//Reads CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET.
//(If CLOUDINARY_URL is set instead, the SDK picks it up by itself.)
if (process.env.CLOUDINARY_CLOUD_NAME) {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
    });
}

const isCloudinaryConfigured = () => {
    const { cloud_name, api_key, api_secret } = cloudinary.config();
    return Boolean(cloud_name && api_key && api_secret);
};

//True only for an https image URL from our Cloudinary account, inside the
//given user's upload folder, so a game can't point at arbitrary external
//images or at another user's uploads
const isOwnUploadUrl = (url, userId) => {
    const { cloud_name } = cloudinary.config();
    if (!cloud_name || typeof url !== 'string' || url.length > 500) return false;
    let parsed;
    try {
        parsed = new URL(url);
    } catch {
        return false;
    }
    return parsed.protocol === 'https:'
        && parsed.hostname === 'res.cloudinary.com'
        && parsed.pathname.startsWith(`/${cloud_name}/image/upload/`)
        && parsed.pathname.includes(`/${UPLOAD_FOLDER}/${userId}/`)
        && !parsed.search && !parsed.hash;
};

//Multer keeps the file in memory; it is streamed to Cloudinary and never written to disk
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_FILE_SIZE, files: 1 },
    fileFilter: (req, file, cb) => {
        if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE_TYPE', file.fieldname));
        }
    },
});

//Uploads an image buffer to Cloudinary and resolves with Cloudinary's result
const uploadImageBuffer = (buffer, subfolder) => new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
        {
            folder: subfolder ? `${UPLOAD_FOLDER}/${subfolder}` : UPLOAD_FOLDER,
            resource_type: 'image',
        },
        (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(buffer);
});

module.exports = {
    upload,
    uploadImageBuffer,
    isCloudinaryConfigured,
    isOwnUploadUrl,
    MAX_FILE_SIZE,
    ALLOWED_MIME_TYPES,
};
