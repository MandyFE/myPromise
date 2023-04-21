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