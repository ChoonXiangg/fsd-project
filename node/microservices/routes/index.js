let express = require('express');
let router = express.Router();

let Mongoose = require('mongoose').Mongoose;
let Schema = require('mongoose').Schema;

require('dotenv').config({ path: '../.env' });
let oldMong = new Mongoose();
oldMong.connect(process.env.MONGODB_URI);

let propertySchema = new Schema({
  name: String,
  image: String,
  address: String,
  city: String,
  county: String,
  price: Number,
  propertyType: String, // 'Residential' or 'Commercial'
  propertySubtype: String, // Depends on propertyType
  bedrooms: String, // 'Studio', '1', '2', '3', '4', '5+' (only for residential)
  verifiedAgent: Boolean,
  floorSize: Number // in square meters or square feet
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
  const savedProperty = await properties.create(theProperty);
  return savedProperty;
}

module.exports = router;