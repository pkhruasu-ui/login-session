//Error handling middleware

exports.errorHandler = function(err, req, res, next){
	"use strict";

	console.log(err.message);
	console.log(err.stack);
	res.status(500);
	res.render("error_template", { error : err});
};