class MyPromise{
  static PENDING = "pending";
  static REJECTED = "rejected";
  static FULFILLED = "fulfilled";

  constructor (fn) {
    this.PromiseState = MyPromise.PENDING;
    this.PromiseResult = undefined;
    this.onRejectedCallbacks = [];
    this.onFulfilledCallbacks = [];
    try {
      fn(this.resolve.bind(this), this.reject.bind(this));
    } catch (e) {
      this.reject(e);
    }
  }
  static race (promises) {
    return new Promise((resolve, reject) => {
      if (Array.isArray(promises)) {
        if (promises.length) {
          promises.forEach(item => {
            MyPromise.resolve(item).then(resolve, reject);
          })
        }
      } else {
        return reject(new TypeError('Argument is not iterable'));
      }
    })
  }

  static resolve  (value) {
     // 如果这个值是一个 promise ，那么将返回这个 promise 
     if (value instanceof MyPromise) {
         return value;
     } else if (value instanceof Object && 'then' in value) {
         // 如果这个值是thenable（即带有`"then" `方法），返回的promise会“跟随”这个thenable的对象，采用它的最终状态；
         return new MyPromise((resolve, reject) => {
           value.then(resolve, reject);
         });
     }
    
     // 否则返回的promise将以此值完成，即以此值执行`resolve()`方法 (状态为fulfilled)
     return new MyPromise((resolve) => {
       resolve(value);
     });
 }


  resolve (result) {
    if (this.PromiseState === MyPromise.PENDING) {
      this.PromiseState = MyPromise.FULFILLED;
      this.PromiseResult = result;
      this.onFulfilledCallbacks.forEach(callback => callback(result));
    }
    
  }
  
  reject (reason) {
    if (this.PromiseState === MyPromise.PENDING) {
      this.PromiseState = MyPromise.REJECTED;
      this.PromiseResult = reason;
      this.onRejectedCallbacks.forEach(callback => callback(reason));
    }
    
  }

  then (onFulfilled, onRejected) {

    const promise2 = new MyPromise((resolve, reject) => {
      if (this.PromiseState === MyPromise.PENDING) {
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              if (typeof onFulfilled !== "function") {
                resolve(this.PromiseResult);
              } else {
                let x = onFulfilled(this.PromiseResult);
                resolvePromise(promise2, x, resolve, reject);
              }
            } catch (e) {
              reject(e);
            }
            
          });
        });
         this.onRejectedCallbacks.push(() => {
           setTimeout(() => {
             try {
               if (typeof onRejected !== 'function') {
                 reject(this.PromiseResult);
               } else {
                 let x = onRejected(this.PromiseResult);
                 resolvePromise(promise2, x, resolve, reject);
               }
             } catch (e) {
               reject(e);
             }
           });
         });
      }

      if (this.PromiseState === MyPromise.FULFILLED) {
        setTimeout(() => {
          try {
            if (typeof onFulfilled !== 'function') {
              resolve(this.PromiseResult);
            } else {
              let x = onFulfilled(this.PromiseResult);
              resolvePromise(promise2, x, resolve, reject);
            }
          } catch (e) {
            reject(e);
          }
         })
        
      }

      if (this.PromiseState === MyPromise.REJECTED) {
        setTimeout(() => {
          try {
            if (typeof onRejected !== 'function') {
              reject(this.PromiseResult);
            } else { 
              let x = onRejected(this.PromiseResult);
              resolvePromise(promise2, x, resolve, reject);
            }
            
          } catch (e) {
            reject(e);
          }
        });
      }
    });

    return promise2
    
  }
}

function resolvePromise (promise, x, resolve, reject) {
  if (promise === x) throw new TypeError("Chaining cycle detected for promise");

  if (x instanceof MyPromise) {
    // 这里用resolve 还是resolvePromise?
    x.then(
      y => resolvePromise(promise, y, resolve, reject),
      r => reject(r)
    )
  }

  if (x !== null && (typeof x === 'object' || typeof x === 'function')) { 
    try {
      let then = x.then;
      if (typeof then === 'function') {
        let called = false;
        try {
          then.call(
            x,
            (y) => {
              if (called) return;
              called = true;
              resolvePromise(promise, y, resolve, reject)
            },
            (r) => {
              if (called) return;
              called = true;
              reject(r)
            }
          );
          
        } catch (e) {
           if (called) return;
           called = true;
          reject(e);
        }
      } else {
        resolve(x);
      }
      
    } catch (e) {
      reject(e); 
    }
  } else {
    resolve(x);
  }
}

MyPromise.deferred = function() {
  const res = {};
  res.promise = new MyPromise((resolve, reject) => {
    res.resolve = resolve;
    res.reject = reject;
  })
  return res;
}

module.exports = MyPromise;

