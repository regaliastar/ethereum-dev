pragma solidity ^0.5.0;

import "./Algorithm.sol";

contract Main {
    address public organizer;
    uint public nodeNumber; //当前可用节点数
    struct Participant {
        address addr;
        uint ability;   //算力
        bool available; //当前是否可用, 值:true——当前可用(已经处理完了工作), false——当前不可用
    }
    Participant[] public Nodes;
    event testTask(address addr, uint x);   //计算x个元素的选择排序消耗的时间
    event execMatrixMulitTask(address addr, uint[3] x, uint[3] y);

    constructor() public {
        organizer = msg.sender;
        nodeNumber = 1;
        Participant memory _participant = Participant(msg.sender, 0, true);
        Nodes.push(_participant);
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
//        require(flag);
        return (node.addr, node.ability, node.available);
    }

    function connect() public{   // solidity不支持返回结构体数组和结构体
//        require(addr != organizer, "organizer cannot join!");
        Participant memory _participant = Participant(msg.sender, 0, true);
        uint length = Nodes.length;
        for(uint i = 0; i < length; i++){
            if(Nodes[i].addr == msg.sender){
                emit testTask(msg.sender, 10000);
                return;
            }
        }
        Nodes.push(_participant);
        nodeNumber = Nodes.length;
        //发射事件测试算力
        emit testTask(msg.sender, 10000);
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