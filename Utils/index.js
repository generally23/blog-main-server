const jwt = require('jsonwebtoken');
const multer = require('multer');

const objectAssign = (source, target) => {
    if (!source || !target) {
        // error
        return;
    }
    for (let key in source) {
        if (source[key]) target[key] = source[key];
    }
}

const isSame = (v1, v2) => {

}

const generateJwt = (id) => {
    return jwt.sign(
        { id }, 
        process.env.JWT_SECRET_KEY || 'secret',
        { expiresIn: process.env.JWT_EXPIRATION_TIME || ((3600 * 24) * 30) + 's'}
    );
}


const uploader = () => {

    const storage = multer.diskStorage();

    return upload = multer(
        {
            storage,
            fileFilter (req, file, cb) {

            },
            limits: {
                fileSize: 5
            }
        }
    )
}


module.exports = {
    generateJwt,
    isSame,
    objectAssign,
    uploader
}