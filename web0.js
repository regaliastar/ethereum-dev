const web = require('./web.js')
const origanizer = '0x4e681f2221C84d4626C9220A5A51319122A0E3aD'

// _manager_flag => true 表示优化 cnp
// _contractor_flag => true 表示 老实节点
web(origanizer, 0, false, true)