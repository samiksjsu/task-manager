const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'samikdada@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app`
    })
}

const sendGoodByeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'samikdada@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Sorry to see youu go, ${name}. Is there anything we could have done to stop you!!`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendGoodByeEmail
}