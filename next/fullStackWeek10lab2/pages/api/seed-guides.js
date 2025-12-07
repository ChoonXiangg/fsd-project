async function handler(req, res) {
    if (req.method === 'POST') {
        const response = await fetch('http://localhost:8000/seedGuides', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        res.json(data);
    }
}

export default handler;
