/**
 * lab10.js - 第 10 週：【天平守恆速算大魔術】 (LAB-W10-N-COMP) - iPad 優化版 (動手加減砝碼與補償抉擇)
 * 數與運算 ｜ 推理 Reasoning ｜ 湊整失衡、動手放微克補償砝碼、多加要減 vs 多減要加物理驗證
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
    mode: 'add', // 'add', 'sub'
    step: 0, // 0: baseline, 1: rounded, 2: compensated
    userAction: 'none' // 'none', 'correct', 'wrong'
  },

  getTeacherSummary() {
    return {
      core: `<h4>💡 核心概念提煉</h4><p>湊整速算的核心是「<strong>等量平衡與補償原理</strong>」。將接近整百的數轉化為整百數運算，極大降低了心算難度，但破壞了原有數值平衡。在同側進行逆向補償：若多加了整百，天平偏重，同側必須減去差額（<strong>多加要減</strong>）；若多減了整百，天平失重翹起，同側必須加回差額（<strong>多減要加</strong>）。</p>`,
      formula: `<h4>📐 核心代數變換與補償模型</h4><p>• <strong>加法湊整（多加要減）：</strong>$348 + 99 = 348 + (100 - 1) = 348 + 100 - 1 = \\mathbf{447}$<br>• <strong>減法湊整（多減要加）：</strong>$523 - 198 = 523 - (200 - 2) = 523 - 200 + 2 = \\mathbf{325}$<br>• <strong>代數本質：</strong>括號前是減號，去括號時括號內減號變加號（負負得正）。</p>`,
      quote: `🎯 <strong>教師總結金句：</strong>「湊整速算天平平，多加要減保平衡；多減要加莫記反，去括號變號見神奇！」`
    };
  },

  render(container) {
    this.container = container;
    this.state = { mode: 'add', step: 0, userAction: 'none' };

    container.innerHTML = `
      <div class="ipad-controls-bar">
        <div class="controls-left-group">
          <button class="touch-btn primary" id="w10-btn-add">➕ 魔術一：加法湊整 (348 + 99)</button>
          <button class="touch-btn" id="w10-btn-sub">➖ 魔術二：減法湊整 (523 − 198)</button>
        </div>
        <button class="touch-btn" id="w10-btn-reset">🔄 恢復初始待測平衡</button>
      </div>

      <!-- 操作流程控制列 -->
      <div class="ipad-controls-bar" style="background:#f8fafc;" id="w10-actions-bar">
        <!-- 動態按鈕在 update 中渲染 -->
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
      this.state.userAction = 'none';
      document.getElementById('w10-btn-add').classList.add('primary');
      document.getElementById('w10-btn-sub').classList.remove('primary');
      window.soundFx.click();
      this.update();
    });

    bind('w10-btn-sub', () => {
      this.state.mode = 'sub';
      this.state.step = 0;
      this.state.userAction = 'none';
      document.getElementById('w10-btn-sub').classList.add('primary');
      document.getElementById('w10-btn-add').classList.remove('primary');
      window.soundFx.click();
      this.update();
    });

    bind('w10-btn-reset', () => {
      this.state.step = 0;
      this.state.userAction = 'none';
      window.soundFx.click();
      this.update();
    });
  },

  update() {
    const beam = document.getElementById('w10-beam');
    const needle = document.getElementById('w10-needle');
    const lT = document.getElementById('w10-l-txt');
    const rT = document.getElementById('w10-r-txt');
    const desc = document.getElementById('w10-desc-box');
    const actionsBar = document.getElementById('w10-actions-bar');

    if (this.state.mode === 'add') {
      // 加法模式：348 + 99
      if (this.state.step === 0) {
        beam.setAttribute('transform', 'rotate(0, 340, 150)');
        needle.style.stroke = '#10b981';
        lT.innerHTML = `<rect x="75" y="205" width="130" height="28" fill="#3b82f6" rx="4"/><text x="140" y="224" fill="white" font-weight="bold" font-size="12" text-anchor="middle">目標值 447g (348+99)</text>`;
        rT.innerHTML = `<rect x="475" y="205" width="130" height="28" fill="#64748b" rx="4"/><text x="540" y="224" fill="white" font-weight="bold" font-size="12" text-anchor="middle">現有基準 348g</text>`;
        
        actionsBar.innerHTML = `
          <span style="font-weight:bold;">第 1 步：湊整加速 ➔</span>
          <button class="touch-btn warning" id="w10-act-round-add">📥 圖省事：右盤放上 +100g 湊整大砝碼</button>
        `;
        document.getElementById('w10-act-round-add')?.addEventListener('click', () => {
          this.state.step = 1;
          window.soundFx.tiltBuzz();
          this.update();
        });

        desc.style.background = '#eff6ff';
        desc.style.borderColor = '#bfdbfe';
        desc.style.color = '#1e40af';
        desc.innerHTML = `⚖️ <strong>初始待測平衡：</strong>左盤放著精確目標值 <strong>447g (348 + 99)</strong>。右盤只有基準 348g。請點擊上方「放上 +100g 湊整大砝碼」開始！`;

      } else if (this.state.step === 1) {
        beam.setAttribute('transform', 'rotate(12, 340, 150)');
        needle.style.stroke = '#ef4444';
        lT.innerHTML = `<rect x="75" y="190" width="130" height="28" fill="#3b82f6" rx="4"/><text x="140" y="209" fill="white" font-weight="bold" font-size="12" text-anchor="middle">目標 447g</text>`;
        rT.innerHTML = `<rect x="470" y="225" width="140" height="28" fill="#ef4444" rx="4"/><text x="540" y="244" fill="white" font-weight="bold" font-size="12" text-anchor="middle">348+100 ＝ 448g (+1g!)</text>`;

        actionsBar.innerHTML = `
          <span style="font-weight:bold; color:#b91c1c;">⚠️ 右盤重了 1g！如何只動 1g 讓天平回正？</span>
          <button class="touch-btn success" id="w10-act-fix-sub">✂️ 從右盤取走 1g (多加要減)</button>
          <button class="touch-btn danger" id="w10-act-fix-add">➕ 在右盤再加 1g</button>
        `;

        document.getElementById('w10-act-fix-sub')?.addEventListener('click', () => {
          this.state.step = 2;
          this.state.userAction = 'correct';
          window.soundFx.balanceChime();
          this.update();
        });

        document.getElementById('w10-act-fix-add')?.addEventListener('click', () => {
          this.state.userAction = 'wrong';
          window.soundFx.tiltBuzz();
          this.update();
        });

        if (this.state.userAction === 'wrong') {
          desc.style.background = '#fef2f2';
          desc.style.borderColor = '#fca5a5';
          desc.style.color = '#991b1b';
          desc.innerHTML = `❌ <strong>失衡加劇！</strong>本來就多加了 1g（448g），如果再加 1g 就變成 449g，天平歪得更厲害了！請選擇「取走 1g」！`;
        } else {
          desc.style.background = '#fffbeb';
          desc.style.borderColor = '#fde68a';
          desc.style.color = '#92400e';
          desc.innerHTML = `⚠️ <strong>天平向右偏重！</strong>目標只要加 99g，圖省事放了 100g，結果<strong>多加了 1g</strong>（448g vs 447g）！請在上方面板做出補償抉擇！`;
        }

      } else if (this.state.step === 2) {
        beam.setAttribute('transform', 'rotate(0, 340, 150)');
        needle.style.stroke = '#10b981';
        lT.innerHTML = `<rect x="75" y="205" width="130" height="28" fill="#3b82f6" rx="4"/><text x="140" y="224" fill="white" font-weight="bold" font-size="12" text-anchor="middle">目標 447g</text>`;
        rT.innerHTML = `<rect x="465" y="205" width="150" height="28" fill="#10b981" rx="4"/><text x="540" y="224" fill="white" font-weight="bold" font-size="11" text-anchor="middle">348+100−1 ＝ 447g</text>`;

        actionsBar.innerHTML = `
          <span style="font-weight:bold; color:#059669;">🎉 補償成功！天平完美歸零！</span>
          <button class="touch-btn" id="w10-act-restart">🔄 重新體驗加法湊整</button>
        `;
        document.getElementById('w10-act-restart')?.addEventListener('click', () => {
          this.state.step = 0;
          this.state.userAction = 'none';
          window.soundFx.click();
          this.update();
        });

        desc.style.background = '#ecfdf5';
        desc.style.borderColor = '#86efac';
        desc.style.color = '#065f46';
        desc.innerHTML = `🎯 <strong>加法速算口訣【多加要減】：</strong>多加了整百的 1g，立刻在同側減去 1g 補償！<strong>348 + 99 ＝ 348 + 100 − 1 ＝ 447</strong>！天平瞬間水平穩固！`;
      }

    } else {
      // 減法模式：523 - 198
      if (this.state.step === 0) {
        beam.setAttribute('transform', 'rotate(0, 340, 150)');
        needle.style.stroke = '#10b981';
        lT.innerHTML = `<rect x="75" y="205" width="130" height="28" fill="#7c3aed" rx="4"/><text x="140" y="224" fill="white" font-weight="bold" font-size="12" text-anchor="middle">目標值 325g (523−198)</text>`;
        rT.innerHTML = `<rect x="475" y="205" width="130" height="28" fill="#64748b" rx="4"/><text x="540" y="224" fill="white" font-weight="bold" font-size="12" text-anchor="middle">現有基準 523g</text>`;

        actionsBar.innerHTML = `
          <span style="font-weight:bold;">第 1 步：湊整加速 ➔</span>
          <button class="touch-btn warning" id="w10-act-round-sub">📤 圖省事：從右盤一口氣拿走 200g 大砝碼</button>
        `;
        document.getElementById('w10-act-round-sub')?.addEventListener('click', () => {
          this.state.step = 1;
          window.soundFx.tiltBuzz();
          this.update();
        });

        desc.style.background = '#f5f3ff';
        desc.style.borderColor = '#ddd6fe';
        desc.style.color = '#6d28d9';
        desc.innerHTML = `⚖️ <strong>減法初始平衡：</strong>左盤是精確目標值 <strong>325g (523 − 198)</strong>。右盤是 523g。目標是扣掉 198g。請點擊「從右盤一口氣拿走 200g」！`;

      } else if (this.state.step === 1) {
        beam.setAttribute('transform', 'rotate(-12, 340, 150)');
        needle.style.stroke = '#ef4444';
        lT.innerHTML = `<rect x="75" y="220" width="130" height="28" fill="#7c3aed" rx="4"/><text x="140" y="239" fill="white" font-weight="bold" font-size="12" text-anchor="middle">目標 325g</text>`;
        rT.innerHTML = `<rect x="470" y="190" width="140" height="28" fill="#ef4444" rx="4"/><text x="540" y="209" fill="white" font-weight="bold" font-size="12" text-anchor="middle">523−200 ＝ 323g (少2g!)</text>`;

        actionsBar.innerHTML = `
          <span style="font-weight:bold; color:#b91c1c;">⚠️ 右盤太輕翹起來了！如何只動 2g 讓天平回正？</span>
          <button class="touch-btn success" id="w10-act-fix-addsub">➕ 在右盤加回 2g (多減要加)</button>
          <button class="touch-btn danger" id="w10-act-fix-subsub">📤 從右盤再拿走 2g</button>
        `;

        document.getElementById('w10-act-fix-addsub')?.addEventListener('click', () => {
          this.state.step = 2;
          this.state.userAction = 'correct';
          window.soundFx.balanceChime();
          this.update();
        });

        document.getElementById('w10-act-fix-subsub')?.addEventListener('click', () => {
          this.state.userAction = 'wrong';
          window.soundFx.tiltBuzz();
          this.update();
        });

        if (this.state.userAction === 'wrong') {
          desc.style.background = '#fef2f2';
          desc.style.borderColor = '#fca5a5';
          desc.style.color = '#991b1b';
          desc.innerHTML = `❌ <strong>翹得更高了！</strong>原本就多扣了 2g（只剩 323g），再扣 2g 變成 321g，天平更加傾斜！多減了必須加回！`;
        } else {
          desc.style.background = '#fffbeb';
          desc.style.borderColor = '#fde68a';
          desc.style.color = '#92400e';
          desc.innerHTML = `⚠️ <strong>右盤太輕翹起來了！</strong>原本只需要扣 198g，一口氣扣掉 200g，<strong>多減了 2g</strong>（323g vs 325g）！請在上方面板選擇正確補償！`;
        }

      } else if (this.state.step === 2) {
        beam.setAttribute('transform', 'rotate(0, 340, 150)');
        needle.style.stroke = '#10b981';
        lT.innerHTML = `<rect x="75" y="205" width="130" height="28" fill="#7c3aed" rx="4"/><text x="140" y="224" fill="white" font-weight="bold" font-size="12" text-anchor="middle">目標 325g</text>`;
        rT.innerHTML = `<rect x="465" y="205" width="150" height="28" fill="#10b981" rx="4"/><text x="540" y="224" fill="white" font-weight="bold" font-size="11" text-anchor="middle">523−200+2 ＝ 325g</text>`;

        actionsBar.innerHTML = `
          <span style="font-weight:bold; color:#059669;">🎉 補償成功！天平完美水平！</span>
          <button class="touch-btn" id="w10-act-restart">🔄 重新體驗減法湊整</button>
        `;
        document.getElementById('w10-act-restart')?.addEventListener('click', () => {
          this.state.step = 0;
          this.state.userAction = 'none';
          window.soundFx.click();
          this.update();
        });

        desc.style.background = '#ecfdf5';
        desc.style.borderColor = '#86efac';
        desc.style.color = '#065f46';
        desc.innerHTML = `🎯 <strong>減法速算口訣【多減要加】：</strong>多扣了 2g，就必須在同側<strong>加回 2g</strong> 補償！<strong>523 − 198 ＝ 523 − 200 + 2 ＝ 325</strong>！天平完美平衡歸零！`;
      }
    }

    if (window.ipadApp) {
      window.ipadApp.updateTeacherSummary(this.getTeacherSummary());
    }
  },

  destroy() {}
};
