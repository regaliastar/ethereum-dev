function countAbilty(result) {
    // 快速排序算法计算
    // 计算函数执行时间并返回结果
    // ability = k/last_time
    const _v = result
    const k = 1000
    let arr = []
    const begin = new Date()
    for(let i = 0; i < _v; i++){
        arr.push(Math.random())
    }
    arr.sort()
    const end = new Date()
    const last_time = end - begin
    const r = Number.parseInt(k/last_time)
    return r
}

function f1() {
    return Promise.resolve()
            .then(v => {
                return Promise.resolve(1)
            }).then(v => {
                console.log(v)
                return 111
            })
}
function f2() {
    return Promise.resolve()
        .then(() => {
            return Promise.resolve(2)
        }).then(v => {
            console.log(v)
            return 222
        })
}
function f() {
    return Promise.resolve()
        .then(() => {
            const p1 = f1()
            const p2 = f2()
            return Promise.all([p1, p2])
        })
        .then(result => {
            console.log('************')
            console.log(result)
        })
}

function  dis() {
    const args = Array.prototype.slice.apply(arguments)
    const arr = args.map(addr => {
        return Promise.resolve()
            .then(() => {
                console.log(addr)
                return 1
            }).then(v => {
                return v
            })
    })
    return Promise.all(arr)
}
console.log(dis('a','b','c'))

/*
const p2 = f2()
const all = Promise.all([p1, p2]).then(v => {
    console.log(v)
})
console.log(all)
*/

/*
var account_one = "0x1234..."; // 一个地址
var account_two = "0xabcd..."; // 另一个地址

var meta;
MetaCoin.deployed().then(function(instance) {
  meta = instance;
  return meta.sendCoin(account_two, 10, {from: account_one});
}).then(function(result) {
  // 结果是一个具有以下值的对象：
  //
  // result.tx      => 交易的哈希，字符串。
  // result.logs    => 在此交易中触发的解码事件数组。
  // result.receipt => 交易接受的对象，包括花费的gas。

  // 我们可以对结果进行循环。查看是否触发了传输事件。
  for (var i = 0; i < result.logs.length; i++) {
    var log = result.logs[i];

    if (log.event == "Transfer") {
      // 我们发现了事件！
      break;
    }
  }
}).catch(function(err) {
  // 有一个错误！需要处理。
});
* */
