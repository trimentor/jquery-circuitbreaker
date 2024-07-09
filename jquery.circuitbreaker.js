/**
 * CircuitBreaker
 *
 * Wrap a protected function call in a circuit breaker object,
 * which monitors for failures. Once the failures reach a certain
 * threshold, the circuit breaker trips, and all further calls to
 * the circuit breaker return with an error, without the protected call
 * being made at all.
 *
 * Copyright 2018 Kjel Delaey
 * Released under the MIT license
 * https://raw.githubusercontent.com/trimentor/jquery-circuitbreaker/master/LICENSE
 */
var CircuitBreaker = function (asyncFn, options) {
  this.asyncFn = asyncFn;

  this.deferred = $.Deferred();

  this.failures = 0;

  this.options = $.extend({
    failureThreshold: 5
  }, options);
};

CircuitBreaker.prototype.fire = function () {
  var cb = this;

  if (cb.getState() === 'OPEN') cb.deferred.reject(new CircuitBreakerError());

  cb.asyncFn().done(function (result) {
    cb.failures = 0;
    cb.deferred.resolve(result);

  }).fail(function (result) {
    if (cb.getState() === 'CLOSED') {
      cb.failures += 1;
      cb.fire();
    } else {
      cb.deferred.reject(new CircuitBreakerError());
    }
  });

  return cb.deferred;
};

CircuitBreaker.prototype.getFailures = function () {
  return this.failures;
};

CircuitBreaker.prototype.getState = function () {
  return (this.getFailures() < this.getFailureThreshold()) ? 'CLOSED' : 'OPEN';
};

CircuitBreaker.prototype.getFailureThreshold = function () {
  return this.options.failureThreshold;
};

var CircuitBreakerError = function () {};
