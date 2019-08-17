const express = require('express');
const router = express.Router();

const User = require('../models/User');

const passport = require('passport');

// LOGIN
router.get('/users/signin', (req, res) => {
  res.render('users/signin');
});

router.post(
  '/users/signin',
  passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/signin'
    // failureFlash: true
  })
);

// REGISTER
router.get('/users/signup', (req, res) => {
  res.render('users/signup');
});

router.post('/users/signup', async (req, res) => {
  const { name, email, password, confirm_password } = req.body;
  const errors = [];

  if (name.length <= 0) {
    errors.push({ text: 'Podaj nazwę użytkownika' });
  }

  if (password != confirm_password) {
    errors.push({ text: 'Zła wartość w polu potwierdź hasło' });
  }

  if (password.length < 4) {
    errors.push({ text: 'Hasło musi być dłuższe niż 4 znaki' });
  }

  if (errors.length > 0) {
    res.render('users/signup', {
      errors,
      name,
      email,
      password,
      confirm_password
    });
  } else {
    const emailUser = await User.findOne({ email: email });
    if (emailUser) {
      res.redirect('/users/signup');
      console.log('email istanieje');
    } else {
      const newUser = new User({ name, email, password });
      newUser.password = await newUser.encryptPassword(password);
      await newUser.save();
      res.redirect('/users/signin');
    }
  }
});

router.get('/users/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
