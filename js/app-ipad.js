/**
 * app-ipad.js - iPad 專屬教學控制器
 * 專為 1 部 iPad + 紙本工作紙課堂打造
 * 支援每週實驗開放進度控制（最多開放 2 個實驗）
 */

class TimssIpadApp {
  constructor() {
    this.currentLabId = 'W01';
    this.currentLab = null;
    this.unlockedLabs = [];
    this.teacherAuthenticated = false;
  }

  init() {
    this.loadUnlockedLabs();
    this.setupNavigation();
    this.setupFloatingToolbar();
    this.setupKeyboard();
    this.setupSummaryToggle();
    this.setupTeacherPanel();

    // 啟動畫筆模組
    if (window.penTool) {
      window.penTool.init();
    }

    const hash = window.location.hash.replace('#', '');
    let targetId = (hash && window.TIMSS_LABS[hash]) ? hash : this.getFirstUnlockedLabId();
    this.loadLab(targetId);
  }

  // 載入開放的實驗清單（優先級：URL 參數 > localStorage > config.js）
  loadUnlockedLabs() {
    // 1. 最高優先級：URL 參數 ?open=W01,W02 或 ?weeks=1,2 或 ?open=all
    const params = new URLSearchParams(window.location.search);
    const openParam = params.get('open') || params.get('weeks');
    if (openParam) {
      if (openParam.toLowerCase() === 'all') {
        this.unlockedLabs = Object.keys(window.TIMSS_LABS || {});
        return;
      }
      const list = openParam.split(',').map(s => s.trim().toUpperCase());
      const validList = [];
      list.forEach(item => {
        if (item.startsWith('W')) {
          validList.push(item);
        } else {
          const n = parseInt(item);
          if (!isNaN(n)) validList.push(n < 10 ? `W0${n}` : `W${n}`);
        }
      });
      if (validList.length > 0) {
        this.unlockedLabs = validList;
        return;
      }
    }

    // 2. 次優先級：本機儲存 (localStorage)
    try {
      const saved = localStorage.getItem('timss_unlocked_labs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.unlockedLabs = parsed;
          return;
        }
      }
    } catch (e) {}

    // 3. 基礎預設值：config.js
    const cfg = window.TIMSS_CONFIG;
    if (cfg && Array.isArray(cfg.defaultOpenLabs) && cfg.defaultOpenLabs.length > 0) {
      this.unlockedLabs = [...cfg.defaultOpenLabs];
    } else {
      this.unlockedLabs = ['W01', 'W02'];
    }
  }

  isLabUnlocked(labId) {
    return this.unlockedLabs.includes(labId) || this.unlockedLabs.includes('ALL');
  }

  getFirstUnlockedLabId() {
    for (let i = 1; i <= 11; i++) {
      const id = i < 10 ? `W0${i}` : `W${i}`;
      if (this.isLabUnlocked(id) && window.TIMSS_LABS[id]) {
        return id;
      }
    }
    return 'W01';
  }

  saveUnlockedLabs() {
    try {
      localStorage.setItem('timss_unlocked_labs', JSON.stringify(this.unlockedLabs));
    } catch (e) {}
  }

  setupNavigation() {
    const bar = document.getElementById('week-nav-bar');
    if (!bar) return;

    let html = '';
    for (let i = 1; i <= 11; i++) {
      const id = i < 10 ? `W0${i}` : `W${i}`;
      const lab = window.TIMSS_LABS[id];
      if (lab) {
        const unlocked = this.isLabUnlocked(id);
        const lockBadge = unlocked ? '' : '<span class="lock-badge">🔒 鎖定</span>';
        const activeClass = id === this.currentLabId ? 'active' : '';
        const lockedClass = unlocked ? '' : 'locked';
        html += `
          <button class="week-btn ${activeClass} ${lockedClass}" data-lab="${id}" title="${unlocked ? lab.title : '🔒 尚未開放，請跟隨老師進度'}">
            <span>${id}</span>
            <span>第${i}週：${lab.title}</span>
            ${lockBadge}
          </button>
        `;
      }
    }
    bar.innerHTML = html;

    bar.querySelectorAll('.week-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-lab');
        window.soundFx?.click();
        this.loadLab(id);
      });
    });
  }

  loadLab(labId) {
    if (!window.TIMSS_LABS[labId]) return;

    if (this.currentLab && typeof this.currentLab.destroy === 'function') {
      this.currentLab.destroy();
    }

    this.currentLabId = labId;
    this.currentLab = window.TIMSS_LABS[labId];
    window.location.hash = labId;

    // 每次切換實驗，教師最後的總結預設摺合
    this.collapseSummary();

    // 更新分頁按鈕高亮狀態
    document.querySelectorAll('.week-btn').forEach(btn => {
      if (btn.getAttribute('data-lab') === labId) {
        btn.classList.add('active');
        btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      } else {
        btn.classList.remove('active');
      }
    });

    const isUnlocked = this.isLabUnlocked(labId);
    const summarySection = document.querySelector('.teacher-summary-card');

    if (isUnlocked) {
      // 正常解鎖狀態：更新頂部資訊，渲染實驗教具，顯示教師總結卡片
      if (summarySection) summarySection.style.display = 'block';
      this.renderHeader();

      const stage = document.getElementById('main-stage-container');
      if (stage) {
        stage.innerHTML = '';
        this.currentLab.render(stage);
      }
    } else {
      // 鎖定狀態：隱藏教師總結，渲染課堂鎖定畫面
      if (summarySection) summarySection.style.display = 'none';
      this.renderHeaderLocked();
      this.renderLockedScreen(labId);
    }
  }

  renderHeader() {
    const lab = this.currentLab;
    const titleArea = document.getElementById('lab-title-box');
    const roleTag = document.getElementById('turn-role-display');

    if (titleArea) {
      titleArea.innerHTML = `
        <h2>
          <span>${lab.title}</span>
          <span style="font-size:0.85rem; font-weight:normal; color:#64748b; font-family:monospace;">(${lab.code})</span>
        </h2>
        <div class="lab-meta-row">
          <span class="badge-tag ${lab.domainType}">📚 ${lab.domain}</span>
          <span class="badge-tag cog">🧠 ${lab.cognitive}</span>
          <span class="badge-tag" style="background:#f1f5f9; color:#475569;">👦 P4 四人小組共用</span>
        </div>
        <div class="question-highlight">
          🎯 <strong>核心認知探究：</strong>${lab.question}
        </div>
      `;
    }

    if (roleTag) {
      roleTag.innerHTML = `<span>${lab.activeRole}</span>`;
    }
  }

  renderHeaderLocked() {
    const lab = this.currentLab;
    const titleArea = document.getElementById('lab-title-box');
    const roleTag = document.getElementById('turn-role-display');

    if (titleArea) {
      titleArea.innerHTML = `
        <h2>
          <span>🔒 ${lab.title}</span>
          <span style="font-size:0.85rem; font-weight:normal; color:#64748b; font-family:monospace;">(${lab.code})</span>
        </h2>
        <div class="lab-meta-row">
          <span class="badge-tag" style="background:#fee2e2; color:#b91c1c;">🔒 課堂進度尚未開放</span>
          <span class="badge-tag ${lab.domainType}">📚 ${lab.domain}</span>
        </div>
        <div class="question-highlight" style="border-left-color:#ef4444;">
          ⏳ <strong>課堂進度引導：</strong>此實驗尚未開放學生操作，請等待老師統一步調！
        </div>
      `;
    }

    if (roleTag) {
      roleTag.innerHTML = `<span style="color:#94a3b8;">🔒 暫未開放</span>`;
    }
  }

  renderLockedScreen(labId) {
    const lab = window.TIMSS_LABS[labId];
    const weekNum = parseInt(labId.replace('W', ''));
    const stage = document.getElementById('main-stage-container');
    if (!stage) return;

    const firstUnlocked = this.getFirstUnlockedLabId();

    stage.innerHTML = `
      <div class="lab-locked-screen">
        <div class="locked-card">
          <div class="locked-icon-anim">🔒</div>
          <div class="locked-badge">課堂進度鎖定中</div>
          <h2>第 ${weekNum} 週：${lab ? lab.title : labId}</h2>
          <p class="locked-sub">${lab ? lab.code : ''} ｜ 建議每週專注 1~2 個核心動手實驗</p>
          <div class="locked-msg-box">
            💡 <strong>本週課堂進度提醒：</strong><br>
            ${window.TIMSS_CONFIG?.lockMessage || '本週請專注於已開放的動手實驗，請跟隨老師教學進度一同探索！'}
          </div>
          <div class="locked-actions-row">
            <button class="touch-btn primary" id="btn-goto-unlocked">🚀 返回本週已開放實驗 (${firstUnlocked})</button>
            <button class="touch-btn text-link" id="btn-teacher-quick-unlock">🔑 教師課堂解鎖此實驗</button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-goto-unlocked')?.addEventListener('click', () => {
      window.soundFx?.click();
      this.loadLab(firstUnlocked);
    });

    document.getElementById('btn-teacher-quick-unlock')?.addEventListener('click', () => {
      this.openTeacherPinModal(() => {
        if (!this.unlockedLabs.includes(labId)) {
          this.unlockedLabs.push(labId);
          this.saveUnlockedLabs();
          this.setupNavigation();
          this.loadLab(labId);
          window.soundFx?.successFanfare();
        }
      });
    });
  }

  // 教師進度控制面板模組
  setupTeacherPanel() {
    const btnOpen = document.getElementById('btn-open-teacher-modal');
    const pinModal = document.getElementById('teacher-pin-modal');
    const manageModal = document.getElementById('teacher-manage-modal');
    const qrModal = document.getElementById('qrcode-modal');

    // 頂部「⚙️ 課堂進度控制」點擊
    btnOpen?.addEventListener('click', () => {
      window.soundFx?.click();
      if (this.teacherAuthenticated) {
        this.openTeacherManageModal();
      } else {
        this.openTeacherPinModal(() => {
          this.openTeacherManageModal();
        });
      }
    });

    // PIN 彈窗關閉與提交
    document.getElementById('btn-close-pin-modal')?.addEventListener('click', () => {
      if (pinModal) pinModal.style.display = 'none';
    });

    document.getElementById('btn-submit-pin')?.addEventListener('click', () => {
      this.handlePinSubmit();
    });

    document.getElementById('input-teacher-pin')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.handlePinSubmit();
    });

    // 管理彈窗關閉與取消
    document.getElementById('btn-close-manage-modal')?.addEventListener('click', () => {
      if (manageModal) manageModal.style.display = 'none';
    });

    document.getElementById('btn-cancel-manage')?.addEventListener('click', () => {
      if (manageModal) manageModal.style.display = 'none';
    });

    // QR 碼彈窗關閉
    document.getElementById('btn-close-qr-modal')?.addEventListener('click', () => {
      if (qrModal) qrModal.style.display = 'none';
    });

    // 儲存開放設定
    document.getElementById('btn-save-manage')?.addEventListener('click', () => {
      this.handleSaveManage();
    });

    // 複製學生專用網址
    document.getElementById('btn-copy-student-url')?.addEventListener('click', () => {
      this.handleCopyStudentUrl();
    });

    // 顯示大螢幕 QR 碼
    document.getElementById('btn-show-qr-code')?.addEventListener('click', () => {
      this.handleShowQrCode();
    });

    // 複製 QR 彈窗內的網址
    document.getElementById('btn-copy-qr-url')?.addEventListener('click', () => {
      const urlBox = document.getElementById('qr-target-url-text');
      if (urlBox) {
        navigator.clipboard.writeText(urlBox.innerText).then(() => {
          const btn = document.getElementById('btn-copy-qr-url');
          if (btn) {
            const old = btn.innerText;
            btn.innerText = '✅ 網址已複製！';
            setTimeout(() => { btn.innerText = old; }, 2000);
          }
        });
      }
    });

    // 快速進度預設按鈕
    document.querySelectorAll('.preset-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        window.soundFx?.click();
        const weeks = btn.getAttribute('data-weeks');
        this.applyPresetWeeks(weeks);
      });
    });
  }

  openTeacherPinModal(onSuccess) {
    const pinModal = document.getElementById('teacher-pin-modal');
    const inputPin = document.getElementById('input-teacher-pin');
    const errorMsg = document.getElementById('pin-error-msg');

    if (errorMsg) errorMsg.style.display = 'none';
    if (inputPin) {
      inputPin.value = '';
      setTimeout(() => inputPin.focus(), 150);
    }
    if (pinModal) pinModal.style.display = 'flex';

    this.onPinSuccessCallback = onSuccess;
  }

  handlePinSubmit() {
    const inputPin = document.getElementById('input-teacher-pin');
    const errorMsg = document.getElementById('pin-error-msg');
    const pinModal = document.getElementById('teacher-pin-modal');
    const correctPin = window.TIMSS_CONFIG?.teacherPin || '8888';

    if (inputPin && inputPin.value.trim() === correctPin) {
      this.teacherAuthenticated = true;
      if (errorMsg) errorMsg.style.display = 'none';
      if (pinModal) pinModal.style.display = 'none';
      window.soundFx?.successFanfare();
      if (typeof this.onPinSuccessCallback === 'function') {
        this.onPinSuccessCallback();
        this.onPinSuccessCallback = null;
      }
    } else {
      if (errorMsg) errorMsg.style.display = 'block';
      if (inputPin) inputPin.select();
      window.soundFx?.click();
    }
  }

  openTeacherManageModal() {
    const manageModal = document.getElementById('teacher-manage-modal');
    const container = document.getElementById('labs-checklist-area');
    if (!container) return;

    let html = '';
    for (let i = 1; i <= 11; i++) {
      const id = i < 10 ? `W0${i}` : `W${i}`;
      const lab = window.TIMSS_LABS[id];
      if (lab) {
        const isChecked = this.isLabUnlocked(id);
        html += `
          <label class="lab-check-item ${isChecked ? 'checked' : ''}" data-id="${id}">
            <input type="checkbox" value="${id}" ${isChecked ? 'checked' : ''}>
            <div class="lab-check-info">
              <div class="lab-check-title">${id} 第${i}週：${lab.title}</div>
              <div class="lab-check-meta">${lab.domain} ｜ ${lab.code}</div>
            </div>
          </label>
        `;
      }
    }
    container.innerHTML = html;

    // 綁定勾選變更事件
    container.querySelectorAll('.lab-check-item').forEach(item => {
      const chk = item.querySelector('input[type="checkbox"]');
      chk?.addEventListener('change', () => {
        item.classList.toggle('checked', chk.checked);
        this.updateManageModalStatus();
      });
    });

    this.updateManageModalStatus();
    if (manageModal) manageModal.style.display = 'flex';
  }

  updateManageModalStatus() {
    const checked = document.querySelectorAll('#labs-checklist-area input[type="checkbox"]:checked');
    const countEl = document.getElementById('selected-labs-count');
    const hintEl = document.getElementById('selected-warning-hint');

    if (countEl) countEl.innerText = checked.length;
    if (hintEl) {
      hintEl.style.display = checked.length > 2 ? 'inline' : 'none';
    }
  }

  applyPresetWeeks(weeksStr) {
    const checkboxes = document.querySelectorAll('#labs-checklist-area input[type="checkbox"]');
    if (!checkboxes.length) return;

    if (weeksStr === 'all') {
      checkboxes.forEach(chk => {
        chk.checked = true;
        chk.closest('.lab-check-item')?.classList.add('checked');
      });
    } else {
      const targetList = weeksStr.split(',').map(s => s.trim());
      checkboxes.forEach(chk => {
        const val = chk.value;
        chk.checked = targetList.includes(val);
        chk.closest('.lab-check-item')?.classList.toggle('checked', chk.checked);
      });
    }
    this.updateManageModalStatus();
  }

  handleSaveManage() {
    const checkboxes = document.querySelectorAll('#labs-checklist-area input[type="checkbox"]:checked');
    const selected = Array.from(checkboxes).map(c => c.value);

    if (selected.length === 0) {
      alert('請至少開放 1 個實驗供學生課堂操作！');
      return;
    }

    this.unlockedLabs = selected;
    this.saveUnlockedLabs();

    const manageModal = document.getElementById('teacher-manage-modal');
    if (manageModal) manageModal.style.display = 'none';

    this.setupNavigation();
    window.soundFx?.successFanfare();

    // 若當前實驗被鎖定，自動跳轉到第一個已開放實驗
    if (!this.isLabUnlocked(this.currentLabId)) {
      this.loadLab(this.getFirstUnlockedLabId());
    } else {
      this.loadLab(this.currentLabId);
    }
  }

  getStudentUrlForCurrentSelection() {
    const checkboxes = document.querySelectorAll('#labs-checklist-area input[type="checkbox"]:checked');
    const selected = Array.from(checkboxes).map(c => c.value);
    const labsParam = selected.length === 11 ? 'all' : selected.join(',');
    const url = new URL(window.location.href);
    url.searchParams.set('open', labsParam);
    url.hash = selected[0] || 'W01';
    return url.toString();
  }

  handleCopyStudentUrl() {
    const url = this.getStudentUrlForCurrentSelection();
    navigator.clipboard.writeText(url).then(() => {
      const btn = document.getElementById('btn-copy-student-url');
      if (btn) {
        const old = btn.innerText;
        btn.innerText = '✅ 學生網址已複製！';
        setTimeout(() => { btn.innerText = old; }, 2000);
      }
    });
  }

  handleShowQrCode() {
    const url = this.getStudentUrlForCurrentSelection();
    const qrModal = document.getElementById('qrcode-modal');
    const qrBox = document.getElementById('qrcode-img-box');
    const urlText = document.getElementById('qr-target-url-text');

    if (urlText) urlText.innerText = url;
    if (qrBox) {
      qrBox.innerHTML = `
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=8&data=${encodeURIComponent(url)}" 
             alt="學生專用二維碼" 
             style="width:240px; height:240px; border-radius:12px; border:2px solid #cbd5e1; box-shadow:0 4px 12px rgba(0,0,0,0.08);" />
      `;
    }

    if (qrModal) qrModal.style.display = 'flex';
  }

  setupSummaryToggle() {
    const btn = document.getElementById('summary-toggle-btn');
    const content = document.getElementById('summary-collapse-content');
    const arrowText = document.getElementById('summary-arrow-text');
    const arrowIcon = document.getElementById('summary-arrow-icon');
    if (!btn || !content) return;

    btn.addEventListener('click', () => {
      const isHidden = content.style.display === 'none' || getComputedStyle(content).display === 'none';
      if (isHidden) {
        content.style.display = 'block';
        if (arrowText) arrowText.innerText = '點擊摺合總結';
        if (arrowIcon) arrowIcon.innerText = '▲';
      } else {
        content.style.display = 'none';
        if (arrowText) arrowText.innerText = '點擊展開總結';
        if (arrowIcon) arrowIcon.innerText = '▼';
      }
      if (window.soundFx) window.soundFx.click();
    });
  }

  collapseSummary() {
    const content = document.getElementById('summary-collapse-content');
    const arrowText = document.getElementById('summary-arrow-text');
    const arrowIcon = document.getElementById('summary-arrow-icon');
    if (content) content.style.display = 'none';
    if (arrowText) arrowText.innerText = '點擊展開總結';
    if (arrowIcon) arrowIcon.innerText = '▼';
  }

  // 更新下方教師最後的總結內容
  updateTeacherSummary(summary) {
    if (!summary) return;
    const coreEl = document.getElementById('summary-core-point');
    const formulaEl = document.getElementById('summary-formula-point');
    const quoteEl = document.getElementById('summary-quote-text');

    if (coreEl && summary.core) {
      coreEl.innerHTML = summary.core;
    }
    if (formulaEl && summary.formula) {
      formulaEl.innerHTML = summary.formula;
    }
    if (quoteEl && summary.quote) {
      quoteEl.innerHTML = summary.quote;
    }
  }

  // 保留相容別名
  updateWorksheetGuide(guide) {
    this.updateTeacherSummary(guide);
  }

  setupFloatingToolbar() {
    const btnPen = document.getElementById('btn-toggle-pen');
    const btnExitPen = document.getElementById('btn-exit-pen');
    const btnClearPen = document.getElementById('btn-clear-pen');
    const btnEraser = document.getElementById('btn-eraser-pen');
    const btnLaser = document.getElementById('btn-toggle-laser');
    const btnSound = document.getElementById('btn-toggle-sound');
    const btnFs = document.getElementById('btn-toggle-fs');

    btnPen?.addEventListener('click', () => {
      window.penTool.togglePen();
    });

    btnExitPen?.addEventListener('click', () => {
      // ❌ 明確退出畫筆：立即解除 Canvas 攔截！
      window.penTool.togglePen(false);
    });

    btnClearPen?.addEventListener('click', () => {
      window.penTool.clear();
    });

    btnEraser?.addEventListener('click', () => {
      window.penTool.setEraser();
      window.soundFx.click();
    });

    document.querySelectorAll('.color-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        const col = dot.getAttribute('data-color');
        window.penTool.setColor(col);
        window.soundFx.click();
      });
    });

    btnLaser?.addEventListener('click', () => {
      window.penTool.toggleLaser();
    });

    btnSound?.addEventListener('click', () => {
      window.soundFx.enabled = !window.soundFx.enabled;
      btnSound.classList.toggle('active', window.soundFx.enabled);
      btnSound.innerText = window.soundFx.enabled ? '🔊' : '🔇';
    });

    btnFs?.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
        btnFs.classList.add('active');
      } else {
        document.exitFullscreen().catch(() => {});
        btnFs.classList.remove('active');
      }
    });
  }

  setupKeyboard() {
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
      const num = parseInt(this.currentLabId.replace('W', ''));
      if (e.key === 'ArrowRight' && num < 11) {
        const nId = num + 1 < 10 ? `W0${num + 1}` : `W${num + 1}`;
        this.loadLab(nId);
      } else if (e.key === 'ArrowLeft' && num > 1) {
        const pId = num - 1 < 10 ? `W0${num - 1}` : `W${num - 1}`;
        this.loadLab(pId);
      }
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.ipadApp = new TimssIpadApp();
  window.ipadApp.init();
});
