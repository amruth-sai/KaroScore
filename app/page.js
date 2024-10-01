// app/page.js
"use client";

import Link from 'next/link';

export default function Home() {
  return (
    <div className="page">
      <h1>Welcome to KaroScore</h1>
      <p>Your gateway to success in academic exams.</p>
      <div className="buttons">
        <Link href="/login">
          <button className="button">Login</button>
        </Link>
        <Link href="/signup">
          <button className="button">Signup</button>
        </Link>
      </div>
      <footer className="footer">
        <p>&copy; 2024 KaroScore. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
