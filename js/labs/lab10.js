/**
 * lab10.js - 第 10 週：【天平守恆速算大魔術】 (LAB-W10-N-COMP) - iPad 優化版
 * 數與運算 ｜ 推理 Reasoning ｜ 加法多加要減、減法多減要加、大天平歸零演示
 */

window.TIMSS_LABS = window.TIMSS_LABS || {};

window.TIMSS_LABS['W10'] = {
  id: 'W10',
  code: 'LAB-W10-N-COMP',
  title: '天平守恆速算大魔術',
  domain: '數與運算 Number',
  domainType: 'number',
  cognitive: '推理 Reasoning',
  question: '計算 348 + 99，我們在天平上多放了 100g 砝碼指針歪了！怎樣只動 1g 讓天平重新平衡？減法多減又該怎樣？',
  activeRole: '🔴 操作員(D) 放置補償砝碼 ➔ 🟢 發言人(B) 朗讀速算口訣',

  state: {
    mode: 'add',
    step: 0
  },

  getWorksheetGuide() {
    return {
      step1: `【工作紙第 1 題】：加法補償：放 100g 比放 99g <strong>多放了 1g</strong>，天平向右偏重，補救方法是同側 <strong>拿走 1g (− 1)</strong>。算式：<strong>348 + 100 − 1 ＝ 447</strong>。`,
      step2: `【工作紙第 2 題】：減法補償：拿走 200g 等於 <strong>多扣了 2g</strong>，天平左側翹起，補救方法是同側 <strong>補回 2g (＋ 2)</strong>。算式：<strong>523 − 200 ＋ 2 ＝ 325</strong>。`,
      quote: `🗣️ 【發言人說理】：我們組在天平上做魔術：多減了 200g，天平歪了，必須在同側補回 2g 才能水平歸零！所以 523 − 198 必須寫成 523 − 200 + 2！口訣：多加要減，多減要加！`
    };
  },

  render(container) {
    this.container = container;
    this.state = { mode: 'add', step: 0 };

    container.innerHTML = `
      <div class="ipad-controls-bar">
        <div class="controls-left-group">
          <button class="touch-btn primary" id="w10-btn-add">➕ 魔術一：加法湊整 (348 + 99)</button>
          <button class="touch-btn" id="w10-btn-sub">➖ 魔術二：減法湊整 (523 − 198)</button>
        </div>
      </div>

      <!-- 3 步驟大按鈕 -->
      <div style="display:flex; gap:10px; margin-bottom:12px; flex-wrap:wrap;">
        <button class="touch-btn" id="w10-s0">1️⃣ 初始準備</button>
        <button class="touch-btn warning" id="w10-s1">2️⃣ 圖省事湊整 (天平歪了！)</button>
        <button class="touch-btn success" id="w10-s2">3️⃣ 神奇補償回正！</button>
      </div>

      <!-- 大天平視覺區 -->
      <div class="big-balance-wrapper">
        <svg class="big-balance-svg" viewBox="0 0 680 380">
          <polygon points="280,360 400,360 360,180 320,180" fill="#475569" />
          <circle cx="340" cy="150" r="40" fill="#ffffff" stroke="#94a3b8" stroke-width="2.5" />
          <line x1="340" y1="115" x2="340" y2="128" stroke="#059669" stroke-width="3" />
          
          <g id="w10-beam" class="beam-rotate-group" transform="rotate(0, 340, 150)">
            <rect x="90" y="144" width="500" height="12" rx="5" fill="#64748b" />
            <circle cx="340" cy="150" r="10" fill="#1e293b" />
            
            <line x1="140" y1="150" x2="140" y2="230" stroke="#94a3b8" stroke-width="2.5" />
            <ellipse cx="140" cy="235" rx="80" ry="18" fill="#cbd5e1" stroke="#64748b" stroke-width="2.5" />
            
            <line x1="540" y1="150" x2="540" y2="230" stroke="#94a3b8" stroke-width="2.5" />
            <ellipse cx="540" cy="235" rx="80" ry="18" fill="#cbd5e1" stroke="#64748b" stroke-width="2.5" />
            
            <line id="w10-needle" x1="340" y1="150" x2="340" y2="95" class="needle-indicator" />
          </g>

          <g id="w10-l-txt"></g>
          <g id="w10-r-txt"></g>
        </svg>
      </div>

      <div id="w10-desc-box" style="margin-top:14px; background:#eff6ff; border:1.5px solid #bfdbfe; border-radius:10px; padding:12px 16px; font-size:0.95rem; color:#1e40af;"></div>
    `;

    this.bindEvents();
    this.update();
  },

  bindEvents() {
    const bind = (id, fn) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', fn);
    };

    bind('w10-btn-add', () => {
      this.state.mode = 'add';
      this.state.step = 0;
      document.getElementById('w10-btn-add').classList.add('primary');
      document.getElementById('w10-btn-sub').classList.remove('primary');
      window.soundFx.click();
      this.update();
    });

    bind('w10-btn-sub', () => {
      this.state.mode = 'sub';
      this.state.step = 0;
      document.getElementById('w10-btn-sub').classList.add('primary');
      document.getElementById('w10-btn-add').classList.remove('primary');
      window.soundFx.click();
      this.update();
    });

    bind('w10-s0', () => { this.state.step = 0; window.soundFx.click(); this.update(); });
    bind('w10-s1', () => { this.state.step = 1; window.soundFx.tiltBuzz(); this.update(); });
    bind('w10-s2', () => { this.state.step = 2; window.soundFx.balanceChime(); this.update(); });
  },

  update() {
    const beam = document.getElementById('w10-beam');
    const needle = document.getElementById('w10-needle');
    const lT = document.getElementById('w10-l-txt');
    const rT = document.getElementById('w10-r-txt');
    const desc = document.getElementById('w10-desc-box');

    if (this.state.mode === 'add') {
      if (this.state.step === 0) {
        beam.setAttribute('transform', 'rotate(0, 340, 150)');
        needle.style.stroke = '#10b981';
        lT.innerHTML = `<rect x="85" y="205" width="110" height="28" fill="#3b82f6" rx="4"/><text x="140" y="224" fill="white" font-weight="bold" font-size="13" text-anchor="middle">基準 348g</text>`;
        rT.innerHTML = `<rect x="485" y="205" width="110" height="28" fill="#3b82f6" rx="4"/><text x="540" y="224" fill="white" font-weight="bold" font-size="13" text-anchor="middle">基準 348g</text>`;
        desc.innerHTML = `1️⃣ <strong>初始天平平衡：</strong>兩端平衡於 348g。目標：右邊要加 99g！`;
      } else if (this.state.step === 1) {
        beam.setAttribute('transform', 'rotate(12, 340, 150)');
        needle.style.stroke = '#ef4444';
        lT.innerHTML = `<rect x="85" y="190" width="110" height="28" fill="#3b82f6" rx="4"/><text x="140" y="209" fill="white" font-weight="bold" font-size="13" text-anchor="middle">348g</text>`;
        rT.innerHTML = `<rect x="480" y="225" width="120" height="28" fill="#ef4444" rx="4"/><text x="540" y="244" fill="white" font-weight="bold" font-size="12" text-anchor="middle">+100g (多加 1g)</text>`;
        desc.innerHTML = `2️⃣ <strong>圖省事多加 100g：</strong>天平向右偏重 1g！如何只動 1g 讓天平回正？`;
      } else if (this.state.step === 2) {
        beam.setAttribute('transform', 'rotate(0, 340, 150)');
        needle.style.stroke = '#10b981';
        lT.innerHTML = `<rect x="85" y="205" width="110" height="28" fill="#3b82f6" rx="4"/><text x="140" y="224" fill="white" font-weight="bold" font-size="13" text-anchor="middle">348g</text>`;
        rT.innerHTML = `<rect x="470" y="205" width="140" height="28" fill="#10b981" rx="4"/><text x="540" y="224" fill="white" font-weight="bold" font-size="12" text-anchor="middle">+100g − 1g ＝ 447g</text>`;
        desc.innerHTML = `3️⃣ <strong>魔術回正：</strong>多加了 1g，從同側拿走 1g！<strong>348 + 99 ＝ 348 + 100 − 1 ＝ 447</strong>！天平瞬間水平！`;
      }
    } else {
      if (this.state.step === 0) {
        beam.setAttribute('transform', 'rotate(0, 340, 150)');
        needle.style.stroke = '#10b981';
        lT.innerHTML = `<rect x="85" y="205" width="110" height="28" fill="#8b5cf6" rx="4"/><text x="140" y="224" fill="white" font-weight="bold" font-size="13" text-anchor="middle">523g</text>`;
        rT.innerHTML = `<rect x="485" y="205" width="110" height="28" fill="#8b5cf6" rx="4"/><text x="540" y="224" fill="white" font-weight="bold" font-size="13" text-anchor="middle">523g</text>`;
        desc.innerHTML = `1️⃣ <strong>減法初始平衡：</strong>兩邊均為 523g。目標：左盤要減去 198g！`;
      } else if (this.state.step === 1) {
        beam.setAttribute('transform', 'rotate(14, 340, 150)');
        needle.style.stroke = '#ef4444';
        lT.innerHTML = `<rect x="80" y="180" width="120" height="28" fill="#ef4444" rx="4"/><text x="140" y="199" fill="white" font-weight="bold" font-size="12" text-anchor="middle">−200g (多扣 2g)</text>`;
        rT.innerHTML = `<rect x="485" y="230" width="110" height="28" fill="#8b5cf6" rx="4"/><text x="540" y="249" fill="white" font-weight="bold" font-size="13" text-anchor="middle">523g</text>`;
        desc.innerHTML = `2️⃣ <strong>多扣 200g 翹起：</strong>多拿走了 2g，左盤變太輕翹起來了！`;
      } else if (this.state.step === 2) {
        beam.setAttribute('transform', 'rotate(0, 340, 150)');
        needle.style.stroke = '#10b981';
        lT.innerHTML = `<rect x="75" y="205" width="130" height="28" fill="#10b981" rx="4"/><text x="140" y="224" fill="white" font-weight="bold" font-size="11" text-anchor="middle">523−200+2 ＝ 325g</text>`;
        rT.innerHTML = `<rect x="485" y="205" width="110" height="28" fill="#8b5cf6" rx="4"/><text x="540" y="224" fill="white" font-weight="bold" font-size="13" text-anchor="middle">523g</text>`;
        desc.innerHTML = `3️⃣ <strong>補償回正：</strong>多扣了 2g，必須在同側<strong>加回 2g</strong>！<strong>523 − 198 ＝ 523 − 200 + 2 ＝ 325</strong>！天平完美歸零！`;
      }
    }

    if (window.ipadApp) {
      window.ipadApp.updateWorksheetGuide(this.getWorksheetGuide());
    }
  },

  destroy() {}
};
