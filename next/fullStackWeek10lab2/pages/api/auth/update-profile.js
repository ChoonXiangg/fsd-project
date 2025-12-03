const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('Update profile API called with:', req.body);

    const response = await fetch('http://localhost:8000/update-profile', {
      method: 'PUT',
      body: JSON.stringify(req.body),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Backend response status:', response.status);

    const data = await response.json();
    console.log('Backend response data:', data);

    if (response.ok) {
      res.status(200).json(data);
    } else {
      res.status(response.status).json(data);
    }
  } catch (error) {
    console.error('API route error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

export default handler;
