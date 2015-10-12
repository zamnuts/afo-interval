var expect = require('chai').expect;

(function() {
	var exitAfter = 30*1000*50;
	var timeout = setTimeout(function() {
		throw new Error('Test run taking too long, or perhaps some interval are lingering, forcefully exiting.');
	},exitAfter);
	timeout.unref();
}());

function asyncCheck(done,func) {
	try {
		func();
		done();
	} catch ( e ) {
		done(e);
	}
}

describe('Interval',function() {
	var Interval = require('../index.js');

	var noop = function() {};
	var d = 50;

	describe('constructor',function() {
		it('should be an Interval',function() {
			expect(new Interval(noop,d)).to.be.an.instanceOf(Interval);
		});
	});

	describe('.isRunning()',function() {
		var isRunning = new Interval(noop,d).isRunning();
		it('should always return some running state',function() {
			expect(isRunning).to.exist;
		});
		it('should not be running by default',function() {
			expect(isRunning).to.equal(false);
		});
	});

	describe('.getDelay()',function() {
		it('should return the specified delay',function() {
			expect(new Interval(noop,d).getDelay()).to.equal(d);
		});
	});

	describe('.setDelay()',function() {
		it('should update the delay',function() {
			var i = new Interval(noop,d);
			var updatedDelay = d+500; // different than d
			i.setDelay(updatedDelay);
			expect(i.getDelay()).to.equal(updatedDelay);
		});
	});

	describe('.getMethod()',function() {
		it('should return the specified callback',function() {
			expect(new Interval(noop,d).getMethod()).to.equal(noop);
		});
	});

	describe('.setMethod()',function() {
		it('should update the callback',function() {
			var i = new Interval(noop,d);
			var updatedMethod = function() {}; // different func ref than noop
			i.setMethod(updatedMethod);
			expect(i.getMethod()).to.equal(updatedMethod);
		});
	});

	describe('.resume()',function() {
		it('should resume/start the interval',function(done) {
			var i = new Interval(function() {
				asyncCheck(done,function() {
					expect(i.isRunning()).to.be.true;
				});
				i.pause();
			},d);
			expect(i.resume()).to.be.true;
			expect(i.isRunning()).to.be.true;
		});
		it('should not resume with an invalid callback',function() {
			expect(new Interval(null,d).resume()).to.be.false;
		});
		it('should not resume if already running',function() {
			var i = new Interval(noop.d);
			i.resume();
			expect(i.resume()).to.be.false;
			i.pause();
		});
	});

	describe('.pause()',function() {
		it('should not pause if not running',function() {
			expect(new Interval(noop,d).pause()).to.be.false;
		});
		it('should pause if running',function() {
			var i = new Interval(noop,d);
			i.resume();
			expect(i.pause()).to.be.true;
		});
	});

	describe('.reset()',function() {
		it('should not throw during reset while paused',function() {
			var i = new Interval(noop,d);
			i.reset();
			expect(true).to.be.true;
		});
		it('should not throw during reset while running',function() {
			var i = new Interval(noop,d);
			i.resume();
			i.reset();
			i.pause();
			expect(true).to.be.true;
		});
	});

	describe('autostart',function() {
		it('should automatically start if configured (called twice)',function(done) {
			var count = 0;
			var i = new Interval(function() {
				count++;
				if ( count > 1 ) {
					asyncCheck(done,function() {
						expect(i.isRunning()).to.be.true;
					});
					i.pause();
				}
			},d,true);
			expect(i.isRunning()).to.be.true;
		});
	});

	describe('.isRefd()',function() {
		it('should be ref\'d by default',function() {
			expect(new Interval(noop,d).isRefd()).to.be.true;
		});
		it('should be unref\'d',function() {
			var i = new Interval(noop,d);
			i.unref();
			expect(i.isRefd()).to.be.false;
		});
		it('should toggle ref and unref states',function() {
			var i = new Interval(noop,d);
			i.unref();
			i.ref();
			expect(i.isRefd()).to.be.true;
		});
	});

	describe('.ref()',function() {
		it('should ref the timer',function() {
			var i = new Interval(noop,d);
			i.resume();
			i.ref();
			expect(i.isRefd()).to.be.true;
			i.pause();
		});
	});
	describe('.unref()',function() {
		it('should unref the timer',function() {
			var i = new Interval(noop,d);
			i.resume();
			i.unref();
			expect(i.isRefd()).to.be.false;
			i.pause();
		});
	});
});

