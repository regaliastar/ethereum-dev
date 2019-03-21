pragma solidity ^0.5.0;

import './Algorithm.sol';
// 区块链上多个节点合作 重点讨论怎么让他计算更快
// 斯塔尔伯格 博弈论
// 雾计算 边缘计算
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
    event myEvent(uint index);

    constructor() public {
        // 初始化
        organizer = msg.sender;
        nodeNumber = 1;
        matrixLength = 10;  // 通过手动设置改变矩阵长度
        totalTaskNumber = matrixLength * 10;
        successTaskNumber = 0;
        finalMatrixSum = 0;
    }

    function init() public{
        successTaskNumber = 0;
        finalMatrixSum = 0;
    }

    // 根据 unitLoad - 工作量 来分配任务，将执行任务结果返回给调用者
    function matrixMulitexecWork(uint unitLoad, uint _matrixLength)
    private
    pure
    returns(uint) {
        //一次性分配
        if(unitLoad == 0){
            return 0;
        }
        uint Length = _matrixLength;
        uint[] memory x = new uint[](Length);
        uint[] memory y = new uint[](Length);
        uint[] memory result = new uint[](unitLoad);    // 为计算的结果
        for(uint i = 0; i < Length; i++){
            x[i] = 1;
            y[i] = 1;
        }
        uint sum = 0;
        for(uint i = 0; i < unitLoad; i++){
            // 这里本来应该取 i < Length
            // 但是为了保证所有任务都一样，以便于分析算力汇聚效果
            // 故硬编码 j < 10
            uint r = 0;
            // 模拟 10*10 矩阵乘法
            for(uint j = 0; j < 10; j++){
                for(uint k = 0; k < 10; k++){

                }
                r = x[j]*y[j] + r;
            }
            sum = sum + r;
            result[i] = r;
        }
        return sum;
    }

    /*
        调用算法0： 不进行分布式计算，用作对照组
        只有 organizer 可以调用
    */
    function no_distribute_manager()
    public
    returns(uint){
        require(msg.sender == organizer);
        uint unitLoad = totalTaskNumber;
        uint sum = matrixMulitexecWork(unitLoad, matrixLength);
        // 更新 finalMatrixSum
        finalMatrixSum = finalMatrixSum + sum;
        // 更新 successTaskNumber
        successTaskNumber = successTaskNumber + unitLoad;
        return sum;
    }

    /*
        调用算法一：一次性分配
        判断任务是否完成，并返回结果
    */
    function direct_distribute_manager()
    public
    returns(uint){
        uint[] memory ability = direct_distribute(totalTaskNumber);
        uint unitLoad = getLoadByAddress(ability, msg.sender);  // 被分配的工作量
        uint sum = matrixMulitexecWork(unitLoad, matrixLength);
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
        调用算法二：循环分配
        优化合同网模型
        谁先完成谁继续分配
    */
    function loop_distribute_manager()
    public
    returns(uint){
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
            uint sum = matrixMulitexecWork(unitLoad, matrixLength);
            successTaskNumber = successTaskNumber + unitLoad;

            // 更新 finalMatrixSum
            finalMatrixSum = finalMatrixSum + sum;
        }
    }

    function better_cnp_managet(bool flag)
    public
    returns(uint){
        while(true){
            uint index = cnp_distribute(flag); // 第index个节点得到该任务
            if(successTaskNumber >= totalTaskNumber){
                return finalMatrixSum;
            }
            if(msg.sender == Nodes[index].addr){
                emit myEvent(index);
            }
            // 更新 successTaskNumber
            uint sum = matrixMulitexecWork(1, matrixLength);
            successTaskNumber++;

            // 更新 finalMatrixSum
            finalMatrixSum = finalMatrixSum + sum;

        }
    }

    // flag = ture => 使用评估结果影响分配，即类型B
    // flag = false => 不使用评估函数，即类型A
    function cnp_distribute(bool flag)
    public
    view
    returns(uint){
        uint Length = nodeNumber;
        uint[] memory ability = new uint[](Length);
        uint maxIndex = 0;
        for(uint i = 0; i < Length; i++){
            ability[i] = Nodes[i].ability;
            if(ability[maxIndex] < ability[i]){
                maxIndex = i;
            }
        }
        if(flag){
            // 为了代码方便，可能不好理解，但是数学期望是一样的
            ability[2] = ability[2]/100;
            ability[3] = ability[3]/100;
            for(uint j = 0; j < Length; j++){
                if(ability[maxIndex] < ability[j]){
                    maxIndex = j;
                }
            }
        }
        return maxIndex;
    }

    /*
        调用算法三：不进行算力测试，直接平均分配任务
    */
    function direct_distribute_without_testTask_manager()
    public
    returns(uint){
        uint[] memory ability = direct_distribute(totalTaskNumber);
        uint unitLoad = getLoadByAddress(ability, msg.sender);  // 被分配的工作量
        uint sum = matrixMulitexecWork(unitLoad, matrixLength);
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
        计算分配任务问题，算法四：
        不进行算力测试，循环分配全部任务
        @param uint totalTaskNum - 需要分配的任务数
        @returns uint[] memory - 分配得到的任务数
    */
    function loop_distribute_without_testTask_manager()
    public
    returns(uint){
        // 设置每个节点一次执行50个任务
        uint unitLoad = matrixLength;
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
            uint sum = matrixMulitexecWork(unitLoad, matrixLength);
            successTaskNumber = successTaskNumber + unitLoad;

            // 更新 finalMatrixSum
            finalMatrixSum = finalMatrixSum + sum;
        }
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
    function direct_distribute(uint totalTaskNum)
    public
    returns(uint[] memory){
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
        uint GCD = algo.countNGcd(ability, Length); // 得到算力的最大公约数
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
    function loop_distribute(uint task_remained)
    public
    view
    returns(uint[] memory){
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
        // TODO: 优化该算法为按比例分配，而不是直接做减法
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

    /*
        计算分配任务问题，算法三：
        不进行算力测试，直接平均分配全部任务
        @param uint totalTaskNum - 需要分配的任务数
        @returns uint[] memory - 分配得到的任务数
    */
    function direct_distribute_without_testTask(uint totalTaskNum)
    public
    view
    returns(uint[] memory){
        uint Length = nodeNumber;
        uint[] memory ability = new uint[](Length);
        uint average = uint(totalTaskNum / Length);
        for(uint i = 0; i < Length; i++){
            ability[i] = average;
        }
        // 排除average被截断的情况
        uint t = average * Length;
        if(t <= totalTaskNumber){
            ability[0] = ability[0] + (totalTaskNumber - t);
        }else{
            ability[0] = ability[0] - (t - totalTaskNumber);
        }
        return ability;
    }

    function getLoadByAddress(uint[] memory ability, address addr)
    private
    view
    returns(uint){
        uint Length = nodeNumber;
        for(uint i = 0; i < Length; i++){
            if(Nodes[i].addr == addr){
                return ability[i];
            }
        }
    }

    function getAbility() public
    view
    returns(uint[] memory){
        uint Length = nodeNumber;
        uint[] memory ability = new uint[](Length);
        for(uint i = 0; i < Length; i++){
            ability[i] = Nodes[i].ability;
        }
        return ability;
    }

    function showNode(address addr) public
    view
    returns(address, uint, bool){
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