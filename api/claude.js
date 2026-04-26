export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '86400');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    let body = req.body;
    if (typeof body === 'string') body = JSON.parse(body);
    
    const userMessage = body?.messages?.[body?.messages?.length-1]?.content || "Génère une enquête policière française";
    
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: userMessage }],
        max_tokens: 2000
      })
    });
    
    const data = await groqRes.json();
    const content = data.choices?.[0]?.message?.content || "";
    res.status(200).json({ content: [{ text: content }] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
