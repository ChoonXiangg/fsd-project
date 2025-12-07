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

// ... (existing code: imports and connections)

let userSchema = new Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true, required: true },
  password: String,
  phoneNumber: String,
  verifiedAgent: Boolean
}, { collection: 'users' });

let guideSchema = new Schema({
  title: String,
  category: String,
  content: String,
  excerpt: String,
  image: String,
  dateAdded: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
  readTime: String,
}, { collection: 'guides' });

let buys = oldMong.model('buys', propertySchema);
let rents = oldMong.model('rents', propertySchema);
let users = oldMong.model('users', userSchema);
let guides = oldMong.model('guides', guideSchema);

router.get('/', async function (req, res, next) {
  res.render('index');
});

router.post('/getBuys', async function (req, res, next) {
  const allBuys = await buys.find().lean();
  res.json({ buys: allBuys });
});

router.post('/getRents', async function (req, res, next) {
  const allRents = await rents.find().lean();
  res.json({ rents: allRents });
});

router.post('/saveBuy', async function (req, res, next) {
  console.log('saving buy:', req.body);
  const savedBuy = await buys.create(req.body);
  res.json(savedBuy);
});

router.post('/saveRent', async function (req, res, next) {
  console.log('saving rent:', req.body);
  const savedRent = await rents.create(req.body);
  res.json(savedRent);
});

router.get('/getGuides', async function (req, res, next) {
  const allGuides = await guides.find().lean();
  res.json(allGuides);
});

// Seed endpoint to populate guides if empty
router.post('/seedGuides', async function (req, res, next) {
  const count = await guides.countDocuments();
  if (count === 0) {
    // Sample data from the frontend mock
    const initialGuides = [
      {
        title: "First-Time Buyer's Checklist 2024",
        category: "Buying",
        dateAdded: new Date("2024-02-15"),
        excerpt: "Everything you need to know before buying your first home in Ireland.",
        image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        views: 120,
        readTime: "5 min read"
      },
      {
        title: "Top 5 Renovation Tips for Spring",
        category: "Home Improvement",
        dateAdded: new Date("2024-02-10"),
        excerpt: "Spruce up your home with these cost-effective improvement ideas.",
        image: "https://images.unsplash.com/photo-1484154218962-a1c002085d2f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        views: 85,
        readTime: "4 min read"
      },
      {
        title: "Understanding Property Tax in 2024",
        category: "Legal & Tax",
        dateAdded: new Date("2024-02-05"),
        excerpt: "A comprehensive guide to property taxes for homeowners and landlords.",
        image: "https://images.unsplash.com/photo-1554224155-9840635290aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        views: 200,
        readTime: "6 min read"
      },
      {
        title: "How to Stage Your Home for Sale",
        category: "Selling",
        dateAdded: new Date("2024-01-20"),
        excerpt: "Maximize your sale price with these staging secrets.",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        views: 5000,
        readTime: "7 min read"
      },
      {
        title: "Mortgage Application Mistakes to Avoid",
        category: "Home Financing",
        dateAdded: new Date("2024-01-15"),
        excerpt: "Don't let these common errors derail your mortgage approval.",
        image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        views: 4200,
        readTime: "8 min read"
      },
      {
        title: "Renting vs Buying: A Financial Analysis",
        category: "Property Insights",
        dateAdded: new Date("2024-01-10"),
        excerpt: "Breaking down the long-term costs of renting versus buying.",
        image: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        views: 3800,
        readTime: "10 min read"
      },
      {
        title: "Tenant Rights in Ireland",
        category: "Renting",
        dateAdded: new Date("2024-01-05"),
        excerpt: "Know your rights as a tenant in the current market.",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        views: 3500,
        readTime: "6 min read"
      },
      {
        title: "Eco-Friendly Home Improvements",
        category: "Home Improvement",
        dateAdded: new Date("2023-12-28"),
        excerpt: "Sustainable upgrades that save money and the planet.",
        image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
        views: 3100,
        readTime: "5 min read"
      }
    ];
    await guides.insertMany(initialGuides);
    res.json({ message: "Seeded guides successfully", guides: initialGuides });
  } else {
    res.json({ message: "Guides already exist", count });
  }
});

router.post('/incrementGuideView', async function (req, res, next) {
  const { guideId } = req.body;
  await guides.findByIdAndUpdate(guideId, { $inc: { views: 1 } });
  res.json({ message: "View count incremented" });
});

router.post('/saveGuide', async function (req, res, next) {
  try {
    console.log('saving guide:', req.body);
    const savedGuide = await guides.create(req.body);
    res.json(savedGuide);
  } catch (error) {
    console.error('Error saving guide:', error);
    res.status(500).json({ message: 'Error saving guide' });
  }
});

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