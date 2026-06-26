// Vercel Serverless Function — Send Email via Twilio SendGrid
// Keeps SendGrid API Key secure on the server

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'quotes@air-careconnect.com';
  const FROM_NAME = process.env.SENDGRID_FROM_NAME || 'Air-Care Connect';

  if (!SENDGRID_API_KEY) {
    return res.status(500).json({ error: 'Email service not configured' });
  }

  try {
    const { to, subject, htmlContent, textContent } = req.body;

    if (!to || !subject || (!htmlContent && !textContent)) {
      return res.status(400).json({ error: 'Email address, subject, and content are required' });
    }

    const payload = {
      personalizations: [{ to: [{ email: to }] }],
      from: { email: FROM_EMAIL, name: FROM_NAME },
      subject: subject,
      content: [
        ...(textContent ? [{ type: 'text/plain', value: textContent }] : []),
        ...(htmlContent ? [{ type: 'text/html', value: htmlContent }] : []),
      ],
    };

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('SendGrid error:', errorData);
      return res.status(response.status).json({ error: 'Email send failed' });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Email send error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
