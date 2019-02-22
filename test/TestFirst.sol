pragma solidity >=0.4.21 <0.6.0;

import "truffle/Assert.sol"; //truffle公共的库
import "truffle/DeployedAddresses.sol"; //truffle公共的库
import "../contracts/First.sol";

contract TestFirst {
    First meta = First(DeployedAddresses.First());

    function testShow() public {
        string memory returnStr = meta.show();
        string memory execpted = "Hello World!";
        // meta.getBalance(tx.origin); //得到余额-该方法不可用，为什么？
        Assert.equal(returnStr, execpted, "show should return Hello World!"); //判断如果没有就抛出异常
    }

    function testPlus() public {
        int returnNum = meta.plus(1,2);
        int execpted = 3;
        Assert.equal(returnNum, execpted, "plus should return 3"); //判断如果没有就抛出异常
    }

}