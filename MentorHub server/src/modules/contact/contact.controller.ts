import { Request, Response } from "express";
import { sendContactEmail } from "../../lib/sendEmail";

export const handleContactSubmit = async (req: Request, res: Response): Promise<void> => {
    try {
        const { firstName, lastName, email, message } = req.body;

        if (!firstName || !lastName || !email || !message) {
            res.status(400).json({ success: false, message: "All fields are required" });
            return;
        }

        await sendContactEmail({ firstName, lastName, email, message });

        res.status(200).json({ success: true, message: "Message sent successfully" });
    } catch (error) {
        console.error("Contact Form Error:", error);
        res.status(500).json({ success: false, message: "Failed to send message. Please try again later." });
    }
};
