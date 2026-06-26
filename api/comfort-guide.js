// Vercel Serverless Function — Comfort Guide AI Chat with Tool Use
// Calls Anthropic's API securely from the server, supports tool calling
// so Comfort Guide can trigger real actions like sending an estimate

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({ error: 'AI service not configured' });
  }

  try {
    const { system, messages, tools } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const requestBody = {
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 600,
      system: system || '',
      messages: messages,
    };

    if (tools && Array.isArray(tools) && tools.length > 0) {
      requestBody.tools = tools;
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Anthropic API error:', data);
      return res.status(response.status).json({ error: data.error?.message || 'AI request failed' });
    }

    // Extract both text and tool_use blocks from the response
    let text = '';
    let toolUse = null;

    for (const block of data.content || []) {
      if (block.type === 'text') text += block.text;
      if (block.type === 'tool_use') {
        toolUse = { name: block.name, input: block.input };
      }
    }

    return res.status(200).json({ text, toolUse });

  } catch (error) {
    console.error('Comfort Guide error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
