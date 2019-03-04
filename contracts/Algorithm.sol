pragma solidity ^0.5.0;

import './Utils.sol';

contract Algorithm {
    // 梯度下降算法 一元线性回归
    // _a, _b 	—— 需求的参数值
    // xi, yi 	—— 样本数组
    // length   —— 数组长度
    // _step 	—— 步长设置
    // _inaccuracy —— 最大误差
    // 串行版
    // 由于 solidity 无法处理浮点数，因此传递参数时默认将所有值扩大 1e6 倍，再处理计算结果
    function gradient_descent(int a, int b, int[] memory xi, int[] memory yi, int length, int times, int inaccuracy)
    public
    pure
    returns(int, int, int){
        int count = 100;        // 最大迭代次数，防止无限循环
        int grad_a = 0;
        int grad_b = 0;
        int cost = 0;
        int old_cost = J(a, b, xi, yi, length);
        while(true){
            count--;
            if(count <= 0){
                break;
            }
            grad_a = Ja(a, b, xi, yi, length, times) * 1e4;    // step * times = 1e4, step = 0.01
            grad_b = Jb(a, b, xi, yi, length, times) * 1e4;
            a = a - grad_a;
            b = b - grad_b;
            cost = J(a, b, xi, yi, length);	    // 代价函数
            if(abs(old_cost - cost) < inaccuracy){
                return (a, b);
            }
            old_cost = cost;
        }
        return (a, b, count);
    }
    // 代价函数
    function J(int a, int b, int[] memory xi, int[] memory yi, int length)
    private
    pure
    returns(int){
        int sum = 0;
        for(uint i = 0; i < uint(length); i++){
            sum = sum + (a*xi[i]+b-yi[i]) * (a*xi[i]+b-yi[i]);
        }
        return sum/2;
    }
    // 对 J 求 a 的偏导
    function Ja(int a, int b, int[] memory xi, int[] memory yi, int length)
    private
    pure
    returns(int){
        int sum = 0;
        for(uint i = 0; i < uint(length); i++){
            sum = sum + (a*xi[i]+b-yi[i])*xi[i];
        }
        return sum;
    }
    // 对 J 求 b 的偏导
    function Jb(int a, int b, int[] memory xi, int[] memory yi, int length)
    private
    pure
    returns(int){
        int sum = 0;
        for(uint i = 0; i < uint(length); i++){
            sum = sum + a*xi[i]+b-yi[i];
        }
        return sum;
    }

    function abs(int a) private pure returns(int){
        if(a < 0){
            return -a;
        }
        return a;
    }

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

    function tsetFixedCompute(int _a) public pure returns(int){
        int a = _a;
        a = a / 10 * 10;
        return a;
    }
    /*
    function linearRegression(int[] memory x, int[] memory y) public pure returns(int[] memory parameter){

        return parameter;
    }
    */
}