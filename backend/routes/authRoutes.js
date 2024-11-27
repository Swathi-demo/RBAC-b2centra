const express = require('express');
const passport = require('passport');
const router = express.Router();

// B2C Authentication
router.get('/b2c/login', passport.authenticate('b2c'));

// B2C Callback
router.post(
  '/b2c/callback',
  passport.authenticate('b2c', {
    failureRedirect: '/login',
    successRedirect: '/dashboard',
  })
);

// Entra ID Authentication
router.get('/entra/login', passport.authenticate('entra'));

// Entra Callback
router.post(
  '/entra/callback',
  passport.authenticate('entra', {
    failureRedirect: '/login',
    successRedirect: '/dashboard',
  })
);

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
