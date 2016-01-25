
function ContentHandler(db){
	"use strict";

	this.displayMainPage = function(req, res, next){

		if(!req.username){ req.username = '';}
		
		return res.render("index", {
			title : "My Home page",
			username : req.username
		});
	};
}

module.exports = ContentHandler;