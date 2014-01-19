
var passport = require('passport-strategy')
  , util = require('util')
  , crypto = require('crypto')



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

	var b64 = new Buffer(username+":"+password).toString('base64');

	// xxx
	// if(!username || !password) {
	//	return this.fail(new BadRequestError(options.badRequestMessage || 'Missing credentials'));
	//}
	username = username || "anonymous";
	password = password || "";

	self._verify(username, password, function(err, user, info) {
		if(error) {
			return self.error(err);
		}
		if(!user) {
			return self.fail(info);
		}
		if(username != "foo") {
			self.fail(info);
		}
		self.success();
	});

};


module.exports = Strategy;

