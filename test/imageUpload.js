const fs = require('fs');
const firebaseAdmin = require('firebase-admin');
const { v4: uuidv4 } = require('uuid');
const admin = require("../src/config/firebaseAdminSdk");
const storageRef = admin.storage().bucket(`gs://doppi-951be.appspot.com`);



// let buff = fs.readFileSync('ubuntu_red_walpaper.jpg');
// let base64data = buff.toString('base64');

// fs.writeFileSync("base64.txt", base64data);
// console.log('Image converted to base 64 is:\n\n' + base64data);


// let data = ""

// let buff = new Buffer(data, 'base64');
// fs.writeFileSync('ok.png', buff);

// console.log('Base64 image data converted to file: stack-abuse-logo-out.png');


// const fileName = (Math.random() * 1000).toString()
// console.log(typeof fileName);

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

(async() => {
    console.log(await uploadFile('./ok.png', (Math.random() * 1000).toString()));
})();
