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
    function test_direct_distribute_manager(meta, address) {
        return Promise.resolve()
            .then(() => {
                return meta.direct_distribute_manager({from: address})
            })
    }
    function test_loop_distribute_manager(meta, address) {
        return Promise.resolve()
            .then(() => {
                return meta.loop_distribute_manager({from: address})
            })
    }
    function test_direct_distribute_without_testTask_manager(meta, address) {
        return Promise.resolve()
            .then(() => {
                return meta.direct_distribute_without_testTask_manager({from: address})
            })
    }
    function test_loop_distribute_without_testTask_manager(meta, address) {
        return Promise.resolve()
            .then(() => {
                return meta.loop_distribute_without_testTask_manager({from: address})
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

    // 销毁合约
    after("afterAll", function () {
        meta.kill({from: organizer})
    })

    const matrixLength = 20

    it("test test_direct_distribute_manager function", async function () {
        const task0 = test_direct_distribute_manager(meta, organizer)
        const task1 = test_direct_distribute_manager(meta, participant_1)
        const task2 = test_direct_distribute_manager(meta, participant_2)
        const task3 = test_direct_distribute_manager(meta, participant_3)
        await Promise.all([task0, task1, task2, task3])
        const finalMatrixSum = await meta.finalMatrixSum.call()
        console.log("finalMatrixSum: "+finalMatrixSum)
        const successTaskNumber = await meta.successTaskNumber.call()
        const excepted = matrixLength*matrixLength
        assert.equal(successTaskNumber, excepted, 'successTaskNumber error!')
    })

    it("test loop_distribute_manager function", async function () {
        // init
        await meta.init();

        const task0 = test_loop_distribute_manager(meta, organizer)
        const task1 = test_loop_distribute_manager(meta, participant_1)
        const task2 = test_loop_distribute_manager(meta, participant_2)
        const task3 = test_loop_distribute_manager(meta, participant_3)
        await Promise.all([task0, task1, task2, task3])
        const finalMatrixSum = await meta.finalMatrixSum.call()
        console.log("finalMatrixSum: "+finalMatrixSum)
        const successTaskNumber = await meta.successTaskNumber.call()
        console.log('successTaskNumber: '+successTaskNumber.toNumber())
        const excepted = matrixLength*matrixLength
        assert.equal(successTaskNumber, excepted, 'successTaskNumber error!')
    })

    it("test direct_distribute_without_testTask_manager", async function () {
        // init
        await meta.init();
        const task0 = test_direct_distribute_without_testTask_manager(meta, organizer)
        const task1 = test_direct_distribute_without_testTask_manager(meta, participant_1)
        const task2 = test_direct_distribute_without_testTask_manager(meta, participant_2)
        const task3 = test_direct_distribute_without_testTask_manager(meta, participant_3)
        await Promise.all([task0, task1, task2, task3])
        const finalMatrixSum = await meta.finalMatrixSum.call()
        console.log("finalMatrixSum: "+finalMatrixSum)
        const successTaskNumber = await meta.successTaskNumber.call()
        console.log('successTaskNumber: '+successTaskNumber.toNumber())
        const excepted = matrixLength*matrixLength
        assert.equal(successTaskNumber, excepted, 'successTaskNumber error!')
    })

    it("test loop_distribute_without_testTask_manager", async function () {
        // init
        await meta.init();
        const task0 = test_loop_distribute_without_testTask_manager(meta, organizer)
        const task1 = test_loop_distribute_without_testTask_manager(meta, participant_1)
        const task2 = test_loop_distribute_without_testTask_manager(meta, participant_2)
        const task3 = test_loop_distribute_without_testTask_manager(meta, participant_3)
        await Promise.all([task0, task1, task2, task3])
        const finalMatrixSum = await meta.finalMatrixSum.call()
        console.log("finalMatrixSum: "+finalMatrixSum)
        const successTaskNumber = await meta.successTaskNumber.call()
        console.log('successTaskNumber: '+successTaskNumber.toNumber())
        const excepted = matrixLength*matrixLength
        assert.equal(successTaskNumber, excepted, 'successTaskNumber error!')
    })


})
