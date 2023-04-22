### Promise A+ 的官网
https://promisesaplus.com/#notes


### ES6 关于Promise 的介绍
https://promisesaplus.com/#notes

##### Promise.prototype上的方法
`1. Promise.prototype.then( result( ),reason( ) )`
接受两个函数，分别对fulfilled和rejected状态做处理

`2. Promise.prototype.catch( )`
对Promise 异常做处理

`3. Promist.prototype.finally( )`
接收一个函数，不管是fulfilled还是rejected 都会执行


##### Promise( )上的方法
`1. Promise.resolve()`
返回一个fulfilled的Promise对象

`2. Promise.reject()`
返回一个rejected 的Promise 对象

`3. Promise.all()`
接收一个Promise实例数组,在所有都`fulfilled`的情况下返回`fulfilled`,其中有一个`rejected`立马返回`rejected`

`4. Promise.allSettled()`
接收一个Promise实例数组,所有的Promise都的状态都变更后才会返回，返回状态固定是`fulfilled`,内容是各个实例情况的数组
```
[
   { status: 'fulfilled', value: 42 },
   { status: 'rejected', reason: -1 }
]
```


`5. Promise.any()`
接收一个Promise实例的数组,如果其中有一个实例 `fulfilled`则返回`fulfilled`,如果所有实例都返回`rejected`,才返回`rejected`,rejected的内容是一个[AggregateError](https://es6.ruanyifeng.com/#docs/object#AggregateError-%E9%94%99%E8%AF%AF%E5%AF%B9%E8%B1%A1)
