const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');

// @route     GET api/auth
// @desc      Get logged in user
// @access    Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route     POST api/auth
// @desc      Auth user & get token
// @access    Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Get user from db with email
      let user = await User.findOne({ email });

      // If user email don't exists
      if (!user) {
        return res
          .status(400)
          .json({ msg: 'Usuario o contraseña incorrectos' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      // If password sending don't match with password in db
      if (!isMatch) {
        return res
          .status(400)
          .json({ msg: 'Usuario o contraseña incorrectos' });
      }

      // Payload to use with jwt
      const payload = {
        user: {
          id: user.id
        }
      };

      // Generate token jwt
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          // In prod recomended expiresIn: 3600
          expiresIn: 360000
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
