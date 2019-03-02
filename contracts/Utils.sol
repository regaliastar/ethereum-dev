pragma solidity ^0.5.0;

contract Utils{
    //求两个数最大公约数
    function gcd(uint n, uint m) public returns(uint){
        if(n < m){
            uint t = n;
            n = m;
            m = t;
        }
        if(m == 0){
            return n;
        }
        return gcd(m, n%m);
    }
}