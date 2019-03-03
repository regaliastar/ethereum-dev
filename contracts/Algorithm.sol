pragma solidity ^0.5.0;

import './Utils.sol';

contract Algorithm {
    // 计算 N 个数的最大公约数
    function countNGcd(uint[] memory ability, uint length) public returns(uint){
        Utils utils = new Utils();
        if(length == 1){
            return ability[0];
        }
        uint c = utils.gcd(ability[0], ability[1]);
        for(uint i = 2; i < length; i++){
            c = utils.gcd(c, ability[i]);
        }
        return c;
    }

    function getMk(uint k, uint x) public pure returns(uint){
        for(uint i = k; i <= x; i++){
            if(x % i == 0){
                return i;
            }
        }
        return 0;
    }

    // 计算向量 x,y 乘积并取和
    function execUnit(uint[] memory x, uint[] memory y, uint length) public pure returns(uint){
        require(length > 0);
        uint sum = 0;
        for(uint i = 0; i < length; i++){
            uint r = x[i]*y[i];
            sum = sum + r;
        }
        return sum;
    }

    function factorial(int x) public pure returns(int){
        int value = 1;
        if(x == 0){
            return 1;
        }
        for(int i = x; i > 0; i--){
            value *= i;
        }
        return value;
    }

    function selectSort(uint[] memory arr, uint length) public pure returns(uint[] memory){
        for(uint i = 0; i < length; i++){
            for(uint j = i; j < length; j++){
                if(arr[i] > arr[j]){
                    uint t = arr[i];
                    arr[i] = arr[j];
                    arr[j] = t;
                }
            }
        }
        return arr;
    }

    function testUnit() public view returns(address t){
        matrixMulti();
        address addr = msg.sender;
        return addr;
    }

    //矩阵相乘，取结果所有元素的和
    function matrixMulti() public pure returns(uint){
        uint8[3][3] memory  m1 = [[1,2,3],[1,2,3],[1,2,3]]; //矩阵可随意定义
        uint8[3][3] memory m2 = [[1,2,3],[1,2,3],[1,2,3]];
        uint m1_raw = m1.length;
        uint m1_column = m1[0].length;
        uint m2_raw = m2.length;
        uint m2_column = m2[0].length;
        uint SUM = 0;
        if(m1_column != m2_raw || m1_raw != m2_column){
            revert();
        }
        for(uint i = 0; i < m1_raw; i++){
            for(uint j = 0; j < m2_column; j++){
                uint sum = 0;
                for(uint k = 0; k < m2_raw; k++){
                    sum += m1[i][k] * m2[k][j];
                }
                SUM += sum;
            }
        }
        return SUM;
    }
    /*
    function linearRegression(int[] memory x, int[] memory y) public pure returns(int[] memory parameter){

        return parameter;
    }
    */
}