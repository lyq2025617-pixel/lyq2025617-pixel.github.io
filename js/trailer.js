// trailer.js — 活动预告片生成交互逻辑 (v3.0 — LLM 驱动)

// 封面风格配置
const TRAILER_STYLES = {
  活泼: { cover: '🎉', gradient: 'linear-gradient(135deg,#ff6b6b,#ffd93d)', bgm: '好日子 - 宋祖英' },
  正式: { cover: '🏛️', gradient: 'linear-gradient(135deg,#2c3e50,#3498db)', bgm: '礼赞 - 陈奕迅' },
  炫酷: { cover: '⚡', gradient: 'linear-gradient(135deg,#0f0c29,#302b63,#24243e)', bgm: 'BOOM - X1' },
  温情: { cover: '💝', gradient: 'linear-gradient(135deg,#f093fb,#f5576c)', bgm: '朋友 - 周华健' },
  燃:   { cover: '🔥', gradient: 'linear-gradient(135deg,#f7971e,#ffd200)', bgm: '燃烧我的卡路里 - 火箭少女' },
};

function pickCoverStyle(inputs) {
  const s = inputs.styles || [];
  if (s.includes('炫酷') || s.includes('燃')) return '炫酷';
  if (s.includes('正式') || s.includes('专业')) return '正式';
  if (s.includes('温情') || s.includes('温馨')) return '温情';
  return '活泼';
}

// 状态变量
let _trailerInputs  = null;
let _coverStyle     = '活泼';
let _copyCache      = {};
let _activeCopyMode = '正式';
let _generated      = false;

// ─── 由 app.js 在结果页渲染后调用 ───────────────────────────────────────────
function initTrailerCard(inputs) {
  _trailerInputs  = inputs;
  _coverStyle     = pickCoverStyle(inputs);
  _copyCache      = {};
  _activeCopyMode = '正式';
  _generated      = false;

  // 封面风格 chip 预选
  document.querySelectorAll('#trailer-style-chips .trailer-chip').forEach(c => {
    c.classList.toggle('active', c.dataset.style === _coverStyle);
  });

  // BGM
  const bgmEl = document.getElementById('trailer-bgm');
  const styleConf = TRAILER_STYLES[_coverStyle] || TRAILER_STYLES['活泼'];
  if (bgmEl) bgmEl.textContent = '🎵 ' + styleConf.bgm;

  // 重置封面
  const coverEl = document.getElementById('trailer-cover');
  if (coverEl) coverEl.innerHTML = '<div class="trailer-cover-placeholder"><span>🎞️</span><p>点击生成后显示封面</p></div>';

  // 重置文案区提示
  const copyEl = document.getElementById('trailer-copy-text');
  if (copyEl) copyEl.innerHTML = '<span style="color:#aaa;font-size:13px">点击「生成预告片」后，AI 将为你生成个性化宣传文案</span>';

  // 按钮状态
  const btnGen     = document.getElementById('btn-gen-trailer');
  const btnPublish = document.getElementById('btn-publish-trailer');
  const btnShare   = document.getElementById('btn-share-trailer');
  if (btnGen)     { btnGen.textContent = '✨ 生成预告片'; btnGen.disabled = false; btnGen.style.cssText = ''; }
  if (btnPublish) { btnPublish.disabled = true;  btnPublish.style.opacity = '0.5'; }
  if (btnShare)   { btnShare.disabled   = true;  btnShare.style.opacity   = '0.5'; }

  // ── 封面风格 chip 切换 ──
  document.querySelectorAll('#trailer-style-chips .trailer-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#trailer-style-chips .trailer-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      _coverStyle = chip.dataset.style;
      const conf = TRAILER_STYLES[_coverStyle] || TRAILER_STYLES['活泼'];
      if (bgmEl) bgmEl.textContent = '🎵 ' + conf.bgm;
      if (_generated) renderTrailerCover();
    });
  });

  // ── 文案 tab 切换（从缓存读，无需再调接口）──
  document.querySelectorAll('.copy-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.copy-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      _activeCopyMode = tab.dataset.copy;
      if (_copyCache[_activeCopyMode] !== undefined) {
        const el = document.getElementById('trailer-copy-text');
        if (el) el.innerHTML = _copyCache[_activeCopyMode].replace(/\n/g, '<br>');
      }
    });
  });

  // ── 生成按钮 ──
  if (btnGen) btnGen.addEventListener('click', () => {
    _generated = false;
    _generateWithLLM(btnGen, btnPublish, btnShare);
  });

  // ── 发布 ──
  if (btnPublish) btnPublish.addEventListener('click', () => {
    alert('活动预告片已成功发布到腾讯视频！\n链接：https://v.qq.com/x/cover/mock_' + Date.now());
  });

  // ── 分享链接 ──
  if (btnShare) btnShare.addEventListener('click', () => {
    const shareRow  = document.getElementById('trailer-share-row');
    const linkInput = document.getElementById('trailer-link');
    if (shareRow && linkInput) {
      linkInput.value = 'https://v.qq.com/share/mock_' + Date.now().toString(36);
      shareRow.style.display = 'flex';
    }
  });

  const btnQQ = document.getElementById('btn-share-qq-trailer');
  const btnWX = document.getElementById('btn-share-wx-trailer');
  if (btnQQ) btnQQ.addEventListener('click', () => alert('预告片分享链接已发送到QQ群'));
  if (btnWX) btnWX.addEventListener('click', () => alert('预告片分享链接已发送到微信'));
}

// ─── LLM 流式生成文案 ────────────────────────────────────────────────────────
function _generateWithLLM(btnGen, btnPublish, btnShare) {
  btnGen.textContent = '⏳ AI 生成中...';
  btnGen.disabled = true;

  // 显示「生成中」蒙层
  var idle = document.getElementById('trailer-player-idle');
  var genMask = document.getElementById('trailer-generating');
  var canvas  = document.getElementById('trailer-canvas');
  var controls= document.getElementById('player-controls');
  if (idle)     idle.style.display    = 'none';
  if (canvas)   canvas.style.display  = 'none';
  if (controls) controls.style.display = 'none';
  if (genMask)  genMask.style.display = 'flex';

  // 假进度条动画
  var fillEl = document.getElementById('gen-fill');
  var statusEl = document.getElementById('gen-status-text');
  var _progress = 0;
  var _progTimer = setInterval(function() {
    _progress = Math.min(_progress + 1.2, 88);
    if (fillEl) fillEl.style.width = _progress + '%';
    if (_progress > 30 && statusEl) statusEl.textContent = '🎨 绘制动态画面...';
    if (_progress > 60 && statusEl) statusEl.textContent = '✍️ 撰写宣传文案...';
    if (_progress > 80 && statusEl) statusEl.textContent = '🎬 合成预告片...';
  }, 200);

  // 安全兜底：35s 后不管有没有结果，强制启动播放器
  var _safeTimer = setTimeout(function() {
    clearInterval(_progTimer);
    if (!_generated) {
      var fallbackCopy = _copyCache[_activeCopyMode] || Object.values(_copyCache)[0] || '精彩活动，期待你的到来！';
      _launchPlayer(fallbackCopy);
      _generated = true;
      if (btnGen) { btnGen.textContent = '🔄 重新生成'; btnGen.disabled = false; }
      if (btnPublish) { btnPublish.disabled = false; btnPublish.style.opacity = '1'; }
      if (btnShare)   { btnShare.disabled   = false; btnShare.style.opacity   = '1'; }
    }
  }, 35000);

  const copyEl = document.getElementById('trailer-copy-text');
  let rawBuf = '';


  generateTrailerCopies(
    _trailerInputs,
    function(token) {
      rawBuf += token;
      if (copyEl) copyEl.innerHTML = rawBuf.replace(/</g, '&lt;').replace(/\n/g, '<br>') +
        '<span style="display:inline-block;animation:blink 1s step-end infinite;color:#1DB954;font-weight:bold">|</span>';
    },
    function(style, text) {
      _copyCache[style] = text;
      if (style === _activeCopyMode && copyEl) {
        copyEl.innerHTML = text.replace(/\n/g, '<br>');
      }
    }
  ).then(function() {
    clearTimeout(_safeTimer);
    _generated = true;
    clearInterval(_progTimer);
    if (fillEl) fillEl.style.width = '100%';

    // ── 启动 Canvas 播放器 ────────────────────────────────
    var copyText = _copyCache[_activeCopyMode] || Object.values(_copyCache)[0] || '';
    _launchPlayer(copyText);

    if (btnGen) {
      btnGen.textContent   = '🔄 重新生成';
      btnGen.disabled      = false;
      btnGen.style.background  = '';
      btnGen.style.color       = '';
      btnGen.style.borderColor = '';
    }
    if (btnPublish) { btnPublish.disabled = false; btnPublish.style.opacity = '1'; }
    if (btnShare)   { btnShare.disabled   = false; btnShare.style.opacity   = '1'; }
    if (window.showToast) window.showToast('🎬 预告片生成成功！点击播放按钮观看');
  }).catch(function(err) {
    clearTimeout(_safeTimer);
    clearInterval(_progTimer);
    console.error('预告片生成失败:', err);
    if (copyEl) copyEl.innerHTML = '<span style="color:#ef4444;font-size:13px">⚠️ 生成失败，请重试</span>';
    if (btnGen) { btnGen.textContent = '✨ 重新生成'; btnGen.disabled = false; }
    _generated = false;
    _hideGenerating();
  });
}

// ─── 启动 Canvas 播放器 ──────────────────────────────────────────────────────
function _launchPlayer(copyText) {
  var idle     = document.getElementById('trailer-player-idle');
  var canvas   = document.getElementById('trailer-canvas');
  var controls = document.getElementById('player-controls');
  var gen      = document.getElementById('trailer-generating');
  if (idle)     idle.style.display    = 'none';
  if (gen)      gen.style.display     = 'none';
  if (canvas)   canvas.style.display  = 'block';
  if (controls) controls.style.display = 'flex';
  if (window.TrailerPlayer) {
    TrailerPlayer.init({
      style:  _coverStyle,
      title:  _trailerInputs ? (_trailerInputs.theme  || '精彩活动') : '精彩活动',
      type:   _trailerInputs ? (_trailerInputs.type   || '活动')    : '活动',
      date:   _trailerInputs ? (_trailerInputs.date   || '敬请期待'): '敬请期待',
      people: _trailerInputs ? (_trailerInputs.people || '--')      : '--',
      copy:   copyText,
    });
    setTimeout(function() { TrailerPlayer.play(); }, 300);
  }
  var playBtn   = document.getElementById('ctrl-play');
  var replayBtn = document.getElementById('ctrl-replay');
  if (playBtn && !playBtn._bound) {
    playBtn._bound = true;
    playBtn.addEventListener('click', function() {
      if (TrailerPlayer.isPlaying()) { TrailerPlayer.pause(); playBtn.textContent = '▶'; }
      else { TrailerPlayer.play(); playBtn.textContent = '⏸'; }
    });
  }
  if (replayBtn && !replayBtn._bound) {
    replayBtn._bound = true;
    replayBtn.addEventListener('click', function() { TrailerPlayer.replay(); if (playBtn) playBtn.textContent = '⏸'; });
  }
  var copyRow = document.getElementById('trailer-copy-row');
  var copyEl  = document.getElementById('trailer-copy-text');
  if (copyRow) copyRow.style.display = '';
  if (copyEl)  copyEl.innerHTML = copyText.replace(/</g,'&lt;').replace(/\n/g,'<br>');
}
function _hideGenerating() {
  var g = document.getElementById('trailer-generating'); if (g) g.style.display = 'none';
}

// ─── 渲染封面 ────────────────────────────────────────────────────────────────
function renderTrailerCover() {
  const el = document.getElementById('trailer-cover');
  if (!el || !_trailerInputs) return;
  const conf = TRAILER_STYLES[_coverStyle] || TRAILER_STYLES['活泼'];
  el.innerHTML = '<div class="trailer-cover-generated" style="background:' + conf.gradient + '">'
    + '<span class="trailer-cover-emoji">' + conf.cover + '</span>'
    + '<div class="trailer-cover-title">' + (_trailerInputs.theme || '精彩活动') + '</div>'
    + '<div class="trailer-cover-subtitle">' + (_trailerInputs.type || '') + ' · ' + (_trailerInputs.date || '敬请期待') + '</div>'
    + '</div>';
}

// 由 Page6 活动回顾按钮调用
function goToReview() {
  // 带入活动信息
  if (_trailerInputs) {
    const nameEl = document.getElementById('review-name');
    if (nameEl) nameEl.textContent = _trailerInputs.theme || '活动';
    const dateEl = document.getElementById('review-meta-date');
    if (dateEl) dateEl.textContent = '📅 ' + (_trailerInputs.date || '--');
    const peopleEl = document.getElementById('review-meta-people');
    if (peopleEl) peopleEl.textContent = '👥 ' + (_trailerInputs.people || '--') + '人';
    // 配乐
    if (_trailerTemplate) {
      const bgmTitle = document.getElementById('review-bgm-title');
      const bgmArtist = document.getElementById('review-bgm-artist');
      if (bgmTitle) bgmTitle.textContent = _trailerTemplate.bgm.title;
      if (bgmArtist) bgmArtist.textContent = _trailerTemplate.bgm.artist + ' · 来自QQ音乐';
    }
  }
  showPage('page-review');
}

document.addEventListener('DOMContentLoaded', () => {
  // Page3 底部 "去活动回顾" 入口由 review.js 注册
});


function goToReview() {
  // 带入活动信息
  if (_trailerInputs) {
    const nameEl = document.getElementById('review-name');
    if (nameEl) nameEl.textContent = _trailerInputs.theme || '活动';
    const dateEl = document.getElementById('review-meta-date');
    if (dateEl) dateEl.textContent = '📅 ' + (_trailerInputs.date || '--');
    const peopleEl = document.getElementById('review-meta-people');
    if (peopleEl) peopleEl.textContent = '👥 ' + (_trailerInputs.people || '--') + '人';
    // 配乐
    if (_trailerTemplate) {
      const bgmTitle = document.getElementById('review-bgm-title');
      const bgmArtist = document.getElementById('review-bgm-artist');
      if (bgmTitle) bgmTitle.textContent = _trailerTemplate.bgm.title;
      if (bgmArtist) bgmArtist.textContent = _trailerTemplate.bgm.artist + ' · 来自QQ音乐';
    }
  }
  showPage('page-review');
}

document.addEventListener('DOMContentLoaded', () => {
  // Page3 底部 "去活动回顾" 入口由 review.js 注册
});

