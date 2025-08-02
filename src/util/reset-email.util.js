import nodemailer from "nodemailer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import createError from "./create-error.util.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendResetEmail = async (email, token) => {
  const filePath = join(__dirname, "../templates/reset-password.html");
  const html = fs.readFileSync(filePath, "utf8");
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  html.replace("{{resetLink}}", resetLink);

  try {
    await transporter.sendMail({
      from: `"DevSecOps Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your Password",
      html,
    });
    console.log("Reset email sent successfully");
  } catch (error) {
    console.error("Error sending reset email:", error);
    createError(500, "Failed to send reset email");
  }
};

export default sendResetEmail;
