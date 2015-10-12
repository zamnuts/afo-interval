var Interval;

module.exports = Interval = function(method,delay,autostart) {
	if ( typeof autostart === 'undefined' ) {
		autostart = false;
	}
	this._method = method;
	this._delay = delay;
	this._timer = null;
	this._refd = true; // nodejs timers are ref'd by default
	if ( autostart ) {
		this._method();
		this.resume();
	}
};

Interval.prototype.resume = function() {
	if ( this.isRunning() ) {
		return false;
	}
	if ( !this._method ) {
		return false;
	}
	this._timer = setInterval(this._method,this._delay);
	if ( this._refd ) {
		this.ref();
	} else {
		this.unref();
	}
	return true;
};

Interval.prototype.pause = function() {
	if ( this.isRunning() ) {
		clearInterval(this._timer);
		this._timer = null;
		return true;
	}
	return false;
};

Interval.prototype.reset = function() {
	if ( this.isRunning() ) {
		this.pause();
		this.resume();
	}
};

Interval.prototype.isRunning = function() {
	return !!this._timer;
};

Interval.prototype.getDelay = function() {
	return this._delay;
};

Interval.prototype.setDelay = function(delay) {
	this._delay = delay;
	this.reset();
};

Interval.prototype.getMethod = function() {
	return this._method;
};

Interval.prototype.setMethod = function(method) {
	this._method = method;
	this.reset();
};

Interval.prototype.ref = function() {
	if ( this._timer ) {
		this._timer.ref();
	}
	this._refd = true;
};

Interval.prototype.unref = function() {
	if ( this._timer ) {
		this._timer.unref();
	}
	this._refd = false;
};

Interval.prototype.isRefd = function() {
	return this._refd;
};
