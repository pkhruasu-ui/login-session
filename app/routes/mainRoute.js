var SessionHandler = require("../controllers/session"),
	ContentHandler = require("../controllers/content"),
	ErrorHandler = require("../controllers/error").errorHandler;


module.exports = function(app, db){

	var contentHandler = new ContentHandler(db);
	var sessionHandler = new SessionHandler(db);
	
	app.use(sessionHandler.isLoggedInMiddleware);
	app.get('/', contentHandler.displayMainPage);
	
	app.route('/signup')
		.get(sessionHandler.getSignup)
		.post(sessionHandler.postSignup);

	app.route('/login')
		.get(sessionHandler.displayLoginPage)
		.post(sessionHandler.handleLoginRequest);

	app.get('/logout', sessionHandler.displayLogoutPage);

	app.get('/welcome', sessionHandler.displayWelcomePage);

	app.use(ErrorHandler);	
};