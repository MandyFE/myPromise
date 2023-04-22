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

  //将给定的一个值转换成Promise对象
  static resolve (value) {
    // 如果这个值是一个promise,直接返回这个promise
    if (value instanceof MyPromise) {
      return value
    } else if (value instanceof Object && 'then' in value) {
      // 如果这个值是thenable(即带有then方法),返回的promise会跟随这个thenable对象,采用它的最终状态
      return new MyPromise((resolve, reject) => {
        if (typeof value.then === 'function') {
          value.then(resolve, reject);
        } else {
          // then 属性可能不是函数，针对这种情况，官方Promise直接把整个对象resolve
          resolve(value);
        }
      })
    }
    //否则返回的promise将以此值完成，即以此值执行resolve方法
    return new MyPromise((resolve) => {
      resolve(value);
    })
  }

  /**
   * @description: Promise.reject
   * @param {*} 拒绝的原因
   * @return {*} 带有拒绝原因的promise对象
   */
  static reject (reason) {
    return new Promise((undefined, reject) => {
      reject(reason);
    })
  }

  /**
   * @description: 
   * @param {*} 参数是一个数组,如果元素不是Promise实例,先转成Promise实例
   * @return {*} resolve promise[] 或者一个reject的promise
   */  
  static all (promises) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        throw new TypeError("object is not iterable");
      } else {
        const res = [];
        const len = promises.length;
        if (len === 0) resolve(promises);

        promises.forEach((item) => {
          MyPromise.resolve(item).then((result) => {
            res.push(result);
            if (res.length === len) {
              resolve(res);
            }
          },reason => reject(reason));
        });
      }
    })
  }

  /**
   * @description: 参数是一个数组，结果值由最先fulfilled或者rejected 的来定
   * @param {*}数组
   * @return {*} promise
   */  
  static race (promises) {
    const len = promises.length;
    return new MyPromise((resolve, reject) => {
      if (len === 0) resolve(promises);
      
      if (!Array.isArray(promises)) {
        const err = new TypeError("object is not iterable");
        throw err;
      } else {
        promises.forEach((item) => { 
          MyPromise.resolve(item).then(
            result => resolve(result),
            reason => reject(reason)
          )
        })
      }
   })
  }

  /**
   * @description: 等所有的promise都有结果了才返回,结果的状态只可能是fulfilled
   * @param {*} promise[]
   * @return {*} promise对象
   */  
  static allSettled (promises) {
    if (!Array.isArray(promises)) { 
      const err = new TypeError("object is not iterable");
      throw err;
    } else {
      const res = [];
      const len = promises.length;
      
      return new Promise((resolve, reject) => { 
        if (len === 0) resolve(promises);
        promises.forEach(item => {
          MyPromise.resolve(item).then(
            result => { 
              res.push({ status: "fulfilled", value: result });
              res.length === len && resolve(res);
            }, reason => {
              res.push({ status: 'rejected', reason: reason });
              res.length === len && resolve(res);
            })
        })
      })
    }
  }

  /**
   * @description: 有一个fulfilled就返回fulfilled,都rejected才返回rejected
   * @param {*} promise[]
   * @return {*} promise
   */  
  static any (promises) {
    if (!Array.isArray(promises)) {
      const err = new TypeError("object is not iterable");
      throw err;
    } else {
      return new Promise((resolve, reject) => { 
        const len = promises.length;
        const errors = [];
        if (len === 0) resolve(promises);
        promises.forEach(item => {
          MyPromise.resolve(item).then(result => {
            resolve(result);
          }, reason => {
            errors.push(reason);
            errors.length == len && reject(new AggregateError(errors));
          })
        })
      })
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

  catch (onRejected) {
    return this.then(undefined,onRejected);
  }

  /**
   * @description: 由于无法知道promise的最终状态，所以finally 的回调函数中不接受任何参数，它仅适用于最终结果如何都要执行的情况
   * @param {*} function cb()
   */  
  finally (callback) {
    this.then(callback,callback)
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

