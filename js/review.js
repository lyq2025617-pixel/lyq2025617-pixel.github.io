// review.js — 活动回顾页交互逻辑 (v2.0)

// 回顾视频配乐库
const REVIEW_BGM_LIST = [
  { title: '那些年', artist: '胡夏', emoji: '🎵' },
  { title: '朋友', artist: '周华健', emoji: '🎵' },
  { title: '平凡之路', artist: '朴树', emoji: '🎵' },
  { title: '青春修炼手册', artist: 'TFBOYS', emoji: '🎵' },
  { title: '挥着翅膀的女孩', artist: '容祖儿', emoji: '🎵' },
  { title: '你的答案', artist: '阿冗', emoji: '🎵' },
  { title: '光年之外', artist: 'G.E.M.邓紫棋', emoji: '🎵' },
  { title: '最美的期待', artist: '周笔畅', emoji: '🎵' }
];
let _currentBgmIdx = 0;
let _mediaFiles = [];

function initReviewPage() {
  // ② 素材上传
  const mediaUpload = document.getElementById('media-upload');
  const uploadZone = document.getElementById('review-upload-zone');
  const previewGrid = document.getElementById('media-preview-grid');
  const countBadge = document.getElementById('media-count');

  if (mediaUpload) {
    mediaUpload.addEventListener('change', e => {
      const files = Array.from(e.target.files);
      files.forEach(f => _mediaFiles.push(f));
      renderMediaGrid();
    });
  }
  // 拖拽支持
  if (uploadZone) {
    uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
    uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('drag-over'));
    uploadZone.addEventListener('drop', e => {
      e.preventDefault(); uploadZone.classList.remove('drag-over');
      const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/') || f.type === 'video/mp4');
      files.forEach(f => _mediaFiles.push(f));
      renderMediaGrid();
    });
  }

  function renderMediaGrid() {
    if (!previewGrid || !countBadge) return;
    countBadge.textContent = _mediaFiles.length + ' 个文件';
    previewGrid.innerHTML = _mediaFiles.map((f, i) => {
      const isVideo = f.type.startsWith('video/');
      return `<div class="media-thumb" data-idx="${i}">
        <div class="media-thumb-inner">${isVideo ? '🎬' : '🖼️'}</div>
        <span class="media-thumb-name">${f.name.slice(0,10)}</span>
        <button class="media-thumb-del" data-idx="${i}">✕</button>
      </div>`;
    }).join('');
    previewGrid.querySelectorAll('.media-thumb-del').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const idx = parseInt(btn.dataset.idx);
        _mediaFiles.splice(idx, 1);
        renderMediaGrid();
      });
    });
  }

  // ④ 配乐换一首
  _currentBgmIdx = Math.floor(Math.random() * REVIEW_BGM_LIST.length);
  renderReviewBgm();
  const btnChangeBgm = document.getElementById('btn-change-bgm');
  if (btnChangeBgm) btnChangeBgm.addEventListener('click', () => {
    _currentBgmIdx = (_currentBgmIdx + 1) % REVIEW_BGM_LIST.length;
    renderReviewBgm();
  });

  // ⑤ 视频风格 chip 单选
  const styleChips = document.querySelectorAll('#review-video-style .chip');
  styleChips.forEach(chip => {
    chip.addEventListener('click', () => {
      styleChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  // ⑤ 生成回顾视频按钮
  const btnGen = document.getElementById('btn-gen-review');
  if (btnGen) btnGen.addEventListener('click', () => {
    if (_mediaFiles.length === 0) {
      alert('请先上传至少1张活动照片或视频片段');
      return;
    }
    btnGen.innerHTML = '<span>⏳</span> AI剪辑中...';
    btnGen.disabled = true;
    setTimeout(() => {
      btnGen.innerHTML = '<span>✅</span> 回顾视频已生成';
      btnGen.disabled = false;
      // 显示预览区 + 发布区
      const previewSec = document.getElementById('review-preview-section');
      const publishSec = document.getElementById('review-publish-section');
      if (previewSec) { previewSec.style.display = ''; renderVideoPreview(); }
      if (publishSec) publishSec.style.display = '';
      // 模拟进度条动画
      animateProgress();
    }, 2500);
  });

  // ⑥ 重新生成
  const btnRegen = document.getElementById('btn-regen-review');
  if (btnRegen) btnRegen.addEventListener('click', () => {
    const btnGen2 = document.getElementById('btn-gen-review');
    if (btnGen2) { btnGen2.innerHTML = '<span>🎬</span> AI 生成回顾视频'; btnGen2.disabled = false; }
    const previewSec = document.getElementById('review-preview-section');
    const publishSec = document.getElementById('review-publish-section');
    if (previewSec) previewSec.style.display = 'none';
    if (publishSec) publishSec.style.display = 'none';
  });

  // ⑦ 发布分享
  const btnPublish = document.getElementById('btn-publish-review');
  if (btnPublish) btnPublish.addEventListener('click', () => {
    alert('✅ 活动回顾视频已成功发布到腾讯视频！\n链接：https://v.qq.com/x/review/mock_' + Date.now());
  });
  const btnShareQQ = document.getElementById('btn-review-share-qq');
  if (btnShareQQ) btnShareQQ.addEventListener('click', () => alert('✅ 回顾视频分享链接已发送到QQ群'));
  const btnShareWX = document.getElementById('btn-review-share-wx');
  if (btnShareWX) btnShareWX.addEventListener('click', () => alert('✅ 回顾视频分享链接已发送到微信'));

  // 返回按钮
  const btnBack = document.getElementById('btn-back-review');
  if (btnBack) btnBack.addEventListener('click', () => showPage('page-result'));
}

function renderReviewBgm() {
  const bgm = REVIEW_BGM_LIST[_currentBgmIdx];
  const titleEl = document.getElementById('review-bgm-title');
  const artistEl = document.getElementById('review-bgm-artist');
  if (titleEl) titleEl.textContent = bgm.emoji + ' ' + bgm.title;
  if (artistEl) artistEl.textContent = bgm.artist + ' · 来自QQ音乐';
}

function renderVideoPreview() {
  const captionEl = document.getElementById('review-caption');
  const overlayEl = document.getElementById('video-overlay-text');
  const screenEl = document.getElementById('review-video-screen');
  const caption = captionEl ? captionEl.value : '';
  const bgm = REVIEW_BGM_LIST[_currentBgmIdx];

  if (screenEl) {
    const styleChip = document.querySelector('#review-video-style .chip.active');
    const videoStyle = styleChip ? styleChip.dataset.value : '温情';
    const styleColors = { 温情:'linear-gradient(135deg,#f093fb,#f5576c)', 活泼:'linear-gradient(135deg,#4facfe,#00f2fe)', 燃:'linear-gradient(135deg,#f7971e,#ffd200)', 文艺:'linear-gradient(135deg,#89f7fe,#66a6ff)' };
    const bg = styleColors[videoStyle] || styleColors['温情'];
    screenEl.style.background = bg;
  }
  if (overlayEl) {
    overlayEl.textContent = caption ? `"${caption.slice(0,30)}${caption.length>30?'...':''}"` : '🎬 精彩回顾';
  }
}

function animateProgress() {
  const bar = document.getElementById('vc-bar');
  if (!bar) return;
  bar.style.width = '0%';
  let w = 0;
  const t = setInterval(() => {
    w = Math.min(w + 1, 100);
    bar.style.width = w + '%';
    if (w >= 100) clearInterval(t);
  }, 23);
}

document.addEventListener('DOMContentLoaded', () => {
  initReviewPage();
});

