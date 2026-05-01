// partner.js — 校园合伙人中心交互逻辑

function initPartnerPage() {
  // 返回按钮
  const btnBack = document.getElementById('btn-back-partner');
  if (btnBack) btnBack.addEventListener('click', () => showPage('page-input'));

  // 复制链接
  const btnCopy = document.getElementById('btn-copy-promo-link');
  if (btnCopy) btnCopy.addEventListener('click', () => {
    const linkInput = document.getElementById('partner-promo-link');
    if (linkInput) {
      linkInput.select();
      navigator.clipboard.writeText(linkInput.value).catch(() => {});
      window.showToast('📋 推广链接已复制到剪贴板');
    }
  });

  // 分享到QQ
  const btnQQ = document.getElementById('btn-share-promo-qq');
  if (btnQQ) btnQQ.addEventListener('click', () => {
    window.showToast('✅ 推广链接已分享到QQ');
  });

  // 分享到微信
  const btnWX = document.getElementById('btn-share-promo-wx');
  if (btnWX) btnWX.addEventListener('click', () => {
    window.showToast('✅ 推广链接已分享到微信');
  });

  // 申请成为合伙人
  const btnApply = document.getElementById('btn-apply-partner');
  if (btnApply) btnApply.addEventListener('click', () => {
    window.showToast('🚀 合伙人申请已提交，审核中...');
  });

  // 查看排行榜
  const btnRank = document.getElementById('btn-view-rank');
  if (btnRank) btnRank.addEventListener('click', () => {
    window.showToast('🏅 正在加载完整排行榜...');
  });
}
