
var passport = require('passport-strategy')
  , util = require('util');
  , crypto = require('crypto');



function Strategy(options) {

	var self = this;

	options = options || {}

	// xxx check 
	self._apiID = options.apiID;
	self._apiSecret = options.apiSecret;

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


	this.pass();

};


module.exports = Strategy;

