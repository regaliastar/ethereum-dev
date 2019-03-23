const web = require('./web.js')
const participant_1 = '0x063a1895b6D14452b9D75CA0BD8C9C4684fe56b0'

// _manager_flag => true 表示优化 cnp
// _contractor_flag => true 表示 老实节点
web(participant_1, 1, false, true)