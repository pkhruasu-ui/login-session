var SessionDAO = require("../lib/sessionDAO").SessionDAO;
var UserDAO = require('../lib/userDAO').UserDAO;

function SessionHandler(db){
	"use strict";

	var sessions = new SessionDAO(db);
	var users = new UserDAO(db);

	this.isLoggedInMiddleware = function(req, res, next){
		var session_id = req.cookies.session;
		
		sessions.getUsername(session_id, function(err, username){			
			if(!err && username){
				req.username = username;
			}
			return next();
		});
	};

	this.getSignup = function(req,res){
		//todo implement
		res.render('signup', { pageTitle : "signup", username : "", email : "", password : "", verify : "",
				username_error : "", password_error : "", email_error : "", verify_error : ""
		});
	};

	this.displayLoginPage = function(req, res, next){
		res.render('login', { username : "", password : "", login_error : ""});
	};

	this.handleLoginRequest = function(req, res, next){
		var username = req.body.username,
			password = req.body.password;

		users.validateLogin(username, password, function(err, user){
			if(err){ return next(err);}

			sessions.startSession(user, function(error, session_id){
				if(error){ return next(error);}

				res.cookie('session', session_id);
				return res.redirect('/');
			});
		});
	};

	this.displayLogoutPage = function(req, res, next){
		var session_id = req.cookies.session;

		sessions.endSession(session_id, function(err){
			if(err){ throw err;}

			res.cookie('session','');
			return res.redirect('/');
		});
	};

	this.postSignup = function(req,res, next){
		var username = req.body.username,
			password = req.body.password,
			email = req.body.email,
			verify = req.body.verify;

		//todo implement
		var errors = { 'username' : username, 'email' : email};
		if(validateSignup(username, password, verify, email, errors)){		
			users.addUser(username, password, email, function(err, user){				
				if(err){
					// This was a duplicate
					if(err.code === 11000){						
						errors['username_error'] = "Username already in use. Please choose another";
						return res.render('signup', errors);
					}
					// This was a duplicate error
					else {
						return next(err);
					}
				}
				
				sessions.startSession(user, function(error, session_id){
					if(err){ return next(error); }
					
					res.cookie('session', session_id);
					return res.redirect('/');
				});
			});			
		}else {
            console.log("user did not validate");
            return res.render("signup", errors);
        }

	};

	function validateSignup(username, password, verify, email, errors){
		var USER_RE = /^[a-zA-Z0-9_-]{3,20}$/;
	    var PASS_RE = /^.{3,20}$/;
	    var EMAIL_RE = /^[\S]+@[\S]+\.[\S]+$/;

	    errors['username_error'] = "";
	    errors['password_error'] = "";
	    errors['verify_error'] = "";
	    errors['email_error'] = "";

	    if (!USER_RE.test(username)) {
	        errors['username_error'] = "invalid username. try just letters and numbers";
	        return false;
	    }
	    if (!PASS_RE.test(password)) {
	        errors['password_error'] = "invalid password.";
	        return false;
	    }
	    if (password !== verify) {
	        errors['verify_error'] = "password must match";
	        return false;
	    }
	    if (email !== "") {
	        if (!EMAIL_RE.test(email)) {
	            errors['email_error'] = "invalid email address";
	            return false;
	        }
	    }
	    return true;	
	}

	this.displayWelcomePage = function(req, res, next){
		if (!req.username) {
            console.log("welcome: can't identify user...redirecting to signup");
            return res.redirect("/signup");
        }

        return res.render("welcome", {'username':req.username});
	};
}

module.exports = SessionHandler;