// pages/api/auth/signup.js

import pool from '../../../utils/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, email, password } = req.body;

    try {
      // Check if the user already exists
      const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      if (rows.length > 0) {
        return res.status(409).json({ message: 'User already exists' });
      }

      // Insert the new user into the database
      await pool.query(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, password]
      );

      // Return a successful response
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Error inserting user:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
