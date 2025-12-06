// /api/new-property

async function handler(req, res) { // can be called anything you like
  const endpoint = req.body.listingType === 'Rent' ? 'saveRent' : 'saveBuy';
  const response = await fetch(`http://localhost:8000/${endpoint}`, {
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

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};
