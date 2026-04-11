import { config } from "dotenv";
config();
import { sendContactEmail } from "./src/lib/sendEmail";

(async () => {
    try {
        await sendContactEmail({
            firstName: "Test",
            lastName: "User",
            email: "test@example.com",
            message: "Testing the email service"
        });
        console.log("Success");
    } catch (e) {
        console.error("FAILED:", e);
    }
})();
