// trailer.js — 活动预告片生成交互逻辑 (v2.0)

// 预告片 Mock 数据：3套预告模板
const TRAILER_TEMPLATES = {
  活泼: {
    cover: '🎉',
    coverGradient: 'linear-gradient(135deg,#ff6b6b,#ffd93d)',
    copies: {
      正式: '诚邀您参加{title}，共赴一场难忘的校园盛典。期待与您相约！',
      活泼: '嘿！{title}来啦！🎉 超好玩超热闹，不来后悔哦！快快快报名！',
      搞笑: '警告⚠️ 参加{title}可能导致：笑到腹肌酸痛、认识一堆新朋友、后悔没早来！'
    },
    bgm: { title: '好日子', artist: '宋祖英', emoji: '🎵' }
  },
  正式: {
    cover: '🏛️',
    coverGradient: 'linear-gradient(135deg,#2c3e50,#3498db)',
    copies: {
      正式: '谨此诚挚邀请您出席{title}，共同见证这一庄重时刻。',
      活泼: '正式but不无聊！{title}等你来！既有仪式感，又有参与感！',
      搞笑: '穿正装来，穿睡衣请绕道——{title}隆重举行，麻烦体面一点谢谢😂'
    },
    bgm: { title: '礼赞', artist: '陈奕迅', emoji: '🎵' }
  },
  炫酷: {
    cover: '⚡',
    coverGradient: 'linear-gradient(135deg,#0f0c29,#302b63,#24243e)',
    copies: {
      正式: '{title}·炫酷来袭，视觉与听觉的双重盛宴，不容错过！',
      活泼: '炸裂！{title}超燃现场等你！灯光特效拉满，准备被震撼！⚡',
      搞笑: '{title}到底有多炫酷？据说上次有人被酷到回家做了三天噩梦😎'
    },
    bgm: { title: 'BOOM', artist: 'X1', emoji: '🎵' }
  }
};

// 根据用户输入选择预告模板
function pickTrailerTemplate(inputs) {
  const styles = inputs.styles || [];
  if (styles.includes('炫酷') || styles.includes('燃')) return TRAILER_TEMPLATES.炫酷;
  if (styles.includes('正式')) return TRAILER_TEMPLATES.正式;
  return TRAILER_TEMPLATES.活泼;
}

// 当前预告片数据（由 updateResultPage 设置）
let _trailerInputs = null;
let _trailerTemplate = null;
let _trailerCopyMode = '正式';
let _trailerStyle = '活泼';

// 由 app.js 调用，在结果页渲染后初始化预告片卡片
function initTrailerCard(inputs) {
  _trailerInputs = inputs;
  _trailerTemplate = pickTrailerTemplate(inputs);
  _trailerCopyMode = '正式';

  // 根据活动风格预选 chip
  const matchedStyle = inputs.styles && (inputs.styles.includes('炫酷') || inputs.styles.includes('燃'))
    ? '炫酷' : inputs.styles && inputs.styles.includes('正式') ? '正式' : '活泼';
  _trailerStyle = matchedStyle;
  document.querySelectorAll('#trailer-style-chips .trailer-chip').forEach(c => {
    c.classList.toggle('active', c.dataset.style === matchedStyle);
  });

  // 渲染 BGM
  const bgmEl = document.getElementById('trailer-bgm');
  if (bgmEl) bgmEl.textContent = _trailerTemplate.bgm.emoji + ' ' + _trailerTemplate.bgm.title + ' - ' + _trailerTemplate.bgm.artist;

  // F4/F7: 进Tab立即渲染文案 + 封面（无需点生成）
  renderTrailerCopy();
  renderTrailerCover();

  // 封面风格 chip 切换
  const styleChips = document.querySelectorAll('#trailer-style-chips .trailer-chip');
  styleChips.forEach(chip => {
    chip.addEventListener('click', () => {
      styleChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      _trailerStyle = chip.dataset.style;
    });
  });

  // 文案风格 tab 切换
  const copyTabs = document.querySelectorAll('.copy-tab');
  copyTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      copyTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      _trailerCopyMode = tab.dataset.copy;
      renderTrailerCopy();
    });
  });

  
  const btnGen = document.getElementById('btn-gen-trailer');
  const btnPublish = document.getElementById('btn-publish-trailer');
  const btnShare = document.getElementById('btn-share-trailer');
  
  // 初始状态
  if (btnPublish) { btnPublish.disabled = true; btnPublish.style.opacity = '0.5'; }
  if (btnShare) { btnShare.disabled = true; btnShare.style.opacity = '0.5'; }
  if (btnGen) { btnGen.textContent = '✨ 生成预告片'; btnGen.disabled = false; }
  
  // 封面清空
  const coverEl = document.getElementById('trailer-cover');
  if (coverEl) coverEl.innerHTML = `<div class="trailer-cover-placeholder"><span>🎞️</span><p>预告封面</p></div>`;

  if (btnGen) btnGen.addEventListener('click', () => {
    btnGen.textContent = '⏳ 正在合成并匹配 BGM...';
    btnGen.disabled = true;
    setTimeout(() => {
      renderTrailerCover();
      btnGen.textContent = '✅ 预告片已生成';
      btnGen.style.background = '#e8f5ef';
      btnGen.style.color = '#12B76A';
      btnGen.style.borderColor = '#12B76A';
      
      // 激活后续按钮
      if (btnPublish) { btnPublish.disabled = false; btnPublish.style.opacity = '1'; }
      if (btnShare) { btnShare.disabled = false; btnShare.style.opacity = '1'; }
      
      if(window.showToast) window.showToast('🎬 预告片生成成功！');
    }, 1800);
  });

  // 发布腾讯视频（复用上方已声明的 btnPublish）
  if (btnPublish) btnPublish.addEventListener('click', () => {
    alert('✅ 活动预告片已成功发布到腾讯视频！\n链接：https://v.qq.com/x/cover/mock_' + Date.now());
  });

  // 生成分享链接（复用上方已声明的 btnShare）
  if (btnShare) btnShare.addEventListener('click', () => {
    const shareRow = document.getElementById('trailer-share-row');
    const linkInput = document.getElementById('trailer-link');
    if (shareRow && linkInput) {
      linkInput.value = 'https://v.qq.com/share/mock_' + Date.now().toString(36);
      shareRow.style.display = 'flex';
    }
  });

  // QQ/微信分享
  const btnQQ = document.getElementById('btn-share-qq-trailer');
  if (btnQQ) btnQQ.addEventListener('click', () => alert('✅ 预告片分享链接已发送到QQ群'));
  const btnWX = document.getElementById('btn-share-wx-trailer');
  if (btnWX) btnWX.addEventListener('click', () => alert('✅ 预告片分享链接已发送到微信'));
}

function renderTrailerCopy() {
  const el = document.getElementById('trailer-copy-text');
  if (!el || !_trailerTemplate || !_trailerInputs) return;
  const tpl = _trailerTemplate.copies[_trailerCopyMode] || '';
  el.textContent = tpl.replace('{title}', _trailerInputs.theme || '精彩活动');
}

function renderTrailerCover() {
  const el = document.getElementById('trailer-cover');
  if (!el || !_trailerTemplate) return;
  const tpl = TRAILER_TEMPLATES[_trailerStyle] || _trailerTemplate;
  el.innerHTML = `<div class="trailer-cover-generated" style="background:${tpl.coverGradient}">
    <span class="trailer-cover-emoji">${tpl.cover}</span>
    <div class="trailer-cover-title">${(_trailerInputs && _trailerInputs.theme) || '精彩活动'}</div>
    <div class="trailer-cover-subtitle">${(_trailerInputs && _trailerInputs.type) || ''} · ${(_trailerInputs && _trailerInputs.date) || ''}</div>
  </div>`;
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

