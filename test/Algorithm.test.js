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
    });

})