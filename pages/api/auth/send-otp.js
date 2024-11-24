import pool from "../../../utils/db";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { phoneNumber } = req.body;

    // Validate the phone number
    if (!phoneNumber || phoneNumber.length < 10) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    try {
      // Generate a random 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000);

      // Check if the phone number already exists in the database
      const [existingRecord] = await pool.query(
        "SELECT * FROM otp_validation WHERE phone_number = ?",
        [phoneNumber]
      );

      if (existingRecord.length > 0) {
        // Update the existing record with the new OTP and time
        await pool.query(
          "UPDATE otp_validation SET otp = ?, otp_last_sent = NOW() WHERE phone_number = ?",
          [otp, phoneNumber]
        );
      } else {
        // Insert a new record
        await pool.query(
          "INSERT INTO otp_validation (phone_number, otp) VALUES (?, ?)",
          [phoneNumber, otp]
        );
      }

      // Send OTP (dummy logic here, replace with an actual SMS gateway)
      console.log(`Sending OTP ${otp} to phone number ${phoneNumber}`);

      // Respond with success
      res.status(200).json({ message: "OTP sent successfully" }); // For debugging, include OTP in the response (remove in production).
    } catch (error) {
      console.error("Error sending OTP:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
