const Web3 = require('web3')

function connect() {
    //默认http://localhost:7545
    let  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
    if(!web3.isConnected()) {
        console.log("连接失败！！")
    } else {
        console.log("连接成功！！")
    }
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
    console.log(JSON.stringify(result))
    const _v = result[1]
    let arr = []
    const begin = new Date()
    for(let i = 0; i < _v; i++){
        arr.push(Math.random())
    }
    arr.sort()
    const end = new Date()
    return end - begin
}

const web3 = connect()
//将第一个账户作为默认账户
web3.eth.defaultAccount = web3.eth.accounts[1]
const contractInstance = initInstance(web3)

contractInstance.disconnect(web3.eth.defaultAccount)
consoleNodeNumber(contractInstance)
contractInstance.connect(web3.eth.defaultAccount)
consoleNodeNumber(contractInstance)
//监听测试任务事件
contractInstance.events.testTask().on("data", function (event) {
    if(err){
        console.error(err)
    }
    const ability = testTaskCallback(result)
    contractInstance.setAbility(ability)
    consoleNode()
})