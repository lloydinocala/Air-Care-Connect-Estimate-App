// Vercel Serverless Function — Send SMS via Twilio
// Keeps Twilio Auth Token secure on the server

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
  const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
  const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER) {
    return res.status(500).json({ error: 'SMS service not configured' });
  }

  try {
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({ error: 'Phone number and message are required' });
    }

    // Normalize phone number to E.164 format (+1XXXXXXXXXX)
    let normalizedPhone = to.replace(/\D/g, '');
    if (normalizedPhone.length === 10) normalizedPhone = '1' + normalizedPhone;
    normalizedPhone = '+' + normalizedPhone;

    const params = new URLSearchParams();
    params.append('To', normalizedPhone);
    params.append('From', TWILIO_PHONE_NUMBER);
    params.append('Body', message);

    const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Twilio SMS error:', data);
      return res.status(response.status).json({ error: data.message || 'SMS send failed' });
    }

    return res.status(200).json({ success: true, sid: data.sid });

  } catch (error) {
    console.error('SMS send error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
