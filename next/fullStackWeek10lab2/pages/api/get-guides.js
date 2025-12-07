async function handler(req, res) {
    if (req.method === 'GET') {
        const response = await fetch('http://localhost:8000/getGuides', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        res.json(data);
    }
}

export default handler;
