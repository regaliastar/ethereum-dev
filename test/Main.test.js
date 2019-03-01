const Main = artifacts.require("./Main.sol")
const Web3 = require('web3')

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
        const organizer = accounts[0]
        return Main.deployed().then(instance => {
            meta = instance
            return meta.connect() //call函数只读，不能修改存储的值
        }).then(async response => {
            const nodeNumber = await meta.nodeNumber.call()
            assert.equal(1, nodeNumber, "disconnect error!")
            return meta.showNode.call(organizer)
        }).then(response => {
            assert.equal(true, response[2], "connect error!")
            assert.equal(0, response[1], "connect error!")
            assert.equal(organizer, response[0], "connect error!")

            return meta.disconnect(organizer)
        }).then(async response => {
            const nodeNumber = await meta.nodeNumber.call()
            const node = await meta.showNode.call(participant_1)
            assert.equal(0, nodeNumber, "disconnect error!")
            assert.equal(node[0], 0x0000000000000000000000000000000000000000, "disconnect error!")
        })
    })
    
    it("test Event", function () {
        let meta = null
        const participant_1 = accounts[1]
        const organizer = accounts[0]
        return Main.deployed().then(instance => {
            meta = instance
            return meta.connect()
        }).then(event => {
            //event.receipt.logs.args 传递的数
            meta.disconnect(organizer)
            const args = event.logs[0].args
            assert.equal(args.x, 10000, "test Event Error!")
        })
    })

    it("test participants connect Event and set ability", function () {
        function testTaskCallback(result) {
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
        const participant_1 = accounts[1]
        let meta = null
        return Main.deployed().then(instance => {
            meta = instance
            return meta.connect({from: participant_1})
        }).then( async event => {
            // 测试participant_1成功connect并接收事件
            const args = event.logs[0].args
            const nodeNumber = await meta.nodeNumber.call()
            assert.equal(1, nodeNumber, "connect error!")
            const node = await meta.showNode.call(participant_1)
            assert.equal(node[0], participant_1, "connect error!")
            // 测试设置ability
            const ability = testTaskCallback(args.x)
            meta.setAbility(ability, {from: participant_1})
            const node_1 = await meta.showNode.call(participant_1)
            assert.notEqual(0, node_1[1], "connect error!")
            // console.log(JSON.stringify(node_1))
            meta.disconnect(participant_1)
        })
    })


})

