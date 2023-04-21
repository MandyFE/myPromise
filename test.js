const MyPromise = require("./myPromise") ;
const p1 = new MyPromise(function (resolve, reject) {
  resolve('p1');
});
const p2 = new MyPromise(function (resolve, reject) {
  resolve('p1');
});
const p3 = new MyPromise(function (resolve, reject) {
  reject('p3');
});

const a = MyPromise.race([p3, p2, p1]);
a.then(
  (res) => {
    console.log(res);
  },
  (e) => {
    console.log('err', e);
  }
);