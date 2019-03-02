const Main = artifacts.require("./Main.sol")

contract("Main.basic", accounts => {
    function disconnectAll(){
        const args = Array.prototype.slice.apply(arguments)
        const meta =args.pop()
        console.log('length:'+args.length)
        const arr = args.map(addr => {
            return Promise.resolve()
                .then(() => {
                    return meta.disconnect(addr, {from: addr})
                }).then(v => {
                    return v
                })
        })
        return Promise.all(arr)
    }
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
    function testTaskUnit(meta, address) {
        return Promise.resolve()
            .then(() => {
                return meta.connect({from: address})
            }).then( async event => {
                //接收event
                const args = event.logs[0].args
                const ability = countAbilty(args.x)
                await meta.setAbility(ability, {from: address})
                return meta.showNode.call(address)
            }).then(node => {
                return node
            })
    }
    function testMatrixMulitexecManager(meta, address) {
        return Promise.resolve()
            .then(() => {
                return meta.matrixMulitexecManager({from: address})
            }).then(result => {
                // console.log(result)
            })
    }

    const organizer = accounts[0]
    const participant_1 = accounts[1]
    const participant_2 = accounts[2]
    const participant_3 = accounts[3]
    let meta = null

    // 开始连接并计算算力
    before("beforeAll", function () {
        return Main.deployed().then(instance => {
            meta = instance
            //开始连接
            const p0 = testTaskUnit(meta, organizer)
            const p1 = testTaskUnit(meta, participant_1)
            const p2 = testTaskUnit(meta, participant_2)
            const p3 = testTaskUnit(meta, participant_3)
            return Promise.all([p0, p1, p2, p3])
        })
    })
    
    after("afterAll", function () {

    })

    it("test direct_distribute function",async function () {
        const totalTaskNum = 100
        const ability = await meta.direct_distribute.call(totalTaskNum)
        let sum = 0
        for(let i = 0; i < ability.length; i++){
            sum += ability[i].toNumber()
        }
        assert.equal(sum, totalTaskNum, "direct_distribute error!")
    })

    it("test matrixMulitManager function", async function () {
        const task0 = testMatrixMulitexecManager(meta, organizer)
        const task1 = testMatrixMulitexecManager(meta, participant_1)
        const task2 = testMatrixMulitexecManager(meta, participant_2)
        const task3 = testMatrixMulitexecManager(meta, participant_3)
        await Promise.all([task0, task1, task2, task3])
        const finalMatrixSum = await meta.finalMatrixSum.call()
        console.log("finalMatrixSum: "+finalMatrixSum)
        const successTaskNumber = await meta.successTaskNumber.call()
        assert.equal(successTaskNumber, 100, 'successTaskNumber error!')
    })
    
    it("test not distribute cost time", async function () {

    })

})
