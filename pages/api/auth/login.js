import pool from "../../../utils/db";
import { serialize } from "cookie"; // For setting cookies
import jwt from "jsonwebtoken"; // For creating JWT tokens

const JWT_SECRET = "your_secret_key"; // Replace with a strong secret key
const COOKIE_NAME = "user_token";
const COOKIE_ACCESS_TOKEN = "user_access_token";
const COOKIE_OPTIONS = {
  httpOnly: process.env.NODE_ENV === "PRODUCTION",
  secure: process.env.NODE_ENV === "PRODUCTION", // Use secure cookies in production
  sameSite: "strict",
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { phoneNumber, otp } = req.body;

    try {
      // Check if the phone number exists in the database
      const [userRows] = await pool.query(
        "SELECT * FROM users WHERE phone_number = ?",
        [phoneNumber]
      );
      if (userRows.length === 0) {
        return res.status(401).json({ message: "User does not exist" });
      }

      const user = userRows[0];

      // Check if the OTP is valid
      const [otpRows] = await pool.query(
        "SELECT otp FROM otp_validation WHERE phone_number = ?",
        [phoneNumber]
      );
      if (otpRows.length === 0 || otpRows[0].otp !== parseInt(otp)) {
        return res.status(401).json({ message: "Invalid or expired OTP" });
      }

      // Remove the OTP record after successful login
      await pool.query("DELETE FROM otp_validation WHERE phone_number = ?", [
        phoneNumber,
      ]);

      // Create a JWT token containing user data
      const token = jwt.sign(
        { userId: user.user_id, phoneNumber: user.phone_number },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Set the cookies
      res.setHeader("Set-Cookie", [
        serialize(COOKIE_NAME, token, COOKIE_OPTIONS), // JWT token
        serialize(COOKIE_ACCESS_TOKEN, user.sid, COOKIE_OPTIONS), // Just SID as userAccessToken
      ]);

      // Return a successful response
      return res.status(200).json({
        message: "Login successful",
        user: {
          userId: user.user_id,
          phoneNumber: user.phone_number,
          sid: user.sid,
        },
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
