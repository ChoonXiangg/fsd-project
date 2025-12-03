async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const response = await fetch('http://localhost:8000/signup', {
      method: 'POST',
      body: JSON.stringify(req.body),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (response.ok) {
      res.status(201).json(data);
    } else {
      res.status(response.status).json(data);
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

export default handler;
