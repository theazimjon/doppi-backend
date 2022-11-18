const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const admin = require("../../src/config/firebaseAdminSdk");
const storageRef = admin.storage().bucket(`gs://doppi-951be.appspot.com`);

async function uploadFile(path, filename) {

    // Upload the File
    const storage = await storageRef.upload(path, {
        public: true,
        destination: `/uploads/hashnode/${filename}`,
        metadata: {
            firebaseStorageDownloadTokens: uuidv4(),
        }
    });
    return storage[0].metadata.mediaLink;
}
module.exports = async function uploadImage(data) {
    try {
        const buff = new Buffer(data, 'base64');
        const fileName = "./" + (Math.random() * 1000).toString() + ".png";
        await fs.promises.writeFile(fileName, buff);
        const result = await uploadFile(fileName, fileName);
        await fs.promises.unlink(fileName);
        return result;
    }
    catch(err){
        return err.message;
    }
}

