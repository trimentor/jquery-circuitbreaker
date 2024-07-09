# jquery-circuitbreaker
Detect failures and encapsulate the logic of preventing a failure from constantly recurring

## Usage
```js
var remoteFn = function () {
  return $.ajax({
    url: '/api/might-fail',
    timeout: 3000
  });
};

var circuitBreaker = new CircuitBreaker(remoteFn, {
  failureThreshold: 3 // Default "5"
});

circuitBreaker.fire().done(function () {
  // Happy path
  console.log('Circuit closed!');
}).fail(function (error) {
  // Unhappy path
  console.log('Circuit open!');
});
```
