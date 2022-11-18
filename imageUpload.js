const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const cloudinary = require("../config/cloudConfig");

module.exports = async function uploadImage(data) {
    try {
        const buff = new Buffer(data, 'base64');
        const fileName = (Math.random() * 1000).toString() + ".png";
        await fs.promises.writeFile(fileName, buff);
        const result = await cloudinary.v2.uploader.upload(fileName,
            { public_id: uuidv4() },
            function(error, res) {console.log(res) });
        await fs.promises.unlink(fileName);
        return result.url;
    }
    catch(err){
        return err.message;
    }
}

