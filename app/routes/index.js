'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');

module.exports = function (app, passport) {

	String.prototype.replaceAll = function (find, replace) {
	    var str = this;
	    return str.replace(new RegExp(find, 'g'), replace);
	};

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	function getNatural(date) {
		var naturalMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		return naturalMonths[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
	}
	
	function getTimeObject(date) {
		return {
			unix: Math.floor(date.getTime() / 1000),
			natural: getNatural(date)
		};	
	}
	
	var clickHandler = new ClickHandler();

	// app.route('/')
	// 	.get(isLoggedIn, function (req, res) {
	// 		res.sendFile(path + '/public/index.html');
	// 	});
	
	app.route('/').get(function(req, res) {
		res.send('Hi guy! Send date via url, f.ex.:<br>' +
		'https://timestamp-ms.herokuapp.com/December%2015,%202015<br>' +
		'https://timestamp-ms.herokuapp.com/1450137600<br>' +
		'https://free-code-camp-back-end-clementine-paweljarema.c9users.io/December%2015,%202015<br>' +
		'https://free-code-camp-back-end-clementine-paweljarema.c9users.io/1450137600');
	});
	
	app.route('/*').get(function(req, res) {
		var query = req.path.slice(1);
		var date; 
		
		if (/^\d+$/.test(query)) {
			var seconds = query * 1000
			date = new Date(seconds);
		} else {
			var seconds = Date.parse(query.replaceAll('%20', ' '));
			date = new Date(seconds);
		}
		
		res.send(JSON.stringify(getTimeObject(date)));
	});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});

	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

	app.route('/api/:id/clicks')
		.get(isLoggedIn, clickHandler.getClicks)
		.post(isLoggedIn, clickHandler.addClick)
		.delete(isLoggedIn, clickHandler.resetClicks);
		
};
