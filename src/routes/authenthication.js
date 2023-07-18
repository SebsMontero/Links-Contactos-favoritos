const express = require('express');
const router = express.Router();

const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

router.get('/singup', isNotLoggedIn, (req, res) => {
  res.render('auth/singup');
});

router.post('/singup', isNotLoggedIn, passport.authenticate('local.singup', {
  successRedirect: '/profile',
  failureRedirect: '/singup',
  failureFlash: true
}));


// Get me permite visualizar
router.get('/singin',isNotLoggedIn, (req, res) => {
    res.render('auth/singin');
});

router.post('/singin', (req, res, next) => {
  passport.authenticate('local.singin', {
      successRedirect: '/profile',
      failureRedirect: '/singin',
      failureFlash: true
  })(req, res, next);
});

router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile');
});

// router.get('/logout', (req, res) => {
//   req.logOut();
//   res.redirect('/');
// });

router.get('/logout', (req, res) => {
  req.logOut(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/singin');
  });
});

module.exports = router