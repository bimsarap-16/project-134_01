const nodemailer = require('nodemailer');

/**
 * Send email utility
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - Email body in HTML
 */
const sendEmail = async (to, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `"QuizHub" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`[Email] Message sent: ${info.messageId} to ${to}`);
        return true;
    } catch (error) {
        console.error('[Email Error]', error);
        return false;
    }
};

module.exports = { sendEmail };
