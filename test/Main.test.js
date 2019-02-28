const Main = artifacts.require("./Main.sol")

contract("Main", accounts => {
    it("initial constructor", function () {
        let meta = null
        const organizer = accounts[0]
        return Main.deployed().then(instance => {
            meta = instance
            return meta.nodeNumber.call()
        }).then(response => {
            assert.equal(1, response, "initial constructor error!")
            return meta.showNode.call(organizer)
        }).then(response => {
            assert.equal(true, response[2], "initial constructor error!")
            assert.equal(0, response[1], "initial constructor error!")
            assert.equal(organizer, response[0], "initial constructor error!")
        })
    })

    it("connect and disconnect", function () {
        let meta = null
        const participant_1 = accounts[1]
        return Main.deployed().then(instance => {
            meta = instance
            return meta.connect(participant_1) //call函数只读，不能修改存储的值
        }).then(async response => {
            const nodeNumber = await meta.nodeNumber.call()
            assert.equal(2, nodeNumber, "disconnect error!")
            return meta.showNode.call(participant_1)
        }).then(response => {
            assert.equal(true, response[2], "connect error!")
            assert.equal(0, response[1], "connect error!")
            assert.equal(participant_1, response[0], "connect error!")

            return meta.disconnect(participant_1)
        }).then(async response => {
            const nodeNumber = await meta.nodeNumber.call()
            const node = await meta.showNode.call(participant_1)
            assert.equal(1, nodeNumber, "disconnect error!")
            assert.equal(node[0], 0x0000000000000000000000000000000000000000, "disconnect error!")
        })
    })
    
    it("test Event", function () {
        let meta = null
        const participant_1 = accounts[1]
        return Main.deployed().then(instance => {
            meta = instance
            return meta.connect(participant_1)
        }).then(event => {
            //event.receipt.logs.args 传递的数
            const args = event.logs[0].args
            console.log(args.x.toString())
            assert.equal(args.x, 10000, "test Event Error!")
        })
    })

})


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