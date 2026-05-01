// sponsor.js — 求米页 & 赞助大厅交互逻辑（已修复所有 Bug）

document.addEventListener('DOMContentLoaded', function () {

  /* ─────────────────────────────────────────────────────────
     工具：复用全局 showPage（来自 app.js）
     不在此处重复定义，直接调用全局函数
  ───────────────────────────────────────────────────────── */
  function goPage(id) {
    if (typeof showPage === 'function') {
      showPage(id);
    } else {
      // 兜底：手动切换
      document.querySelectorAll('.page').forEach(function(p) {
        p.classList.remove('active');
      });
      var el = document.getElementById(id);
      if (el) { el.classList.add('active'); }
      window.scrollTo(0, 0);
    }
  }

  /* ─────────────────────────────────────────────────────────
     从 DOM 中读取活动信息（app.js 已把数据渲染到 DOM 里）
  ───────────────────────────────────────────────────────── */
  function getActivityInfo() {
    var nameEl    = document.getElementById('result-theme');
    var peopleEl  = document.getElementById('result-people');
    var dateEl    = document.getElementById('result-date');
    var name   = nameEl   ? nameEl.textContent.trim()   : '我的活动';
    var people = peopleEl ? peopleEl.textContent.replace(/[^0-9]/g, '') : '50';
    var date   = dateEl   ? dateEl.textContent.replace('📅', '').trim() : '待定';
    if (!people) people = '50';
    if (!date || date === '日期') date = '待定';
    return { name: name, people: people, date: date };
  }

  /* ─────────────────────────────────────────────────────────
     填充求米页活动信息
  ───────────────────────────────────────────────────────── */
  function fillQiuMiInfo() {
    var info = getActivityInfo();
    var nameEl   = document.getElementById('qiumi-activity-name');
    var peopleEl = document.getElementById('qiumi-activity-people');
    var dateEl   = document.getElementById('qiumi-activity-date');
    var reachEl  = document.getElementById('qiumi-reach');
    if (nameEl)   nameEl.textContent   = info.name;
    if (peopleEl) peopleEl.textContent = info.people + ' 人';
    if (dateEl)   dateEl.textContent   = info.date;
    if (reachEl)  reachEl.textContent  = info.people;
  }

  /* ─────────────────────────────────────────────────────────
     填充赞助大厅活动信息
  ───────────────────────────────────────────────────────── */
  function fillHallInfo() {
    var info = getActivityInfo();
    var n = document.getElementById('hall-activity-name');
    var r = document.getElementById('hall-reach');
    var c = document.getElementById('hall-need-count');
    var t = document.getElementById('hall-need-type');
    if (n) n.textContent = info.name;
    if (r) r.textContent = info.people;
    if (c) c.textContent = rewardCount;
    if (t) t.textContent = selectedRewardType;
    updateProgress();
  }

  /* ─────────────────────────────────────────────────────────
     奖品类型切换
  ───────────────────────────────────────────────────────── */
  var selectedRewardType = '代金券';

  document.querySelectorAll('.qiumi-type-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.qiumi-type-btn').forEach(function(b) {
        b.classList.remove('active');
      });
      this.classList.add('active');
      selectedRewardType = this.dataset.type;
    });
  });

  /* ─────────────────────────────────────────────────────────
     数量加减
  ───────────────────────────────────────────────────────── */
  var rewardCount = 10;

  function updateCountDisplay() {
    var el = document.getElementById('qiumi-count');
    if (el) el.textContent = rewardCount;
  }

  var btnMinus = document.getElementById('qiumi-count-minus');
  var btnPlus  = document.getElementById('qiumi-count-plus');

  if (btnMinus) {
    btnMinus.addEventListener('click', function() {
      if (rewardCount > 1) {
        rewardCount--;
        updateCountDisplay();
      }
    });
  }

  if (btnPlus) {
    btnPlus.addEventListener('click', function() {
      rewardCount++;
      updateCountDisplay();
    });
  }

  /* ─────────────────────────────────────────────────────────
     发布求米需求
  ───────────────────────────────────────────────────────── */
  var btnPublish = document.getElementById('btn-publish-qiumi');
  if (btnPublish) {
    btnPublish.addEventListener('click', function() {
      var self = this;
      self.innerHTML = '发布中...';
      self.disabled = true;
      setTimeout(function() {
        self.style.display = 'none';
        var successEl = document.getElementById('qiumi-success');
        if (successEl) successEl.style.display = 'flex';
        fillHallInfo();
      }, 1200);
    });
  }

  /* ─────────────────────────────────────────────────────────
     发布成功 → 查看赞助大厅
  ───────────────────────────────────────────────────────── */
  var btnViewSponsors = document.getElementById('btn-view-sponsors');
  if (btnViewSponsors) {
    btnViewSponsors.addEventListener('click', function() {
      fillHallInfo();
      goPage('page-sponsor-hall');
    });
  }

  /* ─────────────────────────────────────────────────────────
     求米页：「返回活动方案」按钮
  ───────────────────────────────────────────────────────── */
  var btnBackResultFromQiumi = document.getElementById('btn-back-result-from-qiumi');
  if (btnBackResultFromQiumi) {
    btnBackResultFromQiumi.addEventListener('click', function() {
      goPage('page-result');
      // 恢复求米 Tab 高亮
      document.querySelectorAll('.tab-btn').forEach(function(b){ b.classList.remove('active'); });
      var qiuTab = document.querySelector('[data-tab="tab-qiumi"]');
      if (qiuTab) qiuTab.classList.add('active');
    });
  }

  /* ─────────────────────────────────────────────────────────
     求米页：顶部返回按钮（← 返回方案）
  ───────────────────────────────────────────────────────── */
  var btnBackQiumi = document.getElementById('btn-back-qiumi');
  if (btnBackQiumi) {
    btnBackQiumi.addEventListener('click', function() {
      goPage('page-result');
      // 恢复求米 Tab 高亮
      document.querySelectorAll('.tab-btn').forEach(function(b){ b.classList.remove('active'); });
      var qiuTab = document.querySelector('[data-tab="tab-qiumi"]');
      if (qiuTab) qiuTab.classList.add('active');
    });
  }

  /* ─────────────────────────────────────────────────────────
     结果页：求米 Banner 按钮
  ───────────────────────────────────────────────────────── */
  var btnGoQiumi = document.getElementById('btn-go-qiumi');
  if (btnGoQiumi) {
    btnGoQiumi.addEventListener('click', function() {
      fillQiuMiInfo();
      // 重置发布状态
      var btn = document.getElementById('btn-publish-qiumi');
      if (btn) {
        btn.style.display = '';
        btn.disabled = false;
        btn.innerHTML = '<span>\uD83D\uDE80</span> \u53D1\u5E03\u6C42\u7C73\u9700\u6C42';
      }
      var suc = document.getElementById('qiumi-success');
      if (suc) suc.style.display = 'none';
      goPage('page-qiumi');
    });
  }

  /* ─────────────────────────────────────────────────────────
     赞助大厅：返回按钮
  ───────────────────────────────────────────────────────── */
  var btnBackSponsor = document.getElementById('btn-back-sponsor');
  if (btnBackSponsor) {
    btnBackSponsor.addEventListener('click', function() {
      goPage('page-qiumi');
    });
  }

  /* ─────────────────────────────────────────────────────────
     赞助大厅：修改求米需求
  ───────────────────────────────────────────────────────── */
  var btnGoQiumiFromHall = document.getElementById('btn-go-qiumi-from-hall');
  if (btnGoQiumiFromHall) {
    btnGoQiumiFromHall.addEventListener('click', function() {
      goPage('page-qiumi');
    });
  }

  /* ─────────────────────────────────────────────────────────
     赞助大厅：奖品已到位
  ───────────────────────────────────────────────────────── */
  var btnSponsorDone = document.getElementById('btn-sponsor-done');
  if (btnSponsorDone) {
    btnSponsorDone.addEventListener('click', function() {
      goPage('page-result');
      // 恢复求米 Tab 高亮
      document.querySelectorAll('.tab-btn').forEach(function(b){ b.classList.remove('active'); });
      var qiuTab = document.querySelector('[data-tab="tab-qiumi"]');
      if (qiuTab) qiuTab.classList.add('active');
    });
  }

  /* ─────────────────────────────────────────────────────────
     赞助大厅：接受赞助按钮
  ───────────────────────────────────────────────────────── */
  document.querySelectorAll('.btn-accept-sponsor').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var card = this.closest('.sponsor-card');
      if (!card) return;
      card.classList.remove('sponsor-card--pending');
      card.classList.add('sponsor-card--accepted');
      var statusEl = card.querySelector('.sponsor-status');
      if (statusEl) {
        statusEl.className = 'sponsor-status sponsor-status--accepted';
        statusEl.textContent = '\u2705 \u5DF2\u63A5\u53D7';
      }
      this.remove();
      updateProgress();
    });
  });

  /* ─────────────────────────────────────────────────────────
     赞助大厅：邀请赞助按钮
  ───────────────────────────────────────────────────────── */
  document.querySelectorAll('.btn-invite-sponsor').forEach(function(btn) {
    btn.addEventListener('click', function() {
      this.textContent = '\u2705 \u5DF2\u9080\u8BF7';
      this.disabled = true;
      this.style.background = '#e8f5e9';
      this.style.color = '#2e7d32';
    });
  });

  /* ─────────────────────────────────────────────────────────
     进度条更新
  ───────────────────────────────────────────────────────── */
  function updateProgress() {
    var accepted = document.querySelectorAll('#sponsor-list .sponsor-card--accepted').length;
    var gotEl    = document.getElementById('sponsor-got');
    var fillEl   = document.getElementById('sponsor-progress-fill');
    var totalEl  = document.getElementById('sponsor-total');
    var total    = totalEl ? parseInt(totalEl.textContent) || 10 : 10;
    // 每家商家平均提供 2 份
    var gotCount = Math.min(accepted * 2, total);
    if (gotEl)  gotEl.textContent  = gotCount;
    if (fillEl) fillEl.style.width = Math.round(gotCount / total * 100) + '%';
  }

});
