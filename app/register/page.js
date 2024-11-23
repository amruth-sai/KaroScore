"use client";
import { useState } from 'react';


export default function register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState('');

  const handlePayment = async () => {
    const res = await fetch('/api/razorpay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    });

    const data = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: data.currency,
      name: 'Your Company Name',
      description: 'Registration Fee',
      order_id: data.id,
      handler: function (response) {
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
      },
      prefill: {
        name,
        email,
      },
      theme: {
        color: '#3399cc',
      },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  return (
    <div>
      <h2>Registration Form</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handlePayment}>Register & Pay</button>
    </div>
  );
}
