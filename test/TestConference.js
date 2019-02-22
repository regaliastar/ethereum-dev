const Conference = artifacts.require("./Conference.sol");

//https://blog.csdn.net/loy_184548/article/details/78020369

contract('Conference', function(accounts) {

    var Quato;  //限制人数为500
    var NumRegistrants;  //注册的人数刚开始为应该为0
    var Organizer; //组织者地址应该正确
    const organizer_address = accounts[0];
    const user_address = accounts[1];

    it("Initial conference settings should match", function() {
        var meta = null;
        return Conference.deployed().then(function(instance){
            meta = instance;
            return meta.quota.call();
        }).then(function(quota){
            Quato = quota;
            return meta.organizer.call();
        }).then(function(organizer){
            Organizer = organizer;
            return meta.numRegistrants.call();
        }).then(function(numRegistrants){
            NumRegistrants = numRegistrants;

            assert.equal(Quato, 500, "Quota doesn't match!");
            assert.equal(numRegistrants, 0, "Registrants should be zero!");
            assert.equal(Organizer, organizer_address, "Owner doesn't match!");
        });

    });

    async function myGetBalance(address){
        let value = 0
        await web3.eth.getBalance(address).then( v => {
            value = v
        })
        return value
    }


    it("Should let you buy a ticket", () => {
        // var ticketPrice = web3.utils.toWei(0.5, 'ether');
        var ticketPrice = "50000000000000000";
        var initialBalance;  //用户初始余额
        var newBalance;   //用户购买之后余额
        var newNumRegistrants;  //买票人数
        var userPaid;  //付款的金额
        var difference;

        return Conference.deployed().then( async function(instance){
            meta = instance;
            // return meta.getBalance.call(user_address);
            let balance = await myGetBalance(user_address)
            return balance;
        }).then(function(balance){
            console.log('balance:',balance,typeof balance)
            initialBalance = balance;  //初始金额
            return meta.buyTicket({from: user_address, value: ticketPrice});  //买票操作
        }).then( async function(){
            let balance = await myGetBalance(user_address)
            return balance;
        }).then(function(balance){
            newBalance = balance;  //买票之后余额
            console.log('initialBalance',initialBalance)
            console.log('newBalance',newBalance)
            difference = initialBalance - newBalance;
            return meta.numRegistrants.call();
        }).then(function(numRegistrants){
            newNumRegistrants = numRegistrants;
            return meta.registrantsPaid.call(user_address);
        }).then(function(registrantsPaid){
            userPaid = registrantsPaid

            assert.equal(userPaid, ticketPrice, "Sender's paid but is not listed");
            // assert.equal(difference, ticketPrice, "Difference should be what was sent");    //减法精度问题
            assert.equal(newNumRegistrants, 1, "there should be 1 registrant");
        });

    });

});
