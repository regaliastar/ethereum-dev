pragma solidity ^0.5.0;

import "./Algorithm.sol";

contract Main {
    address public organizer;
    uint public nodeNumber; //当前可用节点数
    struct Participant {
        address addr;
        uint ability;   //算力
        bool available; //当前是否可用, 值:true——当前可用, false——当前不可用
    }
    Participant[] Nodes;

    constructor() public {
        organizer = msg.sender;
        nodeNumber = 1;
        Participant memory _participant = Participant(msg.sender, 0, true);
        Nodes.push(_participant);
    }

    function showNode(address addr) public returns(address, uint, bool){
        uint length = Nodes.length;
        Participant memory node;
        for(uint i = 0; i < length; i++){
            if(Nodes[i].addr == addr){
                node = Nodes[i];
            }
        }
        return (node.addr, node.ability, node.available);
    }

    function join() public returns(bool){   // solidity不支持返回结构体数组和结构体
        require(msg.sender != organizer, "organizer cannot join!");
        nodeNumber++;
        Participant memory _participant = Participant(msg.sender, 0, true);
        Nodes.push(_participant);
        return true;
    }

    function quit(address addr) public returns(bool){
        uint length = Nodes.length;
        for(uint i = 0; i < length; i++){
            if(Nodes[i].addr == addr){
                Nodes[i].available = false;
            }
        }
        nodeNumber--;
        return true;
    }

}