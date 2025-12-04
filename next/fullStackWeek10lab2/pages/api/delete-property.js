// /api/delete-property

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const response = await fetch('http://localhost:8000/delete-property', {
      method: 'DELETE',
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
    console.error('Frontend delete-property error:', error);
    res.status(500).json({ message: 'Error deleting property' });
  }
}

export default handler;
