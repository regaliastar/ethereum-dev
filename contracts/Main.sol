pragma solidity ^0.5.0;

import './Algorithm.sol';

contract Main {
    address payable organizer;      // 合约创建者
    uint public nodeNumber;         // 当前可用节点数
    uint public totalTaskNumber;    // 需要完成的任务数量
    uint public successTaskNumber;  // 当前完成任务数量
    uint public finalMatrixSum;     // 矩阵计算完毕后的和
    uint public matrixLength;       // 设置矩阵长度
    struct Participant {
        address addr;
        uint ability;   // 算力
        bool available; // 当前是否可用, 值:true——当前可用(已经处理完了工作), false——当前不可用
    }
    Participant[] public Nodes; // 存储每个参与计算的节点
    event testTask(uint x);     // 发射测试算力事件，计算x个元素的快速排序消耗的时间

    constructor() public {
        // 初始化
        organizer = msg.sender;
        nodeNumber = 1;
        matrixLength = 10;  // 通过手动设置改变矩阵长度
        totalTaskNumber = matrixLength * matrixLength;
        successTaskNumber = 0;
        finalMatrixSum = 0;
    }

    function init() public{
        successTaskNumber = 0;
        finalMatrixSum = 0;
    }

    // 根据 unitLoad - 工作量 来分配任务，将执行任务结果返回给调用者
    function matrixMulitexecWork(uint unitLoad) private returns(uint) {
        //一次性分配
        if(unitLoad == 0){
            return 0;
        }
//        return 10*unitLoad;
        Algorithm algo = new Algorithm();
        uint Length = matrixLength;
        uint[] memory x = new uint[](Length);
        uint[] memory y = new uint[](Length);
        uint[] memory result = new uint[](unitLoad);    // 为计算的结果
        for(uint i = 0; i < Length; i++){
            x[i] = 1;
            y[i] = 1;
        }
        uint sum = 0;
        for(uint i = 0; i < unitLoad; i++){
            // 这里本来应该取 Length
            // 但是为了保证所有任务都一样，以便于分析算力汇聚效果
            // 故硬编码 10
            uint r = algo.execUnit(x, y, 10);
            sum = sum + r;
            result[i] = r;
        }
        return sum;
    }

    /*
        算法一：一次性分配
        判断任务是否完成，并返回结果
    */
    function direct_distribute_manager() public returns(uint){
        uint[] memory ability = direct_distribute(totalTaskNumber);
        uint unitLoad = getLoadByAddress(ability, msg.sender);  // 被分配的工作量
        uint sum = matrixMulitexecWork(unitLoad);
        // 更新 finalMatrixSum
        finalMatrixSum = finalMatrixSum + sum;
        // 更新 successTaskNumber
        successTaskNumber = successTaskNumber + unitLoad;
        //若任务执行完毕
        if(successTaskNumber == totalTaskNumber){
            return finalMatrixSum;
        }
        //总任务还在继续，但该节点已经工作完成
        return 0;
    }

    /*
        算法二：一次性分配
        判断任务是否完成，并返回结果
    */
    function loop_distribute_manager() public returns(uint){
        uint[] memory ability = loop_distribute(totalTaskNumber);
        uint unitLoad = getLoadByAddress(ability, msg.sender);
        uint task_remained = totalTaskNumber - successTaskNumber;
        while(true){
            if(successTaskNumber >= totalTaskNumber){
                return finalMatrixSum;
            }
            task_remained = totalTaskNumber - successTaskNumber;
            if(unitLoad > task_remained){
                unitLoad = task_remained;
            }
            // 更新 successTaskNumber
            uint sum = matrixMulitexecWork(unitLoad);
            successTaskNumber = successTaskNumber + unitLoad;

            // 更新 finalMatrixSum
            finalMatrixSum = finalMatrixSum + sum;
        }
        return finalMatrixSum;
    }

    /*
      计算分配任务问题，算法一：
      一次性分配
      约束条件：算力强的节点尽可能分配多的任务，且尽量均匀
      100  个任务 耗时   ms
      400  个任务 耗时   ms
      900  个任务 耗时   ms
      2500 个任务 耗时   ms
      3600 个任务 耗时   ms
      10000个任务 out of gas
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
        // TODO: 优化算法为按比例分配，而不是直接做减法
        //
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
            uint diff = uint((K - totalTaskNum)/Length);
            for(uint i = 0; i < Length; i++){
                uint a = ability[i]-diff;
                sum = sum + a;
                ability[i] = a;
            }
        }
        // 该步骤消除了 uint diff = uint((K - totalTaskNum)/Length) 除不尽的情况
        if(sum >= totalTaskNum){
            ability[maxIndex] = ability[maxIndex] - (sum - totalTaskNum);
        }else{
            ability[maxIndex] = ability[maxIndex] + (totalTaskNum - sum);
        }

        return ability;
    }

    /*
        计算分配任务问题，算法二：
        循环分配
        思路：先按照测试得到的算力分配，谁先完成谁继续分配
        @param uint totalTaskNum - 需要分配的任务数
        @returns uint[] memory - 分配得到的任务数
    */
    function loop_distribute(uint task_remained) public view returns(uint[] memory){
        uint Length = nodeNumber;
        uint[] memory ability = new uint[](Length);
        uint K = 0;
        uint maxIndex = 0;
        for(uint i = 0; i < Length; i++){
            ability[i] = Nodes[i].ability;
            K = K + ability[i];
            if(ability[maxIndex] < ability[i]){
                maxIndex = i;
            }
        }
        // TODO: 优化算法为按比例分配，而不是直接做减法
        //
        if(K > task_remained){
            uint diff = uint((K - task_remained)/Length);
            uint sum = 0;
            for(uint i = 0; i < Length; i++){
                uint a = ability[i]-diff;
                sum = sum + a;
                ability[i] = a;
            }
            // 该步骤消除了 uint diff = uint((K - totalTaskNum)/Length) 除不尽的情况
            if(sum >= task_remained){
                ability[maxIndex] = ability[maxIndex] - (sum - task_remained);
            }else{
                ability[maxIndex] = ability[maxIndex] + (task_remained - sum);
            }
        }
        return ability;
    }

    function getLoadByAddress(uint[] memory ability, address addr) private view returns(uint){
        uint Length = nodeNumber;
        for(uint i = 0; i < Length; i++){
            if(Nodes[i].addr == addr){
                return ability[i];
            }
        }
    }

    function getAbility() public view returns(uint[] memory){
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
                emit testTask(10000);
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

    // 销毁合约
    function kill() public{
        if (organizer == msg.sender) {
            selfdestruct(organizer);
        }
    }

}