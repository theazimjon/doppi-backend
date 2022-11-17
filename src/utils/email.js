const { CourierClient } = require("@trycourier/courier");


const sendEmail = async (email, subject, text) => {
    try {
        const courier = CourierClient(
            { authorizationToken: process.env.MAIL_SERVICE_KEY});

        const { requestId } = await courier.send({
            message: {
                content: {
                    title: "Doppi A modern solution for your business",
                    body: text
                },
                data: {
                    joke: text
                },
                to: {
                    email: email
                }
            }
        });
        return requestId;

    } catch (error) {
        console.log("email not sent");
        return null;
    }
};

module.exports = sendEmail;