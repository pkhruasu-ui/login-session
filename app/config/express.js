var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

/**
 * Express setup initialization
 * @param app
 */
module.exports = function expressConfigFacotry(app){

    var rootPath = app.get( 'rooPath' );

	app.set('views', './app/views');

    app.engine('html', require('ejs').renderFile);

    app.set('view engine', 'html');
    
    app.use(cookieParser());
	app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    // app.use(express.static(rootPath + config.get( 'express.static' )));    
    app.use(express["static"](rootPath + '/public'));  //workaround jshint idiotic warning    
};