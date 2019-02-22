pragma solidity >=0.4.21 <0.6.0;

contract Conference {  // can be killed, so the owner gets sent the money in the end
    //storage 这些变量永久存储在区块链中，而函数中声明的变量随着运行结束会被释放
    address public organizer;
    mapping (address => uint) public registrantsPaid;
    uint public numRegistrants;
    uint public quota;

    event Deposit(address _from, uint _amount); // so you can log the event
    event Refund(address _to, uint _amount); // so you can log the event

    constructor() public {
        organizer = msg.sender;
        quota = 500;
        numRegistrants = 0;
    }

    function buyTicket() payable public {
        if (numRegistrants >= quota) {
            revert(); // throw ensures funds will be returned
        }
        registrantsPaid[msg.sender] = msg.value;
        numRegistrants++;
        emit Deposit(msg.sender, msg.value);    //需要emit触发事件
    }

    function changeQuota(uint newquota) public {
        if (msg.sender != organizer) { return; }
        quota = newquota;
    }

    function refundTicket(address payable recipient, uint amount) public {
        if (msg.sender != organizer) { return; }
        if (registrantsPaid[recipient] == amount) {
            address myAddress = address(this);  //使用显式转换
            if (myAddress.balance >= amount) {
                recipient.transfer(amount); //调用transfer需要声明memory如下：address payable recipient
                emit Refund(recipient, amount);
                registrantsPaid[recipient] = 0;
                numRegistrants--;
            }
        }
        return;
    }

    function destroy() public{
        if (msg.sender == organizer) { // without this funds could be locked in the contract forever!
            selfdestruct(msg.sender);
        }
    }
}
