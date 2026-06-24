// Vercel Serverless Function — Create Stripe Payment Intent
// Keeps the Stripe Secret Key secure on the server, never exposed to browser

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

  if (!STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Stripe not configured' });
  }

  try {
    const { amount, currency = 'usd', customerEmail, customerName, description, paymentMethodType } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    // Build the payment intent params
    const params = new URLSearchParams();
    params.append('amount', Math.round(amount * 100)); // Stripe uses cents
    params.append('currency', currency);
    params.append('description', description || 'Air-Care Connect - AC System Deposit');
    
    if (customerEmail) params.append('receipt_email', customerEmail);
    
    // Restrict payment method types based on what was requested
    if (paymentMethodType === 'ach') {
      params.append('payment_method_types[]', 'us_bank_account');
    } else {
      params.append('payment_method_types[]', 'card');
    }

    // Add metadata for tracking in Stripe dashboard
    if (customerName) params.append('metadata[customer_name]', customerName);
    params.append('metadata[source]', 'air-care-connect-app');

    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Stripe error:', data);
      return res.status(response.status).json({ error: data.error?.message || 'Payment intent creation failed' });
    }

    // Return only what the frontend needs
    return res.status(200).json({
      clientSecret: data.client_secret,
      paymentIntentId: data.id,
    });

  } catch (error) {
    console.error('Payment intent error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
