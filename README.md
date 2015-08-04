# AngularJS Promise Queuer

Decorates the $q service which will add a #queue method. Adding to the queue will start promises sequentially

Promises are chained by their ability to promise a result or reject.

### Usage:

Assuming '$q' is in the params of the function for the injector.

```javascript

var deferedPromise = $q.defer();

var task = {
   success: function(data){
       deferedPromise.resolve({data: 'data'});
       return deferedPromise.promise;
   },
   fail: function(reason){
      // Depending on whether you'll want to queue to break if a promise is rejected
      //deferedPromise.reject({data: 'data'});
      //deferedPromise.resolve({data: 'data'});
      return deferedPromise.promise;
   }
}

// Placing the queue in will link it to the previous promise.
$q.queue('queue-identifier', task);

return deferedPromise.promise;  

```

Reference:
 * [codeducky](http://www.codeducky.org/q-serial/) The code was based on codeduckys implementation of $q.serial()
