// Vercel Serverless Function — Save Progress & Generate Resume Link
// Stores customer's current state in Supabase and emails them a resume link

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const SUPABASE_URL = "https://dalertxugwgkfsyizmly.supabase.co";
  const SUPABASE_KEY = "sb_publishable_nPaxXCiHyZkO8MkRsz-1Zw_ZgPBlybk";
  const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'info@air-careconnect.com';
  const APP_URL = process.env.APP_URL || 'https://air-care-connect-estimate-app.vercel.app';

  try {
    const { email, name, stateSnapshot, lang } = req.body;

    if (!email || !stateSnapshot) {
      return res.status(400).json({ error: 'Email and state snapshot are required' });
    }

    // Generate a unique resume token
    const resumeToken = 'rsm_' + Math.random().toString(36).slice(2) + Date.now().toString(36);

    // Save the snapshot to Supabase saved_sessions table
    const saveResponse = await fetch(`${SUPABASE_URL}/rest/v1/saved_sessions`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        resume_token: resumeToken,
        customer_email: email,
        customer_name: name || null,
        state_snapshot: stateSnapshot,
        language: lang || 'en',
      }),
    });

    if (!saveResponse.ok) {
      const errText = await saveResponse.text();
      console.error('Supabase save error:', errText);
      return res.status(500).json({ error: 'Could not save your progress' });
    }

    const resumeUrl = `${APP_URL}?resume=${resumeToken}`;

    // Send the resume link via email
    if (SENDGRID_API_KEY) {
      const isEs = lang === 'es';
      const emailPayload = {
        personalizations: [{ to: [{ email }] }],
        from: { email: FROM_EMAIL, name: 'Air-Care Connect' },
        subject: isEs ? 'Continúe Su Estimado de Air-Care Connect' : 'Continue Your Air-Care Connect Estimate',
        content: [{
          type: 'text/html',
          value: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
              <h2 style="color: #163E64;">${isEs ? 'Su Progreso Está Guardado' : 'Your Progress is Saved'}</h2>
              <p>${isEs ? 'Hola' : 'Hi'} ${name || ''},</p>
              <p>${isEs ? 'Puede continuar exactamente donde lo dejó haciendo clic en el botón a continuación, en cualquier dispositivo.' : "You can pick up right where you left off by clicking the button below, on any device."}</p>
              <a href="${resumeUrl}" style="display:inline-block; background:#00B0F0; color:white; padding:14px 28px; border-radius:50px; text-decoration:none; font-weight:bold; margin: 16px 0;">
                ${isEs ? 'Continuar Mi Estimado' : 'Continue My Estimate'}
              </a>
              <p style="color:#64748b; font-size:13px;">${isEs ? 'Este enlace funciona durante 45 días.' : 'This link works for 45 days.'}</p>
            </div>
          `,
        }],
      };

      await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: { Authorization: `Bearer ${SENDGRID_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(emailPayload),
      });
    }

    return res.status(200).json({ success: true, resumeUrl, resumeToken });

  } catch (error) {
    console.error('Save progress error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
