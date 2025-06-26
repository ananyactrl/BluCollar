const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// User Signup with password hashing
router.post('/signup', (req, res) => {
  const { name, email, phone, address, password } = req.body;
  const db = req.app.locals.db; // Access the shared DB connection

  // Hash the password
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err);
      return res.status(500).json({ message: 'Error while encrypting password' });
    }

    const query = 'INSERT INTO signup(name, email, phone, address, password) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [name, email, phone, address, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error inserting user:', err);
        return res.status(500).json({ message: 'Signup failed' });
      }
      res.json({ message: 'Signup successful' });
    });
  });
});

// User login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const db = req.app.locals.db; // Access the shared DB connection

  const query = 'SELECT * FROM signup WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error('Server error during login:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    if (results.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT Payload
    const payload = {
      id: user.id,
      email: user.email,
    };

    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' }, // Token expires in 7 days
      (err, token) => {
        if (err) {
            console.error('Error signing token:', err)
            throw err;
        };
        res.json({
          success: true,
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            // Add other non-sensitive user data you might need on the frontend
          }
        });
      }
    );
  });
});

router.get('/admin/users', (req, res) => {
  const db = req.app.locals.db;
  db.query('SELECT * FROM Signup ORDER BY id DESC', (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(results);
  });
});

module.exports = router; 