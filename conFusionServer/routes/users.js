var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var User = require('../models/user');

router.post('/signup', (req, res, next) => {
  
  console.log('signup');
  if (!req.body.username){
      console.log('No username in body!');
      return;
  }

  User.findOne({username: req.body.username})
  .then((user) => {
    console.log(user);
    console.log("Check if user exists in DB! ... ");
    if(user != null) {
      console.log("user exists");
      var err = new Error('User ' + req.body.username + ' already exists!');
      err.status = 403;
      next(err);
    } else {
      console.log("add user");
      return User.create({
        username: req.body.username,
        password: req.body.password});
    }
  })
  .then((user) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({status: 'Registration Successful!', user: user});
  }, (err) => next(err))
  .catch((err) => {next(err),
  console.log("signup error");
  });
});

router.post('/login', (req, res, next) => {
  console.log('login');
  console.log(req.session);

  if(!req.session.user) { // No user, check & add user
    var authHeader = req.headers.authorization;
    
    if (!authHeader) {
      var err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }
  
    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    var username = auth[0];
    var password = auth[1];
  
    User.findOne({username: username})
    .then((user) => {
      if (user === null) {
        var err = new Error('User ' + username + ' does not exist!');
        err.status = 403;
        return next(err);
      }
      else if (user.password !== password) {
        var err = new Error('Your password is incorrect!');
        err.status = 403;
        return next(err);
      }
      else if (user.username === username && user.password === password) { // Add user to session
        req.session.user = 'authenticated';
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are authenticated!')
  
        console.log("login end");
        console.log(req.session);
      }
    })
    .catch((err) => next(err));
  }
  else { // With user, ignore
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('You are already authenticated!');
  }
})

router.get('/logout', (req, res) => {
  console.log('logout');
  console.log(req.session);
  if (req.session) { // with session, destroy and logout
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
  console.log("logout end");
  console.log(req.session);
});

module.exports = router;
