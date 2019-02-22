pragma solidity >=0.4.21 <0.6.0;

contract First{
    function show() public returns (string memory) {
        return ("Hello World!");
      }

    function plus(int a,int b) public pure returns (int) {
        return a + b;
    }
}