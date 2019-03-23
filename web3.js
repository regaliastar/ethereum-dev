const web = require('./web.js')
const participant_3 = '0xeA9c9Dafe494fF187f7cb01F97Fd125a80E25E64'

// _manager_flag => true 表示优化 cnp
// _contractor_flag => true 表示 老实节点
web(participant_3, 3,true, true)