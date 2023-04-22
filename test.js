const MyPromise = require("./myPromise");

// const p1 = new MyPromise(function (resolve, reject) {
//   resolve('p1');
// });
// const p2 = new MyPromise(function (resolve, reject) {
//   resolve('p1');
// });
// const p3 = new MyPromise(function (resolve, reject) {
//   reject('p3');
// });

// const a = MyPromise.race([p3, p2, p1]);
// a.then(
//   (res) => {
//     console.log(res);
//   },
//   (e) => {
//     console.log('err', e);
//   }
// );

// ### 测试Promise.resolve()
// const resolve1 = MyPromise.resolve(123);
// console.log('resolve的值是基础类型:', resolve1,'\n');

// const resolve2 = MyPromise.resolve({
//   then: 124 }
// );
// console.log('resolve的值是有then属性的对象:', resolve2, '\n');

// const resolve3 = MyPromise.resolve({
//   then: function() { return 123} }
// );
// console.log('resolve的值是有then属性的对象,then是个普通函数:', resolve3, '\n');

// const resolve4 = MyPromise.resolve({
//   then: function(resolve) { resolve(123)} }
// );
// console.log('resolve的值是有then属性的对象,then里面调用了resolve:', resolve4, '\n');

// const resolve5 = MyPromise.resolve({
//   then: function(undefined,reject) { reject(123)} }
// );
// console.log('resolve的值是有then属性的对象,then里面调用了reject:', resolve5, '\n');

// // ### 测试Promise.reject()
// const reject1 = MyPromise.reject('123');
// console.log('reject的内容是基本类型:', reject1, '\n');

// const reject2 = MyPromise.reject({a:123});
// console.log('reject的内容是对象:', reject2, '\n');

// const reject3 = MyPromise.reject(new Error("reject的内容是Error"));
// console.log('reject的内容是Error:', reject3, '\n');

// const reject4 = MyPromise.reject(MyPromise.reject('123'));
// console.log('reject的内容是Promise.reject:', reject4, '\n');

// ### 测试catch
// const catch1 = new MyPromise((resolve, reject) => {
//   resolve('catch1')
// })
// catch1.then(resolve => {
//   return resolve;
// }).then(res => {
//   console.log('catch1的第二次then:',res)
// }).then(r => {
//   console.log('catch1的第三次then:', r);
//   throw '123'
// }).catch(err => {
//   console.log('catch1 catch:',err)
// })

// ### 测试finally
// resolve 的值是 undefined
// const finally1 = MyPromise.resolve(2).then(
//   () => {},
//   () => {}
// );
// console.log('finally1', finally1);

// // resolve 的值是 2
// const finally2 = MyPromise.resolve(2).finally(() => {});
// console.log('finally2', finally2);

// // reject 的值是 undefined
// const finally3 = MyPromise.reject(3).then(
//   () => {},
//   () => {}
// );
// console.log('finally3', finally3);

// // reject 的值是 3
// const finally4 = MyPromise.reject(3).finally(() => {console.log(1)});
// console.log('finally4', finally4);

// ### 测试Promise.all()

// const promise1 = MyPromise.resolve(3);
// const promise2 = 42;
// const promise3 = new MyPromise((resolve, reject) => {
//     setTimeout(resolve, 100, 'foo');
// });

// MyPromise.all([promise1, promise2, promise3]).then((values) => {
//   console.log(values);
// }, err => {
//   console.log(err);
// })
// expected output: Array [3, 42, "foo"]

// ### 测试Promise.allSettled()
// const promise1 = MyPromise.resolve(3);
// const promise2 = 1;
// const promises = [promise1, promise2];

// MyPromise.allSettled(promises).then((results) =>
//   results.forEach((result) => console.log(result))
// );

// setTimeout(() => {
//     const p1 = MyPromise.resolve(3);
//     const p2 = new MyPromise((resolve, reject) =>
//       setTimeout(reject, 100, 'foo')
//     );
//     const ps = [p1, p2];

//     MyPromise.allSettled(ps).then((results) =>
//       results.forEach((result) => console.log(result))
//     );
// }, 1000);

// MyPromise.allSettled([]).then((results) => console.log(results));



/**
 * 验证Promise.any()方法
 */

// console.log(new AggregateError('All promises were rejected'));

MyPromise.any([]).catch((e) => {
  console.log(e);
});

const pErr = new MyPromise((resolve, reject) => {
  reject('总是失败');
});

const pSlow = new MyPromise((resolve, reject) => {
  setTimeout(resolve, 500, '最终完成');
});

const pFast = new MyPromise((resolve, reject) => {
  setTimeout(resolve, 100, '很快完成');
});

MyPromise.any([pErr, pSlow, pFast]).then((value) => {
  console.log(value);
  // 期望输出: "很快完成"
});

const pErr1 = new MyPromise((resolve, reject) => {
  reject('总是失败');
});

const pErr2 = new MyPromise((resolve, reject) => {
  reject('总是失败');
});

const pErr3 = new MyPromise((resolve, reject) => {
  reject('总是失败');
});

MyPromise.any([pErr1, pErr2, pErr3]).catch((e) => {
  console.log(e);
});

