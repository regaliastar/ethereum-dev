/*
* 数据记录
* 4并行 20任务：16195 —— truffle test
* 1并行 20任务：35218
* 2并行 20任务：22115
* 4并行 20任务：32341
* */


const Web3 = require('web3')
const contractABI = require('./abi')()
const contractAddress = '0x56fa63A87c4a54265Ff22aF8717D48B2EC53883c'
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"))

const contractInstance = web3.eth.contract(contractABI).at(contractAddress)
if(web3.isConnected()){
    console.log('web3 连接成功')
}
const origanizer = '0x4e681f2221C84d4626C9220A5A51319122A0E3aD'
const participant_1 = '0x063a1895b6D14452b9D75CA0BD8C9C4684fe56b0'
let defaultAddress = origanizer
let defaultNodeIndex = 0

function consoleNodeNumber() {
    const nodeNumber = contractInstance.nodeNumber.call()
    console.log("nodeNumber: "+nodeNumber)
}

function consoleNodeAbility(address) {
    const node = contractInstance.showNode(address)
    const ability = node[1].toNumber()
    console.log("ability: "+ability)
}

function consoleNodeByAddress(address) {
    const node = contractInstance.showNode(address)
    console.log(node)
}

function consoleSuccessTaskNumber() {
    const successTaskNumber = contractInstance.successTaskNumber.call()
    const toNumber = successTaskNumber.toNumber()
    console.log('successTaskNumber', toNumber)
}

function setAbility(ability) {
    consoleNodeAbility(defaultAddress)
    contractInstance.setAbility(ability, {from: defaultAddress})
    consoleNodeAbility(defaultAddress)
}

// setAbility(100)
// consoleNodeNumber()
// consoleNodeByAddress(origanizer)
// consoleNodeAbility(origanizer)
// consoleNodeAbility(participant_1)

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

async function testTaskUnit() {
    const ability = countAbilty(10000)
    await contractInstance.setAbility(ability, {from: defaultAddress})
}

// 单元任务——计算矩阵
function execTask(){
    const k = 1000
    let arr = []
    for(let i = 0; i < k; i++){
        arr.push(Math.random())
    }
    arr.sort()
}
function init(address, NodeIndex){
    defaultAddress = address
    defaultNodeIndex = NodeIndex
    return contractInstance.init({from: defaultAddress})
}

async function connect() {
    await contractInstance.connect({from: defaultAddress})
    await testTaskUnit()
}

async function sendSuccessMsg(){
    return contractInstance.taskFinished({from: defaultAddress})
}

// 投标并获取标书（index），返回值表示是否被分配任务
// false 表示该节点为 老实节点

async function applyTask(){
    // 提交算力
    testTaskUnit()
    // 标书
    await contractInstance.better_cnp_manager(false, {from: defaultAddress})
    const nowTaskNode = await contractInstance.nowTaskNode.call()
    if(defaultNodeIndex == nowTaskNode.toNumber()){
        return true
    }
    return false
}

module.exports = async function(_address, _nodeIndex) {
    init(_address, _nodeIndex)
    await connect()
    const totalTaskNumber = 20
    let maxLoop = totalTaskNumber + 1 // 防止无限循环
    let flag = false
    let successTaskNumber = 0
    consoleSuccessTaskNumber()
    // 每一次循环都是一次请求标书
    const begin = new Date()
    while (maxLoop--){
        flag = await applyTask()
        // 表示被分配到任务
        console.log(maxLoop, flag)
        if(flag){
            //执行任务
            execTask()
            //若执行完毕，发送完毕信息
            await sendSuccessMsg()
        }

        // 终止条件
        successTaskNumber = contractInstance.successTaskNumber.call()
        if(successTaskNumber.toNumber() >= totalTaskNumber){
            break
        }
    }
    const end = new Date()
    const last_time = end - begin

    consoleSuccessTaskNumber()
    console.log("maxLoop", maxLoop)
    console.log("花费时间", last_time, 'ms')
    console.log('执行结束')
}


// consoleNodeByAddress(origanizer)
// contractInstance.setAvailableByAddr(defaultAddress, true, {from: defaultAddress})
// consoleNodeByAddress(defaultAddress)
// contractInstance.setAvailableByAddr(defaultAddress, false, {from: defaultAddress})
// consoleNodeByAddress(defaultAddress)
// consoleSuccessTaskNumber()
// contractInstance.taskFinished({from: defaultAddress})
// consoleSuccessTaskNumber()
/*
consoleNodeNumber()
consoleNodeByAddress(origanizer)
consoleNodeByAddress(defaultAddress)
applyTask()
contractInstance.setAvailableByAddr(defaultAddress, true, {from: defaultAddress})
consoleNodeByAddress(defaultAddress)
const nowTaskNode = contractInstance.nowTaskNode.call()
console.log(nowTaskNode.toNumber())
*/
