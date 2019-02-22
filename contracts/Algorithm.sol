pragma solidity ^0.5.0;

contract Algorithm {
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
}