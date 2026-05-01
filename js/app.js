// 页面导航管理
function showPage(pageId) {
  // 隐藏所有页面
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  
  // 显示目标页面
  document.getElementById(pageId).classList.add('active');
  
  // 滚动到顶部
  window.scrollTo(0, 0);
}

// 初始化 Page 1 交互
function initPage1() {
  // Chip 选择
  const chipGroups = document.querySelectorAll('.chip-group');
  chipGroups.forEach(group => {
    group.addEventListener('click', (e) => {
      if (e.target.classList.contains('chip')) {
        // 清除同组其他chip的active状态
        group.querySelectorAll('.chip').forEach(chip => {
          chip.classList.remove('active');
        });
        // 激活当前chip
        e.target.classList.add('active');
      }
    });
  
  // 校园合伙人入口
  const btnPartner = document.getElementById('btn-go-partner');
  if (btnPartner) btnPartner.addEventListener('click', () => showPage('page-partner'));

});
  
  // Tag 选择 (多选)
  const tagGroups = document.querySelectorAll('.tag-group');
  tagGroups.forEach(group => {
    group.addEventListener('click', (e) => {
      if (e.target.classList.contains('tag')) {
        e.target.classList.toggle('active');
      }
    });
  });

  // 日期快捷选择
  const dateInput = document.getElementById('activity-date');
  const dateClear = document.getElementById('date-clear');
  document.querySelectorAll('.date-shortcut').forEach(btn => {
    btn.addEventListener('click', () => {
      const offset = parseInt(btn.dataset.offset);
      const d = new Date();
      d.setDate(d.getDate() + offset);
      const yyyy = d.getFullYear();
      const mm   = String(d.getMonth() + 1).padStart(2, '0');
      const dd   = String(d.getDate()).padStart(2, '0');
      dateInput.value = `${yyyy}-${mm}-${dd}`;
      document.querySelectorAll('.date-shortcut').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
  if (dateClear) dateClear.addEventListener('click', () => {
    dateInput.value = '';
    document.querySelectorAll('.date-shortcut').forEach(b => b.classList.remove('active'));
  });

  // F2: 示例弹窗 - 点击「看看别人怎么用」弹出案例
  const btnShowEx  = document.getElementById('btn-show-examples');
  const modalEx    = document.getElementById('modal-examples');
  const modalClose = document.getElementById('modal-close-examples');
  if (btnShowEx && modalEx) {
    btnShowEx.addEventListener('click', () => { modalEx.style.display = 'flex'; });
    modalClose.addEventListener('click', () => { modalEx.style.display = 'none'; });
    modalEx.addEventListener('click', e => { if (e.target === modalEx) modalEx.style.display = 'none'; });
    modalEx.querySelectorAll('.example-card').forEach(card => {
      card.addEventListener('click', () => {
        const themeInput = document.getElementById('theme');
        const venueInput = document.getElementById('activity-venue');
        const typeSelect = document.getElementById('activity-type');
        if (themeInput) themeInput.value = card.dataset.theme;
        if (venueInput) venueInput.value = card.dataset.venue || '';
        document.querySelectorAll('#people-group .chip').forEach(c => {
          c.classList.toggle('active', c.dataset.value === card.dataset.people);
        });
        document.querySelectorAll('#duration-group .chip').forEach(c => {
          c.classList.toggle('active', c.dataset.value === card.dataset.duration);
        });
        const exStyles = (card.dataset.styles || '').split(',');
        document.querySelectorAll('#style-group .tag').forEach(t => {
          t.classList.toggle('active', exStyles.includes(t.dataset.value));
        });
        if (typeSelect) typeSelect.value = card.dataset.type;
        modalEx.style.display = 'none';
      });
    });
  }

  // 开始生成按钮
  document.getElementById('btn-start').addEventListener('click', () => {
    const inputs = {
      theme: document.getElementById('theme').value || '动漫社迎新晚会',
      people: document.querySelector('#people-group .chip.active').dataset.value,
      duration: document.querySelector('#duration-group .chip.active').dataset.value,
      styles: Array.from(document.querySelectorAll('#style-group .tag.active'))
                   .map(tag => tag.dataset.value),
      type: document.getElementById('activity-type').value,
      venue: (document.getElementById('activity-venue') || {}).value || '',
      date: document.getElementById('activity-date').value
    };
    showPage('page-loading');
    simulateAIGeneration(inputs);
  });
}


let generationTimeouts = [];

// 模拟 AI 生成过程
function simulateAIGeneration(inputs) {
  // 重置所有 step 到初始待机状态
  document.querySelectorAll('.step').forEach(el => {
    el.className = 'step pending-step';
  });
  document.querySelectorAll('.step-icon').forEach(el => {
    el.textContent = '';
    el.className = 'step-icon pending';
  });

  // 重置进度条
  const progressBar = document.getElementById('loading-progress-bar');
  if (progressBar) progressBar.style.width = '0%';
  
  // 清理之前的 timeout
  generationTimeouts.forEach(clearTimeout);
  generationTimeouts = [];

  const steps = [
    {id: 'step-1', delay: 1000,  progress: 25},
    {id: 'step-2', delay: 2500,  progress: 50},
    {id: 'step-3', delay: 4000,  progress: 75},
    {id: 'step-4', delay: 5500,  progress: 100}
  ];

  steps.forEach((step, idx) => {
    const startDelay = idx === 0 ? 200 : steps[idx - 1].delay + 200;
    const endDelay   = step.delay;

    generationTimeouts.push(setTimeout(() => {
      const el = document.getElementById(step.id);
      if (!el) return;
      el.className = 'step running-step';
      const icon = el.querySelector('.step-icon');
      if (icon) { icon.textContent = ''; icon.className = 'step-icon running'; }
    }, startDelay));

    generationTimeouts.push(setTimeout(() => {
      const el = document.getElementById(step.id);
      if (!el) return;
      el.className = 'step done-step';
      const icon = el.querySelector('.step-icon');
      if (icon) { icon.textContent = '✓'; icon.className = 'step-icon completed'; }
      if (progressBar) progressBar.style.width = step.progress + '%';
    }, endDelay));
  });

  generationTimeouts.push(setTimeout(() => {
    updateResultPage(inputs);
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    const firstTabBtn = document.querySelector('.tab-btn[data-tab="tab-process"]');
    const firstTabPane = document.getElementById('tab-process');
    if (firstTabBtn) firstTabBtn.classList.add('active');
    if (firstTabPane) firstTabPane.classList.add('active');
    showPage('page-result');
  }, 6500));
}

// 全局 Toast 提示函数
window.showToast = function(msg) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
};

// 取消生成事件绑定
document.addEventListener('DOMContentLoaded', () => {
  const btnCancel = document.getElementById('btn-cancel-gen');
  if (btnCancel) {
    btnCancel.addEventListener('click', () => {
      generationTimeouts.forEach(clearTimeout);
      generationTimeouts = [];
      showPage('page-input');
    });
  }
});

// 更新结果页内容
function updateResultPage(inputs) {
  // 更新摘要信息
  document.getElementById('result-theme').textContent = inputs.theme;
  document.getElementById('result-type').textContent = 
    document.getElementById('activity-type').selectedOptions[0].text;
  
  const peopleText = {
    '5': '👥 5人', '10': '👥 10人',
    '20': '👥 20人', '50': '👥 50人', '100': '👥 100人以上'
  };
  document.getElementById('result-people').textContent = peopleText[inputs.people] || ('👥 ' + inputs.people + '人');
  
  const durationText = {
    '60': '⏰ 1小时', '120': '⏰ 2小时', 
    '180': '⏰ 3小时', '240': '⏰ 半天'
  };
  document.getElementById('result-duration').textContent = durationText[inputs.duration];
  
  const styleText = inputs.styles.map(s => `🎨 ${s}`).join(' ');
  document.getElementById('result-style').textContent = styleText || '🎨 活泼';

  
  const dateEl = document.getElementById('result-date');
  if (inputs.date) {
    const d = new Date(inputs.date + 'T00:00:00');
    const today = new Date();
    today.setHours(0,0,0,0);
    const diffTime = d - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let countdownText = '';
    if (diffDays > 0) {
      countdownText = ` <span style="margin-left:6px; color:#F59E0B; font-weight:800;">⏳ 还有 ${diffDays} 天</span>`;
    } else if (diffDays === 0) {
      countdownText = ` <span style="margin-left:6px; color:#EF4444; font-weight:800;">🔥 就是今天</span>`;
    }
    
    const formatted = `${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`;
    dateEl.innerHTML = '📅 ' + formatted + countdownText;
    dateEl.style.display = '';
  } else {
    dateEl.style.display = 'none';
  }


  // F5: 动态生成邀请链接（基于 theme 的 slug）并同步到 Page6
  const slug = encodeURIComponent(inputs.theme.slice(0, 8)).replace(/%/g, '').toLowerCase() || 'event';
  const inviteLink = 'https://act.qq.com/review/' + slug + '_' + Date.now().toString(36).slice(-4);
  const inviteLinkEl = document.getElementById('invite-link-input');
  if (inviteLinkEl) inviteLinkEl.value = inviteLink;

  // 获取 mock 数据
  const data = getMockData(inputs);
  
  // 更新活动流程
  const processList = document.getElementById('process-list');
  const processCount = data.process.length;
  processList.innerHTML = `
    <div class="result-card">
      <div class="result-card-header">
        <span class="rc-icon">📋</span>
        <h3>活动流程时间线</h3>
        <span class="rc-badge">AI 生成</span>
      </div>
      <div class="result-card-body">
        <div class="card-summary-bar">
          <div class="csb-text">
            <span>全场共 <strong>${processCount}</strong> 个环节</span>
            <span>总时长 <strong>${inputs.duration}分钟</strong></span>
          </div>
          <div class="csb-progress"><div class="csb-fill" style="width: 100%; background: linear-gradient(90deg, #12B76A, #a5f3cb);"></div></div>
        </div>
        <div class="process-timeline">
          ${data.process.map(item => `
            <div class="process-item" draggable="true">
              <div class="process-drag-handle">\u28bf</div>
              <div class="process-body">
                <div class="process-time">${item.time}</div>
                <div class="process-title">${item.title}</div>
                <div class="process-desc">${item.desc}</div>
              </div>
              <button class="btn-del-process" title="\u5220\u9664\u73af\u8282">\u2715</button>
            </div>
          `).join('')}
        </div>
        <div class="process-add-row">
          <button class="btn-add-process" id="btn-add-process"><span>＋</span> 新增环节</button>
        </div>
      </div>
    </div>
  `;
  
  // 更新专属歌单
  const playlistList = document.getElementById('playlist-list');
  const totalSongs = data.playlist.reduce((acc, cur) => acc + cur.songs.length, 0);
  playlistList.innerHTML = `
    <div class="result-card">
      <div class="result-card-header">
        <span class="rc-icon">🎵</span>
        <h3>匹配专属歌单</h3>
        <span class="rc-badge">QQ音乐</span>
      </div>
      <div class="result-card-body">
        <div class="mini-player-header">
          <div class="mph-left">
            <div class="mph-cover">
              <span class="mph-play-icon">▶</span>
            </div>
            <div class="mph-info">
              <div class="mph-title">${inputs.theme} 专属BGM</div>
              <div class="mph-subtitle">QQ音乐 AI智能匹配 · 共 ${totalSongs} 首</div>
            </div>
          </div>
          <div class="mph-right">
            <button class="mph-btn-play">全部播放</button>
          </div>
        </div>
        <div class="mph-progress-wrap">
          <span class="mph-time">0:00</span>
          <div class="mph-progress-track"><div class="mph-progress-fill"></div></div>
          <span class="mph-time">--:--</span>
        </div>
        ${data.playlist.map(section => `
          <div class="playlist-section">
            <div class="playlist-title">${section.section}</div>
            <div class="playlist-items">
              ${section.songs.map(song => `
                <div class="playlist-item">
                  <div class="album-cover">${song.cover}</div>
                  <div class="song-info">
                    <div class="song-title">${song.title}</div>
                    <div class="song-meta">
                      <span class="song-artist">${song.artist}</span>
                      ${(song.mood_tags||[]).map(t=>'<span class="mood-tag">'+t+'</span>').join('')}
                    </div>
                  </div>
                  <div class="song-actions">
                    <span class="song-duration">${song.duration}</span>
                    <button class="btn-song-listen" data-title="${song.title}" title="\u8bd5\u542c">\u25b6</button>
                    <button class="btn-song-replace" data-title="${song.title}" title="\u66ff\u6362">\u21bb</button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  // 更新主持串词
  const scriptList = document.getElementById('script-list');
  scriptList.innerHTML = `
    <div class="result-card">
      <div class="result-card-header">
        <span class="rc-icon">🎤</span>
        <h3>专业主持串词</h3>
        <span class="rc-badge">AI 生成</span>
      </div>
      <div class="result-card-body">
        <div class="card-summary-bar">
          <div class="csb-text">
            <span>🎤 <strong>智能提词器模式</strong></span>
            <span>预计串场 <strong>${data.script.length * 3}分钟</strong></span>
          </div>
          <div class="csb-progress"><div class="csb-fill" style="width: 15%; background: linear-gradient(90deg, #F59E0B, #fde68a);"></div></div>
        </div>
        ${data.script.map(item => `
          <div class="script-item" data-time="${item.time}">
            <div class="script-item-header">
              <div class="script-time">${item.time}</div>
              <div class="script-style-tabs">
                <button class="script-style-btn active" data-style="formal">\u6b63\u5f0f</button>
                <button class="script-style-btn" data-style="lively">\u6d3b\u6cfc</button>
                <button class="script-style-btn" data-style="funny">\u641e\u7b11</button>
              </div>
              <button class="btn-copy-script" title="\u4e00\u952e\u590d\u5236">\ud83d\udccb</button>
            </div>
            <div class="script-content" data-formal="${item.content}" data-lively="${item.lively||item.content}" data-funny="${item.funny||item.content}">${item.content.replace(/\n/g, '<br>')}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  // 更新任务清单
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = `
    <div class="result-card">
      <div class="result-card-header">
        <span class="rc-icon">✅</span>
        <h3>筹备任务拆解</h3>
      </div>
      <div class="result-card-body">
        ${data.tasks.map((task, index) => `
          <div class="task-item" data-index="${index}">
            <div class="task-checkbox ${task.done ? 'checked' : ''}" data-index="${index}">
              ${task.done ? '✓' : ''}
            </div>
            <div class="task-content">
              <div class="task-title">${task.title}</div>
              <div class="task-meta"><span class="task-desc">${task.desc}</span></div>
            </div>
            <button class="btn-del-task" title="删除">✕</button>
          </div>
        `).join('')}
        <div class="task-add-row">
          <button class="btn-add-task" id="btn-add-task"><span>＋</span> 新增任务</button>
        </div>
      </div>
    </div>
  `;
  
  // 添加任务清单的勾选交互
  document.querySelectorAll('.task-checkbox').forEach(checkbox => {
    checkbox.addEventListener('click', () => {
      checkbox.classList.toggle('checked');
      if (checkbox.classList.contains('checked')) {
        checkbox.textContent = '✓';
      } else {
        checkbox.textContent = '';
      }
    });
  });

  // 初始化预告片卡片 (v2.0)
  if (typeof initTrailerCard === 'function') {
    initTrailerCard(inputs);
  }
}

// 初始化 Page 3 交互
function initPage3() {
  // Tab 切换
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      if (tabId === 'tab-qiumi') { showPage('page-qiumi'); return; }
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.tab-pane').forEach(pane => { pane.classList.remove('active'); });
      const pane = document.getElementById(tabId);
      if (pane) pane.classList.add('active');
    });
  });
  
  // 返回按钮
  document.getElementById('btn-back').addEventListener('click', () => {
    showPage('page-input');
  });
  
  // 导出按钮
  document.getElementById('btn-export').addEventListener('click', () => {
    showPage('page-export');
  });
  
  // 导出歌单按钮
  document.getElementById('btn-save-playlist').addEventListener('click', () => {
    window.showToast('✅ 已成功保存歌单到QQ音乐APP');
  });
  
  // 导出串词按钮
  document.getElementById('btn-export-script').addEventListener('click', () => {
    alert('✅ 已成功导出主持串词Word文档');
  });
  
  // 发送QQ按钮
  document.getElementById('btn-send-qq').addEventListener('click', () => {
    alert('✅ 已成功发送任务清单到QQ群');
  });

  // 活动回顾入口按钮 (v2.0)
  const btnGoReview = document.getElementById('btn-go-review');
  if (btnGoReview) btnGoReview.addEventListener('click', () => {
    if (typeof goToReview === 'function') {
      goToReview();
    } else {
      showPage('page-review');
    }
  });

  // 邀请投稿 - 复制链接
  const btnCopyInvite = document.getElementById('btn-copy-invite');
  if (btnCopyInvite) {
    btnCopyInvite.addEventListener('click', () => {
      const link = document.getElementById('invite-link-input').value;
      navigator.clipboard.writeText(link).then(() => {
        btnCopyInvite.textContent = '已复制 ✓';
        btnCopyInvite.style.background = '#52c41a';
        setTimeout(() => { btnCopyInvite.textContent = '复制链接'; btnCopyInvite.style.background = ''; }, 2000);
      }).catch(() => {
        btnCopyInvite.textContent = '已复制 ✓';
        setTimeout(() => { btnCopyInvite.textContent = '复制链接'; }, 2000);
      });
    });
  }
  // 邀请投稿 - 分享
  const btnInviteQq = document.getElementById('btn-invite-qq');
  if (btnInviteQq) btnInviteQq.addEventListener('click', () => alert('✅ 投稿链接已发送到QQ群'));
  const btnInviteWx = document.getElementById('btn-invite-wx');
  if (btnInviteWx) btnInviteWx.addEventListener('click', () => alert('✅ 投稿链接已分享到微信'));

  // ── 歌单：试听 / 替换 (事件委托) ──
  document.getElementById('playlist-list').addEventListener('click', (e) => {
    const listenBtn = e.target.closest('.btn-song-listen');
    const replaceBtn = e.target.closest('.btn-song-replace');
    if (listenBtn) {
      const title = listenBtn.dataset.title;
      window.showToast('▶ 正在试听：' + title + '（QQ音乐）');
    }
    if (replaceBtn) {
      const title = replaceBtn.dataset.title;
      window.showToast('↻ 已替换 "' + title + '" 为相似风格歌曲');
    }
  });

  // ── 串词：风格切换 + 一键复制 (事件委托) ──
  document.getElementById('script-list').addEventListener('click', (e) => {
    const styleBtn = e.target.closest('.script-style-btn');
    const copyBtn  = e.target.closest('.btn-copy-script');
    if (styleBtn) {
      const item = styleBtn.closest('.script-item');
      item.querySelectorAll('.script-style-btn').forEach(b => b.classList.remove('active'));
      styleBtn.classList.add('active');
      const style = styleBtn.dataset.style;
      const contentEl = item.querySelector('.script-content');
      const text = contentEl.dataset[style] || contentEl.dataset.formal || '';
      contentEl.innerHTML = text.replace(/\n/g, '<br>');
    }
    if (copyBtn) {
      const item = copyBtn.closest('.script-item');
      const text = item.querySelector('.script-content').textContent;
      navigator.clipboard.writeText(text).catch(() => {});
      window.showToast('✅ 串词已复制到剪贴板');
    }
  });

  // ── 任务清单：删除 + 新增 (事件委托) ──
  document.getElementById('task-list').addEventListener('click', (e) => {
    const delBtn = e.target.closest('.btn-del-task');
    if (delBtn) {
      delBtn.closest('.task-item').remove();
      window.showToast('🗑️ 任务已删除');
    }
  });
  document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'btn-add-task') {
      const title = prompt('请输入任务名称：');
      if (!title) return;
      const taskList = document.querySelector('#task-list .result-card-body');
      const addRow = taskList.querySelector('.task-add-row');
      const newItem = document.createElement('div');
      newItem.className = 'task-item';
      newItem.innerHTML = '<div class="task-checkbox"></div><div class="task-content"><div class="task-title">'+title+'</div><div class="task-meta"><span class="task-desc">待完成</span></div></div><button class="btn-del-task" title="删除">✕</button>';
      newItem.querySelector('.task-checkbox').addEventListener('click', function(){ this.classList.toggle('checked'); this.textContent = this.classList.contains('checked') ? '✓' : ''; });
      taskList.insertBefore(newItem, addRow);
      window.showToast('✅ 任务已添加');
    }
    if (e.target && e.target.id === 'btn-add-process') {
      const title = prompt('请输入环节名称：');
      if (!title) return;
      const duration = prompt('环节时长（如：10分钟）：') || '10分钟';
      const desc = prompt('环节说明：') || '';
      const timeline = document.querySelector('#process-list .process-timeline');
      const newItem = document.createElement('div');
      newItem.className = 'process-item';
      newItem.setAttribute('draggable', 'true');
      newItem.innerHTML = '<div class="process-drag-handle">⠿</div><div class="process-body"><div class="process-time">'+duration+'</div><div class="process-title">'+title+'</div><div class="process-desc">'+desc+'</div></div><button class="btn-del-process" title="删除环节">✕</button>';
      timeline.appendChild(newItem);
      window.showToast('✅ 环节已添加');
    }
  });

  // ── 流程：删除环节 (事件委托) ──
  document.getElementById('process-list').addEventListener('click', (e) => {
    const delBtn = e.target.closest('.btn-del-process');
    if (delBtn) {
      delBtn.closest('.process-item').remove();
      window.showToast('🗑️ 环节已删除');
    }
  });
}

// 初始化 Page 4 交互
function initPage4() {
  // 返回按钮
  document.getElementById('btn-back-export').addEventListener('click', () => {
    showPage('page-result');
  });
  
  // 重新策划按钮
  document.getElementById('btn-new-plan').addEventListener('click', () => {
    showPage('page-input');
  });
  
  // 导出选项按钮
  document.getElementById('export-pdf').addEventListener('click', () => {
    alert('✅ 已成功导出完整策划PDF文件');
  });
  
  document.getElementById('export-word').addEventListener('click', () => {
    alert('✅ 已成功导出串词Word文档');
  });
  
  document.getElementById('export-text').addEventListener('click', () => {
    alert('✅ 已成功复制活动方案摘要文本到剪贴板');
  });
  
  // 分享选项按钮
  document.getElementById('share-poster').addEventListener('click', () => {
    alert('✅ 已成功生成并保存分享海报');
  });
  
  document.getElementById('share-link').addEventListener('click', () => {
    alert('✅ 分享链接已复制到剪贴板');
  });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  initPage1();
  initPage3();
  initPage4();
  if (typeof initPartnerPage === 'function') initPartnerPage();
});

// ==== P2: 海报背景设置 ====
const PRESET_STYLES = {
  default: 'linear-gradient(135deg,#1DB954 0%,#18a04a 100%)',
  night:   'linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)',
  sunset:  'linear-gradient(135deg,#f7971e 0%,#ffd200 100%)',
  ocean:   'linear-gradient(135deg,#1a6dff 0%,#c822ff 100%)',
};
let posterBg = { type:'preset', preset:'default', dataUrl:null };

function initBackgroundUpload() {
  const presets    = document.querySelectorAll('.bg-preset');
  const fileInput  = document.getElementById('background-upload');
  const dropZone   = document.getElementById('upload-drop-zone');
  const preview    = document.getElementById('background-preview');
  const previewImg = document.getElementById('background-image-preview');
  const filenameEl = document.getElementById('background-filename');
  const removeBtn  = document.getElementById('btn-remove-bg');
  const uploadArea = document.getElementById('custom-upload-area');
  if (!presets.length) return;

  presets.forEach(el => {
    el.addEventListener('click', () => {
      presets.forEach(p => p.classList.remove('active'));
      el.classList.add('active');
      if (el.dataset.preset === 'custom') {
        uploadArea.style.display = 'block';
      } else {
        uploadArea.style.display = 'none';
        posterBg = { type:'preset', preset:el.dataset.preset, dataUrl:null };
        preview.style.display = 'none';
      }
    });
  });

  if (dropZone) dropZone.addEventListener('click', () => fileInput && fileInput.click());
  if (dropZone) {
    dropZone.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
    dropZone.addEventListener('drop', e => { e.preventDefault(); dropZone.classList.remove('drag-over'); const f=e.dataTransfer.files[0]; if(f) handleBgFile(f); });
  }
  if (fileInput) fileInput.addEventListener('change', e => { const f=e.target.files[0]; if(f) handleBgFile(f); });
  if (removeBtn) removeBtn.addEventListener('click', () => {
    posterBg = { type:'preset', preset:'default', dataUrl:null };
    if (fileInput) fileInput.value = '';
    preview.style.display = 'none';
    presets.forEach(p => p.classList.toggle('active', p.dataset.preset==='default'));
    uploadArea.style.display = 'none';
  });

  function handleBgFile(file) {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => {
      posterBg = { type:'image', preset:null, dataUrl:e.target.result };
      previewImg.src = e.target.result;
      if (filenameEl) filenameEl.textContent = file.name;
      preview.style.display = 'flex';
      uploadArea.style.display = 'none';
    };
    reader.readAsDataURL(file);
  }
}

function generateSharePosterWithBg() {
  const theme    = document.getElementById('result-theme').textContent;
  const type     = document.getElementById('result-type').textContent;
  const people   = document.getElementById('result-people').textContent;
  const duration = document.getElementById('result-duration').textContent;
  const style    = document.getElementById('result-style').textContent;

  let bgCss;
  if (posterBg.type === 'image' && posterBg.dataUrl) {
    bgCss = "background-image:url('" + posterBg.dataUrl + "');background-size:cover;background-position:center;";
  } else {
    bgCss = 'background:' + (PRESET_STYLES[posterBg.preset] || PRESET_STYLES.default) + ';';
  }
  const overlay = posterBg.type==='image'
    ? '<div style="position:absolute;inset:0;border-radius:15px;background:rgba(0,0,0,0.35);"></div>' : '';

  const poster = '<div style="position:relative;width:300px;padding:30px 20px;'+bgCss+'border-radius:15px;font-family:Noto Sans SC,sans-serif;color:white;box-shadow:0 10px 30px rgba(0,0,0,.25);overflow:hidden;">'
    + overlay
    + '<div style="position:relative;z-index:1;">'
    + '<div style="text-align:center;margin-bottom:22px;"><div style="font-size:26px;font-weight:700;margin-bottom:4px;">🎵 腾讯AI</div>'
    + '<div style="font-size:13px;opacity:.85;">QQ音乐 × AI 校园活动策划助手</div></div>'
    + '<div style="background:rgba(255,255,255,.15);backdrop-filter:blur(6px);border-radius:12px;padding:16px;margin-bottom:20px;">'
    + '<div style="font-size:20px;font-weight:700;text-align:center;margin-bottom:12px;">'+theme+'</div>'
    + '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;">'
    + '<span style="background:rgba(255,255,255,.25);padding:4px 12px;border-radius:20px;font-size:12px;">'+type+'</span>'
    + '<span style="background:rgba(255,255,255,.25);padding:4px 12px;border-radius:20px;font-size:12px;">'+people+'</span>'
    + '<span style="background:rgba(255,255,255,.25);padding:4px 12px;border-radius:20px;font-size:12px;">'+duration+'</span>'
    + '<span style="background:rgba(255,255,255,.25);padding:4px 12px;border-radius:20px;font-size:12px;">'+style+'</span>'
    + '</div></div>'
    + '<div style="text-align:center;font-size:13px;opacity:.85;">'
    + '<div>✨ 由腾讯AI智能生成</div>'
    + '<div style="margin-top:4px;">扫码查看完整策划方案</div>'
    + '<div style="margin:12px auto 0;width:80px;height:80px;background:white;border-radius:10px;display:flex;align-items:center;justify-content:center;">'
    + '<div style="width:60px;height:60px;background:#1DB954;border-radius:6px;display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:13px;">QR码</div>'
    + '</div></div></div></div>';

  const w = window.open('','_blank');
  if (!w) { alert('请允许弹出窗口后重试'); return; }
  w.document.write('<!DOCTYPE html><html><head><title>分享海报</title><meta charset="UTF-8">'
    + '<meta name="viewport" content="width=device-width,initial-scale=1.0">'
    + '<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap" rel="stylesheet">'
    + '<style>body{margin:0;padding:20px;background:#e8e8e8;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;gap:16px}'
    + '.print-btn{background:#1DB954;color:white;border:none;padding:12px 28px;border-radius:30px;font-size:15px;cursor:pointer}'
    + '@media print{.print-btn{display:none}}</style>'
    + '</head><body>' + poster
    + '<button class="print-btn" onclick="window.print()">🖨️ 打印 / 保存海报</button>'
    + '</body></html>');
  w.document.close();
  if (typeof saveToHistory === 'function') saveToHistory();
}

// ==== P3: 历史记录 + 页面跳转扩展 ====
function initPageExportExtra() {
  const btnHistory = document.getElementById('btn-view-history');
  if (btnHistory) btnHistory.addEventListener('click', () => {
    if (typeof loadHistory === 'function') loadHistory();
    showPage('page-history');
  });
  const btnBackHistory = document.getElementById('btn-back-history');
  if (btnBackHistory) btnBackHistory.addEventListener('click', () => showPage('page-export'));

  // 覆盖 share-poster 为新版
  const sp = document.getElementById('share-poster');
  if (sp) {
    sp.replaceWith(sp.cloneNode(true)); // 移除旧监听
    document.getElementById('share-poster').addEventListener('click', generateSharePosterWithBg);
  }
}

// 覆盖 DOMContentLoaded 追加初始化
document.addEventListener('DOMContentLoaded', () => {
  initBackgroundUpload();
  initPageExportExtra();
});

// 覆盖 DOMContentLoaded 追加初始化
document.addEventListener('DOMContentLoaded', () => {
  initBackgroundUpload();
  initPageExportExtra();
});
