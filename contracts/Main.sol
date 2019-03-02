pragma solidity ^0.5.0;

import './Algorithm.sol';

contract Main {
    address public organizer;
    uint public nodeNumber; // 当前可用节点数
    struct Participant {
        address addr;
        uint ability;   // 算力
        bool available; // 当前是否可用, 值:true——当前可用(已经处理完了工作), false——当前不可用
    }
    Participant[] public Nodes; // 存储每个参与计算的节点
    event testTask(uint x);   // 计算x个元素的快速排序消耗的时间
    event execMatrixMulitTask(uint[10] x, uint[10] y);    //10*10矩阵乘法

    constructor() public {
        // 初始化
        organizer = msg.sender;
        nodeNumber = 1;
    }

    function distributeManager() public{
        //一次性分配

    }
    /*
      计算分配任务问题，解法一：
      一次性分配，整数线性规划
    */
    function direct_distribute(uint totalTaskNum) public returns(uint[] memory){
        Algorithm algo = new Algorithm();
        uint Length = nodeNumber;
        uint[] memory ability = new uint[](Length);
        uint maxIndex = 0;
        for(uint i = 0; i < Length; i++){
            ability[i] = Nodes[i].ability;
            if(ability[maxIndex] < ability[i]){
                maxIndex = i;
            }
        }

        //先化简ability比例为 最简整数比
        uint GCD = algo.countNGcd(ability, Length);
        uint K = 0;
        for(uint i = 0; i < Length; i++){
            ability[i] = ability[i]/GCD;
            K = K + ability[i];
        }
        uint sum = 0;
        if(K <= totalTaskNum){
            uint Mk = algo.getMk(K, totalTaskNum);
            uint diff = uint((Mk - K)/Length);
            for(uint i = 0; i < Length; i++){
                uint a = ability[i]+diff;
                uint b = totalTaskNum / Mk;
                ability[i] = a * b;
                sum = sum + ability[i];
            }
        } else {
            uint Mk = algo.getMk(K, totalTaskNum);
            uint diff = uint((K - totalTaskNum)/Length);
            for(uint i = 0; i < Length; i++){
                uint a = ability[i]-diff;
                sum = sum + a;
                ability[i] = a;
            }
        }
        if(sum >= totalTaskNum){
            ability[maxIndex] = ability[maxIndex] - (sum - totalTaskNum);
        }else{
            ability[maxIndex] = ability[maxIndex] + (totalTaskNum - sum);
        }

        return ability;
    }

    function getAbility() public returns(uint[] memory){
        uint Length = nodeNumber;
        uint[] memory ability = new uint[](Length);
        for(uint i = 0; i < Length; i++){
            ability[i] = Nodes[i].ability;
        }
        return ability;
    }

    function showNode(address addr) public view returns(address, uint, bool){
        uint length = Nodes.length;
        bool flag = false;
        Participant memory node;
        for(uint i = 0; i < length; i++){
            if(Nodes[i].addr == addr){
                node = Nodes[i];
                flag = true;
            }
        }
        return (node.addr, node.ability, node.available);
    }

    function connect() public{   // solidity不支持返回结构体数组和结构体
        Participant memory _participant = Participant(msg.sender, 0, true);
        uint length = Nodes.length;
        for(uint i = 0; i < length; i++){
            if(Nodes[i].addr == msg.sender){
                emit testTask(9999);
                return;
            }
        }
        Nodes.push(_participant);
        nodeNumber = Nodes.length;
        //发射事件测试算力
        emit testTask(10000);
    }

    function disconnect(address addr) public{
        uint length = Nodes.length;
        for(uint i = 0; i < length; i++){
            if(Nodes[i].addr == addr){
                Nodes[i] = Nodes[length-1];
                Nodes.pop();
            }
        }
        nodeNumber = Nodes.length;
    }

    function setAbility(uint ability) public{
        uint length = Nodes.length;
        for(uint i = 0; i < length; i++){
            if(Nodes[i].addr == msg.sender){
                Nodes[i].ability = ability;
            }
        }
    }

}