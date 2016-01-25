var bcrypt = require('bcrypt-nodejs');

/* Uer DAO must be connected to database object */
function UserDAO(db){
	"use strict";

	/* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === this instanceof UserDAO) {
        console.log('Warning: UsersDAO constructor called without "new" operator');
        return new UserDAO(db);
    }

    var users = db.collection('users');

	this.addUser = function(username, password, email, cb){
		// Generate password hash
		var salt = bcrypt.genSaltSync(),
			password_hash = bcrypt.hashSync(password, salt);

		// Create user document
		var user = { '_id' : username, 'password' : password_hash};

		// Add email if set
		if (email !== "") {
			user['email'] = email;
		}

		users.insertOne(user,function(err, result){
			if(!err){				
				return cb(null, result.ops[0]._id);
			}

			return cb(err, null);
		});
	};

	this.validateLogin = function(username, password, cb){
		
		users.findOne({'_id' : username }, function(err, user){
			if(err){ return cb(err, null);}
			
			if(user){
				if(bcrypt.compareSync(password, user.password)){
					cb(null, user._id);
				}else{
					var invalid_password_error = new Error("Invalid password");
                    // Set an extra field so we can distinguish this from a db error
                    invalid_password_error.invalid_password = true;
                    cb(invalid_password_error, null);
				}
			}else{
				var no_such_user_error = new Error("User: " + user._id + " does not exist");
                // Set an extra field so we can distinguish this from a db error
                no_such_user_error.no_such_user = true;
                cb(no_such_user_error, null);
			}
		});
	};
}

module.exports.UserDAO = UserDAO;