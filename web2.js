const web = require('./web.js')
const participant_2 = '0x328F15dB411483B7ec83c712C0C06151dd3d5D4B'

// _manager_flag => true 表示优化 cnp
// _contractor_flag => true 表示 老实节点
web(participant_2, 2, false, false)