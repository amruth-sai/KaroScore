import Razorpay from 'razorpay';
import shortid from 'shortid';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { amount } = req.body;

    const payment_capture = 1;
    const currency = 'INR';

    const options = {
      amount: (amount * 100).toString(), // amount in paisa
      currency,
      receipt: shortid.generate(),
      payment_capture,
    };

    try {
      const response = await razorpay.orders.create(options);
      res.status(200).json({
        id: response.id,
        currency: response.currency,
        amount: response.amount,
      });
    } catch (error) {
      res.status(500).json({ error: 'Error creating order' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
