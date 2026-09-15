/**
 * lab04.js - 第 4 週：【殘缺斷尺尋寶大挑戰】 (LAB-W04-MG-SCALE) - iPad 優化版
 * 測量與幾何 ｜ 應用 Applying ｜ 大觸控物體平移、刻度放大鏡、撕膠帶透視
 */

window.TIMSS_LABS = window.TIMSS_LABS || {};

window.TIMSS_LABS['W04'] = {
  id: 'W04',
  code: 'LAB-W04-MG-SCALE',
  title: '殘缺斷尺尋寶大挑戰',
  domain: '測量與幾何 M&G',
  domainType: 'mg',
  cognitive: '應用 Applying',
  question: '尺子的 0 刻度被黑膠帶死死封住了，如何精確量出一枝新鉛筆的身長？為什麼直接讀右邊數字是錯的？',
  activeRole: '🔴 操作員(D) 平移待測物 ➔ 🟣 質疑員(A) 撕膠帶透視驗證',

  state: {
    itemKey: 'pencil',
    start: 6.0,
    tapePeel: false,
    items: {
      pencil: { name: '全新鉛筆', len: 15.4, color: '#f59e0b' },
      scissors: { name: '安全剪刀', len: 11.2, color: '#ef4444' },
      note: { name: '正方形便簽', len: 7.5, color: '#10b981' },
      marker: { name: '水彩彩色筆', len: 13.0, color: '#8b5cf6' }
    }
  },

  getWorksheetGuide() {
    const item = this.state.items[this.state.itemKey];
    const s = this.state.start;
    const e = parseFloat((s + item.len).toFixed(1));
    return {
      step1: `【工作紙第 1 題】：待測物 <strong>${item.name}</strong>，左端起點在 <strong>${s.toFixed(1)} cm</strong>，右端終點在 <strong>${e.toFixed(1)} cm</strong>。`,
      step2: `【工作紙第 2 題】：算式：<strong>${e.toFixed(1)} − ${s.toFixed(1)} = ${item.len.toFixed(1)} cm</strong>。完整尺驗證真實長度為 <strong>${item.len.toFixed(1)} cm</strong>。`,
      quote: `🗣️ 【發言人說理】：我們組測量鉛筆，左端在 ${s.toFixed(1)} cm，右端在 ${e.toFixed(1)} cm。因為前面 0 到 ${s.toFixed(1)} cm 沒有碰到物體，必須減掉！所以用終點減起點：${e.toFixed(1)} − ${s.toFixed(1)} = ${item.len.toFixed(1)} cm！`
    };
  },

  render(container) {
    this.container = container;
    this.state = { itemKey: 'pencil', start: 6.0, tapePeel: false, items: this.state.items };

    container.innerHTML = `
      <div class="ipad-controls-bar">
        <div class="controls-left-group">
          <span style="font-weight:bold;">🎁 挑選待測物品：</span>
          <button class="touch-btn primary" id="w04-btn-pencil">✏️ 全新鉛筆</button>
          <button class="touch-btn" id="w04-btn-scissors">✂️ 剪刀</button>
          <button class="touch-btn" id="w04-btn-note">📝 便簽</button>
          <button class="touch-btn" id="w04-btn-marker">🖍️ 彩色筆</button>
        </div>
        <button class="touch-btn warning" id="w04-btn-tape">🩹 撕開黑膠帶透視驗證</button>
      </div>

      <!-- 物體起點平移滑桿 -->
      <div class="ipad-controls-bar" style="background:#f8fafc;">
        <div style="display:flex; align-items:center; gap:12px;">
          <label style="font-weight:bold; font-size:1rem;">📍 物體左端起點對準刻度：<strong id="w04-start-txt" style="color:var(--primary); font-size:1.2rem;">6.0</strong> cm</label>
          <input type="range" class="touch-slider" id="w04-start-slider" min="5.0" max="10.0" value="6.0" step="0.5" style="width:220px;">
        </div>
        <span style="font-size:0.85rem; color:#64748b;">⚠️ 嚴禁從破損膠帶 0~5cm 處起量</span>
      </div>

      <!-- 斷尺與待測物展示畫布 -->
      <div style="background:white; border:2px solid #cbd5e1; border-radius:12px; padding:24px 16px; min-height:280px; overflow-x:auto;">
        <!-- 待測物圖形 -->
        <div id="w04-item-bar" style="height:60px; position:relative; margin-bottom:12px;"></div>

        <!-- 斷尺軌道 (寬 720px, 0~24cm) -->
        <div class="ipad-broken-ruler" style="width:720px;">
          <!-- 0~5cm 黑膠帶 -->
          <div class="tape-cover" id="w04-tape" style="width:150px;">
            ⚠️ 0~5cm 破損遮蔽
          </div>

          <!-- 刻度尺 SVG -->
          <svg width="720" height="96" viewBox="0 0 720 96">
            ${Array.from({ length: 25 }, (_, i) => {
              const x = i * 30;
              const major = i % 5 === 0;
              return `
                <line x1="${x}" y1="0" x2="${x}" y2="${major ? 28 : 16}" stroke="#78350f" stroke-width="${major ? 2.5 : 1.2}" />
                ${i < 24 ? Array.from({ length: 9 }, (_, m) => `<line x1="${x + (m + 1) * 3}" y1="0" x2="${x + (m + 1) * 3}" y2="9" stroke="#b45309" stroke-width="0.9" />`).join('') : ''}
                <text x="${x}" y="46" font-size="13" fill="#78350f" font-weight="bold" text-anchor="middle" font-family="Cambria Math">${i}</text>
              `;
            }).join('')}
            <text x="705" y="86" font-size="12" fill="#78350f" font-weight="bold">(cm)</text>
          </svg>

          <!-- 起點與終點放大鏡指針 -->
          <div id="w04-ptr-start" style="position:absolute; top:-14px; width:3px; height:116px; background:#ef4444; pointer-events:none; transform:translateX(-50%);">
            <span style="position:absolute; top:-20px; left:-18px; background:#ef4444; color:white; font-size:11px; font-weight:bold; padding:2px 6px; border-radius:4px;">起點</span>
          </div>
          <div id="w04-ptr-end" style="position:absolute; top:-14px; width:3px; height:116px; background:#2563eb; pointer-events:none; transform:translateX(-50%);">
            <span style="position:absolute; top:-20px; left:-18px; background:#2563eb; color:white; font-size:11px; font-weight:bold; padding:2px 6px; border-radius:4px;">終點</span>
          </div>
        </div>
      </div>

      <!-- 錯誤直覺 vs 正確算式對比 -->
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:14px; margin-top:12px;">
        <div style="background:#fef2f2; border:1.5px solid #fecaca; border-radius:10px; padding:12px;">
          <strong style="color:#991b1b; font-size:0.95rem;">❌ 小明的直覺錯誤：</strong>
          <p style="font-size:0.9rem; color:#7f1d1d; margin-top:4px;">
            「右邊終點指著 <strong id="w04-bad-end">21.4</strong> cm，所以物體長度就是 <strong id="w04-bad-len">21.4</strong> cm！」<br>
            <span style="font-size:0.8rem; color:#b91c1c;">⚠️ 致命錯誤：把前面 0~6cm 未觸碰的尺身也算進去了！</span>
          </p>
        </div>

        <div style="background:#ecfdf5; border:1.5px solid #a7f3d0; border-radius:10px; padding:12px;">
          <strong style="color:#065f46; font-size:0.95rem;">✅ 正確的終點減起點：</strong>
          <div style="font-size:1.25rem; font-weight:900; color:#047857; font-family:var(--font-math); margin-top:4px;" id="w04-good-formula">
            21.4 − 6.0 = 15.4 cm
          </div>
          <span style="font-size:0.8rem; color:#059669;">💡 終點減起點：剔除未碰到的空白段！</span>
        </div>
      </div>
    `;

    this.bindEvents();
    this.update();
  },

  bindEvents() {
    const bindItem = (id, key) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('click', () => {
          this.state.itemKey = key;
          ['w04-btn-pencil', 'w04-btn-scissors', 'w04-btn-note', 'w04-btn-marker'].forEach(b => {
            document.getElementById(b)?.classList.remove('primary');
          });
          el.classList.add('primary');
          window.soundFx.click();
          this.update();
        });
      }
    };

    bindItem('w04-btn-pencil', 'pencil');
    bindItem('w04-btn-scissors', 'scissors');
    bindItem('w04-btn-note', 'note');
    bindItem('w04-btn-marker', 'marker');

    const slider = document.getElementById('w04-start-slider');
    if (slider) {
      slider.addEventListener('input', (e) => {
        this.state.start = parseFloat(e.target.value);
        document.getElementById('w04-start-txt').innerText = this.state.start.toFixed(1);
        this.update();
      });
    }

    const btnTape = document.getElementById('w04-btn-tape');
    if (btnTape) {
      btnTape.addEventListener('click', () => {
        this.state.tapePeel = !this.state.tapePeel;
        const tape = document.getElementById('w04-tape');
        if (this.state.tapePeel) {
          tape.style.opacity = '0';
          btnTape.innerText = '🔒 貼回黑膠帶';
          window.soundFx.balanceChime();
        } else {
          tape.style.opacity = '1';
          btnTape.innerText = '🩹 撕開黑膠帶透視驗證';
          window.soundFx.click();
        }
      });
    }
  },

  update() {
    const item = this.state.items[this.state.itemKey];
    const s = this.state.start;
    const len = item.len;
    const e = parseFloat((s + len).toFixed(1));

    const sPx = s * 30;
    const lenPx = len * 30;
    const ePx = e * 30;

    // 指針平移
    const pS = document.getElementById('w04-ptr-start');
    const pE = document.getElementById('w04-ptr-end');
    if (pS) pS.style.left = `${sPx}px`;
    if (pE) pE.style.left = `${ePx}px`;

    // 渲染物體
    const bar = document.getElementById('w04-item-bar');
    if (bar) {
      bar.innerHTML = `
        <div style="position:absolute; left:${sPx}px; width:${lenPx}px; height:50px; background:${item.color}; border-radius:8px; border:2.5px solid rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center; color:white; font-weight:800; font-size:13px; box-shadow:0 3px 8px rgba(0,0,0,0.15);">
          ${item.name} (${len} cm)
        </div>
      `;
    }

    document.getElementById('w04-bad-end').innerText = e.toFixed(1);
    document.getElementById('w04-bad-len').innerText = e.toFixed(1);
    document.getElementById('w04-good-formula').innerText = `${e.toFixed(1)} − ${s.toFixed(1)} = ${len.toFixed(1)} cm`;

    if (window.ipadApp) {
      window.ipadApp.updateWorksheetGuide(this.getWorksheetGuide());
    }
  },

  destroy() {}
};
