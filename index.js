import express from 'express';
import nodemailer from 'nodemailer';
import { Resend } from 'resend'; 
import dotenv from 'dotenv';
import path from "path";
import { fileURLToPath } from "url";


const port = process.env.PORT || 4000
const app = express();

dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

app.post("/contact", async (req, res)=>{
    const {name, email, message} = req.body

    if (!name || !email || !message)
        return res.status(400).json({ message: "All fields are required." });


    try {
        const data = await resend.emails.send({
            from: "Vicky's Portfolio <onboarding@resend.dev>",
            to: process.env.EMAIL_USER,
            subject: `Portfolio Message from ${name}`,
            reply_to: email, // the user email
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        });

        console.log("Email sent:", data);
        res.status(200).json({ message: "Message sent successfully ✅" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "An error occurred while sending the message." });
    }
})

app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
});
