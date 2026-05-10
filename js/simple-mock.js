// 简化版 Mock 数据生成器
function getMockData(inputs) {
  var theme    = inputs.theme    || '校园活动';
  var type     = inputs.type     || '晚会';
  var duration = parseInt(inputs.duration) || 120;
  var styles   = inputs.styles && inputs.styles.length ? inputs.styles : ['活泼'];
  var venue    = inputs.venue    || '';

  // 基础时间计算
  var BASE_HOUR = 18;
  var BASE_MIN  = 30;
  function toTime(offsetMin) {
    var total = BASE_HOUR * 60 + BASE_MIN + offsetMin;
    var h = Math.floor(total / 60);
    var m = total % 60;
    return h + ':' + (m < 10 ? '0' : '') + m;
  }
  function seg(start, end) { 
    return toTime(start) + '-' + toTime(end); 
  }

  // 活动流程模板
  var flowTemplates = {
    '晚会': [
      { ratio:0.10, title:'开场环节', desc:'主持人宣布「' + theme + '」正式开始' },
      { ratio:0.22, title:'节目表演', desc:'精彩节目依次登场，彰显' + styles[0] + '风格' },
      { ratio:0.20, title:'互动游戏', desc:'观众参与趣味游戏，活跃气氛' },
      { ratio:0.25, title:'主题表演', desc:'「' + theme + '」核心节目压轴登场' },
      { ratio:0.13, title:'自由交流', desc:'茶歇时间，自由交流' },
      { ratio:0.10, title:'结束环节', desc:'主持人总结，合影留念' },
    ],
    '迎新': [
      { ratio:0.10, title:'破冰暖场', desc:'主持人介绍流程，破冰小游戏' },
      { ratio:0.20, title:'组织介绍', desc:'学长学姐分享经历' },
      { ratio:0.25, title:'互动体验', desc:'分组进行「' + styles[0] + '」风格小游戏' },
      { ratio:0.20, title:'才艺展示', desc:'新成员才艺展示' },
      { ratio:0.15, title:'自由交流', desc:'填写报名表，解答疑问' },
      { ratio:0.10, title:'合影收尾', desc:'集体合影，发放纪念品' },
    ],
    '毕业': [
      { ratio:0.10, title:'入场开幕', desc:'毕业生入场，「' + theme + '」开始' },
      { ratio:0.20, title:'回忆相册', desc:'播放毕业纪念视频' },
      { ratio:0.25, title:'致辞环节', desc:'师生代表发言' },
      { ratio:0.20, title:'才艺汇演', desc:'精彩节目表演' },
      { ratio:0.15, title:'互动留念', desc:'班级游戏互动' },
      { ratio:0.10, title:'告别仪式', desc:'合唱送别，合影留念' },
    ],
    '联谊': [
      { ratio:0.10, title:'集合破冰', desc:'随机分组，自我介绍' },
      { ratio:0.20, title:'团队竞技', desc:'团队游戏，考验默契' },
      { ratio:0.25, title:'才艺切磋', desc:'双方代表才艺表演' },
      { ratio:0.20, title:'互选环节', desc:'特色互动，增进了解' },
      { ratio:0.15, title:'自由社交', desc:'自由交流，建立友谊' },
      { ratio:0.10, title:'合影送别', desc:'互赠礼物，合影留念' },
    ],
    '社团招新': [
      { ratio:0.12, title:'宣传开场', desc:'社团形象展示' },
      { ratio:0.25, title:'社团展台', desc:'各部门展示成果' },
      { ratio:0.25, title:'体验活动', desc:'开放体验工坊' },
      { ratio:0.20, title:'现场问答', desc:'解答疑问' },
      { ratio:0.10, title:'报名加入', desc:'填写报名表' },
      { ratio:0.08, title:'收尾感谢', desc:'总结发言' },
    ],
    '其他': [
      { ratio:0.10, title:'活动开场', desc:'主持人介绍流程' },
      { ratio:0.25, title:'主体活动', desc:'核心活动内容' },
      { ratio:0.25, title:'互动环节', desc:'趣味互动游戏' },
      { ratio:0.20, title:'分享交流', desc:'分享感受与收获' },
      { ratio:0.10, title:'答谢致辞', desc:'主办方感谢' },
      { ratio:0.10, title:'结束合影', desc:'全体合影' },
    ],
  };

  // 任务模板
  var taskTemplates = {
    '晚会': ['确定演出场地', '节目编排', '宣传推广', '物资采购', '人员安排', '应急预案'],
    '迎新': ['破冰游戏准备', '资料准备', '场地布置', '志愿者培训', '餐饮安排', '后续跟进'],
    '毕业': ['视频制作', '场地装饰', '邀请嘉宾', '礼品准备', '流程彩排', '合影安排'],
    '联谊': ['嘉宾邀请', '互动游戏设计', '场地布置', '配对机制', '餐饮安排', '后续跟进'],
    '社团招新': ['展台设计', '宣传物料', '成员培训', '报名系统', '展示内容', '后续沟通'],
    '其他': ['场地预订', '活动宣传', '物资准备', '人员分工', '流程策划', '应急预案'],
  };

  // 生成流程
  var tpl = flowTemplates[type] || flowTemplates['其他'];
  var cursor = 0;
  var process = [];
  for (var i = 0; i < tpl.length; i++) {
    var item = tpl[i];
    var segMin = Math.round(item.ratio * duration);
    var start = cursor;
    var end = i === tpl.length - 1 ? duration : cursor + segMin;
    cursor = end;
    process.push({
      time: seg(start, end),
      title: item.title,
      desc: item.desc
    });
  }

  // 生成串词
  var styleGreetings = {
    '活泼': '亲爱的小伙伴们！',
    '搞笑': '各位靓仔靓女！',
    '正式': '尊敬的各位来宾！',
    '温情': '亲爱的朋友们！',
    '燃': '全体注意！',
    '治愈': '疲惫的心灵需要休息~',
  };
  var greeting = styleGreetings[styles[0]] || '亲爱的朋友们！';
  
  var script = [];
  for (var i = 0; i < process.length; i++) {
    var p = process[i];
    script.push({
      time: p.time + ' ' + p.title,
      content: greeting + '欢迎来到「' + theme + '」！现在是' + p.time + '，' + p.title + '即将开始！'
    });
  }

  // 生成任务
  var taskList = taskTemplates[type] || taskTemplates['其他'];
  var tasks = [];
  for (var i = 0; i < taskList.length; i++) {
    tasks.push({
      title: taskList[i],
      desc: '完成「' + taskList[i] + '」相关工作',
      done: i < 2
    });
  }

  // 生成歌单
  var playlist = [
    { section: '环节一', songs: [
      { title: '歌曲1', artist: '歌手A', duration: '3:00', cover: '🎵' },
      { title: '歌曲2', artist: '歌手B', duration: '4:00', cover: '🎵' },
    ]},
    { section: '环节二', songs: [
      { title: '歌曲3', artist: '歌手C', duration: '3:30', cover: '🎵' },
      { title: '歌曲4', artist: '歌手D', duration: '4:30', cover: '🎵' },
    ]},
    { section: '环节三', songs: [
      { title: '歌曲5', artist: '歌手E', duration: '3:15', cover: '🎵' },
    ]},
  ];

  return {
    process: process,
    playlist: playlist,
    script: script,
    tasks: tasks,
  };
}
