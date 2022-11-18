const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: 'dvvsvhlym',
    api_key: '933412173342929',
    api_secret: 'dW_omhMN7YbhQmutMvzH_ZOzRr8'
});


cloudinary.v2.uploader.upload('',
    { public_id: "olympic_flag" },
    function(error, result) {console.log(result); });

