const Web3 = require('web3')

function connect() {
    //默认http://localhost:7545
    let  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"))
    console.log("连接成功！！")
    return web3
}

function initInstance(web3) {
    const contractAddress = '0xfCD5316c595373388e5F160f1A27f1D54C7ce61b'
    // JSON压缩 http://www.bejson.com/zhuanyi/
    const contractABI = [{"constant":true,"inputs":[],"name":"nodeNumber","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x335e2e5e"},{"constant":true,"inputs":[],"name":"organizer","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x61203265"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"Nodes","outputs":[{"name":"addr","type":"address"},{"name":"ability","type":"uint256"},{"name":"available","type":"bool"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xa83733a4"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor","signature":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"x","type":"uint256"}],"name":"testTask","type":"event","signature":"0x3d2133d0478c237f144822ed1fdc7d517306b68c702018423a0b8f6f3cf6011c"},{"anonymous":false,"inputs":[{"indexed":false,"name":"addr","type":"address"},{"indexed":false,"name":"x","type":"uint256[3]"},{"indexed":false,"name":"y","type":"uint256[3]"}],"name":"execMatrixMulitTask","type":"event","signature":"0x32b7339e8a88c4c76f10176da83fb6b3a36d8bda5b1db99c2c1fce7eecf99093"},{"constant":true,"inputs":[{"name":"addr","type":"address"}],"name":"showNode","outputs":[{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xd76837d2"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"connect","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xee8f931b"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"disconnect","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xcbf24339"},{"constant":false,"inputs":[{"name":"ability","type":"uint256"}],"name":"setAbility","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x0a5644df"}]
    const contractInstance = web3.eth.contract(contractABI).at(contractAddress)
    return contractInstance
}

function consoleNodeNumber(contractInstance) {
    const nodeNumber = contractInstance.nodeNumber.call()
    console.log("nodeNumber: "+nodeNumber)
}

function consoleNode(contractInstance, addr) {
    console.log('*** consoleNode ***')
    let node = contractInstance.showNode(addr)
    console.log(JSON.stringify(node))
}

function testTaskCallback(result) {
    console.log('*** testTaskCallback ***')
    // 计算函数执行时间并返回结果
    const _v = result
    let arr = []
    const begin = new Date()
    for(let i = 0; i < _v; i++){
        arr.push(Math.random())
    }
    arr.sort()
    const end = new Date()
    return end - begin
}
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
console.log(testTaskCallback(10000))