const multer = require('multer');
const path = require('path');


// Storage configuration for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the folder where files will be stored
    },
    filename: (req, file, cb) => {
        // Ensure the file name is unique by adding timestamp
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

// File filter to allow only images
const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png|gif/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'));
    }
};

// Multer upload middleware
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB size limit for the image
});

module.exports = upload;
