var crypto = require("crypto");

function SessionDAO(db){
	"use strict";


	/* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
     if (false === this instanceof SessionDAO ){
     	console.log("Warning: SessionDAO constructor called without 'new' operator");
     }

     var sessions = db.collection("sessions");

     this.getUsername = function(session_id, cb){
     	if(!session_id){
     		cb("Session not set", null);
     		return;
     	}

     	sessions.findOne({ '_id' : session_id}, function(err, session){

     		if(!session){
     			cb( new Error("Session" + session + "does not exist"), null);
     			return;
     		}

     		cb(null, session.username);
     	});
     };

     this.startSession = function(username, cb){
          // Generate
          var current_date = (new Date()).valueOf().toString();
          var random = Math.random.toString();
          var session_id = crypto.createHash('sha1').update(current_date + random).digest('hex');
          // Create session document
          var session = { 'username' : username, '_id' : session_id};
          // Insert session document
          sessions.insert(session, function(err, result){
               if(err){ throw err;}

               cb(err, session_id);          
          });
     };

     this.endSession = function(session_id, cb){
          // Remove session document
          sessions.remove({ '_id' : session_id}, function(err, numRemoved){
               if(err){ throw err;}

               cb(err);
          });
     };
}

module.exports.SessionDAO = SessionDAO;