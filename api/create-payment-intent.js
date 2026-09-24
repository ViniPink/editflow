// api/create-payment-intent.js
// Vercel Serverless Function — executa no servidor, nunca expõe a secret key

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, name } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 19700,           // R$ 197,00 em centavos
      currency: 'brl',
      payment_method_types: ['card', 'boleto'],
      receipt_email: email,
      description: 'Editflow — Acesso vitalício',
      metadata: { name: name || '' },
      payment_method_options: {
        boleto: { expires_after_days: 3 }
      },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });

  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: err.message });
  }
};
