const Algorithm = artifacts.require("./Algorithm.sol")

contract('Algorithm', accounts => {
    it('factorial', function () {
        return Algorithm.deployed().then(instance => {
            const meta = instance
            const x = 10
            return meta.factorial.call(10)   //函数返回promise对象
        }).then(value => {
            assert.equal(value, 3628800, 'factorial function error!')
        })
    })

    it('selectSort', function () {
        const arr = [3,2,5,1,4,0]
        const length = arr.length
        return Algorithm.deployed().then(instance => {
            const meta = instance
            return meta.selectSort.call(arr, length)
        }).then(value => {
            const arr_str = arr.sort().toString()
            const v_str = value.toString()
            assert.equal(arr_str, v_str, 'selectSort function error!')
        })
    })

    it('matrixMulti', function () {
        const m1 = [[1,1],[1,1]]
        const m2 = [[1,1],[1,1]]
        return Algorithm.deployed().then(instance => {
            const meta = instance
            return meta.matrixMulti.call()
        }).then(value => {
            // const expectValue = [[6,12,18],[6,12,18],[6,12,18]].toString()
            const expectValue = 108
            assert.equal(expectValue.toString(), value.toString(), 'matrixMulti function error!')
        })
    })

    it('testUnit', function () {
        const m1 = [[1,1],[1,1]]
        const m2 = [[1,1],[1,1]]
        return Algorithm.deployed().then(instance => {
            const meta = instance
            return meta.testUnit.call()
        }).then(value => {
            assert.equal(accounts[0], value, 'matrixMulti function error!')
        })
    })

    it('test function used by Main', function () {
        let meta = null
        return Algorithm.deployed().then(instance => {
            meta = instance
            return meta.countNGcd.call([100,50,15,20,30],5)
        }).then(value => {
            console.log(value)
            assert.equal(5, value, 'countNGcd function error!')
            return meta.getMk.call(6,100)
        }).then(value => {
            assert.equal(10, value, 'getMk function error!')
            return meta.getMk.call(100,100)
        }).then(value => {
            assert.equal(100, value, 'getMk function error!')
            return meta.getMk.call(101,100)
        }).then(value => {
            assert.equal(0, value, 'getMk function error!')
        })
    })

})