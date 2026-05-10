// Mock 数据
const MOCK_DATA = {
  // 活动流程 (P0)
  process: [
    {
      time: "18:30-18:40",
      title: "开场环节",
      desc: "主持人开场，介绍活动主题和流程，播放预热音乐"
    },
    {
      time: "18:40-19:00",
      title: "社团展示环节",
      desc: "各社团代表进行3分钟才艺展示（舞蹈、歌唱、乐器演奏等）"
    },
    {
      time: "19:00-19:30",
      title: "互动游戏环节",
      desc: "进行“你画我猜”、“歌曲接龙”等互动游戏，活跃气氛"
    },
    {
      time: "19:30-20:00",
      title: "主题表演",
      desc: "动漫社成员带来精心编排的宅舞和声优表演"
    },
    {
      time: "20:00-20:20",
      title: "自由交流时间",
      desc: "提供茶歇，新老成员自由交流，填写报名表"
    },
    {
      time: "20:20-20:30",
      title: "结束环节",
      desc: "主持人总结，公布后续活动安排，合影留念"
    }
  ],

  // 专属歌单 (P0)
  playlist: [
    {
      section: "开场预热",
      songs: [
        { title: "Butter", artist: "BTS", duration: "2:42", cover: "🎵" },
        { title: "Dynamite", artist: "BTS", duration: "3:19", cover: "🎵" },
        { title: "Permission to Dance", artist: "BTS", duration: "3:07", cover: "🎵" }
      ]
    },
    {
      section: "才艺展示",
      songs: [
        { title: "青鸟", artist: "生物股长", duration: "4:02", cover: "🎵" },
        { title: "红莲华", artist: "LiSA", duration: "4:22", cover: "🎵" },
        { title: "梦灯笼", artist: "RADWIMPS", duration: "5:33", cover: "🎵" }
      ]
    },
    {
      section: "互动游戏",
      songs: [
        { title: "恋爱循环", artist: "花泽香菜", duration: "4:15", cover: "🎵" },
        { title: "千本樱", artist: "初音未来", duration: "4:08", cover: "🎵" },
        { title: "世界第一公主殿下", artist: "初音未来", duration: "3:52", cover: "🎵" }
      ]
    },
    {
      section: "主题表演",
      songs: [
        { title: "君の名は希望", artist: "乃木坂46", duration: "4:44", cover: "🎵" },
        { title: "ギフト", artist: "近畿小子", duration: "5:20", cover: "🎵" },
        { title: "Beautiful", artist: "WJSN", duration: "3:58", cover: "🎵" }
      ]
    },
    {
      section: "结束送别",
      songs: [
        { title: "Always With Me", artist: "久石让", duration: "2:36", cover: "🎵" },
        { title: "天空之城", artist: "久石让", duration: "3:45", cover: "🎵" }
      ]
    }
  ],

  // 主持串词 (P0)
  script: [
    {
      time: "18:30-18:40 开场环节",
      content: "尊敬的各位来宾，亲爱的同学们，大家晚上好！\n\n欢迎大家来到我们动漫社的迎新晚会现场！我是今晚的主持人[主持人姓名]。在这个美好的夜晚，我们将一起走进二次元的世界，感受动漫的魅力！\n\n在接下来的两个小时里，我们将欣赏到精彩的表演，参与有趣的游戏，还有机会认识更多志同道合的朋友。现在，让我们先来一段轻松的音乐，放松一下心情吧！有请第一位表演者..."
    },
    {
      time: "18:40-19:00 社团展示",
      content: "感谢刚才精彩的开场音乐！接下来是我们期待已久的社团展示环节。\n\n在这个环节中，各社团的代表将为我们带来3分钟的才艺展示。他们可能是舞者、歌手、乐手，也可能是隐藏的高手！\n\n让我们用热烈的掌声欢迎第一位表演者登场！\n\n（表演结束后）\n\n太精彩了！感谢各位表演者的倾情演出。接下来，我们要进入一个更加轻松愉快的环节——互动游戏时间！"
    },
    {
      time: "19:00-19:30 互动游戏",
      content: "现在让我们进入今晚的第一个互动游戏环节——“你画我猜”！\n\n游戏规则很简单：我们将邀请4位同学上台，两人一组，一人根据提示词画画，另一人猜词。\n\n每组有2分钟时间，猜对最多的组将获得精美礼品一份！\n\n现在有谁想上来挑战的吗？请举手示意！\n\n（游戏进行中）\n\n太欢乐了！感谢大家的积极参与。现在让我们继续下一个游戏——歌曲接龙！"
    },
    {
      time: "19:30-20:00 主题表演",
      content: "经过了轻松愉快的游戏环节，现在让我们把目光投向今晚的重头戏——主题表演！\n\n我们的动漫社成员们为了这场晚会准备了许久，他们将带来精心编排的宅舞和声优表演。\n\n让我们用最热烈的掌声，欢迎他们登场！\n\n（表演结束后）\n\n太震撼了！感谢所有表演者的精彩演出。现在让我们进入自由交流时间。"
    },
    {
      time: "20:00-20:20 自由交流",
      content: "现在是自由交流时间，我们为大家准备了茶歇。\n\n大家可以一边享用美食，一边和新认识的朋友聊天，也可以向社团的学长学姐们了解更多关于社团的信息。\n\n现场还设有报名台，感兴趣的同学可以填写报名表加入我们。\n\n10分钟后，我们将进行最后一个环节。"
    },
    {
      time: "20:20-20:30 结束环节",
      content: "亲爱的朋友们，快乐的时光总是短暂的。我们的迎新晚会也即将接近尾声。\n\n今晚我们一同欣赏了精彩的表演，参与了有趣的游戏，认识了许多新朋友。\n\n感谢每一位表演者和工作人员的辛勤付出，也感谢每一位观众的热情参与！\n\n后续我们还会举办更多有趣的活动，欢迎大家持续关注。现在让我们合影留念，记录下这美好的时刻！\n\n我们下次再见！"
    }
  ],

  // 任务清单 (P1)
  tasks: [
    {
      title: "确定活动场地",
      desc: "联系学校相关部门，预订活动场地，确保音响设备齐全",
      done: true
    },
    {
      title: "准备表演节目",
      desc: "组织社团成员排练开场舞和主题表演，准备服装道具",
      done: true
    },
    {
      title: "设计宣传物料",
      desc: "制作宣传海报、传单、线上宣传图，发布到各平台",
      done: false
    },
    {
      title: "准备游戏道具",
      desc: "购买“你画我猜”画板、笔，准备歌曲接龙题目",
      done: false
    },
    {
      title: "采购茶歇物资",
      desc: "购买饮料、小食、纸杯、纸巾等茶歇用品",
      done: false
    },
    {
      title: "准备报名表格",
      desc: "设计新成员报名表，打印足够份数",
      done: false
    },
    {
      title: "安排摄影人员",
      desc: "安排专人负责晚会全程拍摄和合影",
      done: false
    },
    {
      title: "准备礼品奖品",
      desc: "采购游戏环节的小礼品和抽奖奖品",
      done: false
    }
  ]
};

// ── 多风格歌单曲库 ─────────────────────────────────────────────
const PLAYLIST_DB = {
  energetic: [
    { section: '开场预热', songs: [
      { title: 'FIRE', artist: 'BTS', duration: '3:23', cover: '🎵' },
      { title: '跑马', artist: '薛之谦', duration: '3:41', cover: '🎵' },
      { title: 'Permission to Dance', artist: 'BTS', duration: '3:07', cover: '🎵' },
    ]},
    { section: '互动高潮', songs: [
      { title: '野狼disco', artist: '宝石Gem', duration: '3:51', cover: '🎵' },
      { title: 'Dynamite', artist: 'BTS', duration: '3:19', cover: '🎵' },
      { title: '我管你', artist: '薛之谦', duration: '3:28', cover: '🎵' },
    ]},
    { section: '压轴表演', songs: [
      { title: 'DNA', artist: 'BTS', duration: '3:44', cover: '🎵' },
      { title: '红莲华', artist: 'LiSA', duration: '4:22', cover: '🎵' },
      { title: 'IDOL', artist: 'BTS', duration: '3:43', cover: '🎵' },
    ]},
    { section: '结束送别', songs: [
      { title: 'Spring Day', artist: 'BTS', duration: '4:28', cover: '🎵' },
      { title: '天空之城', artist: '久石让', duration: '3:45', cover: '🎵' },
    ]},
  ],
  chill: [
    { section: '开场暖场', songs: [
      { title: '光年之外', artist: '邓紫棋', duration: '4:04', cover: '🎵' },
      { title: '平凡之路', artist: '朴树', duration: '4:52', cover: '🎵' },
      { title: '等你下课', artist: '周杰伦', duration: '3:38', cover: '🎵' },
    ]},
    { section: '温情互动', songs: [
      { title: '说散就散', artist: '袁娅维', duration: '3:57', cover: '🎵' },
      { title: '后来', artist: '刘若英', duration: '4:12', cover: '🎵' },
      { title: '那些年', artist: '胡夏', duration: '4:20', cover: '🎵' },
    ]},
    { section: '主题表演', songs: [
      { title: '告白气球', artist: '周杰伦', duration: '3:35', cover: '🎵' },
      { title: '稻香', artist: '周杰伦', duration: '3:42', cover: '🎵' },
      { title: 'Always With Me', artist: '久石让', duration: '2:36', cover: '🎵' },
    ]},
    { section: '温柔收尾', songs: [
      { title: '夜空中最亮的星', artist: '逃跑计划', duration: '4:31', cover: '🎵' },
      { title: '起风了', artist: '买辣椒也用券', duration: '4:50', cover: '🎵' },
    ]},
  ],
  formal: [
    { section: '开幕序曲', songs: [
      { title: '星辰大海', artist: '黄霄雲', duration: '4:08', cover: '🎵' },
      { title: '你的答案', artist: '阿冗', duration: '4:12', cover: '🎵' },
      { title: '漂洋过海来看你', artist: '李宗盛', duration: '4:35', cover: '🎵' },
    ]},
    { section: '节目伴奏', songs: [
      { title: '当爱在靠近', artist: '刘若英', duration: '4:02', cover: '🎵' },
      { title: '遇见', artist: '孙燕姿', duration: '4:04', cover: '🎵' },
      { title: '领悟', artist: '辛晓琪', duration: '4:28', cover: '🎵' },
    ]},
    { section: '致辞配乐', songs: [
      { title: '好久不见', artist: '陈奕迅', duration: '4:15', cover: '🎵' },
      { title: '传奇', artist: '王菲', duration: '4:40', cover: '🎵' },
      { title: '新的心跳', artist: '陈奕迅', duration: '3:50', cover: '🎵' },
    ]},
    { section: '典礼尾声', songs: [
      { title: '时间都去哪儿了', artist: '王铮亮', duration: '4:28', cover: '🎵' },
      { title: 'Yesterday Once More', artist: 'Carpenters', duration: '4:10', cover: '🎵' },
    ]},
  ],
  anime: [
    { section: '开场预热', songs: [
      { title: '千本樱', artist: '初音未来', duration: '4:08', cover: '🎵' },
      { title: '恋爱循环', artist: '花泽香菜', duration: '4:15', cover: '🎵' },
      { title: 'Butter', artist: 'BTS', duration: '2:42', cover: '🎵' },
    ]},
    { section: '才艺展示', songs: [
      { title: '青鸟', artist: '生物股长', duration: '4:02', cover: '🎵' },
      { title: '红莲华', artist: 'LiSA', duration: '4:22', cover: '🎵' },
      { title: '梦灯笼', artist: 'RADWIMPS', duration: '5:33', cover: '🎵' },
    ]},
    { section: '主题表演', songs: [
      { title: '君の名は希望', artist: '乃木坂46', duration: '4:44', cover: '🎵' },
      { title: '世界第一公主殿下', artist: '初音未来', duration: '3:52', cover: '🎵' },
      { title: 'ギフト', artist: '近畿小子', duration: '5:20', cover: '🎵' },
    ]},
    { section: '结束送别', songs: [
      { title: 'Always With Me', artist: '久石让', duration: '2:36', cover: '🎵' },
      { title: '天空之城', artist: '久石让', duration: '3:45', cover: '🎵' },
    ]},
  ],
  graduation: [
    { section: '入场音乐', songs: [
      { title: '突然好想你', artist: '五月天', duration: '4:44', cover: '🎵' },
      { title: '派对动物', artist: '五月天', duration: '4:09', cover: '🎵' },
      { title: '毕业了', artist: '曹方', duration: '4:12', cover: '🎵' },
    ]},
    { section: '回忆配乐', songs: [
      { title: '那些年', artist: '胡夏', duration: '4:20', cover: '🎵' },
      { title: '栀子花开', artist: '何炅', duration: '4:15', cover: '🎵' },
      { title: '晴天', artist: '周杰伦', duration: '4:29', cover: '🎵' },
    ]},
    { section: '致辞节目', songs: [
      { title: '追梦赤子心', artist: 'GALA', duration: '4:17', cover: '🎵' },
      { title: '我们都是好孩子', artist: '高晓松', duration: '4:05', cover: '🎵' },
      { title: '时间都去哪儿了', artist: '王铮亮', duration: '4:28', cover: '🎵' },
    ]},
    { section: '告别时刻', songs: [
      { title: '朋友', artist: '周华健', duration: '4:26', cover: '🎵' },
      { title: '光辉岁月', artist: 'Beyond', duration: '4:32', cover: '🎵' },
      { title: '再见', artist: '绿日乐队', duration: '3:46', cover: '🎵' },
    ]},
  ],
};

// 根据 type/styles/theme 选择最合适的歌单
function pickPlaylist(type, styles, theme) {
  if (type === '毕业' || /毕业|告别|离别/.test(theme))
    return PLAYLIST_DB.graduation;
  const styleStr = styles.join('');
  if (/动漫|二次元|宅|ACG/i.test(theme) || /搞笑/.test(styleStr))
    return PLAYLIST_DB.anime;
  if (/正式|文艺|沉浸/.test(styleStr))
    return PLAYLIST_DB.formal;
  if (/温情|治愈|松弛/.test(styleStr))
    return PLAYLIST_DB.chill;
  return PLAYLIST_DB.energetic;
}

// 根据风格生成对应语气的串词
function generateScriptByStyle(theme, type, styles, timeInfo, processTitle) {
  const styleMap = {
    '活泼': {
      greet: ['亲爱的小伙伴们', '各位可爱的同学们', '嗨起来！'],
      intro: ['今天真是太开心啦', '让我们一起嗨翻天', '准备好狂欢了吗'],
      end: ['玩得开心哦', '下次再见啦', '么么哒~'],
    },
    '搞笑': {
      greet: ['各位靓仔靓女', '在座的各位都是人才', '走过路过不要错过'],
      intro: ['今天不笑算我输', '准备好笑出腹肌', '笑点低的慎入'],
      end: ['笑够了没', '下次继续搞笑', '溜了溜了'],
    },
    '正式': {
      greet: ['尊敬的各位来宾', '亲爱的老师们同学们', '各位领导各位嘉宾'],
      intro: ['今天我们欢聚一堂', '共同见证这一时刻', '让我们共同开启'],
      end: ['感谢大家的到来', '期待下次再会', '祝大家晚安'],
    },
    '温情': {
      greet: ['亲爱的朋友们', '最爱的家人们', '温暖的大家庭'],
      intro: ['在这个温暖的夜晚', '让我们感受爱与美好', '温情时刻即将开始'],
      end: ['温暖永存心中', '爱你们哟', '愿温暖常伴'],
    },
    '燃': {
      greet: ['全体注意', 'Are you ready', '让我们点燃全场'],
      intro: ['激情燃烧的时刻到了', '准备好燃烧卡路里', '火力全开'],
      end: ['燃爆全场', '永不熄灭', '下次更燃'],
    },
    '治愈': {
      greet: ['疲惫的心灵需要休息', '让我们放松一下', '欢迎来到治愈空间'],
      intro: ['在这里放下疲惫', '让音乐治愈心灵', '享受宁静时光'],
      end: ['希望你被治愈', '元气满满地离开', '下次再见'],
    },
  };
  
  var primaryStyle = styles.find(function(s) { return styleMap[s]; }) || '活泼';
  var styleConf = styleMap[primaryStyle];
  
  var templates = {
    '开场环节': '【' + timeInfo + ' ' + processTitle + '】\n' + styleConf.greet[Math.floor(Math.random() * styleConf.greet.length)] + '！欢迎来到「' + theme + '」的现场！\n' + styleConf.intro[Math.floor(Math.random() * styleConf.intro.length)] + '！现在，让我们用热烈的掌声开启今天的活动！',
    '节目表演': '【' + timeInfo + ' ' + processTitle + '】\n精彩的节目即将开始！让我们用最热烈的掌声欢迎表演者们登场！',
    '互动游戏': '【' + timeInfo + ' ' + processTitle + '】\n接下来是激动人心的互动游戏环节！有没有勇敢的小伙伴想要上台挑战？',
    '主题表演': '【' + timeInfo + ' ' + processTitle + '】\n万众期待的时刻到了！让我们用最热烈的掌声请出今天的主角们！',
    '自由交流': '【' + timeInfo + ' ' + processTitle + '】\n现在是自由交流时间，大家可以放松一下，享受美食，认识新朋友！',
    '结束环节': '【' + timeInfo + ' ' + processTitle + '】\n快乐的时光总是短暂的，「' + theme + '」就要和大家说再见了！' + styleConf.end[Math.floor(Math.random() * styleConf.end.length)] + '！',
    '破冰暖场': '【' + timeInfo + ' ' + processTitle + '】\n' + styleConf.greet[Math.floor(Math.random() * styleConf.greet.length)] + '！欢迎来到「' + theme + '」！让我们先来玩个小游戏热热身！',
    '组织介绍': '【' + timeInfo + ' ' + processTitle + '】\n接下来让我们了解一下活动的组织方和精彩内容！',
    '互动体验': '【' + timeInfo + ' ' + processTitle + '】\n现在是互动体验时间，大家积极参与哦！',
    '才艺展示': '【' + timeInfo + ' ' + processTitle + '】\n有才艺的小伙伴们看过来！展示你的时刻到了！',
    '合影收尾': '【' + timeInfo + ' ' + processTitle + '】\n让我们一起留下美好的回忆，准备合影啦！',
    '入场开幕': '【' + timeInfo + ' ' + processTitle + '】\n欢迎各位毕业生入场！「' + theme + '」正式开始！',
    '回忆相册': '【' + timeInfo + ' ' + processTitle + '】\n让我们一起回顾这美好的时光，看看那些难忘的瞬间！',
    '致辞环节': '【' + timeInfo + ' ' + processTitle + '】\n接下来有请各位领导和老师为我们送上祝福！',
    '才艺汇演': '【' + timeInfo + ' ' + processTitle + '】\n精彩的才艺表演即将开始，大家拭目以待！',
    '互动留念': '【' + timeInfo + ' ' + processTitle + '】\n让我们尽情享受这最后的时光，留下美好的回忆！',
    '告别仪式': '【' + timeInfo + ' ' + processTitle + '】\n天下没有不散的筵席，但我们的情谊永存！',
    '集合破冰': '【' + timeInfo + ' ' + processTitle + '】\n' + styleConf.greet[Math.floor(Math.random() * styleConf.greet.length)] + '！欢迎来到「' + theme + '」！让我们快速认识一下彼此！',
    '团队竞技': '【' + timeInfo + ' ' + processTitle + '】\n团队合作的时刻到了！让我们看看哪队最默契！',
    '才艺切磋': '【' + timeInfo + ' ' + processTitle + '】\n才艺大比拼开始！谁才是今天的才艺之星？',
    '互选环节': '【' + timeInfo + ' ' + processTitle + '】\n神秘的互选环节来啦！看看谁会是你的有缘人！',
    '自由社交': '【' + timeInfo + ' ' + processTitle + '】\n自由社交时间到！多认识些新朋友吧！',
    '合影送别': '【' + timeInfo + ' ' + processTitle + '】\n美好的时光总是短暂，让我们合影留念！',
    '宣传开场': '【' + timeInfo + ' ' + processTitle + '】\n欢迎来到「' + theme + '」！让我们一起了解这个精彩的社团！',
    '社团展台': '【' + timeInfo + ' ' + processTitle + '】\n各部门已经准备就绪，快去参观吧！',
    '体验活动': '【' + timeInfo + ' ' + processTitle + '】\n亲身体验的时刻到了！快来参与吧！',
    '现场问答': '【' + timeInfo + ' ' + processTitle + '】\n有什么问题尽管问，学长学姐们为你解答！',
    '报名加入': '【' + timeInfo + ' ' + processTitle + '】\n心动不如行动！快来加入我们吧！',
    '收尾感谢': '【' + timeInfo + ' ' + processTitle + '】\n感谢大家的参与！期待下次再见！',
    '活动开场': '【' + timeInfo + ' ' + processTitle + '】\n' + styleConf.greet[Math.floor(Math.random() * styleConf.greet.length)] + '！「' + theme + '」正式开始！',
    '主体活动': '【' + timeInfo + ' ' + processTitle + '】\n精彩的主体活动即将开始，大家准备好了吗？',
    '分享交流': '【' + timeInfo + ' ' + processTitle + '】\n让我们分享一下今天的收获和感受！',
    '答谢致辞': '【' + timeInfo + ' ' + processTitle + '】\n感谢大家的支持与参与！你们是最棒的！',
  };
  
  return templates[processTitle] || '【' + timeInfo + ' ' + processTitle + '】\n欢迎来到「' + theme + '」！让我们一起度过美好的时光！';
}

// 根据主题和类型生成定制化任务
function generateTasks(theme, type, venue) {
  var taskTemplates = {
    '晚会': [
      { title: '确定演出场地', desc: '联系' + (venue || '学校相关部门') + '，预订场地并确认音响设备' },
      { title: '节目编排', desc: '组织节目彩排，确保节目质量' },
      { title: '宣传推广', desc: '制作海报、短视频进行宣传' },
      { title: '物资采购', desc: '购买道具、奖品和茶歇用品' },
      { title: '人员安排', desc: '安排主持人、摄影、后勤人员' },
      { title: '应急预案', desc: '制定突发情况应对方案' },
    ],
    '迎新': [
      { title: '破冰游戏准备', desc: '设计有趣的破冰游戏' },
      { title: '资料准备', desc: '准备迎新手册和报名表' },
      { title: '场地布置', desc: '营造温馨的迎新氛围' },
      { title: '志愿者培训', desc: '培训迎新志愿者' },
      { title: '餐饮安排', desc: '准备迎新茶歇' },
      { title: '后续跟进', desc: '建立新生群，持续跟进' },
    ],
    '毕业': [
      { title: '视频制作', desc: '制作毕业纪念视频' },
      { title: '场地装饰', desc: '布置毕业典礼场地' },
      { title: '邀请嘉宾', desc: '邀请老师和嘉宾出席' },
      { title: '礼品准备', desc: '准备毕业纪念品' },
      { title: '流程彩排', desc: '进行毕业典礼彩排' },
      { title: '合影安排', desc: '组织班级和集体合影' },
    ],
    '联谊': [
      { title: '嘉宾邀请', desc: '邀请联谊对象参加活动' },
      { title: '互动游戏设计', desc: '设计有趣的互动游戏' },
      { title: '场地布置', desc: '营造浪漫的联谊氛围' },
      { title: '配对机制', desc: '设计合理的配对方式' },
      { title: '餐饮安排', desc: '准备精致的茶点' },
      { title: '后续跟进', desc: '建立联谊群，促进交流' },
    ],
    '社团招新': [
      { title: '展台设计', desc: '设计吸引人的招新展台' },
      { title: '宣传物料', desc: '制作招新海报和传单' },
      { title: '成员培训', desc: '培训招新接待人员' },
      { title: '报名系统', desc: '准备报名表和报名流程' },
      { title: '展示内容', desc: '准备社团成果展示' },
      { title: '后续沟通', desc: '及时回复报名人员咨询' },
    ],
    '其他': [
      { title: '场地预订', desc: '预订' + (venue || '活动') + '场地' },
      { title: '活动宣传', desc: '进行活动宣传推广' },
      { title: '物资准备', desc: '准备活动所需物资' },
      { title: '人员分工', desc: '明确各人员职责' },
      { title: '流程策划', desc: '详细规划活动流程' },
      { title: '应急预案', desc: '制定安全应急预案' },
    ],
  };
  
  var baseTasks = taskTemplates[type] || taskTemplates['其他'];
  return baseTasks.map(function(task, index) {
    return {
      title: task.title.replace(/XXX/g, theme),
      desc: task.desc.replace(/XXX/g, theme),
      done: index < 2,
    };
  });
}

// 用户输入映射到 mock 数据
function getMockData(inputs) {
  var theme    = inputs.theme    || '校园活动';
  var type     = inputs.type     || '晚会';
  var duration = parseInt(inputs.duration) || 120;
  var styles   = inputs.styles && inputs.styles.length ? inputs.styles : ['活泼'];
  var venue    = inputs.venue    || '';
  var date     = inputs.date     || '';

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

  var TEMPLATES = {
    '晚会': [
      { ratio:0.10, title:'开场环节',   desc:'主持人宣布「' + theme + '」正式开始，播放预热音乐，现场氛围预热' },
      { ratio:0.22, title:'节目表演',   desc:'多个精彩节目依次登场，含歌舞、才艺秀等，彰显' + styles[0] + '风格' },
      { ratio:0.20, title:'互动游戏',   desc:'观众参与趣味游戏（歌曲接龙、你画我猜），活跃气氛，赢取精美礼品' },
      { ratio:0.25, title:'主题表演',   desc:'「' + theme + '」核心精彩节目压轴登场，全场高潮' },
      { ratio:0.13, title:'自由交流',   desc:'茶歇时间，新老成员自由交流，展示活动成果' },
      { ratio:0.10, title:'结束环节',   desc:'主持人总结致辞，公布下期活动，全员合影留念' },
    ],
    '迎新': [
      { ratio:0.10, title:'破冰暖场',   desc:'主持人介绍「' + theme + '」流程，破冰小游戏让新成员快速认识彼此' },
      { ratio:0.20, title:'组织介绍',   desc:'学长学姐分享加入经历与心得，展示社团/班级精彩活动集锦' },
      { ratio:0.25, title:'互动体验',   desc:'分组进行「' + styles[0] + '」风格小游戏，新老成员混搭组队' },
      { ratio:0.20, title:'才艺展示',   desc:'新成员自愿上台展示才艺，老成员助阵表演，共同营造' + styles[0] + '氛围' },
      { ratio:0.15, title:'自由交流',   desc:'茶歇时间，填写报名表，学长学姐解答新成员疑问' },
      { ratio:0.10, title:'合影收尾',   desc:'集体合影，发放纪念品，宣布后续「' + theme + '」系列活动安排' },
    ],
    '毕业': [
      { ratio:0.10, title:'入场开幕',   desc:'背景音乐响起，毕业生依次入场，「' + theme + '」正式拉开帷幕' },
      { ratio:0.20, title:'回忆相册',   desc:'播放精心剪辑的四年时光视频，勾起' + styles[0] + '共同回忆' },
      { ratio:0.25, title:'致辞环节',   desc:'师生代表先后发言，表达感恩与祝福，「' + theme + '」情感升华' },
      { ratio:0.20, title:'才艺汇演',   desc:'班级/社团节目汇演，充满' + styles[0] + '气息的表演令人难忘' },
      { ratio:0.15, title:'互动留念',   desc:'班级游戏、抢答有奖，毕业生尽情释放' + styles[0] + '情绪' },
      { ratio:0.10, title:'告别仪式',   desc:'燃放荧光棒，全员合唱，「' + theme + '」在欢声笑语中圆满落幕' },
    ],
    '联谊': [
      { ratio:0.10, title:'集合破冰',   desc:'「' + theme + '」正式开始，随机分组，简短自我介绍打破陌生感' },
      { ratio:0.20, title:'团队竞技',   desc:'设计' + styles[0] + '风格团队游戏，考验默契与合作' },
      { ratio:0.25, title:'才艺切磋',   desc:'两校/两班代表轮番表演，互相欣赏，气氛活跃' },
      { ratio:0.20, title:'互选环节',   desc:'特色互动环节（星球漂流瓶/暗号传递），增进了解' },
      { ratio:0.15, title:'自由社交',   desc:'开放场地，美食茶歇，自由交流，「' + theme + '」情谊在此建立' },
      { ratio:0.10, title:'合影送别',   desc:'互赠小礼物，合影留念，期待下次「' + theme + '」再相见' },
    ],
    '社团招新': [
      { ratio:0.12, title:'宣传开场',   desc:'「' + theme + '」正式启动，社团展示形象视频，吸引新生目光' },
      { ratio:0.25, title:'社团展台',   desc:'各部门设展台，展示作品与活动成果，' + styles[0] + '风格陈设吸引驻足' },
      { ratio:0.25, title:'体验活动',   desc:'开放体验工坊，新生亲身体验社团核心活动内容' },
      { ratio:0.20, title:'现场问答',   desc:'老成员解答疑问，分享加入「' + theme + '」后的成长故事' },
      { ratio:0.10, title:'报名加入',   desc:'引导感兴趣的新生填写报名表，加入社团群' },
      { ratio:0.08, title:'收尾感谢',   desc:'主持人总结，宣布正式成员名单公布时间，期待相聚' },
    ],
    '其他': [
      { ratio:0.10, title:'活动开场',   desc:'主持人宣布「' + theme + '」正式开始，介绍活动流程与注意事项' },
      { ratio:0.25, title:'主体活动',   desc:'「' + theme + '」核心内容展开，' + styles[0] + '氛围贯穿始终' },
      { ratio:0.25, title:'互动环节',   desc:'参与者积极互动，趣味活动让现场气氛达到高潮' },
      { ratio:0.20, title:'分享交流',   desc:'各方分享感受与收获，「' + theme + '」主旨在互动中升华' },
      { ratio:0.10, title:'答谢致辞',   desc:'主办方发表感谢，对本次「' + theme + '」进行总结' },
      { ratio:0.10, title:'结束合影',   desc:'全体合影，「' + theme + '」圆满落幕，期待下次再聚' },
    ],
  };

  var tpl = TEMPLATES[type] || TEMPLATES['其他'];

  var cursor = 0;
  var process = tpl.map(function(item, i) {
    var segMin = Math.round(item.ratio * duration);
    var start  = cursor;
    var end    = i === tpl.length - 1 ? duration : cursor + segMin;
    cursor = end;
    return {
      time:  seg(start, end),
      title: item.title,
      desc:  item.desc,
    };
  });

  var script = process.map(function(item) {
    return {
      time:    item.time + ' ' + item.title,
      content: generateScriptByStyle(theme, type, styles, item.time, item.title),
    };
  });

  var tasks = generateTasks(theme, type, venue);

  var rawPlaylist = pickPlaylist(type, styles, theme);
  var playlist = rawPlaylist.map(function(group, i) {
    return {
      section: process[i] ? group.section + '（' + process[i].title + '）' : group.section,
      songs: group.songs,
    };
  });

  return {
    process: process,
    playlist: playlist,
    script: script,
    tasks: tasks,
  };
}
