// Vercel Serverless Function — Retrieve Saved Progress by Resume Token

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const SUPABASE_URL = "https://dalertxugwgkfsyizmly.supabase.co";
  const SUPABASE_KEY = "sb_publishable_nPaxXCiHyZkO8MkRsz-1Zw_ZgPBlybk";

  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: 'Resume token is required' });
    }

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/saved_sessions?resume_token=eq.${token}&select=*`,
      { headers: { apikey: SUPABASE_KEY } }
    );

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(404).json({ error: 'Saved session not found or expired' });
    }

    const session = data[0];

    // Check 45-day expiration
    const savedAt = new Date(session.created_at);
    const daysSince = (Date.now() - savedAt.getTime()) / (1000 * 60 * 60 * 24);
    const expired = daysSince > 45;

    return res.status(200).json({
      stateSnapshot: session.state_snapshot,
      customerEmail: session.customer_email,
      customerName: session.customer_name,
      language: session.language,
      expired,
      daysSince: Math.floor(daysSince),
    });

  } catch (error) {
    console.error('Resume progress error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
