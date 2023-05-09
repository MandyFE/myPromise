// Function.prototype.bind2 = function(context) {
//   var self = this;
//   return function() {
//     self.apply(context);
//   }
// }

Function.prototype.bind2 = function(context) { 
  const self = this;// 用self绑定this,存放当前函数的this
  const args = [...arguments].slice(1);//获取除this以外的参数

  return function() {
    const restArgs = [...arguments];// 这里是指bind返回的函数传入的函数
    return self.apply(context, args.concat(restArgs));
  }
}

https://juejin.cn/post/7158009281735262239