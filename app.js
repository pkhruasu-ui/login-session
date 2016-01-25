var express = require('express'), 
	app = express(), 
	MongoClient = require("mongodb").MongoClient;

MongoClient.connect('mongodb://localhost:27017/login', function(err, db){
	"use strict";
	if(err){ throw err;}

	app.set("rooPath", __dirname);

	require('./app/config/express')(app);
	require('./app/routes/mainRoute')(app,db);

	app.listen(80,function(){
		console.log("app listen at localhost:80");
	});
});