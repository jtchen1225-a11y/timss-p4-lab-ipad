/**
 * lab04.js - 第 4 週：【殘缺斷尺尋寶大挑戰】 (LAB-W04-MG-SCALE) - iPad 優化版 (動手平移測量與撕膠帶驗證)
 * 測量與幾何 ｜ 應用 Applying ｜ 物體長度不劇透、平移起點、終點減起點、滑回0刻度透視
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
    revealed: false,
    zeroAligned: false,
    items: {
      pencil: { name: '全新鉛筆', icon: '✏️', len: 15.4, color: '#f59e0b' },
      scissors: { name: '安全剪刀', icon: '✂️', len: 11.2, color: '#ef4444' },
      note: { name: '正方形便簽', icon: '📝', len: 7.5, color: '#10b981' },
      marker: { name: '水彩彩色筆', icon: '🖍️', len: 13.0, color: '#8b5cf6' }
    }
  },

  getTeacherSummary() {
    const item = this.state.items[this.state.itemKey];
    const s = this.state.start;
    const e = parseFloat((s + item.len).toFixed(1));
    return {
      core: `<h4>💡 核心概念提煉</h4><p>用尺測量物體長度的本質是「<strong>統計所跨越的長度單位區間</strong>」，絕不是盲目看右邊的終點數字！當直尺磨損、斷裂或未從 0 刻度起測時，終點讀數包含了 0 到起點的「虛無空白段」，必須將起點剔除。</p>`,
      formula: `<h4>📐 核心測量公式與辨析</h4><p>通用長度公式：<strong>物體真實長度 = 右端終點刻度 − 左端起點刻度</strong><br>當前實測：<strong>${e.toFixed(1)} − ${s.toFixed(1)} = ${item.len.toFixed(1)} cm</strong><br>❌ 常見迷思錯誤：直接誤讀為終點 ${e.toFixed(1)} cm（多算了前段 ${s.toFixed(1)} cm 空白！）。</p>`,
      quote: `🎯 <strong>教師總結金句：</strong>「斷尺測量莫慌張，起點非零減起點；終點減去起點數，區間長度現原形！」`
    };
  },

  render(container) {
    this.container = container;
    this.state = {
      itemKey: 'pencil',
      start: 6.0,
      revealed: false,
      zeroAligned: false,
      items: this.state.items
    };

    container.innerHTML = `
      <div class="ipad-controls-bar">
        <div class="controls-left-group">
          <span style="font-weight:bold;">🎁 挑選待測文具：</span>
          <button class="touch-btn primary" id="w04-btn-pencil">✏️ 全新鉛筆</button>
          <button class="touch-btn" id="w04-btn-scissors">✂️ 安全剪刀</button>
          <button class="touch-btn" id="w04-btn-note">📝 便簽</button>
          <button class="touch-btn" id="w04-btn-marker">🖍️ 彩色筆</button>
        </div>
        <button class="touch-btn" id="w04-btn-reset">🔄 重新測量</button>
      </div>

      <!-- 物體起點平移滑桿 -->
      <div class="ipad-controls-bar" style="background:#f8fafc;">
        <div style="display:flex; align-items:center; gap:12px;">
          <label style="font-weight:bold; font-size:1rem;">📍 物體左端起點對齊刻度：<strong id="w04-start-txt" style="color:var(--primary); font-size:1.2rem;">6.0</strong> cm</label>
          <input type="range" class="touch-slider" id="w04-start-slider" min="5.0" max="10.0" value="6.0" step="0.5" style="width:220px;">
        </div>
        <div style="display:flex; gap:8px;">
          <button class="touch-btn primary" id="w04-btn-calc">🧮 計算跨越長度 (終點−起點)</button>
          <button class="touch-btn warning" id="w04-btn-tape">🩹 撕開膠帶並對齊 0 刻度驗證</button>
        </div>
      </div>

      <!-- 斷尺與待測物展示畫布 -->
      <div style="background:white; border:2px solid #cbd5e1; border-radius:12px; padding:24px 16px; min-height:280px; overflow-x:auto;">
        <!-- 待測物圖形 (不劇透長度) -->
        <div id="w04-item-bar" style="height:60px; position:relative; margin-bottom:12px; transition:all 0.5s;"></div>

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
                <text x="${x}" y="${46}" font-size="13" fill="#78350f" font-weight="bold" text-anchor="middle" font-family="Cambria Math">${i}</text>
              `;
            }).join('')}
            <text x="705" y="86" font-size="12" fill="#78350f" font-weight="bold">(cm)</text>
          </svg>

          <!-- 起點與終點指針 -->
          <div id="w04-ptr-start" style="position:absolute; top:-14px; width:3px; height:116px; background:#ef4444; pointer-events:none; transform:translateX(-50%); transition:left 0.4s;">
            <span style="position:absolute; top:-20px; left:-18px; background:#ef4444; color:white; font-size:11px; font-weight:bold; padding:2px 6px; border-radius:4px;">起點</span>
          </div>
          <div id="w04-ptr-end" style="position:absolute; top:-14px; width:3px; height:116px; background:#2563eb; pointer-events:none; transform:translateX(-50%); transition:left 0.4s;">
            <span style="position:absolute; top:-20px; left:-18px; background:#2563eb; color:white; font-size:11px; font-weight:bold; padding:2px 6px; border-radius:4px;">終點</span>
          </div>
        </div>
      </div>

      <!-- 讀數觀測與探索對比卡 -->
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:14px; margin-top:12px;">
        <div style="background:#fef2f2; border:1.5px solid #fecaca; border-radius:10px; padding:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong style="color:#991b1b; font-size:0.95rem;">❌ 小明的直覺猜想：</strong>
            <span style="font-size:0.8rem; background:#fee2e2; color:#b91c1c; padding:2px 8px; border-radius:4px; font-weight:bold;">常見陷阱</span>
          </div>
          <p style="font-size:0.9rem; color:#7f1d1d; margin-top:6px;">
            「右邊終點指著 <strong id="w04-bad-end" style="font-size:1.15rem; color:#b91c1c;">--</strong> cm，所以鉛筆長度就是 <strong id="w04-bad-len">--</strong> cm！」<br>
            <span style="font-size:0.8rem; color:#b91c1c;">⚠️ 破綻：物體左邊根本沒碰到 0 刻度，0 到起點這段空白尺身不能算！</span>
          </p>
        </div>

        <div style="background:#ecfdf5; border:1.5px solid #a7f3d0; border-radius:10px; padding:12px;" id="w04-calc-card">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong style="color:#065f46; font-size:0.95rem;">✅ 正確的區間跨度計算：</strong>
            <span style="font-size:0.8rem; background:#d1fae5; color:#047857; padding:2px 8px; border-radius:4px; font-weight:bold;">終點 − 起點</span>
          </div>
          <div id="w04-calc-result" style="font-size:1.25rem; font-weight:900; color:#047857; font-family:var(--font-math); margin-top:6px;">
            等待點擊「計算跨度」...
          </div>
          <span style="font-size:0.8rem; color:#059669;" id="w04-calc-hint">💡 點擊上方按鈕計算終點減起點，剔除前面的空白段！</span>
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
          this.state.revealed = false;
          this.state.zeroAligned = false;
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
        if (this.state.zeroAligned) return;
        this.state.start = parseFloat(e.target.value);
        document.getElementById('w04-start-txt').innerText = this.state.start.toFixed(1);
        this.state.revealed = false;
        this.update();
      });
    }

    // 計算跨度
    const btnCalc = document.getElementById('w04-btn-calc');
    if (btnCalc) {
      btnCalc.addEventListener('click', () => {
        this.state.revealed = true;
        window.soundFx.balanceChime();
        this.update();
      });
    }

    // 撕開膠帶並對齊0刻度驗證
    const btnTape = document.getElementById('w04-btn-tape');
    if (btnTape) {
      btnTape.addEventListener('click', () => {
        this.state.zeroAligned = !this.state.zeroAligned;
        this.state.revealed = true;
        if (this.state.zeroAligned) {
          btnTape.innerText = '🔒 貼回膠帶 (回到斷尺狀態)';
          window.soundFx.successFanfare();
        } else {
          btnTape.innerText = '🩹 撕開膠帶並對齊 0 刻度驗證';
          window.soundFx.click();
        }
        this.update();
      });
    }

    // 重置
    const btnReset = document.getElementById('w04-btn-reset');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        this.state.start = 6.0;
        this.state.revealed = false;
        this.state.zeroAligned = false;
        const slider = document.getElementById('w04-start-slider');
        if (slider) slider.value = '6.0';
        document.getElementById('w04-start-txt').innerText = '6.0';
        const btnTape = document.getElementById('w04-btn-tape');
        if (btnTape) btnTape.innerText = '🩹 撕開膠帶並對齊 0 刻度驗證';
        window.soundFx.click();
        this.update();
      });
    }
  },

  update() {
    const item = this.state.items[this.state.itemKey];
    const s = this.state.zeroAligned ? 0 : this.state.start;
    const len = item.len;
    const e = parseFloat((s + len).toFixed(1));

    const sPx = s * 30;
    const lenPx = len * 30;
    const ePx = e * 30;

    // 膠帶顯示控制
    const tape = document.getElementById('w04-tape');
    if (tape) {
      tape.style.opacity = this.state.zeroAligned ? '0' : '1';
    }

    // 起點文字
    const startTxt = document.getElementById('w04-start-txt');
    if (startTxt) {
      startTxt.innerText = s.toFixed(1);
    }

    // 指針平移
    const pS = document.getElementById('w04-ptr-start');
    const pE = document.getElementById('w04-ptr-end');
    if (pS) pS.style.left = `${sPx}px`;
    if (pE) pE.style.left = `${ePx}px`;

    // 渲染物體 (未揭曉前不劇透長度)
    const bar = document.getElementById('w04-item-bar');
    if (bar) {
      const label = this.state.revealed || this.state.zeroAligned
        ? `${item.icon} ${item.name} (${len} cm)`
        : `${item.icon} ${item.name} (長度待測)`;

      bar.innerHTML = `
        <div style="position:absolute; left:${sPx}px; width:${lenPx}px; height:50px; background:${item.color}; border-radius:8px; border:2.5px solid rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center; color:white; font-weight:800; font-size:13px; box-shadow:0 3px 8px rgba(0,0,0,0.15); transition:left 0.5s;">
          ${label}
        </div>
      `;
    }

    // 錯誤直覺面板更新
    document.getElementById('w04-bad-end').innerText = e.toFixed(1);
    document.getElementById('w04-bad-len').innerText = e.toFixed(1);

    // 計算跨度面板
    const calcResult = document.getElementById('w04-calc-result');
    const calcHint = document.getElementById('w04-calc-hint');
    if (this.state.zeroAligned) {
      calcResult.innerText = `從 0 刻度量起：終點直接為 ${len.toFixed(1)} cm！`;
      calcHint.innerText = `🎉 膠帶撕開後直接對準 0 刻度，終點讀數 ${len.toFixed(1)} cm 正好等於物體真實長度！終點減起點 ${e.toFixed(1)} − ${s.toFixed(1)} ＝ ${len.toFixed(1)} cm 永遠成立！`;
    } else if (this.state.revealed) {
      calcResult.innerText = `${e.toFixed(1)} − ${s.toFixed(1)} ＝ ${len.toFixed(1)} cm`;
      calcHint.innerText = `💡 終點減起點：剔除了 0~${s.toFixed(1)}cm 空白段，算出真實長度為 ${len.toFixed(1)} cm！`;
    } else {
      calcResult.innerText = `起點 ${s.toFixed(1)} cm ➔ 終點 ${e.toFixed(1)} cm（等待計算）`;
      calcHint.innerText = `💡 點擊上方按鈕計算終點減起點，剔除前面的空白段！`;
    }

    if (window.ipadApp) {
      window.ipadApp.updateTeacherSummary(this.getTeacherSummary());
    }
  },

  destroy() {}
};
