let express = require('express');
let router = express.Router();
let jwt = require('jsonwebtoken');

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
  floorSize: Number, // in square meters or square feet
  creatorId: String,
  creatorUsername: String,
  creatorEmail: String,
  creatorPhoneNumber: String,
  starredBy: [String], // Array of user IDs who have starred this property
  dateAdded: { type: Date, default: Date.now }
}, { collection: 'properties' });

let userSchema = new Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true, required: true },
  password: String,
  phoneNumber: String,
  verifiedAgent: Boolean
}, { collection: 'users' });

let properties = oldMong.model('properties', propertySchema);
let users = oldMong.model('users', userSchema);

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

router.post('/signup', async function (req, res, next) {
  try {
    const { username, email, password, phoneNumber, verifiedAgent } = req.body;

    // Check if email already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Check if username already exists
    const existingUsername = await users.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Check if phone number already exists (if provided)
    if (phoneNumber) {
      const existingPhone = await users.findOne({ phoneNumber });
      if (existingPhone) {
        return res.status(400).json({ message: 'Phone number already in use' });
      }
    }

    // Create new user
    const newUser = await users.create({
      username,
      email,
      password,
      phoneNumber,
      verifiedAgent: verifiedAgent || false
    });

    // Create JWT token for new user
    const token = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token: token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        verifiedAgent: newUser.verifiedAgent
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    if (error.code === 11000) {
      if (error.keyPattern && error.keyPattern.phoneNumber) {
        return res.status(400).json({ message: 'Phone number already in use' });
      }
      if (error.keyPattern && error.keyPattern.email) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      if (error.keyPattern && error.keyPattern.username) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      return res.status(400).json({ message: 'Duplicate key error' });
    }
    res.status(500).json({ message: 'Error creating user' });
  }
});

router.post('/login', async function (req, res, next) {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await users.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // Token expires in 7 days
    );

    res.status(200).json({
      message: 'Login successful',
      token: token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        verifiedAgent: user.verifiedAgent
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

router.post('/verify-token', async function (req, res, next) {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID from token
    const user = await users.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Token valid',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        verifiedAgent: user.verifiedAgent
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(500).json({ message: 'Error verifying token' });
  }
});

router.put('/update-profile', async function (req, res, next) {
  try {
    const { userId, username, phoneNumber, email } = req.body;

    console.log('Update profile request:', { userId, username, phoneNumber, email });

    // Find user first
    const user = await users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Link checks are done. Now update user fields
    if (email && email !== user.email) {
      // Check for duplicate email
      const existingEmail = await users.findOne({ email });
      if (existingEmail && existingEmail._id.toString() !== userId) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      user.email = email;
    }

    if (username && username !== user.username) {
      // Check for duplicate username
      const existingUsername = await users.findOne({ username });
      if (existingUsername && existingUsername._id.toString() !== userId) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      user.username = username;
    }

    if (phoneNumber && phoneNumber !== user.phoneNumber) {
      // Check for duplicate phoneNumber
      const existingPhoneNumber = await users.findOne({ phoneNumber });
      if (existingPhoneNumber && existingPhoneNumber._id.toString() !== userId) {
        return res.status(400).json({ message: 'Phone number already in use' });
      }
      user.phoneNumber = phoneNumber;
    }

    // Save the updated user
    const updatedUser = await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        verifiedAgent: updatedUser.verifiedAgent
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    console.error('Error details:', error.message);
    if (error.code === 11000) {
      if (error.keyPattern && error.keyPattern.username) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      if (error.keyPattern && error.keyPattern.email) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      if (error.keyPattern && error.keyPattern.phoneNumber) {
        return res.status(400).json({ message: 'Phone number already in use' });
      }
      return res.status(400).json({ message: 'Email, username or phone number already in use' });
    }
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

router.post('/toggle-star', async function (req, res, next) {
  try {
    const { userId, propertyId } = req.body;

    if (!userId || !propertyId) {
      return res.status(400).json({ message: 'User ID and Property ID are required' });
    }

    // Find the property
    const property = await properties.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Initialize starredBy array if it doesn't exist
    if (!property.starredBy) {
      property.starredBy = [];
    }

    // Toggle: if user has starred, unstar it; if not starred, star it
    const isCurrentlyStarred = property.starredBy.includes(userId);

    if (isCurrentlyStarred) {
      // Unstar: remove user from array
      property.starredBy = property.starredBy.filter(id => id !== userId);
    } else {
      // Star: add user to array
      property.starredBy.push(userId);
    }

    await property.save();

    res.status(200).json({
      message: isCurrentlyStarred ? 'Property unstarred successfully' : 'Property starred successfully',
      isStarred: !isCurrentlyStarred,
      starredBy: property.starredBy
    });
  } catch (error) {
    console.error('Toggle star error:', error);
    res.status(500).json({ message: 'Error toggling star', error: error.message });
  }
});

router.put('/update-property', async function (req, res, next) {
  try {
    const { propertyId, userId, ...updateData } = req.body;

    if (!propertyId || !userId) {
      return res.status(400).json({ message: 'Property ID and User ID are required' });
    }

    // Find the property
    const property = await properties.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if the user is the creator of the property
    if (property.creatorId !== userId) {
      return res.status(403).json({ message: 'You do not have permission to edit this property' });
    }

    // Update property fields
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        property[key] = updateData[key];
      }
    });

    await property.save();

    res.status(200).json({
      message: 'Property updated successfully',
      property: property
    });
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({ message: 'Error updating property', error: error.message });
  }
});

router.delete('/delete-property', async function (req, res, next) {
  try {
    const { propertyId, userId } = req.body;

    if (!propertyId || !userId) {
      return res.status(400).json({ message: 'Property ID and User ID are required' });
    }

    // Find the property
    const property = await properties.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if the user is the creator of the property
    if (property.creatorId !== userId) {
      return res.status(403).json({ message: 'You do not have permission to delete this property' });
    }

    await properties.findByIdAndDelete(propertyId);

    res.status(200).json({
      message: 'Property deleted successfully'
    });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({ message: 'Error deleting property', error: error.message });
  }
});

module.exports = router;