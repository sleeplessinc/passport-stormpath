
var passport = require('passport-strategy')
  , util = require('util')
  , crypto = require('crypto')
  , https = require("https")



function Strategy(options, verify) {

	var self = this;

	options = options || {};

	if (typeof options === 'function') {
		verify = options;
		options = {};
	}

	if (!verify) {
		throw new Error('stormpath authentication strategy requires a verify function');
	}
	self._verify = verify;

	// xxx check 
	self._apiID = options.apiID || "";
	self._apiSecret = options.apiSecret || "";

	passport.Strategy.call(this);
	self.name = 'stormpath';

}


util.inherits(Strategy, passport.Strategy);


Strategy.prototype.authenticate = function(username, password, cb) {

	var self = this;

	username = username || "anonymous";
	password = password || "";

	var userpass = username + ':' + password;

	//var b64 = new Buffer(username+":"+password).toString('base64');
	var options = {
		host: 'api.stormpath.com',
		path: '/v1',
		method: "POST",
		auth: userpass
	};

	var post = function(options, cb) {

		var req = https.request(options, function(res){
			res.setEncoding("utf8");

			var body = "";
			res.on("data", function(chunk) {
				body += chunk;
			});
			res.on("end", function() {
				cb(body);
			});
			req.end();
		});

	}

	post(options, function(json) {

		var job = j2o(json);	// xxx 
		log(3, I(job));

		var id = sha1(userpass + salt);

		var profile = {
			displayName: "Mr. Someone",
		};

		self._verify(id, profile, function(err, user, info) {
			if(err) {
				return self.error(err);
			}
			if(!user) {
				return self.fail(info);
			}
			if(username != "foo") {
				self.fail(info);
			}
			self.success(user, info);
		});

	});

};


module.exports = Strategy;

