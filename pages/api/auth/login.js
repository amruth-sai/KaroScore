// pages/api/auth/login.js

import pool from '../../../utils/db';

export default async function handler(req, res) {
    console.log("*HERE****");
  if (req.method === 'POST') {
    const { username, password } = req.body;

    try {
      // Check if the user exists
      const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
      if (rows.length === 0) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      const user = rows[0];

      // Verify the password (you should hash and compare hashed passwords in production)
      if (user.password !== password) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }

      // Return a successful response
      res.status(200).json({ message: 'Login successful' });
    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
