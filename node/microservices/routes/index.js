let express = require('express');
let router = express.Router();

let Mongoose = require('mongoose').Mongoose;
let Schema = require('mongoose').Schema;

require('dotenv').config({ path: '../.env' });
let oldMong = new Mongoose();
oldMong.connect(process.env.MONGODB_URI);

let propertySchema = new Schema({
  title: String,
  image: String,
  address: String,
  price: Number,
  description: String,
  bedrooms: Number,
  bathrooms: Number
}, { collection: 'properties' });

let properties = oldMong.model('properties', propertySchema);

router.get('/', async function (req, res, next) {
  res.render('index');
});

router.post('/getProperties', async function (req, res, next) {
  const allProperties = await getProperties();
  res.json(allProperties);
});

async function getProperties() {
  data = await properties.find().lean();
  return { properties: data };
}

router.post('/saveProperty', async function (req, res, next) {
  const result = await saveProperty(req.body);
  res.json(result);
});

async function saveProperty(theProperty) {
  console.log('theProperty: ', theProperty);
  await properties.create(theProperty,
    function (err, res) {
      if (err) {
        console.log('Could not insert new property')
        return { savePropertyResponse: "fail" };
      }
    }
  )
  return { savePropertyResponse: "success" };
}

module.exports = router;