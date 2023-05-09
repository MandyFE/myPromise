// // async 函数可能包含0个或者多个await 表达式。await表达式会暂停整个async函数的执行进程并出让其控制权，只有当其等待的基于Promise的异步操作被兑现或者拒绝之后才会恢复进程。promise的解决值会被当作该await表达式的返回值，使用async/await 关键字就可以在异步代码中使用普通try/catch 代码块。

// // await 关键字只在async 函数内有效。如果你在async函数体之外使用它，就会抛出语法错误

// async function foo() {
//    const p1 = new Promise((resolve) => setTimeout(() => resolve('1'), 1000))
//    const p2 = new Promise((_,reject) => setTimeout(() => reject('2'), 500))
//   const results = [await p1, await p2] // 不推荐使用这种方式，请使用 Promise.all或者Promise.allSettled 
//   return results
// }

// console.log(foo().catch((err) => console.error(err)));
// // foo().catch(() => {}) // 捕捉所有的错误...

   function timeoutPromise(interval) {
        return new Promise((resolve, reject) => {
          setTimeout(function(){
            resolve("done");
          }, interval);
        });
      };

      async function timeTest() {
        const timeoutPromise1 = timeoutPromise(3000);
        const timeoutPromise2 = timeoutPromise(3000);
        const timeoutPromise3 = timeoutPromise(3000);

        await timeoutPromise1;
        await timeoutPromise2;
        await timeoutPromise3;
      }

      let startTime = Date.now();
timeTest().then((res) => {
  console.log('timeTest', res);
        let finishTime = Date.now();
        let timeTaken = finishTime - startTime;
        console.log("Time taken in milliseconds: " + timeTaken);
      })



      //   function timeoutPromise(interval) {
      //   return new Promise((resolve, reject) => {
      //     setTimeout(function(){
      //       resolve("done");
      //     }, interval);
      //   });
      // };

      // async function timeTest() {
      //   await timeoutPromise(3000);
      //   await timeoutPromise(3000);
      //   await timeoutPromise(3000);
      // }

      // let startTime = Date.now();
      // timeTest().then(() => {
      //   let finishTime = Date.now();
      //   let timeTaken = finishTime - startTime;
      //   console.log("Time taken in milliseconds: " + timeTaken);
      // })
