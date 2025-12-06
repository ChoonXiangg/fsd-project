// /api/get-rents

async function handler(req, res) { // can be called anything you like
    const response = await fetch('http://localhost:8000/getRents', {
        method: 'POST',
        body: JSON.stringify(req.body),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    res.json(data)
}

export default handler;
