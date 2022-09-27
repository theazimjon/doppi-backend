const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
    try {
        // const transporter = nodemailer.createTransport({
        //     host: process.env.HOST,
        //     service: process.env.SERVICE,
        //     port: 587,
        //     secure: true,
        //     auth: {
        //         user: process.env.USER,
        //         pass: process.env.PASS,
        //     },
        // });
        // let testAccount = await nodemailer.createTestAccount();


        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'cordelia.bosco77@ethereal.email',
                pass: 'wyJskDePSvJJy7WB1F'
            }
        });


        await transporter.sendMail({
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text,
        });
        console.log("email sent sucessfully");
    } catch (error) {
        console.log("email not sent");
        console.log(error);
    }
};

module.exports = sendEmail;