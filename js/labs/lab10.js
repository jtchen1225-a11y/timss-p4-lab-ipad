/**
 * lab10.js - 第 10 週：【天平守恆速算大魔術】 (LAB-W10-N-COMP) - iPad 優化版
 * 教師引導 ➔ 學生主動探究 ➔ 任務切換立即歸零待測
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
    mission: 'add', // 'add', 'sub'
    step: 0,
    userAction: 'none'
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
    this.state = { mission: 'add', step: 0, userAction: 'none' };

    container.innerHTML = `
      <!-- 任務切換列：點擊任何任務立即歸零 -->
      <div class="ipad-controls-bar">
        <div class="controls-left-group">
          <button class="touch-btn primary" id="w10-tab-add">➕ 任務一：加法湊整大魔術 (348 + 99)</button>
          <button class="touch-btn" id="w10-tab-sub">➖ 任務二：減法湊整大魔術 (523 − 198)</button>
        </div>
        <button class="touch-btn" id="w10-btn-reset">🔄 當前任務歸零待測</button>
      </div>

      <!-- 👨‍🏫 教師引導與學生探究導引條 -->
      <div class="teacher-guide-banner" id="w10-guide-banner">
        <div class="guide-header-row">
          <span class="guide-step-tag" id="w10-guide-tag">👨‍🏫 老師引導 ➔ 第 1 步 / 共 2 步</span>
          <span class="guide-mission-title" id="w10-guide-title">任務一：加法湊整 (348 + 99)</span>
        </div>
        <div class="guide-instruction-text" id="w10-guide-text">
          計算 348 ＋ 99。99 接近 100，小明圖省事在右盤放了 <strong>+100g 湊整砝碼</strong>。請操作員點擊下方<strong>「📥 放上 +100g 湊整大砝碼」</strong>！
        </div>
        <div class="guide-hint-subtext" id="w10-guide-sub">
          💡 天平目前在基準平衡狀態，左盤放著精確目標值 447g。
        </div>
      </div>

      <!-- 學生操作抉擇列 -->
      <div class="ipad-controls-bar" style="background:#f8fafc;" id="w10-actions-bar"></div>

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
    `;

    this.bindEvents();
    this.update();
  },

  bindEvents() {
    const bind = (id, fn) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', fn);
    };

    // 任務切換：一律歸零待測！
    bind('w10-tab-add', () => {
      this.state = { mission: 'add', step: 0, userAction: 'none' };
      this.updateTabs('w10-tab-add');
      window.soundFx.click();
      this.update();
    });

    bind('w10-tab-sub', () => {
      this.state = { mission: 'sub', step: 0, userAction: 'none' };
      this.updateTabs('w10-tab-sub');
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

  updateTabs(activeId) {
    ['w10-tab-add', 'w10-tab-sub'].forEach(id => {
      const b = document.getElementById(id);
      if (b) {
        if (id === activeId) b.classList.add('primary');
        else b.classList.remove('primary');
      }
    });
  },

  update() {
    const beam = document.getElementById('w10-beam');
    const needle = document.getElementById('w10-needle');
    const lT = document.getElementById('w10-l-txt');
    const rT = document.getElementById('w10-r-txt');
    const actionsBar = document.getElementById('w10-actions-bar');
    const guideTag = document.getElementById('w10-guide-tag');
    const guideTitle = document.getElementById('w10-guide-title');
    const guideText = document.getElementById('w10-guide-text');
    const guideSub = document.getElementById('w10-guide-sub');

    if (this.state.mission === 'add') {
      guideTitle.innerText = '任務一：加法湊整大魔術 (348 + 99)';

      if (this.state.step === 0) {
        beam.setAttribute('transform', 'rotate(0, 340, 150)');
        needle.style.stroke = '#10b981';
        lT.innerHTML = `<rect x="75" y="205" width="130" height="28" fill="#3b82f6" rx="4"/><text x="140" y="224" fill="white" font-weight="bold" font-size="12" text-anchor="middle">目標值 447g (348+99)</text>`;
        rT.innerHTML = `<rect x="475" y="205" width="130" height="28" fill="#64748b" rx="4"/><text x="540" y="224" fill="white" font-weight="bold" font-size="12" text-anchor="middle">基準值 348g</text>`;

        actionsBar.innerHTML = `
          <span style="font-weight:bold;">第 1 步操作 ➔</span>
          <button class="touch-btn warning" id="w10-act-round-add" style="font-weight:800;">📥 圖省事：右盤放上 +100g 湊整大砝碼</button>
        `;
        document.getElementById('w10-act-round-add')?.addEventListener('click', () => {
          this.state.step = 1;
          window.soundFx.tiltBuzz();
          this.update();
        });

        guideTag.className = 'guide-step-tag';
        guideTag.innerText = '👨‍🏫 老師引導 ➔ 第 1 步 / 共 2 步';
        guideText.innerHTML = `計算 348 ＋ 99。99 接近整百 100。小明圖省事在右盤多放了 <strong>+100g 湊整砝碼</strong>。請操作員點擊下方<strong>「📥 放上 +100g 湊整大砝碼」</strong>！`;
        guideSub.innerText = '💡 左盤放著精確目標值 447g。';

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
          guideTag.className = 'guide-step-tag step-alert';
          guideTag.innerText = '❌ 失衡加劇！';
          guideText.innerHTML = `本來就多加了 1g（448g），如果再加 1g 就變成 449g，天平歪得更厲害了！請選擇<strong>「✂️ 從右盤取走 1g」</strong>！`;
          guideSub.innerText = '💡 多放了必須拿走才能補償。';
        } else {
          guideTag.className = 'guide-step-tag step-alert';
          guideTag.innerText = '⚠️ 老師引導 ➔ 偏重難題！如何補償？';
          guideText.innerHTML = `<strong>天平向右偏重！</strong>目標只要加 99g，放了 100g 導致<strong>多加了 1g</strong>（448g vs 447g）！如何只動 1g 讓天平回正？請操作員在下方做出補償抉擇！`;
          guideSub.innerText = '💡 請全班思考速算口訣：多加了該怎麼辦？';
        }

      } else if (this.state.step === 2) {
        beam.setAttribute('transform', 'rotate(0, 340, 150)');
        needle.style.stroke = '#10b981';
        lT.innerHTML = `<rect x="75" y="205" width="130" height="28" fill="#3b82f6" rx="4"/><text x="140" y="224" fill="white" font-weight="bold" font-size="12" text-anchor="middle">目標 447g</text>`;
        rT.innerHTML = `<rect x="465" y="205" width="150" height="28" fill="#10b981" rx="4"/><text x="540" y="224" fill="white" font-weight="bold" font-size="11" text-anchor="middle">348+100−1 ＝ 447g</text>`;

        actionsBar.innerHTML = `
          <span style="font-weight:bold; color:#059669;">🎉 補償成功！天平完美水平！</span>
          <button class="touch-btn" id="w10-act-restart">🔄 重新體驗加法湊整</button>
        `;
        document.getElementById('w10-act-restart')?.addEventListener('click', () => {
          this.state.step = 0;
          this.state.userAction = 'none';
          this.update();
        });

        guideTag.className = 'guide-step-tag step-done';
        guideTag.innerText = '🎉 探究結論 ➔ 加法速算口訣【多加要減】';
        guideText.innerHTML = `<strong>天平瞬間回正！</strong>多加了整百的 1g，立刻在同側<strong>減去 1g</strong> 補償！算式為 <strong>348 ＋ 99 ＝ 348 ＋ 100 − 1 ＝ 447</strong>！`;
        guideSub.innerText = '🎯 教師金句：湊整速算天平平，多加要減保平衡！';
      }

    } else {
      guideTitle.innerText = '任務二：減法湊整大魔術 (523 − 198)';

      if (this.state.step === 0) {
        beam.setAttribute('transform', 'rotate(0, 340, 150)');
        needle.style.stroke = '#10b981';
        lT.innerHTML = `<rect x="75" y="205" width="130" height="28" fill="#7c3aed" rx="4"/><text x="140" y="224" fill="white" font-weight="bold" font-size="12" text-anchor="middle">目標值 325g (523−198)</text>`;
        rT.innerHTML = `<rect x="475" y="205" width="130" height="28" fill="#64748b" rx="4"/><text x="540" y="224" fill="white" font-weight="bold" font-size="12" text-anchor="middle">基準值 523g</text>`;

        actionsBar.innerHTML = `
          <span style="font-weight:bold;">第 1 步操作 ➔</span>
          <button class="touch-btn warning" id="w10-act-round-sub" style="font-weight:800;">📤 圖省事：從右盤一口氣拿走 200g 大砝碼</button>
        `;
        document.getElementById('w10-act-round-sub')?.addEventListener('click', () => {
          this.state.step = 1;
          window.soundFx.tiltBuzz();
          this.update();
        });

        guideTag.className = 'guide-step-tag';
        guideTag.innerText = '👨‍🏫 老師引導 ➔ 第 1 步 / 共 2 步';
        guideText.innerHTML = `計算 523 − 198。198 接近 200。小明圖省事從右盤一口氣拿走了 <strong>200g 湊整砝碼</strong>。請操作員點擊下方按鈕！`;
        guideSub.innerText = '💡 左盤放著精確目標值 325g。';

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
          guideTag.className = 'guide-step-tag step-alert';
          guideTag.innerText = '❌ 翹得更高了！';
          guideText.innerHTML = `原本就多扣了 2g（只剩 323g），再扣 2g 變成 321g，天平更加傾斜！多扣了必須加回來！`;
          guideSub.innerText = '💡 請選擇「➕ 在右盤加回 2g」。';
        } else {
          guideTag.className = 'guide-step-tag step-alert';
          guideTag.innerText = '⚠️ 老師引導 ➔ 翹起難題！如何補償？';
          guideText.innerHTML = `<strong>右盤太輕翹起來了！</strong>原本只需要扣 198g，一口氣拿走 200g 導致<strong>多減了 2g</strong>（323g vs 325g）！如何只動 2g 讓天平回平？請操作員在下方做出抉擇！`;
          guideSub.innerText = '💡 請全班思考減法速算口訣：多減了該怎麼辦？';
        }

      } else if (this.state.step === 2) {
        beam.setAttribute('transform', 'rotate(0, 340, 150)');
        needle.style.stroke = '#10b981';
        lT.innerHTML = `<rect x="75" y="205" width="130" height="28" fill="#7c3aed" rx="4"/><text x="140" y="224" fill="white" font-weight="bold" font-size="12" text-anchor="middle">目標 325g</text>`;
        rT.innerHTML = `<rect x="465" y="205" width="150" height="28" fill="#10b981" rx="4"/><text x="540" y="224" fill="white" font-weight="bold" font-size="11" text-anchor="middle">523−200+2 ＝ 325g</text>`;

        actionsBar.innerHTML = `
          <span style="font-weight:bold; color:#059669;">🎉 補償成功！天平完美歸零！</span>
          <button class="touch-btn" id="w10-act-restart">🔄 重新體驗減法湊整</button>
        `;
        document.getElementById('w10-act-restart')?.addEventListener('click', () => {
          this.state.step = 0;
          this.state.userAction = 'none';
          this.update();
        });

        guideTag.className = 'guide-step-tag step-done';
        guideTag.innerText = '🎉 探究結論 ➔ 減法速算口訣【多減要加】';
        guideText.innerHTML = `<strong>天平完美水平！</strong>多扣了 2g，就必須在同側<strong>加回 2g</strong> 補償！算式為 <strong>523 − 198 ＝ 523 − 200 ＋ 2 ＝ 325</strong>！負負得正，變號見神奇！`;
        guideSub.innerText = '🎯 教師金句：多減要加莫記反，去括號變號見神奇！';
      }
    }

    if (window.ipadApp) {
      window.ipadApp.updateTeacherSummary(this.getTeacherSummary());
    }
  },

  destroy() {}
};
