import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { config } from "dotenv";

config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SENDER_SMTP_HOST,
    port: Number(process.env.EMAIL_SENDER_SMTP_PORT) || 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_SENDER_SMTP_USER,
        pass: process.env.EMAIL_SENDER_SMTP_PASS,
    },
});

(async () => {
    try {
        const templatePath = path.join(__dirname, 'src', 'lib', 'templates', 'contact.ejs');
        const htmlContent = await ejs.renderFile(templatePath, {
            firstName: "Test",
            lastName: "User",
            email: "test@example.com",
            message: "Testing the email service",
            date: new Date().toLocaleString()
        });

        const mailOptions = {
            from: process.env.EMAIL_SENDER_SMTP_FROM || process.env.EMAIL_SENDER_SMTP_USER,
            to: process.env.ADMIN_EMAIL || process.env.EMAIL_SENDER_SMTP_USER,
            subject: `New Contact Message from User`,
            html: htmlContent,
            replyTo: "test@example.com"
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Success", info);
    } catch (e) {
        console.error("FAILED TO SEND:", e);
    }
})();
