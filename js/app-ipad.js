/**
 * app-ipad.js - iPad 專屬教學控制器
 * 專為 1 部 iPad + 紙本工作紙課堂打造
 */

class TimssIpadApp {
  constructor() {
    this.currentLabId = 'W01';
    this.currentLab = null;
  }

  init() {
    this.setupNavigation();
    this.setupFloatingToolbar();
    this.setupKeyboard();

    // 啟動畫筆模組
    if (window.penTool) {
      window.penTool.init();
    }

    const hash = window.location.hash.replace('#', '');
    const defaultId = (hash && window.TIMSS_LABS[hash]) ? hash : 'W01';
    this.loadLab(defaultId);
  }

  setupNavigation() {
    const bar = document.getElementById('week-nav-bar');
    if (!bar) return;

    let html = '';
    for (let i = 1; i <= 11; i++) {
      const id = i < 10 ? `W0${i}` : `W${i}`;
      const lab = window.TIMSS_LABS[id];
      if (lab) {
        html += `
          <button class="week-btn ${id === this.currentLabId ? 'active' : ''}" data-lab="${id}">
            <span>${id}</span>
            <span>第${i}週：${lab.title}</span>
          </button>
        `;
      }
    }
    bar.innerHTML = html;

    bar.querySelectorAll('.week-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-lab');
        window.soundFx.click();
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

    // 更新分頁狀態
    document.querySelectorAll('.week-btn').forEach(btn => {
      if (btn.getAttribute('data-lab') === labId) {
        btn.classList.add('active');
        btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      } else {
        btn.classList.remove('active');
      }
    });

    // 更新頂部資訊與動手角色
    this.renderHeader();

    // 渲染核心實驗舞台
    const stage = document.getElementById('main-stage-container');
    if (stage) {
      stage.innerHTML = '';
      this.currentLab.render(stage);
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

  // 更新下方紙本工作紙引導
  updateWorksheetGuide(guide) {
    const step1El = document.getElementById('guide-step-1');
    const step2El = document.getElementById('guide-step-2');
    const quoteEl = document.getElementById('guide-quote-box');

    if (step1El) step1El.innerHTML = guide.step1;
    if (step2El) step2El.innerHTML = guide.step2;
    if (quoteEl) quoteEl.innerHTML = guide.quote;
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
