/**
 * lab06.js - 第 6 週：【毛線籬笆變形記】 (LAB-W06-MG-PER) - iPad 優化版
 * 測量與幾何 ｜ 應用 Applying ｜ 大尺寸農場、毛線剪貼、磚牆與大門情境
 */

window.TIMSS_LABS = window.TIMSS_LABS || {};

window.TIMSS_LABS['W06'] = {
  id: 'W06',
  code: 'LAB-W06-MG-PER',
  title: '毛線籬笆變形記',
  domain: '測量與幾何 M&G',
  domainType: 'mg',
  cognitive: '應用 Applying',
  question: '農場長 12cm、寬 8cm。四面圍籬笆要 40cm 毛線。若其中一條長邊靠磚牆，或留 3cm 大門，毛線要剪掉多少？',
  activeRole: '🔴 操作員(D) 調整農場尺寸 ➔ 🟣 質疑員(A) 挑戰靠牆周界變化',

  state: {
    length: 12,
    width: 8,
    mode: 'full' // 'full', 'wall', 'gate', 'wall_gate'
  },

  getWorksheetGuide() {
    const L = this.state.length;
    const W = this.state.width;
    const full = (L + W) * 2;
    const wallVal = full - L;
    const gateVal = full - 3;
    return {
      step1: `【工作紙第 1 題】：四面全圍毛線長度：(<strong>${L} + ${W}</strong>) × 2 ＝ <strong>${full} cm</strong>。`,
      step2: `【工作紙第 2 題】：長邊靠牆實用毛線：<strong>${full} − ${L} ＝ ${wallVal} cm</strong>；預留 3cm 門實用毛線：<strong>${full} − 3 ＝ ${gateVal} cm</strong>。`,
      quote: `🗣️ 【發言人說理】：我們組實測圍籬笆：四面全圍剛好用光 40cm 毛線；靠牆一面時，剪掉一條長邊，只要 28 cm；留 3cm 大門時，剪去大門，只要 37 cm！周界是圍繞外圍一週的長度，靠牆處不用圍！`
    };
  },

  render(container) {
    this.container = container;
    this.state = { length: 12, width: 8, mode: 'full' };

    container.innerHTML = `
      <div class="ipad-controls-bar">
        <div class="controls-left-group">
          <div style="display:flex; align-items:center; gap:8px;">
            <label style="font-weight:bold;">📏 長度 (L)：<strong id="w06-l-txt" style="color:var(--primary); font-size:1.1rem;">12</strong> cm</label>
            <input type="range" class="touch-slider" id="w06-l-slider" min="6" max="16" value="12" step="1">
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <label style="font-weight:bold;">📐 寬度 (W)：<strong id="w06-w-txt" style="color:var(--primary); font-size:1.1rem;">8</strong> cm</label>
            <input type="range" class="touch-slider" id="w06-w-slider" min="4" max="12" value="8" step="1">
          </div>
        </div>
      </div>

      <!-- 情境切換按鈕列 -->
      <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
        <button class="touch-btn primary" id="w06-btn-full">🏞️ 情境 A：四面全圍 (40cm)</button>
        <button class="touch-btn" id="w06-btn-wall" style="border-color:#b91c1c; color:#b91c1c;">🧱 情境 B：長邊靠磚牆 (減長邊)</button>
        <button class="touch-btn" id="w06-btn-gate" style="border-color:#d97706; color:#d97706;">🚪 情境 C：底邊留 3cm 門 (剪去門)</button>
        <button class="touch-btn" id="w06-btn-wallgate" style="border-color:#7c3aed; color:#7c3aed;">⭐ 靠牆 ＋ 留門</button>
      </div>

      <!-- 農場大畫布 -->
      <div style="background:#f0fdf4; border:2.5px solid #86efac; border-radius:14px; padding:20px; min-height:360px; display:flex; justify-content:center; align-items:center;">
        <svg width="600" height="320" viewBox="0 0 600 320" id="w06-farm-svg">
          <g id="w06-farm-g"></g>
        </svg>
      </div>

      <!-- 解釋文字框 -->
      <div id="w06-info-box" style="margin-top:12px; background:#ecfdf5; border:1.5px solid #86efac; border-radius:10px; padding:12px 16px; font-size:0.95rem;"></div>
    `;

    this.bindEvents();
    this.update();
  },

  bindEvents() {
    const lSlider = document.getElementById('w06-l-slider');
    const wSlider = document.getElementById('w06-w-slider');

    if (lSlider) {
      lSlider.addEventListener('input', (e) => {
        this.state.length = parseInt(e.target.value);
        window.soundFx.click();
        this.update();
      });
    }

    if (wSlider) {
      wSlider.addEventListener('input', (e) => {
        this.state.width = parseInt(e.target.value);
        window.soundFx.click();
        this.update();
      });
    }

    const bind = (id, mode) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('click', () => {
          this.state.mode = mode;
          ['w06-btn-full', 'w06-btn-wall', 'w06-btn-gate', 'w06-btn-wallgate'].forEach(b => {
            document.getElementById(b)?.classList.remove('primary');
          });
          el.classList.add('primary');
          window.soundFx.rubberSnap();
          this.update();
        });
      }
    };

    bind('w06-btn-full', 'full');
    bind('w06-btn-wall', 'wall');
    bind('w06-btn-gate', 'gate');
    bind('w06-btn-wallgate', 'wall_gate');
  },

  update() {
    const L = this.state.length;
    const W = this.state.width;
    const scale = 20;
    const full = (L + W) * 2;

    document.getElementById('w06-l-txt').innerText = L;
    document.getElementById('w06-w-txt').innerText = W;

    const rW = L * scale;
    const rH = W * scale;
    const sx = (600 - rW) / 2;
    const sy = (320 - rH) / 2;

    const g = document.getElementById('w06-farm-g');
    const info = document.getElementById('w06-info-box');

    let needed = full;
    const isWall = this.state.mode === 'wall' || this.state.mode === 'wall_gate';
    const isGate = this.state.mode === 'gate' || this.state.mode === 'wall_gate';

    let html = `
      <rect x="${sx}" y="${sy}" width="${rW}" height="${rH}" fill="#dcfce7" stroke="#86efac" stroke-width="2.5" rx="6" />
      <text x="${sx + rW / 2}" y="${sy + rH / 2 + 6}" font-size="15" fill="#15803d" font-weight="900" text-anchor="middle">農場面積 ＝ ${L} × ${W} ＝ ${L * W} cm²</text>
      <text x="${sx + rW / 2}" y="${sy - 10}" font-size="13" fill="#334155" font-weight="bold" text-anchor="middle">長 ＝ ${L} cm</text>
      <text x="${sx - 14}" y="${sy + rH / 2}" font-size="13" fill="#334155" font-weight="bold" text-anchor="middle" transform="rotate(-90, ${sx - 14}, ${sy + rH / 2})">寬 ＝ ${W} cm</text>
    `;

    // 頂邊
    if (isWall) {
      html += `
        <rect x="${sx - 12}" y="${sy - 18}" width="${rW + 24}" height="18" fill="#b91c1c" stroke="#7f1d1d" stroke-width="2" />
        <text x="${sx + rW / 2}" y="${sy - 5}" font-size="11" fill="white" font-weight="bold" text-anchor="middle">🧱 磚牆 (長 ${L} cm 免圍籬笆)</text>
        <path d="M ${sx} ${sy} Q ${sx + rW / 2} ${sy + 40} ${sx + rW} ${sy}" fill="none" stroke="#94a3b8" stroke-width="3" stroke-dasharray="4,4" />
      `;
      needed -= L;
    } else {
      html += `<line x1="${sx}" y1="${sy}" x2="${sx + rW}" y2="${sy}" stroke="#ef4444" stroke-width="6" stroke-linecap="round" />`;
    }

    // 左邊與右邊
    html += `<line x1="${sx}" y1="${sy}" x2="${sx}" y2="${sy + rH}" stroke="#ef4444" stroke-width="6" stroke-linecap="round" />`;
    html += `<line x1="${sx + rW}" y1="${sy}" x2="${sx + rW}" y2="${sy + rH}" stroke="#ef4444" stroke-width="6" stroke-linecap="round" />`;

    // 底邊
    if (isGate) {
      const gatePx = 3 * scale;
      const gS = sx + rW / 2 - gatePx / 2;
      const gE = gS + gatePx;
      html += `
        <line x1="${sx}" y1="${sy + rH}" x2="${gS}" y2="${sy + rH}" stroke="#ef4444" stroke-width="6" stroke-linecap="round" />
        <rect x="${gS}" y="${sy + rH - 5}" width="${gatePx}" height="10" fill="#d97706" rx="3" />
        <text x="${(gS + gE) / 2}" y="${sy + rH + 20}" font-size="12" fill="#b45309" font-weight="bold" text-anchor="middle">🚪 3cm 大門 (剪除 3cm)</text>
        <line x1="${gE}" y1="${sy + rH}" x2="${sx + rW}" y2="${sy + rH}" stroke="#ef4444" stroke-width="6" stroke-linecap="round" />
      `;
      needed -= 3;
    } else {
      html += `<line x1="${sx}" y1="${sy + rH}" x2="${sx + rW}" y2="${sy + rH}" stroke="#ef4444" stroke-width="6" stroke-linecap="round" />`;
    }

    g.innerHTML = html;

    if (this.state.mode === 'full') {
      info.style.background = '#ecfdf5';
      info.style.borderColor = '#86efac';
      info.style.color = '#065f46';
      info.innerHTML = `🏞️ <strong>四面全圍：</strong>算式 <strong>(${L} + ${W}) × 2 ＝ ${full} cm</strong>。紅色毛線剛好繞滿四周！`;
    } else if (this.state.mode === 'wall') {
      info.style.background = '#eff6ff';
      info.style.borderColor = '#bfdbfe';
      info.style.color = '#1e40af';
      info.innerHTML = `🧱 <strong>長邊靠磚牆：</strong>算式 <strong>(${L} + ${W}) × 2 − ${L} ＝ ${needed} cm</strong>。磚牆抵擋，上面一條邊不用圍，<strong>毛線只需 ${needed} cm，省下 ${L} cm！</strong>`;
    } else if (this.state.mode === 'gate') {
      info.style.background = '#fffbeb';
      info.style.borderColor = '#fde68a';
      info.style.color = '#92400e';
      info.innerHTML = `🚪 <strong>底邊留 3cm 門：</strong>算式 <strong>(${L} + ${W}) × 2 − 3 ＝ ${needed} cm</strong>。剪掉大門通道，<strong>實用毛線只需 ${needed} cm！</strong>`;
    } else if (this.state.mode === 'wall_gate') {
      info.style.background = '#f5f3ff';
      info.style.borderColor = '#ddd6fe';
      info.style.color = '#6d28d9';
      info.innerHTML = `⭐ <strong>雙重扣減（靠牆＋留門）：</strong>算式 <strong>(${L} + ${W}) × 2 − ${L} (牆) − 3 (門) ＝ ${needed} cm</strong>！`;
    }

    if (window.ipadApp) {
      window.ipadApp.updateWorksheetGuide(this.getWorksheetGuide());
    }
  },

  destroy() {}
};
