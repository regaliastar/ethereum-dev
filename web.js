/*
* 数据记录
* date: 2019/3/23
* 4并行 20任务：19195 —— truffle test
*
* 实验一（4并行，（false, true）vs（true, true））：
* 50任务 不优化，老实节点(false, true)：55094
* 50任务   优化，老实节点(true, true)：54932
* 100任务 不优化，老实节点(false, true)：104914
* 100任务   优化，老实节点(true, true)：99941
* 150任务 不优化，老实节点(false, true)：158476
* 150任务   优化，老实节点(true, true)：156932
* 200任务 不优化，老实节点(false, true)：203867
* 200任务   优化，老实节点(true, true)：201743
*
* 实验二（4并行，（false, false）vs（true, false））：
* 只修改两个诚实节点，两个欺骗节点
* 50任务 不优化，欺骗节点(false, false)：56726
* 50任务   优化，欺骗节点(true, false)：55412
* 100任务 不优化，欺骗节点(false, false)：117421
* 100任务   优化，欺骗节点(true, false)：114597
* 150任务 不优化，欺骗节点(false, false)：173741
* 150任务   优化，欺骗节点(true, false)： 163948
* 200任务 不优化，欺骗节点(false, false)：236907
* 200任务   优化，欺骗节点(true, false)：220110
*
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

function consoleTotalTaskNumber() {
    const totalTaskNumber = contractInstance.totalTaskNumber.call()
    const toNumber = totalTaskNumber.toNumber()
    console.log('totalTaskNumber', toNumber)
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

async function testTaskUnit(_manager_flag, _contractor_flag) {
    let ability = countAbilty(10000)
    if(!_contractor_flag){
        ability = ability * 100
    }
    await contractInstance.setAbility(ability, _manager_flag, {from: defaultAddress})
}

// 单元任务——快速排序
function execTask(){
    const k = 1000
    let arr = []
    for(let i = 0; i < k; i++){
        arr.push(Math.random())
    }
    arr.sort()
}
function init(_address, _nodeIndex){
    defaultAddress = _address
    defaultNodeIndex = _nodeIndex
    return contractInstance.init({from: defaultAddress})
}

async function connect(_manager_flag, _contractor_flag) {
    await contractInstance.connect({from: defaultAddress})
    await testTaskUnit(_manager_flag, _contractor_flag)
}

async function sendSuccessMsg(){
    return contractInstance.taskFinished({from: defaultAddress})
}

// 投标并获取标书（index），返回值表示是否被分配任务
// _manager_flag => true 表示优化 cnp
// _contractor_flag => true 表示 老实节点

async function applyTask(_manager_flag, _contractor_flag){
    // 提交算力
    testTaskUnit(_manager_flag, _contractor_flag)
    // 标书
    await contractInstance.better_cnp_manager(_manager_flag, {from: defaultAddress})
    const nowTaskNode = await contractInstance.nowTaskNode.call()
    if(defaultNodeIndex == nowTaskNode.toNumber()){
        return true
    }
    return false
}

module.exports = async function(_address, _nodeIndex, _manager_flag, _contractor_flag) {
    init(_address, _nodeIndex)
    await connect(_manager_flag, _contractor_flag)
    const totalTaskNumber = 100
    let maxLoop = totalTaskNumber + 1 // 防止无限循环
    let flag = false
    let successTaskNumber = 0
    consoleTotalTaskNumber()
    consoleSuccessTaskNumber()
    // 每一次循环都是一次请求标书
    const begin = new Date()
    while (maxLoop--){
        flag = await applyTask(_manager_flag, _contractor_flag)
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
    consoleTotalTaskNumber()
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
