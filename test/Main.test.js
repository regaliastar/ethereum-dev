const Main = artifacts.require("./Main.sol")

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

    
})