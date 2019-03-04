const Algorithm = artifacts.require("./Algorithm.sol")

contract('Algorithm', accounts => {
    let meta = null
    
    before("beforeAll", function () {
        return Algorithm.deployed().then(instance => {
            meta = instance
        })
    })

    it('factorial',async function () {
        const value = await meta.factorial.call(10)
        assert.equal(value, 3628800, 'factorial function error!')
    })

    it('selectSort',async function () {
        const arr = [3,2,5,1,4,0]
        const length = arr.length
        const value = await meta.selectSort.call(arr, length)
        const arr_str = arr.sort().toString()
        const v_str = value.toString()
        assert.equal(arr_str, v_str, 'selectSort function error!')
    })

    it('matrixMulti',async function () {
        const value = await meta.matrixMulti.call()
        const expectValue = 108
        assert.equal(expectValue.toString(), value.toString(), 'matrixMulti function error!')
    })

    it('testUnit',async function () {
        const m1 = [[1,1],[1,1]]
        const m2 = [[1,1],[1,1]]
        const value = await meta.testUnit.call()
        assert.equal(accounts[0], value, 'matrixMulti function error!')
    })
/*
    it('test function used by Main',async function () {
        const value = await meta.countNGcd.call([100,50,15,20,30],5)
        assert.equal(5, value, 'countNGcd function error!')
        const Mk1 = await meta.getMk.call(6,100)
        assert.equal(10, Mk1, 'getMk function error!')
        const Mk2 = await meta.getMk.call(100,100)
        assert.equal(100, Mk2, 'getMk function error!')
        const Mk3 = await meta.getMk.call(101,100)
        assert.equal(0, Mk3, 'getMk function error!')
    })
    */
    it('test tsetFixedCompute', async function () {
        const value = await meta.tsetFixedCompute.call(1234)
        console.log(value.toNumber())
        assert.equal(1230, value, 'tsetFixedCompute function error!')
    })

    it('test gradient_descent', async function () {
        function encodeArr(arr, times) {
            return arr.map(item => {
                return item * times
            })
        }
        const times = 1e6
        const xi = encodeArr([1,2,3,4,5,9], times)
        const yi = encodeArr([1,3,2,4,5,7], times)
        const length = xi.length
        const _step = 1
        const _inaccuracy = 1e-3 * times
        const value = await meta.gradient_descent.call(0,0,xi,yi,length,times,_inaccuracy)
        console.log(value[0], value[1], value[2])
    })

})