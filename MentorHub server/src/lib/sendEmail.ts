import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SENDER_SMTP_HOST,
    port: Number(process.env.EMAIL_SENDER_SMTP_PORT) || 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_SENDER_SMTP_USER,
        pass: process.env.EMAIL_SENDER_SMTP_PASS,
    },
});

export const sendContactEmail = async (data: { firstName: string; lastName: string; email: string; message: string }) => {
    try {
        const templatePath = path.join(__dirname, 'templates', 'contact.ejs');
        const htmlContent = await ejs.renderFile(templatePath, {
            ...data,
            date: new Date().toLocaleString()
        });

        const mailOptions = {
            from: process.env.EMAIL_SENDER_SMTP_FROM || process.env.EMAIL_SENDER_SMTP_USER,
            to: data.email, // Send directly to the email entered in the form
            bcc: process.env.ADMIN_EMAIL, // Also copy the admin
            subject: `MentorHub: We received your message, ${data.firstName}!`,
            html: htmlContent,
            replyTo: process.env.EMAIL_SENDER_SMTP_USER
        };

        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Failed to send email");
    }
};
