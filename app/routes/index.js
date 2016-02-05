'use strict';

var path = process.cwd();

module.exports = function (app, passport) {

	// move to controllers
	String.prototype.replaceAll = function (find, replace) {
	    var str = this;
	    return str.replace(new RegExp(find, 'g'), replace);
	};

	function getNatural(date) {
		var naturalMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		if (isNaN(date.getDate()))
			return null;
			
		return naturalMonths[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
	}
	
	function getTimeObject(date) {
		return {
			unix: Math.floor(date.getTime() / 1000),
			natural: getNatural(date)
		};	
	}
	
	app.route('/').get(function(req, res) {
		res.sendFile(path + '/public/index.html');
	});
	
	app.route('/*').get(function(req, res) {
		var query = req.path.slice(1);
		var date, seconds; 
		
		if (/^\d+$/.test(query)) {
			seconds = query * 1000;
			date = new Date(seconds);
		} else {
			seconds = Date.parse(query.replaceAll('%20', ' '));
			date = new Date(seconds);
		}
		
		res.send(JSON.stringify(getTimeObject(date)));
	});
};
