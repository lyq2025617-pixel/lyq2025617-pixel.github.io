// 历史方案记录功能

// 保存方案到历史记录
function saveToHistory() {
  // 获取当前方案数据
  const currentPlan = {
    theme: document.getElementById('result-theme').textContent,
    type: document.getElementById('result-type').textContent,
    people: document.getElementById('result-people').textContent,
    duration: document.getElementById('result-duration').textContent,
    style: document.getElementById('result-style').textContent,
    timestamp: new Date().toLocaleString('zh-CN')
  };

  // 从localStorage获取历史记录
  let history = JSON.parse(localStorage.getItem('activityPlanHistory')) || [];
  
  // 添加当前方案到历史记录
  history.push(currentPlan);
  
  // 限制历史记录数量为10条
  if (history.length > 10) {
    history = history.slice(-10);
  }
  
  // 保存到localStorage
  localStorage.setItem('activityPlanHistory', JSON.stringify(history));
}

// 从历史记录加载方案
function loadHistory() {
  const history = JSON.parse(localStorage.getItem('activityPlanHistory')) || [];
  const historyList = document.getElementById('history-list');
  
  if (history.length === 0) {
    historyList.innerHTML = '<div class="empty-history">暂无历史方案记录</div>';
    return;
  }
  
  // 生成历史记录列表
  historyList.innerHTML = history.map((plan, index) => `
    <div class="history-item" data-index="${index}">
      <div class="history-header">
        <div class="history-title">${plan.theme}</div>
        <div class="history-time">${plan.timestamp}</div>
      </div>
      <div class="history-tags">
        <span class="history-tag">${plan.type}</span>
        <span class="history-tag">${plan.people}</span>
        <span class="history-tag">${plan.duration}</span>
        <span class="history-tag">${plan.style}</span>
      </div>
      <div class="history-actions">
        <button class="btn-secondary btn-small load-history" data-index="${index}">加载方案</button>
        <button class="btn-secondary btn-small delete-history" data-index="${index}">删除</button>
      </div>
    </div>
  `).join('');
  
  // 添加事件监听器
  document.querySelectorAll('.load-history').forEach(button => {
    button.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      loadPlanFromHistory(index);
    });
  });
  
  document.querySelectorAll('.delete-history').forEach(button => {
    button.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      deleteHistoryItem(index);
    });
  });
}

// 从历史记录加载特定方案
function loadPlanFromHistory(index) {
  const history = JSON.parse(localStorage.getItem('activityPlanHistory')) || [];
  if (index >= 0 && index < history.length) {
    const plan = history[index];
    alert(`已加载历史方案: ${plan.theme}`);
    // 这里可以实现实际的方案加载逻辑
  }
}

// 删除历史记录项
function deleteHistoryItem(index) {
  let history = JSON.parse(localStorage.getItem('activityPlanHistory')) || [];
  if (index >= 0 && index < history.length) {
    history.splice(index, 1);
    localStorage.setItem('activityPlanHistory', JSON.stringify(history));
    loadHistory(); // 重新加载历史记录列表
  }
}

// 页面加载完成后初始化历史记录功能
document.addEventListener('DOMContentLoaded', () => {
  // 如果在历史记录页面，加载历史记录
  if (document.getElementById('page-history')) {
    loadHistory();
  }
});