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
        const m1 = [[1,1],[1,1]]
        const m2 = [[1,1],[1,1]]
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

})