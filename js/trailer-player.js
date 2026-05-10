// trailer-player.js — Canvas 动态预告片播放器引擎 v2.0

(function() {
  'use strict';

  var SCENES = [
    { id: 'logo',  frames: 90  },
    { id: 'title', frames: 120 },
    { id: 'info',  frames: 120 },
    { id: 'copy',  frames: 150 },
    { id: 'cta',   frames: 120 },
  ];
  var TOTAL_FRAMES = SCENES.reduce(function(s, sc) { return s + sc.frames; }, 0);

  // ── 主题配置（bg1=深色底, bg2=中间色, accent=高亮色, glow=光晕色） ──────────
  var THEMES = {
    '活泼': { bg1:'#1a0533', bg2:'#4a1060', accent:'#ff6bcb', glow:'rgba(255,107,203,0.4)', line:'rgba(255,220,100,0.25)', ptx:['🎉','🎊','✨','🌟','🎈'] },
    '正式': { bg1:'#0a0e1a', bg2:'#0d1b3e', accent:'#C8A951', glow:'rgba(200,169,81,0.35)',  line:'rgba(200,169,81,0.2)',   ptx:['★','◆','●','▲','◇'] },
    '炫酷': { bg1:'#050510', bg2:'#0f0c29', accent:'#00d4ff', glow:'rgba(0,212,255,0.4)',    line:'rgba(0,212,255,0.2)',    ptx:['⚡','◈','▶','◉','✦'] },
    '温情': { bg1:'#1a0520', bg2:'#3d0a40', accent:'#ff9de2', glow:'rgba(255,157,226,0.4)',  line:'rgba(255,180,220,0.2)',  ptx:['💝','💕','🌸','🌷','✿'] },
    '燃':   { bg1:'#1a0800', bg2:'#3d1200', accent:'#ff6b00', glow:'rgba(255,107,0,0.45)',   line:'rgba(255,200,0,0.25)',   ptx:['🔥','💥','⚡','🌟','▲'] },
  };

  var _canvas = null, _ctx = null;
  var _frame = 0, _playing = false, _rafId = null;
  var _data = {}, _conf = null, _pts = [], _copyChars = [];
  var _lines = [];   // 几何线条（初始化时生成，固定不动）

  // ── 公开 API ──────────────────────────────────────────────────────────────
  window.TrailerPlayer = {
    init: function(data) {
      _canvas = document.getElementById('trailer-canvas');
      if (!_canvas) return;
      _ctx = _canvas.getContext('2d');
      _data = data || {};
      _conf = THEMES[_data.style] || THEMES['活泼'];
      _frame = 0; _playing = false;
      _pts   = _mkPts();
      _lines = _mkLines();
      _copyChars = (_data.copy || '').split('');
      _draw(0);
    },
    play:      function() { if (!_playing) { _playing = true; _loop(); } },
    pause:     function() { _playing = false; if (_rafId) cancelAnimationFrame(_rafId); },
    replay:    function() { _frame = 0; _playing = true; _loop(); },
    isPlaying: function() { return _playing; },
    progress:  function() { return _frame / TOTAL_FRAMES; },
  };

  // ── 初始化几何线条（斜线网格装饰） ─────────────────────────────────────────
  function _mkLines() {
    var arr = [];
    for (var i = 0; i < 8; i++) {
      arr.push({
        x1: Math.random()*560, y1: -20,
        x2: Math.random()*560, y2: 335,
        w:  Math.random()*0.8 + 0.3,
      });
    }
    // 横线
    for (var j = 0; j < 4; j++) {
      arr.push({ x1: -20, y1: Math.random()*315, x2: 580, y2: Math.random()*315, w: Math.random()*0.6+0.2 });
    }
    return arr;
  }

  // ── 初始化粒子 ─────────────────────────────────────────────────────────────
  function _mkPts() {
    var arr = [], ptx = (_conf||THEMES['活泼']).ptx;
    for (var i = 0; i < 22; i++) {
      arr.push({
        x:  Math.random()*560, y: Math.random()*315,
        vx: (Math.random()-0.5)*0.9, vy: -Math.random()*1.2-0.2,
        a:  Math.random()*0.55+0.15,
        sz: Math.random()*14+8,
        c:  ptx[i % ptx.length],
        trail: [],
      });
    }
    return arr;
  }

  // ── 主循环 ─────────────────────────────────────────────────────────────────
  function _loop() {
    if (!_playing) return;
    _frame++;
    if (_frame >= TOTAL_FRAMES) {
      _frame = TOTAL_FRAMES; _draw(_frame); _updCtrl(); _playing = false;
      var pb = document.getElementById('ctrl-play');
      if (pb) pb.textContent = '▶';
      setTimeout(function() { _frame=0; _playing=true; _loop(); if(pb) pb.textContent='⏸'; }, 900);
      return;
    }
    _draw(_frame); _updCtrl();
    _rafId = requestAnimationFrame(_loop);
  }

  // ── 主绘制 ─────────────────────────────────────────────────────────────────
  function _draw(f) {
    if (!_ctx) return;
    var W=560, H=315, c=_conf||THEMES['活泼'];

    // 1. 深色渐变背景
    var g = _ctx.createRadialGradient(W*0.35, H*0.4, 0, W*0.5, H*0.5, W*0.75);
    g.addColorStop(0, c.bg2); g.addColorStop(1, c.bg1);
    _ctx.fillStyle = g; _ctx.fillRect(0, 0, W, H);

    // 2. 动态光晕（随帧缓慢呼吸）
    var pulse = 0.7 + 0.3 * Math.sin(f * 0.04);
    var hg = _ctx.createRadialGradient(W*0.5, H*0.45, 0, W*0.5, H*0.45, W*0.45*pulse);
    hg.addColorStop(0, c.glow); hg.addColorStop(1, 'transparent');
    _ctx.fillStyle = hg; _ctx.fillRect(0, 0, W, H);

    // 副光晕（右下角）
    var hg2 = _ctx.createRadialGradient(W*0.8, H*0.8, 0, W*0.8, H*0.8, W*0.3);
    hg2.addColorStop(0, c.glow.replace('0.4','0.2').replace('0.45','0.2').replace('0.35','0.15')); hg2.addColorStop(1, 'transparent');
    _ctx.fillStyle = hg2; _ctx.fillRect(0, 0, W, H);

    // 3. 几何线条装饰
    _ctx.save();
    _ctx.strokeStyle = c.line; _ctx.lineWidth = 0.6;
    _lines.forEach(function(l) {
      _ctx.beginPath(); _ctx.moveTo(l.x1, l.y1); _ctx.lineTo(l.x2, l.y2);
      _ctx.globalAlpha = l.w * 0.8; _ctx.stroke();
    });
    _ctx.restore();

    // 4. 底部 & 顶部暗边（让画面有深度）
    var topG = _ctx.createLinearGradient(0,0,0,60);
    topG.addColorStop(0,'rgba(0,0,0,0.5)'); topG.addColorStop(1,'transparent');
    _ctx.fillStyle=topG; _ctx.fillRect(0,0,W,60);
    var botG = _ctx.createLinearGradient(0,H-50,0,H);
    botG.addColorStop(0,'transparent'); botG.addColorStop(1,'rgba(0,0,0,0.6)');
    _ctx.fillStyle=botG; _ctx.fillRect(0,H-50,W,50);

    // 5. 粒子层
    _updPts(W,H); _drawPts();

    // 6. 场景内容
    var sc=_scId(f), sf=_scF(f);
    if(sc==='logo')  _s1(sf,W,H,c);
    if(sc==='title') _s2(sf,W,H,c);
    if(sc==='info')  _s3(sf,W,H,c);
    if(sc==='copy')  _s4(sf,W,H,c);
    if(sc==='cta')   _s5(sf,W,H,c,f);

    // 7. 顶部品牌小标 + 进度条
    _ctx.save();
    _ctx.font='bold 11px "Noto Sans SC",sans-serif';
    _ctx.fillStyle='rgba(255,255,255,0.55)'; _ctx.textAlign='left';
    _ctx.fillText('🎵 腾讯AI', 14, 20);
    _ctx.restore();
    _ctx.fillStyle='rgba(255,255,255,0.15)'; _ctx.fillRect(0,H-3,W,3);
    _ctx.fillStyle=c.accent; _ctx.fillRect(0,H-3,W*(f/TOTAL_FRAMES),3);
  }

  // ── 场景1：Logo 飞入 ───────────────────────────────────────────────────────
  function _s1(sf,W,H,c) {
    var e = _ease(sf/35);
    var y = H/2 - 5 + (1-e)*70;
    _ctx.save(); _ctx.globalAlpha = e; _ctx.textAlign = 'center';

    // 发光文字底层
    _ctx.shadowColor = c.accent; _ctx.shadowBlur = 24*e;
    _ctx.font = 'bold 40px "Noto Sans SC",sans-serif'; _ctx.fillStyle = '#fff';
    _ctx.fillText('腾讯 AI', W/2, y);

    // 下划线装饰
    _ctx.shadowBlur = 0;
    var lw = 120*e;
    _ctx.fillStyle = c.accent; _ctx.fillRect(W/2-lw/2, y+8, lw, 2);

    // 副标题
    _ctx.globalAlpha = e * 0.8;
    _ctx.font = '13px "Noto Sans SC",sans-serif'; _ctx.fillStyle = 'rgba(255,255,255,0.85)';
    _ctx.fillText('QQ音乐 × 腾讯视频 × AI校园活动助手', W/2, y+30);
    _ctx.restore();
  }

  // ── 场景2：活动标题 ────────────────────────────────────────────────────────
  function _s2(sf,W,H,c) {
    var e = _ease(sf/45);
    var title = _data.title || '精彩活动';
    _ctx.save(); _ctx.textAlign = 'center';

    // 毛玻璃卡片
    _ctx.globalAlpha = e * 0.55;
    _ctx.fillStyle = 'rgba(255,255,255,0.08)';
    _rr(50, H/2-52, W-100, 96, 16); _ctx.fill();
    // 卡片描边
    _ctx.globalAlpha = e * 0.4;
    _ctx.strokeStyle = c.accent; _ctx.lineWidth = 1;
    _rr(50, H/2-52, W-100, 96, 16); _ctx.stroke();

    // 顶部标签
    _ctx.globalAlpha = e;
    _ctx.font = '11px "Noto Sans SC",sans-serif'; _ctx.fillStyle = c.accent;
    _ctx.fillText('✦  活动预告  ✦', W/2, H/2-26);

    // 主标题（带发光）
    _ctx.shadowColor = c.accent; _ctx.shadowBlur = 12;
    _ctx.font = 'bold 28px "Noto Sans SC",sans-serif'; _ctx.fillStyle = '#fff';
    _fitTxt(title, W/2, H/2+10, W-120, 28);
    _ctx.restore();
  }

  // ── 场景3：活动信息逐行飞入 ────────────────────────────────────────────────
  function _s3(sf,W,H,c) {
    var items = [
      { icon:'📅', label: _data.date   || '时间待定' },
      { icon:'👥', label: (_data.people|| '--') + ' 人参加' },
      { icon:'🎭', label: _data.type   || '精彩活动' },
    ];
    _ctx.save(); _ctx.textAlign = 'center';
    var cardH = 36, gap = 44, startY = H/2 - gap;

    items.forEach(function(it, i) {
      var t  = Math.min((sf - i*22) / 38, 1);
      var e  = _ease(t); if (e <= 0) return;
      var cy = startY + i*gap;
      var dx = (1-e)*60;

      // 行背景胶囊
      _ctx.globalAlpha = e * 0.35;
      _ctx.fillStyle = 'rgba(255,255,255,0.1)';
      _rr(W/2-130+dx, cy-cardH/2, 260, cardH, cardH/2); _ctx.fill();
      // 左侧彩色竖线
      _ctx.globalAlpha = e * 0.9;
      _ctx.fillStyle = c.accent;
      _ctx.fillRect(W/2-122+dx, cy-12, 3, 24);

      // 文字
      _ctx.globalAlpha = e;
      _ctx.font = '14px "Noto Sans SC",sans-serif'; _ctx.fillStyle = '#fff';
      _ctx.fillText(it.icon + '  ' + it.label, W/2 + dx, cy+5);
    });
    _ctx.restore();
  }

  // ── 场景4：文案打字机 ──────────────────────────────────────────────────────
  function _s4(sf,W,H,c) {
    var txt = _copyChars.slice(0, Math.floor(sf/3)).join('') + (Math.floor(sf/18)%2 ? '▌' : '');
    _ctx.save();

    // 毛玻璃背景
    _ctx.fillStyle = 'rgba(0,0,0,0.45)';
    _rr(30, H/2-72, W-60, 140, 14); _ctx.fill();
    _ctx.strokeStyle = c.accent.replace(')', ',0.4)').replace('rgb','rgba').replace('#','rgba(').replace(/^rgba\(([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2}),/, function(m,r,g,b){ return 'rgba('+parseInt(r,16)+','+parseInt(g,16)+','+parseInt(b,16)+','; });
    _ctx.strokeStyle = c.accent; _ctx.globalAlpha = 0.35; _ctx.lineWidth = 1;
    _rr(30, H/2-72, W-60, 140, 14); _ctx.stroke();

    // 标题行
    _ctx.globalAlpha = 1;
    _ctx.font = 'bold 12px "Noto Sans SC",sans-serif'; _ctx.fillStyle = c.accent; _ctx.textAlign = 'center';
    _ctx.fillText('✦  宣传文案  ✦', W/2, H/2-48);

    // 分割线
    _ctx.globalAlpha = 0.3; _ctx.fillStyle = c.accent;
    _ctx.fillRect(W/2-60, H/2-38, 120, 1);

    // 文案正文
    _ctx.globalAlpha = 1;
    _ctx.font = '14px "Noto Sans SC",sans-serif'; _ctx.fillStyle = '#fff';
    _wrapTxt(txt, W/2, H/2-20, W-80, 22);
    _ctx.restore();
  }

  // ── 场景5：CTA ─────────────────────────────────────────────────────────────
  function _s5(sf,W,H,c,f) {
    var fadeIn  = _ease(Math.min(sf/28, 1));
    var fadeOut = sf > 98 ? _ease((sf-98)/22) : 0;
    var alpha   = fadeIn * (1 - fadeOut);
    var bk      = Math.floor(sf/22)%2;
    _ctx.save(); _ctx.textAlign = 'center';

    // 中央光晕扩散
    _ctx.globalAlpha = alpha * 0.5;
    var cg = _ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,180*fadeIn);
    cg.addColorStop(0, c.glow); cg.addColorStop(1,'transparent');
    _ctx.fillStyle = cg; _ctx.fillRect(0,0,W,H);

    // 主标题（带发光）
    _ctx.globalAlpha = alpha;
    _ctx.shadowColor = c.accent; _ctx.shadowBlur = 20 * fadeIn;
    _ctx.font = 'bold 32px "Noto Sans SC",sans-serif'; _ctx.fillStyle = '#fff';
    _fitTxt(_data.title||'精彩活动', W/2, H/2-8, W-80, 32);

    // 下划线
    _ctx.shadowBlur = 0;
    _ctx.fillStyle = c.accent;
    _ctx.globalAlpha = alpha * 0.8;
    _ctx.fillRect(W/2-80, H/2+8, 160, 2);

    // CTA 按钮样式文字（闪烁）
    _ctx.globalAlpha = alpha * (bk ? 1 : 0.4);
    _ctx.fillStyle = c.bg1; _rr(W/2-90, H/2+22, 180, 36, 18); _ctx.fill();
    _ctx.fillStyle = c.accent; _rr(W/2-90, H/2+22, 180, 36, 18); _ctx.stroke && _ctx.stroke();
    _ctx.strokeStyle = c.accent; _ctx.lineWidth = 1.5;
    _rr(W/2-90, H/2+22, 180, 36, 18); _ctx.stroke();
    _ctx.font = 'bold 14px "Noto Sans SC",sans-serif'; _ctx.fillStyle = c.accent;
    _ctx.fillText('▶  立即报名  ·  期待相遇', W/2, H/2+46);

    // 底部品牌
    _ctx.globalAlpha = alpha * 0.5;
    _ctx.font = '10px "Noto Sans SC",sans-serif'; _ctx.fillStyle = '#fff';
    _ctx.fillText('腾讯AI校园活动助手 · QQ音乐 × 腾讯视频', W/2, H-14);
    _ctx.restore();
  }

  // ── 粒子更新 & 绘制（带拖尾） ─────────────────────────────────────────────
  function _updPts(W,H) {
    _pts.forEach(function(p) {
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > 6) p.trail.shift();
      p.x += p.vx; p.y += p.vy;
      if (p.y < -30) { p.y = H+10; p.x = Math.random()*W; p.trail=[]; }
      if (p.x < -30) p.x = W+10;
      if (p.x > W+30) p.x = -10;
    });
  }
  function _drawPts() {
    _pts.forEach(function(p) {
      // 拖尾
      p.trail.forEach(function(pt, i) {
        _ctx.save();
        _ctx.globalAlpha = p.a * (i/p.trail.length) * 0.18;
        _ctx.font = (p.sz*0.7)+'px serif'; _ctx.textAlign='center';
        _ctx.fillText(p.c, pt.x, pt.y); _ctx.restore();
      });
      // 主粒子
      _ctx.save();
      _ctx.globalAlpha = p.a * 0.6;
      _ctx.font = p.sz+'px serif'; _ctx.textAlign='center';
      _ctx.fillText(p.c, p.x, p.y); _ctx.restore();
    });
  }

  // ── 工具函数 ──────────────────────────────────────────────────────────────
  function _ease(t){t=Math.min(Math.max(t,0),1);return 1-Math.pow(1-t,3);}
  function _scId(f){var a=0;for(var i=0;i<SCENES.length;i++){a+=SCENES[i].frames;if(f<=a)return SCENES[i].id;}return SCENES[SCENES.length-1].id;}
  function _scF(f){var a=0;for(var i=0;i<SCENES.length;i++){if(f<=a+SCENES[i].frames)return f-a;a+=SCENES[i].frames;}return 0;}
  function _rr(x,y,w,h,r){_ctx.beginPath();_ctx.moveTo(x+r,y);_ctx.lineTo(x+w-r,y);_ctx.quadraticCurveTo(x+w,y,x+w,y+r);_ctx.lineTo(x+w,y+h-r);_ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);_ctx.lineTo(x+r,y+h);_ctx.quadraticCurveTo(x,y+h,x,y+h-r);_ctx.lineTo(x,y+r);_ctx.quadraticCurveTo(x,y,x+r,y);_ctx.closePath();}
  function _fitTxt(t,x,y,mw){while(_ctx.measureText(t).width>mw&&t.length>2)t=t.slice(0,-1);_ctx.fillText(t,x,y);}
  function _wrapTxt(t,x,y,mw,lh){var ws=t.split(''),l='',ls=[];ws.forEach(function(ch){var tt=l+ch;if(_ctx.measureText(tt).width>mw&&l){ls.push(l);l=ch;}else l=tt;});ls.push(l);ls.slice(0,4).forEach(function(ln,i){_ctx.fillText(ln,x,y+i*lh);});}
  function _updCtrl(){var f=document.getElementById('ctrl-fill'),t=document.getElementById('ctrl-time'),p=TrailerPlayer.progress();if(f)f.style.width=(p*100).toFixed(1)+'%';var s=Math.floor(p*10);if(t)t.textContent='0:'+(s<10?'0':'')+s+' / 0:10';}

})();
