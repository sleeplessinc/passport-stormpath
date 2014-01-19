
var util = require('util')
var https = require("https")
var passport = require('passport-strategy')
var Stormpath = require("sleepless-stormpath")



function Strategy(opts, verify) {

	var self = this;

	opts = opts || {};
	if (typeof opts === 'function') {
		verify = opts;
		opts = {};
	}

	passport.Strategy.call(self);
	self.name = 'stormpath';

	// xxx check 
	self.opts = opts;
	self._verify = verify;
	self._usernameField = opts.usernameField || 'username';
	self._passwordField = opts.passwordField || 'password';

	self.sp = new Stormpath(opts.apiID, opts.apiSecret);
	self.spapp = null;
}


util.inherits(Strategy, passport.Strategy);


Strategy.prototype.authenticate = function(req, opts) {

	var self = this;

	function lookup(obj, field) {
		if (!obj) { return null; }
		var chain = field.split(']').join('').split('[');
		for (var i = 0, len = chain.length; i < len; i++) {
			var prop = obj[chain[i]];
			if (typeof(prop) === 'undefined') { return null; }
			if (typeof(prop) !== 'object') { return prop; }
			obj = prop;
		}
		return null;
	}

	opts = opts || {};
	var username = lookup(req.body, self._usernameField) || lookup(req.query, self._usernameField);
	var password = lookup(req.body, self._passwordField) || lookup(req.query, self._passwordField);
  
	var sp = self.sp;
	(function(cb) {
		if(self.app) {
			cb(null, self.app);
		}
		else {
			sp.getApplication(self.opts.appID, function(err, app) {
				cb(err, app);
			});
		}
	})(function(err, app) {
		if (err) { return self.error(err); }
		sp.authenticateAccount(app, username, password, function(err, user) {
			//if (err) { return self.error(err); }
			if (!user) { return self.fail(null); }
			user.displayName = user.fullName;
			self._verify(user.href, user, function(err, user, info) {
				self.success(user, null);
			});
		});
	});
  
};


module.exports = Strategy;

