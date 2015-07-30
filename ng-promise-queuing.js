angular.module('app.providers.$q.queuing', [])
.config(function ($provide) {
  $provide.decorator("$q", function ($delegate) {
     //Helper method copied from q.js.
    var _isPromiseLike = function (obj) { return obj && angular.isFunction(obj.then); }

    var _queue = function(queue, value){
      if( typeof(value) != 'undefined') $delegate.queues[queue] = value;
      return $delegate.queues[queue];
    }

    var _promiseError = function(promise){
      if (!_isPromiseLike(promise)) throw new Error("Task did not return a promise.");
    }

    $delegate.queues = {};

    $delegate.queue = function(queue, task){

      var prevPromise = _queue(queue);
      var success     = task.success || task;
      var fail        = task.fail;
      var notify      = task.notify;
      var nextPromise;


      if (!prevPromise) {
        nextPromise = success();
        _promiseError(nextPromise);
      } else {
        // Wait until the previous promise has resolved or rejected
        nextPromise = prevPromise.then(
          // SUCCESS
          function (data) {
            if (!success) { return data; }
            var ret = success(data);
            _promiseError(nextPromise);
            return ret;
          },
          // FAILTURE 
          function (reason) {
            if (!fail) { return $delegate.reject(reason); }
            var ret = fail(reason);
            _promiseError(nextPromise);
            return ret;
          },
        notify
        );
      }

      _queue(queue, nextPromise);

      return prevPromise || $delegate.when();
    }

    return $delegate;
  });
});