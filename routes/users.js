var express = require('express')
var router = express.Router();
var body = require("body-parser");
var bcrypt = require("bcryptjs");
var passport = require("passport");

var bodyencoder = body.urlencoded({ extended: false }) ;

//bring in models
let User = require("../models/user");

//register form
router.get('/register', (req,res) =>{
	res.render('register');
})

//register process
router.post('/register', bodyencoder , (req,res) =>{
	let name = req.body.Name;
	let email = req.body.Email;
	let username = req.body.Username;
	let password = req.body.Password;
	let password2 = req.body.Password2;
    
    req.checkBody('Name','Name is required').notEmpty();
	req.checkBody('Email','Email is required').notEmpty();
	req.checkBody('Email','Email is not valid').isEmail();
	req.checkBody('Username','Username is required').notEmpty();
	req.checkBody('Password','Password is required').notEmpty();
	req.checkBody('Password2','Password is not match').equals(req.body.Password);

	let errors = req.validationErrors();

	if (errors) {
		res.render('register',{
			errors:errors
		});
	}else{
		let newUser = new User({
			name:name,
			email:email,
			username:username,
			password:password
		});

		bcrypt.genSalt(10, (err , salt) =>{
			bcrypt.hash(newUser.password, salt, (err , hash) =>{
				if (err) {
					console.log(err);
				}
				newUser.password = hash;
				newUser.save((err) =>{
					if (err) {
						console.log(err);
						return;
					}else{
						req.flash('success','You are now registered and can login');
						res.redirect('/users/login');
					}
				})
			})
		})
	}
})



//login form
router.get('/login', (req,res) =>{
	res.render('login');
});

//login process
router.post('/login', (req, res, next) =>{
	passport.authenticate('local', {
		successRedirect: '/',
		//badRequestMessage: "Wrong",
		failureRedirect: '/users/login',
		failureFlash: true
	})(req, res, next);
});

module.exports = router;

