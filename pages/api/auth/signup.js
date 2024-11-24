import pool from "../../../utils/db";
import bcrypt from "bcrypt"; // For hashing passwords
const short = require("shortid");



export default async function handler(req, res) {
  if (req.method === "POST") {
    const {
      firstName,
      lastName,
      dob,
      aadharNumber,
      phoneNumber,
      otp,
    } = req.body;

    try {
      // Validate OTP from otp_validation table
      const [otpRecord] = await pool.query(
        "SELECT otp FROM otp_validation WHERE phone_number = ?",
        [phoneNumber]
      );

      if (otpRecord.length === 0 || otpRecord[0].otp !== parseInt(otp)) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      // Check if the user already exists (by phone_number or aadhar_number)
      const [existingUser] = await pool.query(
        "SELECT * FROM users WHERE phone_number = ? OR aadhar_number = ?",
        [phoneNumber, aadharNumber]
      );
      if (existingUser.length > 0) {
        return res.status(409).json({
          message: "User with this phone number or Aadhar already exists",
        });
      }

      const sid = short();
      // Insert the new user into the database
      await pool.query(
        `INSERT INTO users (sid,first_name, last_name, dob, aadhar_number, phone_number) 
         VALUES (?, ?, ?, ?, ?, ? )`,
        [sid, firstName, lastName, dob, aadharNumber, phoneNumber]
      );

      // Optional: Remove the OTP record after successful signup
      await pool.query("DELETE FROM otp_validation WHERE phone_number = ?", [
        phoneNumber,
      ]);

      // Return a successful response
      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      console.error("Error processing signup:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
