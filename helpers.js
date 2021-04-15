const imageFilter = function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(json|JSON|txt|TXT)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Tylko tekstowe pliki są akceptowane!'), false);
    }
    cb(null, true);
};
exports.imageFilter = imageFilter;