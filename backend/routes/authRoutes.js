const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require("../firebase"); // Firestore

// User Signup with password hashing
router.post('/signup', (req, res) => {
  const { name, email, phone, address, password } = req.body;

  // Hash the password
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, async (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err);
      return res.status(500).json({ message: 'Error while encrypting password' });
    }

    try {
      // Check if user already exists
      const userRef = db.collection('signup');
      const snapshot = await userRef.where('email', '==', email).get();
      if (!snapshot.empty) {
        return res.status(409).json({ message: 'You already have an account with this email.' });
      }
      // Add new user
      await userRef.add({
        name,
        email,
        phone,
        address,
        password: hashedPassword
      });
      res.json({ message: 'Signup successful' });
    } catch (err) {
      console.error('Error inserting user:', err);
      res.status(500).json({ message: 'Signup failed' });
    }
  });
});

// User login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const userRef = db.collection('signup');
  userRef.where('email', '==', email).get().then(async snapshot => {
    if (snapshot.empty) {
      return res.status(401).json({ message: 'User not found' });
    }
    const userDoc = snapshot.docs[0];
    const user = userDoc.data();
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Create JWT Payload
    const payload = {
      id: userDoc.id,
      email: user.email,
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) {
          console.error('Error signing token:', err)
          throw err;
        }
        res.json({
          success: true,
          token,
          user: {
            id: userDoc.id,
            name: user.name,
            email: user.email,
          }
        });
      }
    );
  }).catch(err => {
    console.error('Server error during login:', err);
    res.status(500).json({ message: 'Server error' });
  });
});

router.get('/admin/users', (req, res) => {
  db.collection('signup').get().then(snapshot => {
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(users);
  }).catch(err => {
    res.status(500).json({ error: 'DB error' });
  });
});

module.exports = router; 