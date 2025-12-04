// /api/toggle-star

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const response = await fetch('http://localhost:8000/toggle-star', {
      method: 'POST',
      body: JSON.stringify(req.body),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Frontend toggle-star error:', error);
    res.status(500).json({ message: 'Error toggling star' });
  }
}

export default handler;
