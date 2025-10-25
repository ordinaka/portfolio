import express from 'express';
import nodemailer from 'nodemailer';
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



app.post("/contact", async (req, res)=>{
    const {name, email, message} = req.body

    if (!name || !email || !message)
        return res.status(400).json({ message: "All fields are required." });

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: `Portfolio Message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({message: "message was sent succesfully"});
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "An error occurred while sending the message." });
    }
})

app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
});
