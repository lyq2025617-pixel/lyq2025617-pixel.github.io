// 增强版 Mock 数据生成器
function getMockData(inputs) {
  var theme    = inputs.theme    || '校园活动';
  var type     = inputs.type     || '晚会';
  var duration = parseInt(inputs.duration) || 120;
  var styles   = inputs.styles && inputs.styles.length ? inputs.styles : ['活泼'];
  var venue    = inputs.venue    || '';
  var people   = inputs.people   || '50-100人';
  var date     = inputs.date     || '';

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

  // 风格配置
  var styleConfig = {
    '活泼': {
      tone: '欢快、轻松、充满活力',
      greet: ['亲爱的小伙伴们！', '各位可爱的同学们！', '嗨起来！'],
      intro: ['今天真是太开心啦！', '让我们一起嗨翻天！', '准备好狂欢了吗？'],
      end: ['玩得开心哦！', '下次再见啦！', '么么哒~'],
      keywords: ['欢乐', '热闹', '活力', '激情', '笑声'],
    },
    '搞笑': {
      tone: '幽默、诙谐、搞笑有趣',
      greet: ['各位靓仔靓女！', '在座的各位都是人才！', '走过路过不要错过！'],
      intro: ['今天不笑算我输！', '准备好笑出腹肌！', '笑点低的慎入！'],
      end: ['笑够了没？', '下次继续搞笑！', '溜了溜了！'],
      keywords: ['搞笑', '幽默', '逗趣', '欢乐', '捧腹'],
    },
    '正式': {
      tone: '庄重、正式、典雅大方',
      greet: ['尊敬的各位来宾！', '亲爱的老师们同学们！', '各位领导各位嘉宾！'],
      intro: ['今天我们欢聚一堂！', '共同见证这一时刻！', '让我们共同开启！'],
      end: ['感谢大家的到来！', '期待下次再会！', '祝大家晚安！'],
      keywords: ['庄重', '典雅', '正式', '隆重', '感恩'],
    },
    '温情': {
      tone: '温馨、感人、充满爱意',
      greet: ['亲爱的朋友们！', '最爱的家人们！', '温暖的大家庭！'],
      intro: ['在这个温暖的夜晚！', '让我们感受爱与美好！', '温情时刻即将开始！'],
      end: ['温暖永存心中！', '爱你们哟！', '愿温暖常伴！'],
      keywords: ['温暖', '感动', '温馨', '感恩', '祝福'],
    },
    '燃': {
      tone: '激情、热血、充满力量',
      greet: ['全体注意！', 'Are you ready？', '让我们点燃全场！'],
      intro: ['激情燃烧的时刻到了！', '准备好燃烧卡路里！', '火力全开！'],
      end: ['燃爆全场！', '永不熄灭！', '下次更燃！'],
      keywords: ['激情', '热血', '燃烧', '震撼', '沸腾'],
    },
    '治愈': {
      tone: '舒缓、放松、治愈心灵',
      greet: ['疲惫的心灵需要休息~', '让我们放松一下~', '欢迎来到治愈空间~'],
      intro: ['在这里放下疲惫~', '让音乐治愈心灵~', '享受宁静时光~'],
      end: ['希望你被治愈~', '元气满满地离开~', '下次再见~'],
      keywords: ['治愈', '放松', '宁静', '美好', '温暖'],
    },
  };

  // 获取主要风格配置
  var primaryStyle = styles[0] || '活泼';
  var style = styleConfig[primaryStyle] || styleConfig['活泼'];

  // 活动流程模板
  var flowTemplates = {
    '晚会': [
      { ratio:0.10, title:'开场环节', desc:'主持人以' + style.tone + '的风格宣布「' + theme + '」正式开始，播放预热音乐，现场氛围预热，' + style.keywords[0] + '的气氛弥漫全场' },
      { ratio:0.22, title:'节目表演', desc:'多个精彩节目依次登场，含歌舞、才艺秀等，表演者们以' + style.tone + '的风格呈现，彰显' + primaryStyle + '特色' },
      { ratio:0.20, title:'互动游戏', desc:'观众参与趣味游戏（歌曲接龙、你画我猜、踩气球等），' + style.keywords[1] + '的互动让现场气氛达到高潮，赢取精美礼品' },
      { ratio:0.25, title:'主题表演', desc:'「' + theme + '」核心精彩节目压轴登场，全体演员以最饱满的热情呈现，将' + style.keywords[2] + '的氛围推向顶点' },
      { ratio:0.13, title:'自由交流', desc:'茶歇时间，新老成员自由交流，品尝精美茶点，展示活动成果，享受' + style.keywords[3] + '的时光' },
      { ratio:0.10, title:'结束环节', desc:'主持人总结致辞，公布下期活动安排，全员合影留念，在' + style.keywords[4] + '的氛围中圆满落幕' },
    ],
    '迎新': [
      { ratio:0.10, title:'破冰暖场', desc:'主持人以' + style.tone + '的风格介绍「' + theme + '」流程，通过趣味破冰小游戏让新成员快速认识彼此，消除陌生感' },
      { ratio:0.20, title:'组织介绍', desc:'学长学姐分享加入经历与心得，展示社团/班级精彩活动集锦，传递' + style.keywords[0] + '的氛围' },
      { ratio:0.25, title:'互动体验', desc:'分组进行「' + primaryStyle + '」风格小游戏，新老成员混搭组队，增进了解，培养默契' },
      { ratio:0.20, title:'才艺展示', desc:'新成员自愿上台展示才艺，老成员助阵表演，共同营造' + style.keywords[1] + '的舞台氛围' },
      { ratio:0.15, title:'自由交流', desc:'茶歇时间，填写报名表，学长学姐解答新成员疑问，建立初步联系' },
      { ratio:0.10, title:'合影收尾', desc:'集体合影，发放定制纪念品，宣布后续「' + theme + '」系列活动安排，留下美好回忆' },
    ],
    '毕业': [
      { ratio:0.10, title:'入场开幕', desc:'背景音乐响起，毕业生们身着盛装依次入场，「' + theme + '」正式拉开帷幕，现场弥漫着' + style.keywords[0] + '的氛围' },
      { ratio:0.20, title:'回忆相册', desc:'播放精心剪辑的四年时光视频，回顾大学生活的点点滴滴，勾起' + style.keywords[1] + '的共同回忆' },
      { ratio:0.25, title:'致辞环节', desc:'师生代表先后发言，表达感恩与祝福，「' + theme + '」情感在此刻升华，全场沉浸在' + style.keywords[2] + '之中' },
      { ratio:0.20, title:'才艺汇演', desc:'班级/社团节目汇演，充满' + primaryStyle + '气息的表演令人难忘，掌声雷动' },
      { ratio:0.15, title:'互动留念', desc:'班级游戏、抢答有奖，毕业生尽情释放' + style.keywords[3] + '情绪，留下珍贵回忆' },
      { ratio:0.10, title:'告别仪式', desc:'燃放荧光棒，全员合唱经典曲目，「' + theme + '」在' + style.keywords[4] + '的氛围中圆满落幕' },
    ],
    '联谊': [
      { ratio:0.10, title:'集合破冰', desc:'「' + theme + '」正式开始，随机分组，通过趣味自我介绍打破陌生感，营造' + style.keywords[0] + '的氛围' },
      { ratio:0.20, title:'团队竞技', desc:'设计「' + primaryStyle + '」风格团队游戏，考验默契与合作，各组展开激烈比拼' },
      { ratio:0.25, title:'才艺切磋', desc:'两校/两班代表轮番表演，互相欣赏，气氛活跃，展现青春风采' },
      { ratio:0.20, title:'互选环节', desc:'特色互动环节（星球漂流瓶/暗号传递/心动互选），增进了解，寻找志同道合的伙伴' },
      { ratio:0.15, title:'自由社交', desc:'开放场地，美食茶歇，自由交流，「' + theme + '」情谊在此建立，留下美好印象' },
      { ratio:0.10, title:'合影送别', desc:'互赠精心准备的小礼物，合影留念，期待下次「' + theme + '」再相见' },
    ],
    '社团招新': [
      { ratio:0.12, title:'宣传开场', desc:'「' + theme + '」正式启动，播放社团形象视频，吸引新生目光，展现' + style.keywords[0] + '的社团文化' },
      { ratio:0.25, title:'社团展台', desc:'各部门设展台，展示作品与活动成果，「' + primaryStyle + '」风格陈设吸引新生驻足参观' },
      { ratio:0.25, title:'体验活动', desc:'开放体验工坊，新生亲身体验社团核心活动内容，感受' + style.keywords[1] + '的氛围' },
      { ratio:0.20, title:'现场问答', desc:'老成员解答疑问，分享加入「' + theme + '」后的成长故事，消除新生顾虑' },
      { ratio:0.10, title:'报名加入', desc:'引导感兴趣的新生填写报名表，加入社团群，开启精彩的社团之旅' },
      { ratio:0.08, title:'收尾感谢', desc:'主持人总结，宣布正式成员名单公布时间，期待与新生相聚在下次活动' },
    ],
    '其他': [
      { ratio:0.10, title:'活动开场', desc:'主持人以' + style.tone + '的风格宣布「' + theme + '」正式开始，介绍活动流程与注意事项' },
      { ratio:0.25, title:'主体活动', desc:'「' + theme + '」核心内容展开，' + style.keywords[0] + '的氛围贯穿始终，参与者全情投入' },
      { ratio:0.25, title:'互动环节', desc:'参与者积极互动，趣味活动让现场气氛达到高潮，充满' + style.keywords[1] + '的欢乐' },
      { ratio:0.20, title:'分享交流', desc:'各方分享感受与收获，「' + theme + '」主旨在互动中升华，留下深刻印象' },
      { ratio:0.10, title:'答谢致辞', desc:'主办方发表感谢，对本次「' + theme + '」进行总结，表达美好祝愿' },
      { ratio:0.10, title:'结束合影', desc:'全体合影，「' + theme + '」圆满落幕，期待下次再聚，珍藏美好回忆' },
    ],
  };

  // 任务模板
  var taskTemplates = {
    '晚会': [
      { title: '确定演出场地', desc: '联系' + (venue || '学校相关部门') + '，预订场地并确认音响灯光设备' },
      { title: '节目编排', desc: '组织节目彩排，确保节目质量，与表演者沟通' + style.tone + '的表演风格' },
      { title: '宣传推广', desc: '制作海报、短视频进行宣传，突出「' + theme + '」的' + primaryStyle + '特色' },
      { title: '物资采购', desc: '购买道具、奖品和茶歇用品，准备' + style.keywords[0] + '风格的装饰' },
      { title: '人员安排', desc: '安排主持人、摄影、后勤人员，明确分工' },
      { title: '应急预案', desc: '制定突发情况应对方案，确保活动顺利进行' },
    ],
    '迎新': [
      { title: '破冰游戏准备', desc: '设计符合' + primaryStyle + '风格的破冰游戏，准备游戏道具' },
      { title: '资料准备', desc: '准备迎新手册、报名表和新生指南' },
      { title: '场地布置', desc: '营造' + style.keywords[0] + '的迎新氛围，悬挂横幅和装饰' },
      { title: '志愿者培训', desc: '培训迎新志愿者，讲解流程和注意事项' },
      { title: '餐饮安排', desc: '准备迎新茶歇，确保饮食安全' },
      { title: '后续跟进', desc: '建立新生群，持续跟进新生情况' },
    ],
    '毕业': [
      { title: '视频制作', desc: '制作毕业纪念视频，收集四年精彩瞬间' },
      { title: '场地装饰', desc: '布置毕业典礼场地，营造' + style.keywords[0] + '的氛围' },
      { title: '邀请嘉宾', desc: '邀请老师和嘉宾出席，发送邀请函' },
      { title: '礼品准备', desc: '准备毕业纪念品和相册' },
      { title: '流程彩排', desc: '进行毕业典礼彩排，确保流程顺畅' },
      { title: '合影安排', desc: '组织班级和集体合影，准备拍照道具' },
    ],
    '联谊': [
      { title: '嘉宾邀请', desc: '邀请联谊对象参加活动，发送精美邀请函' },
      { title: '互动游戏设计', desc: '设计符合' + primaryStyle + '风格的互动游戏，增进彼此了解' },
      { title: '场地布置', desc: '营造' + style.keywords[0] + '的联谊氛围，浪漫温馨' },
      { title: '配对机制', desc: '设计合理的配对方式，促进交流' },
      { title: '餐饮安排', desc: '准备精致的茶点和饮品' },
      { title: '后续跟进', desc: '建立联谊群，促进后续交流' },
    ],
    '社团招新': [
      { title: '展台设计', desc: '设计吸引人的招新展台，突出' + primaryStyle + '风格' },
      { title: '宣传物料', desc: '制作招新海报、传单和宣传视频' },
      { title: '成员培训', desc: '培训招新接待人员，讲解社团特色' },
      { title: '报名系统', desc: '准备报名表和报名流程，设置咨询台' },
      { title: '展示内容', desc: '准备社团成果展示，制作宣传册' },
      { title: '后续沟通', desc: '及时回复报名人员咨询，发送欢迎信息' },
    ],
    '其他': [
      { title: '场地预订', desc: '预订' + (venue || '活动') + '场地，确认设施情况' },
      { title: '活动宣传', desc: '进行活动宣传推广，吸引参与者' },
      { title: '物资准备', desc: '准备活动所需物资，包括道具和礼品' },
      { title: '人员分工', desc: '明确各人员职责，确保各司其职' },
      { title: '流程策划', desc: '详细规划活动流程，制定时间表' },
      { title: '应急预案', desc: '制定安全应急预案，保障活动安全' },
    ],
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

  // 生成丰富的主持串词
  function generateRichScript(title, timeInfo, index, total) {
    var greet = style.greet[Math.floor(Math.random() * style.greet.length)];
    var intro = style.intro[Math.floor(Math.random() * style.intro.length)];
    var end = style.end[Math.floor(Math.random() * style.end.length)];
    
    var scripts = {
      '开场环节': greet + '欢迎来到「' + theme + '」的现场！\n\n' + intro + '今天我们将一起度过一个' + style.keywords[0] + '的夜晚！现在，让我们用最热烈的掌声开启今天的活动！\n\n（播放开场音乐）',
      '节目表演': '感谢刚才精彩的开场！接下来是我们期待已久的节目表演环节！\n\n在这个环节中，我们将欣赏到多个精彩节目，包括歌舞、才艺秀等，每一个节目都经过精心准备！\n\n让我们用热烈的掌声欢迎第一位表演者登场！',
      '互动游戏': '精彩的表演告一段落，现在让我们进入' + style.keywords[1] + '的互动游戏环节！\n\n接下来我们要玩一个非常有趣的游戏——「' + (['歌曲接龙', '你画我猜', '踩气球', '谁是卧底'][Math.floor(Math.random() * 4)]) + '」！\n\n有没有勇敢的小伙伴想要上台挑战？请举手示意！',
      '主题表演': '经过了轻松愉快的游戏环节，现在让我们把目光投向今晚的重头戏——主题表演！\n\n「' + theme + '」的核心节目即将登场，这是我们今晚最期待的时刻！\n\n让我们用最热烈的掌声，请出今天的主角们！',
      '自由交流': '现在是自由交流时间！我们为大家准备了精美的茶歇，请大家尽情享用！\n\n在这段时间里，大家可以自由交流，认识新朋友，分享彼此的感受。\n\n记得填写报名表哦，期待与大家再次相见！',
      '结束环节': '亲爱的朋友们，快乐的时光总是短暂的！「' + theme + '」就要和大家说再见了！\n\n今晚我们一同欣赏了精彩的表演，参与了有趣的游戏，收获了满满的欢乐和回忆！\n\n感谢每一位参与者和工作人员的辛勤付出！' + end + '我们下次再见！',
      '破冰暖场': greet + '欢迎来到「' + theme + '」！\n\n为了让大家快速认识彼此，我们先来玩一个破冰小游戏！\n\n请大家按照指示行动，让我们一起度过这个' + style.keywords[0] + '的时刻！',
      '组织介绍': '接下来让我们了解一下本次活动的组织方和精彩内容！\n\n学长学姐们将分享他们的加入经历和心得，让我们一起感受这个大家庭的温暖！',
      '互动体验': '现在是互动体验时间！我们准备了「' + primaryStyle + '」风格的小游戏，希望大家积极参与！\n\n分组进行，看看哪组最有默契！',
      '才艺展示': '有才艺的小伙伴们看过来！展示你的时刻到了！\n\n无论你是唱歌、跳舞还是其他才艺，都欢迎上台展示！\n\n让我们用掌声鼓励勇敢的表演者！',
      '合影收尾': '美好的时光总是短暂，但回忆是永恒的！\n\n现在让我们一起合影留念，记录下这美好的时刻！\n\n请大家排好队，准备拍照！',
      '入场开幕': '背景音乐响起，让我们用热烈的掌声欢迎各位毕业生入场！\n\n「' + theme + '」正式开始！让我们共同见证这个难忘的时刻！',
      '回忆相册': '让我们一起回顾这美好的时光！\n\n接下来将播放精心制作的毕业纪念视频，让我们一起重温那些珍贵的回忆！',
      '致辞环节': '接下来有请各位领导和老师为我们送上祝福！\n\n他们将分享对毕业生的期望和祝福，让我们用掌声欢迎！',
      '才艺汇演': '精彩的才艺表演即将开始！\n\n毕业生们将用他们的才艺为我们呈现一场视觉盛宴！\n\n让我们拭目以待！',
      '互动留念': '让我们尽情享受这最后的时光！\n\n接下来是互动游戏时间，让我们一起留下美好的回忆！',
      '告别仪式': '天下没有不散的筵席，但我们的情谊永存！\n\n让我们一起合唱这首经典歌曲，为「' + theme + '」画上圆满的句号！',
      '集合破冰': greet + '欢迎来到「' + theme + '」！\n\n让我们快速认识一下彼此！请大家随机分组，进行简短的自我介绍！',
      '团队竞技': '团队合作的时刻到了！\n\n接下来的游戏需要大家齐心协力，看看哪队最默契！\n\n准备好了吗？比赛开始！',
      '才艺切磋': '才艺大比拼开始！\n\n两队代表将轮番表演，展示各自的才艺！\n\n谁才是今天的才艺之星？让我们拭目以待！',
      '互选环节': '神秘的互选环节来啦！\n\n通过这个环节，大家可以找到志同道合的伙伴！\n\n准备好了吗？让我们开始！',
      '自由社交': '自由社交时间到！\n\n大家可以放松一下，享用美食，多认识些新朋友！\n\n希望大家都能找到聊得来的伙伴！',
      '合影送别': '美好的时光总是短暂，让我们合影留念！\n\n感谢大家的参与，期待下次「' + theme + '」再相见！',
      '宣传开场': greet + '欢迎来到「' + theme + '」！\n\n让我们一起了解这个精彩的社团！首先，请观看我们的宣传视频！',
      '社团展台': '各部门已经准备就绪！\n\n请大家自由参观各个展台，了解不同部门的特色！\n\n有任何问题都可以咨询现场的学长学姐！',
      '体验活动': '亲身体验的时刻到了！\n\n我们准备了各种体验活动，欢迎大家参与！\n\n感受一下社团的魅力吧！',
      '现场问答': '有什么问题尽管问！\n\n学长学姐们将为你解答关于社团的任何疑问！\n\n不要害羞，大胆提问！',
      '报名加入': '心动不如行动！\n\n如果你对我们社团感兴趣，请填写报名表！\n\n期待你的加入！',
      '收尾感谢': '感谢大家的参与！\n\n今天的招新活动圆满结束！\n\n期待下次活动与大家相见！',
      '活动开场': greet + '「' + theme + '」正式开始！\n\n感谢大家在百忙之中来到现场！\n\n让我们一起度过这个' + style.keywords[0] + '的时刻！',
      '主体活动': '精彩的主体活动即将开始！\n\n请大家保持安静，准备欣赏今天的重头戏！\n\n准备好了吗？让我们开始！',
      '分享交流': '让我们分享一下今天的收获和感受！\n\n有哪位朋友想要分享一下？\n\n欢迎踊跃发言！',
      '答谢致辞': '感谢大家的支持与参与！\n\n你们是最棒的！\n\n希望今天的活动能给大家留下美好的回忆！',
    };
    
    return scripts[title] || greet + '欢迎来到「' + theme + '」！现在是' + timeInfo + '，「' + title + '」即将开始！';
  }

  // 生成串词
  var script = [];
  for (var i = 0; i < process.length; i++) {
    var p = process[i];
    script.push({
      time: p.time + ' ' + p.title,
      content: generateRichScript(p.title, p.time, i, process.length)
    });
  }

  // 生成任务
  var taskList = taskTemplates[type] || taskTemplates['其他'];
  var tasks = [];
  for (var i = 0; i < taskList.length; i++) {
    tasks.push({
      title: taskList[i].title,
      desc: taskList[i].desc,
      done: i < 2
    });
  }

  // 生成歌单
  var playlistDB = {
    energetic: [
      { title: 'FIRE', artist: 'BTS', duration: '3:23', cover: '🎵' },
      { title: 'Dynamite', artist: 'BTS', duration: '3:19', cover: '🎵' },
      { title: 'Permission to Dance', artist: 'BTS', duration: '3:07', cover: '🎵' },
      { title: '野狼disco', artist: '宝石Gem', duration: '3:51', cover: '🎵' },
      { title: '我管你', artist: '薛之谦', duration: '3:28', cover: '🎵' },
      { title: '红莲华', artist: 'LiSA', duration: '4:22', cover: '🎵' },
    ],
    chill: [
      { title: '光年之外', artist: '邓紫棋', duration: '4:04', cover: '🎵' },
      { title: '平凡之路', artist: '朴树', duration: '4:52', cover: '🎵' },
      { title: '等你下课', artist: '周杰伦', duration: '3:38', cover: '🎵' },
      { title: '说散就散', artist: '袁娅维', duration: '3:57', cover: '🎵' },
      { title: 'Always With Me', artist: '久石让', duration: '2:36', cover: '🎵' },
      { title: '起风了', artist: '买辣椒也用券', duration: '4:50', cover: '🎵' },
    ],
    formal: [
      { title: '星辰大海', artist: '黄霄雲', duration: '4:08', cover: '🎵' },
      { title: '你的答案', artist: '阿冗', duration: '4:12', cover: '🎵' },
      { title: '漂洋过海来看你', artist: '李宗盛', duration: '4:35', cover: '🎵' },
      { title: '遇见', artist: '孙燕姿', duration: '4:04', cover: '🎵' },
      { title: '好久不见', artist: '陈奕迅', duration: '4:15', cover: '🎵' },
      { title: '时间都去哪儿了', artist: '王铮亮', duration: '4:28', cover: '🎵' },
    ],
    anime: [
      { title: '千本樱', artist: '初音未来', duration: '4:08', cover: '🎵' },
      { title: '恋爱循环', artist: '花泽香菜', duration: '4:15', cover: '🎵' },
      { title: '青鸟', artist: '生物股长', duration: '4:02', cover: '🎵' },
      { title: '红莲华', artist: 'LiSA', duration: '4:22', cover: '🎵' },
      { title: '君の名は希望', artist: '乃木坂46', duration: '4:44', cover: '🎵' },
      { title: '世界第一公主殿下', artist: '初音未来', duration: '3:52', cover: '🎵' },
    ],
    graduation: [
      { title: '突然好想你', artist: '五月天', duration: '4:44', cover: '🎵' },
      { title: '那些年', artist: '胡夏', duration: '4:20', cover: '🎵' },
      { title: '栀子花开', artist: '何炅', duration: '4:15', cover: '🎵' },
      { title: '晴天', artist: '周杰伦', duration: '4:29', cover: '🎵' },
      { title: '追梦赤子心', artist: 'GALA', duration: '4:17', cover: '🎵' },
      { title: '朋友', artist: '周华健', duration: '4:26', cover: '🎵' },
    ],
  };

  // 根据类型和风格选择歌单
  var playlistType = 'energetic';
  if (type === '毕业') {
    playlistType = 'graduation';
  } else if (styles.indexOf('搞笑') >= 0 || theme.indexOf('动漫') >= 0) {
    playlistType = 'anime';
  } else if (styles.indexOf('正式') >= 0) {
    playlistType = 'formal';
  } else if (styles.indexOf('温情') >= 0 || styles.indexOf('治愈') >= 0) {
    playlistType = 'chill';
  }

  var songs = playlistDB[playlistType];
  var playlist = [];
  var sections = ['开场预热', '互动高潮', '主题表演', '结束送别'];
  for (var i = 0; i < sections.length; i++) {
    var sectionSongs = [];
    for (var j = 0; j < 3 && i * 3 + j < songs.length; j++) {
      sectionSongs.push(songs[i * 3 + j]);
    }
    playlist.push({
      section: sections[i] + (process[i] ? '（' + process[i].title + '）' : ''),
      songs: sectionSongs
    });
  }

  return {
    process: process,
    playlist: playlist,
    script: script,
    tasks: tasks,
  };
}
