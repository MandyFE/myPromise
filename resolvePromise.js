const myPromise = require("./myPromise");

function resolvePromise(promise, x, resolve, reject) {
  //2.3.1 If promise and x refer to the same object, reject promise with a TypeError as the reason.
  if (promise === x)
    throw new TypeError('Chaining cycle detected for promise');

  // 2.3.2 If x is a promise, adopt its state
  if (x instanceof myPromise) {
    // 2.3.2.1 If x is pending, promise must remain pending until x is fulfilled or rejected.
    // 2.3.2.2 If/when x is fulfilled, fulfill promise with the same value.
    // 2.3.2.3 If x is rejected, reject promise with the same reason.
    x.then(y => {
      resolvePromise(promise, y, resolve, reject);
    }, e => reject(e));
    // 2.3.3 Otherwise, if x is an object or function,
  } else if (x !== null && (typeof x === "object" || typeof x === "function")) {
    try {
      let then = x.then;

      if (typeof then === "function") {
        let called = false;
        try {
          then.call(
            x,
            y => {
              if (called) return;
              called = true;
              resolvePromise(promise, y, resolve, reject);
            },
            r => {
              if (called) return;
              called = true;
              reject(r)
             }
          )
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