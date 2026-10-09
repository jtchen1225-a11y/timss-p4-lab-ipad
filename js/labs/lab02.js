/**
 * lab02.js - 第 2 週：【糖果裝袋真實流水線】 (LAB-W02-N-DIVR) - iPad 優化版
 * 教師引導 ➔ 學生主動探究 ➔ 任務切換立即歸零待測 ➔ 資優延伸探究（多數值自選與自訂）
 */

window.TIMSS_LABS = window.TIMSS_LABS || {};

window.TIMSS_LABS['W02'] = {
  id: 'W02',
  code: 'LAB-W02-N-DIVR',
  title: '糖果裝袋真實流水線',
  domain: '數與運算 Number',
  domainType: 'number',
  cognitive: '應用 Applying',
  question: '流水線要包裝 87 粒糖果，每 6 粒裝一袋。算式 87 ÷ 6 = 14……3。剩下的 3 粒到底要不要多拿一個袋子？',
  activeRole: '🔴 操作員(D) 調整糖果包裝 ➔ 🟢 發言人(B) 說理兩種情境',

  state: {
    mission: 'pack', // 'pack', 'ceil', 'floor', 'extend'
    total: 87,
    perBag: 6,
    packedBags: 0,
    scenario: 'none' // 'none', 'ceil', 'floor'
  },

  getTeacherSummary() {
    const q = Math.floor(this.state.total / this.state.perBag);
    const r = this.state.total % this.state.perBag;
    return {
      core: `<h4>💡 核心概念提煉</h4><p>帶餘除法中的「<strong>餘數</strong>」具有深刻的現實情境意義。當題目要求「全員乘車/全部裝箱」時，剩餘的物品或人數不能遺棄，必須增加一個載體，採用「<strong>進一法（商+1）</strong>」；當要求「湊滿成套/按整袋售賣」時，不足額的散件無法包裝成整件，採用「<strong>去尾法（保留商）</strong>」。</p>`,
      formula: `<h4>📐 核心算式與數學模型</h4><p>數學除法模型：<strong>${this.state.total} ÷ ${this.state.perBag} = ${q} …… ${r}</strong><br>• 全納進一法：${q} + 1 = <strong>${q + 1} 個</strong>（生活保護：乘車、租船、裝箱）<br>• 足額去尾法：只能湊成 <strong>${q} 個</strong>（商業買賣：做衣服、賣整盒、買套餐）</p>`,
      quote: `🎯 <strong>教師總結金句：</strong>「餘數去留看情境，全員裝載進一法，足額售賣去尾法；數學源於生活，生活決定算法！」`
    };
  },

  render(container) {
    this.container = container;
    // 進入時完全歸零
    this.state = { mission: 'pack', total: 87, perBag: 6, packedBags: 0, scenario: 'none' };

    container.innerHTML = `
      <!-- 任務切換列：點擊任何任務立即歸零 -->
      <div class="ipad-controls-bar">
        <div class="controls-left-group">
          <button class="touch-btn primary" id="w02-tab-pack">📦 任務一：流水線逐袋分裝 (87÷6)</button>
          <button class="touch-btn" id="w02-tab-ceil">🚌 任務二：情境 A 全納進一法 (校車/裝箱)</button>
          <button class="touch-btn" id="w02-tab-floor">🛒 任務三：情境 B 足額去尾法 (超市賣整袋)</button>
          <button class="touch-btn" id="w02-tab-extend">🚀 任務四：資優延伸探究 (多數值實驗室)</button>
        </div>
        <button class="touch-btn" id="w02-btn-reset">🔄 當前任務歸零待測</button>
      </div>

      <!-- 👨‍🏫 教師引導與學生探究導引條 -->
      <div class="teacher-guide-banner" id="w02-guide-banner">
        <div class="guide-header-row">
          <span class="guide-step-tag" id="w02-guide-tag">👨‍🏫 老師引導 ➔ 第 1 步 / 共 2 步</span>
          <span class="guide-mission-title" id="w02-guide-title">任務一：流水線逐袋分裝 (87 ÷ 6)</span>
        </div>
        <div class="guide-instruction-text" id="w02-guide-text">
          輸送帶上有 <strong>87 粒待裝糖果</strong>。請操作員點擊下方<strong>「📦 裝入 1 袋 (6粒)」</strong>或<strong>「▶️ 自動流水線裝滿」</strong>，親自體驗分裝！
        </div>
        <div class="guide-hint-subtext" id="w02-guide-sub">
          💡 目前已封口 0 袋，請讓學生動手分裝，觀察散糖是如何一袋袋減少的。
        </div>
      </div>

      <!-- 資優延伸探究控制列（預設隱藏，任務四顯示） -->
      <div id="w02-extend-controls" style="display:none; background:#f0fdf4; border:2px solid #86efac; border-radius:12px; padding:12px 16px; margin-bottom:12px;">
        <div style="font-weight:bold; color:#166534; font-size:1rem; margin-bottom:8px;">
          🚀 資優延伸探究：請選擇不同挑戰情境，或自訂任意除法數值進行探究：
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center; margin-bottom:10px;">
          <button class="touch-btn primary" id="w02-ext-case-1">📌 課本題 (87 ÷ 6)</button>
          <button class="touch-btn" id="w02-ext-case-2">🎯 進階一：百粒裝盒 (105 ÷ 8)</button>
          <button class="touch-btn" id="w02-ext-case-3">🎯 進階二：整打批發 (148 ÷ 12)</button>
          <button class="touch-btn" id="w02-ext-case-4">🏆 奧數題：大巴租車 (215 ÷ 45)</button>
        </div>
        <div style="background:#ffffff; padding:10px 14px; border-radius:8px; border:1px solid #bbf7d0; display:flex; flex-wrap:wrap; gap:16px; align-items:center;">
          <div>
            <label style="font-size:0.85rem; font-weight:bold; color:#15803d;">自訂總數量：</label>
            <input type="range" id="w02-ext-tot-slider" min="20" max="220" step="1" value="87" style="vertical-align:middle; width:130px;">
            <strong id="w02-ext-tot-val" style="color:#15803d; font-size:1rem;">87</strong>
          </div>
          <div>
            <label style="font-size:0.85rem; font-weight:bold; color:#15803d;">每袋/每份容量：</label>
            <input type="range" id="w02-ext-per-slider" min="3" max="25" step="1" value="6" style="vertical-align:middle; width:110px;">
            <strong id="w02-ext-per-val" style="color:#15803d; font-size:1rem;">6</strong>
          </div>
          <button class="touch-btn success" id="w02-ext-btn-apply" style="padding:6px 14px;">⚡ 套用自訂數值並歸零</button>
        </div>
      </div>

      <!-- 流水線操作列 -->
      <div style="background:#f8fafc; border:2px solid #cbd5e1; border-radius:12px; padding:12px 18px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <div style="font-size:1.35rem; font-weight:900; color:#0f172a; font-family:var(--font-math);" id="w02-formula-text">
          87 ÷ 6 ＝ 等待裝袋...
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button class="touch-btn primary" id="w02-btn-pack-one">📦 裝入 1 袋</button>
          <button class="touch-btn success" id="w02-btn-pack-all">▶️ 自動流水線裝滿</button>
        </div>
      </div>

      <!-- 傳送帶與包裝展示區 -->
      <div class="ipad-conveyor-wrap">
        <div style="display:flex; justify-content:space-between; align-items:center; color:#e2e8f0; margin-bottom:8px; font-weight:bold;">
          <span>⚙️ 糖果自動流水傳送帶</span>
          <span id="w02-badge" style="background:#0284c7; padding:4px 12px; border-radius:14px; font-size:0.85rem;">已封口 0 袋 ｜ 輸送帶待裝 87 粒</span>
        </div>

        <div class="ipad-conveyor-track"></div>

        <!-- 滿袋陳列架 -->
        <div style="margin-top:14px;">
          <div style="color:#94a3b8; font-size:0.85rem; font-weight:bold; margin-bottom:6px;">📦 已封口標準滿袋陳列架：</div>
          <div id="w02-bags-area" style="display:flex; flex-wrap:wrap; min-height:80px; max-height:160px; overflow-y:auto; gap:6px; background:rgba(0,0,0,0.25); padding:8px; border-radius:8px;"></div>
        </div>

        <!-- 散裝待裝/落單糖果托盤 -->
        <div style="margin-top:12px; background:rgba(239, 68, 68, 0.2); border:1.5px dashed #ef4444; border-radius:8px; padding:10px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong style="color:#fca5a5; font-size:0.9rem;" id="w02-loose-title">🍬 輸送帶待分裝散糖：<span id="w02-loose-num" style="color:#ef4444; font-size:1.2rem;">87</span> 粒</strong>
            <span id="w02-loose-desc" style="color:#fecaca; font-size:0.8rem;">尚未封入標準袋的散糖</span>
          </div>
          <div id="w02-loose-items" style="display:flex; flex-wrap:wrap; gap:4px; margin-top:8px; max-height:80px; overflow-y:auto;"></div>
        </div>
      </div>

      <!-- 餘數情境抉擇按鈕列（裝滿後出現） -->
      <div id="w02-dilemma-bar" style="display:none; margin-top:12px; background:#fffbeb; border:2px solid #fde68a; border-radius:12px; padding:12px 16px;">
        <div style="font-weight:bold; color:#92400e; margin-bottom:8px;" id="w02-dilemma-title">
          🤔 餘數抉擇：輸送帶上還剩散糖，不夠裝滿 1 整袋！請選擇生活情境進行決策：
        </div>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <button class="touch-btn primary" id="w02-btn-act-ceil">🚌 點擊實測：情境 A 全納進一 (校車/全部裝箱)</button>
          <button class="touch-btn warning" id="w02-btn-act-floor">🛒 點擊實測：情境 B 足額去尾 (超市論袋出售)</button>
        </div>
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

    // 任務切換：一律歸零待測！絕不預填答案！
    bind('w02-tab-pack', () => {
      this.state = { mission: 'pack', total: 87, perBag: 6, packedBags: 0, scenario: 'none' };
      this.updateTabs('w02-tab-pack');
      window.soundFx.click();
      this.update();
    });

    bind('w02-tab-ceil', () => {
      // 切換進入任務二，一律從 0 袋開始歸零待測！由老師引導動手裝袋
      this.state = { mission: 'ceil', total: 87, perBag: 6, packedBags: 0, scenario: 'none' };
      this.updateTabs('w02-tab-ceil');
      window.soundFx.click();
      this.update();
    });

    bind('w02-tab-floor', () => {
      // 切換進入任務三，一律從 0 袋開始歸零待測！由老師引導動手裝袋
      this.state = { mission: 'floor', total: 87, perBag: 6, packedBags: 0, scenario: 'none' };
      this.updateTabs('w02-tab-floor');
      window.soundFx.click();
      this.update();
    });

    bind('w02-tab-extend', () => {
      // 任務四：資優延伸探究
      this.state = { mission: 'extend', total: 87, perBag: 6, packedBags: 0, scenario: 'none' };
      this.updateTabs('w02-tab-extend');
      window.soundFx.click();
      this.update();
    });

    bind('w02-btn-reset', () => {
      this.state.packedBags = 0;
      this.state.scenario = 'none';
      window.soundFx.click();
      this.update();
    });

    // 裝袋
    bind('w02-btn-pack-one', () => {
      const maxBags = Math.floor(this.state.total / this.state.perBag);
      if (this.state.packedBags < maxBags) {
        this.state.packedBags++;
        window.soundFx.stampThud();
        this.update();
      } else {
        window.soundFx.tiltBuzz();
      }
    });

    bind('w02-btn-pack-all', () => {
      const maxBags = Math.floor(this.state.total / this.state.perBag);
      this.state.packedBags = maxBags;
      window.soundFx.balanceChime();
      this.update();
    });

    bind('w02-btn-act-ceil', () => {
      this.state.scenario = 'ceil';
      window.soundFx.stampThud();
      this.update();
    });

    bind('w02-btn-act-floor', () => {
      this.state.scenario = 'floor';
      window.soundFx.tiltBuzz();
      this.update();
    });

    // 資優延伸題預設案例切換（每次切換一律歸零待測）
    const setCase = (tot, per, btnId) => {
      this.state.total = tot;
      this.state.perBag = per;
      this.state.packedBags = 0;
      this.state.scenario = 'none';
      ['w02-ext-case-1', 'w02-ext-case-2', 'w02-ext-case-3', 'w02-ext-case-4'].forEach(id => {
        const b = document.getElementById(id);
        if (b) {
          if (id === btnId) b.classList.add('primary');
          else b.classList.remove('primary');
        }
      });
      const totSlider = document.getElementById('w02-ext-tot-slider');
      const perSlider = document.getElementById('w02-ext-per-slider');
      const totVal = document.getElementById('w02-ext-tot-val');
      const perVal = document.getElementById('w02-ext-per-val');
      if (totSlider) totSlider.value = tot;
      if (perSlider) perSlider.value = per;
      if (totVal) totVal.innerText = tot;
      if (perVal) perVal.innerText = per;
      window.soundFx.click();
      this.update();
    };

    bind('w02-ext-case-1', () => setCase(87, 6, 'w02-ext-case-1'));
    bind('w02-ext-case-2', () => setCase(105, 8, 'w02-ext-case-2'));
    bind('w02-ext-case-3', () => setCase(148, 12, 'w02-ext-case-3'));
    bind('w02-ext-case-4', () => setCase(215, 45, 'w02-ext-case-4'));

    // 自訂滑桿
    const totSlider = document.getElementById('w02-ext-tot-slider');
    const perSlider = document.getElementById('w02-ext-per-slider');
    if (totSlider) {
      totSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        document.getElementById('w02-ext-tot-val').innerText = val;
      });
    }
    if (perSlider) {
      perSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        document.getElementById('w02-ext-per-val').innerText = val;
      });
    }

    bind('w02-ext-btn-apply', () => {
      const tot = parseInt(document.getElementById('w02-ext-tot-slider').value, 10) || 87;
      const per = parseInt(document.getElementById('w02-ext-per-slider').value, 10) || 6;
      this.state.total = tot;
      this.state.perBag = per;
      this.state.packedBags = 0;
      this.state.scenario = 'none';
      ['w02-ext-case-1', 'w02-ext-case-2', 'w02-ext-case-3', 'w02-ext-case-4'].forEach(id => {
        const b = document.getElementById(id);
        if (b) b.classList.remove('primary');
      });
      window.soundFx.balanceChime();
      this.update();
    });
  },

  updateTabs(activeId) {
    ['w02-tab-pack', 'w02-tab-ceil', 'w02-tab-floor', 'w02-tab-extend'].forEach(id => {
      const b = document.getElementById(id);
      if (b) {
        if (id === activeId) b.classList.add('primary');
        else b.classList.remove('primary');
      }
    });
  },

  update() {
    const tot = this.state.total;
    const per = this.state.perBag;
    const maxBags = Math.floor(tot / per);
    const finalRemainder = tot % per;
    const packed = this.state.packedBags;
    const remaining = tot - packed * per;

    // 延伸控制列顯示
    const extControls = document.getElementById('w02-extend-controls');
    if (extControls) {
      extControls.style.display = this.state.mission === 'extend' ? 'block' : 'none';
    }

    // 更新裝袋按鈕文字
    const packOneBtn = document.getElementById('w02-btn-pack-one');
    if (packOneBtn) packOneBtn.innerText = `📦 裝入 1 袋 (${per}粒)`;

    const formulaText = document.getElementById('w02-formula-text');
    if (packed === 0) {
      formulaText.innerText = `${tot} ÷ ${per} ＝ 等待裝袋... (每 ${per} 粒裝 1 袋)`;
      formulaText.style.color = '#64748b';
    } else if (packed < maxBags) {
      formulaText.innerText = `${tot} ÷ ${per} ➔ 已裝 ${packed} 袋 (還剩 ${remaining} 粒待裝)`;
      formulaText.style.color = '#0284c7';
    } else {
      formulaText.innerText = `${tot} ÷ ${per} ＝ ${maxBags} 袋 …… 剩 ${finalRemainder} 粒`;
      formulaText.style.color = '#0f172a';
    }

    document.getElementById('w02-badge').innerText = `已密封 ${packed} 袋 ｜ 輸送帶待裝 ${remaining} 粒`;
    document.getElementById('w02-loose-num').innerText = remaining;

    const looseTitle = document.getElementById('w02-loose-title');
    if (packed === maxBags) {
      looseTitle.innerHTML = `🍬 散裝落單糖果（餘數）：<span style="color:#ef4444; font-size:1.2rem;">${finalRemainder}</span> 粒`;
    } else {
      looseTitle.innerHTML = `🍬 輸送帶待分裝散糖：<span style="color:#ef4444; font-size:1.2rem;">${remaining}</span> 粒`;
    }

    // 渲染袋子
    const bagsArea = document.getElementById('w02-bags-area');
    let bagsHTML = '';
    if (packed === 0) {
      bagsHTML = `<div style="color:#64748b; font-size:0.85rem; display:flex; align-items:center; justify-content:center; width:100%; height:60px;">暫無已封口袋子，請點擊上方按鈕開始動手裝袋！</div>`;
    } else {
      const showDots = Math.min(per, 16);
      for (let i = 1; i <= packed; i++) {
        bagsHTML += `<div class="big-candy-bag"><span style="color:#0284c7; font-size:0.75rem;">袋 #${i}</span><div style="display:flex; flex-wrap:wrap; max-width:65px; justify-content:center;">`;
        for (let c = 0; c < showDots; c++) bagsHTML += `<span class="big-candy-dot"></span>`;
        if (per > 16) bagsHTML += `<span style="font-size:0.6rem; color:#0284c7;">+${per-16}</span>`;
        bagsHTML += `</div><span style="font-size:0.7rem; color:#64748b;">${per}粒</span></div>`;
      }
    }

    // 全納進一額外呈現
    if (this.state.scenario === 'ceil' && finalRemainder > 0 && packed === maxBags) {
      const remDots = Math.min(finalRemainder, 16);
      bagsHTML += `<div class="big-candy-bag" style="border:2.5px dashed #10b981; background:#ecfdf5;"><span style="color:#059669; font-size:0.75rem;">第 ${maxBags + 1} 袋 (進一保護)</span><div style="display:flex; flex-wrap:wrap; max-width:65px; justify-content:center;">`;
      for (let c = 0; c < remDots; c++) bagsHTML += `<span class="big-candy-dot" style="background:#10b981;"></span>`;
      if (finalRemainder > 16) bagsHTML += `<span style="font-size:0.6rem; color:#059669;">+${finalRemainder-16}</span>`;
      bagsHTML += `</div><span style="font-size:0.7rem; color:#059669; font-weight:bold;">${finalRemainder}粒 (全納)</span></div>`;
    }

    bagsArea.innerHTML = bagsHTML;

    // 渲染散糖
    const looseItems = document.getElementById('w02-loose-items');
    let looseHTML = '';
    const showCount = Math.min(remaining, 36);
    for (let i = 0; i < showCount; i++) looseHTML += `<span class="big-candy-dot" style="margin:2px;"></span>`;
    if (remaining > 36) looseHTML += `<span style="color:#ef4444; font-weight:bold; align-self:center; font-size:0.85rem; margin-left:8px;">+${remaining - 36} 粒</span>`;
    looseItems.innerHTML = looseHTML;

    // 決策列顯示控制（只有裝滿標準袋後才出現情境抉擇）
    const dilemmaBar = document.getElementById('w02-dilemma-bar');
    const dilemmaTitle = document.getElementById('w02-dilemma-title');
    if (packed === maxBags && finalRemainder > 0) {
      dilemmaBar.style.display = 'block';
      dilemmaTitle.innerHTML = `🤔 餘數抉擇：輸送帶上還剩 <strong>${finalRemainder}</strong> 粒散糖，不夠裝滿 1 整袋！請選擇情境驗證：`;
    } else {
      dilemmaBar.style.display = 'none';
    }

    // 導引條更新
    const guideTag = document.getElementById('w02-guide-tag');
    const guideTitle = document.getElementById('w02-guide-title');
    const guideText = document.getElementById('w02-guide-text');
    const guideSub = document.getElementById('w02-guide-sub');

    if (this.state.mission === 'pack') {
      guideTitle.innerText = `任務一：流水線逐袋分裝 (${tot} ÷ ${per})`;
      if (packed === 0) {
        guideTag.className = 'guide-step-tag';
        guideTag.innerText = '👨‍🏫 老師引導 ➔ 第 1 步 / 共 2 步';
        guideText.innerHTML = `輸送帶上有 <strong>${tot} 粒待裝糖果</strong>。請操作員點擊上方<strong>「📦 裝入 1 袋 (${per}粒)」</strong>或<strong>「▶️ 自動流水線裝滿」</strong>，親自體驗分裝！`;
        guideSub.innerText = '💡 目前已封口 0 袋，請讓學生動手分裝，觀察散糖是如何一袋袋減少的。';
      } else if (packed < maxBags) {
        guideTag.className = 'guide-step-tag';
        guideTag.innerText = '👨‍🏫 老師引導 ➔ 裝袋進行中...';
        guideText.innerHTML = `已裝好 <strong>${packed} 袋</strong>，輸送帶上還剩 <strong>${remaining} 粒散糖</strong>。請繼續點擊裝袋！`;
        guideSub.innerText = `💡 ${tot} ÷ ${per} ＝ ${packed} 袋 …… 剩 ${remaining} 粒`;
      } else {
        guideTag.className = 'guide-step-tag step-alert';
        guideTag.innerText = '👨‍🏫 老師引導 ➔ 第 2 步：餘數難題！';
        guideText.innerHTML = `<strong>停！已裝好 ${maxBags} 袋，輸送帶只剩 ${finalRemainder} 粒散糖，不夠裝滿 1 整袋！</strong>算式是 <strong>${tot} ÷ ${per} ＝ ${maxBags} …… ${finalRemainder}</strong>。這 ${finalRemainder} 粒到底要不要多拿 1 個袋子？請在下方點擊情境抉擇！`;
        guideSub.innerText = '💡 請老師先引導學生討論：如果這是校車，這幾個人能丟下嗎？如果是賣整袋，這幾粒能賣嗎？';
      }

    } else if (this.state.mission === 'ceil') {
      guideTitle.innerText = '任務二：情境 A 全納進一法 (校車/裝箱)';
      if (packed === 0) {
        guideTag.className = 'guide-step-tag';
        guideTag.innerText = '👨‍🏫 老師引導 ➔ 第 1 步：先動手裝載乘客/貨物';
        guideText.innerHTML = `全校有 <strong>${tot} 名師生</strong>要乘車，每輛車坐 <strong>${per} 人</strong>。請操作員點擊<strong>「▶️ 自動流水線裝滿」</strong>，先坐滿標準車輛！`;
        guideSub.innerText = '💡 當前為 0 輛出發狀態，請親自動手裝載，看看會不會有人落單！';
      } else if (packed < maxBags) {
        guideTag.className = 'guide-step-tag';
        guideTag.innerText = '👨‍🏫 老師引導 ➔ 裝載進行中...';
        guideText.innerHTML = `已裝滿 <strong>${packed} 輛車</strong>，還有 <strong>${remaining} 人等待上車</strong>。請繼續裝載！`;
        guideSub.innerText = '💡 必須確保所有人都能出發！';
      } else if (this.state.scenario !== 'ceil') {
        guideTag.className = 'guide-step-tag step-alert';
        guideTag.innerText = '👨‍🏫 老師引導 ➔ 第 2 步：落單乘客抉擇！';
        guideText.innerHTML = `坐滿 <strong>${maxBags} 輛車</strong>後，<strong>還剩 ${finalRemainder} 名師生</strong>！這 ${finalRemainder} 人能丟在學校不管嗎？請點擊下方<strong>「情境 A 全納進一」</strong>！`;
        guideSub.innerText = '💡 討論：如果不加車，這幾位同學就無法參加活動，能接受嗎？';
      } else {
        guideTag.className = 'guide-step-tag step-done';
        guideTag.innerText = '🎉 探究結論 ➔ 全納進一法 (商 ＋ 1)';
        guideText.innerHTML = `<strong>必須再派第 ${maxBags + 1} 輛車！</strong>為剩下的 ${finalRemainder} 名師生多派 1 輛車，總共需要 <strong>${maxBags} ＋ 1 ＝ ${maxBags + 1} 輛車</strong>！生活中要求全員覆蓋時，必須採用進一法！`;
        guideSub.innerText = '🎯 教師金句：全員裝載進一法，一人一粒不落下！';
      }

    } else if (this.state.mission === 'floor') {
      guideTitle.innerText = '任務三：情境 B 足額去尾法 (超市論袋賣)';
      if (packed === 0) {
        guideTag.className = 'guide-step-tag';
        guideTag.innerText = '👨‍🏫 老師引導 ➔ 第 1 步：工廠分裝商品';
        guideText.innerHTML = `工廠有 <strong>${tot} 粒糖果</strong>，規定每 <strong>${per} 粒封一袋</strong>明碼標價。請操作員點擊<strong>「▶️ 自動流水線裝滿」</strong>封裝標準商品！`;
        guideSub.innerText = '💡 目前已封口 0 袋，請先完成標準袋封裝。';
      } else if (packed < maxBags) {
        guideTag.className = 'guide-step-tag';
        guideTag.innerText = '👨‍🏫 老師引導 ➔ 分裝進行中...';
        guideText.innerHTML = `已封口 <strong>${packed} 袋</strong>，輸送帶上還有 <strong>${remaining} 粒散糖</strong>。請繼續封裝！`;
        guideSub.innerText = '💡 必須每袋滿額才能出廠！';
      } else if (this.state.scenario !== 'floor') {
        guideTag.className = 'guide-step-tag step-alert';
        guideTag.innerText = '👨‍🏫 老師引導 ➔ 第 2 步：半成品能賣嗎？';
        guideText.innerHTML = `裝完 <strong>${maxBags} 袋</strong>後，輸送帶只剩 <strong>${finalRemainder} 粒散糖</strong>！老闆能把這 ${finalRemainder} 粒當作一整袋賣給顧客嗎？請點擊下方<strong>「情境 B 足額去尾」</strong>！`;
        guideSub.innerText = '💡 討論：顧客付一整袋的錢，買到不足額的半成品，這符合商業誠信嗎？';
      } else {
        guideTag.className = 'guide-step-tag step-done';
        guideTag.innerText = '🎉 探究結論 ➔ 足額去尾法 (捨去餘數)';
        guideText.innerHTML = `<strong>最多只能賣出 ${maxBags} 整袋！</strong>剩下的 ${finalRemainder} 粒是不足額半成品，絕不能當作標準商品出售！捨去餘數，售賣總數為 <strong>${maxBags} 袋</strong>！商業買賣必須足額去尾！`;
        guideSub.innerText = '🎯 教師金句：足額售賣去尾法，不足一份不能賣！';
      }

    } else if (this.state.mission === 'extend') {
      guideTitle.innerText = `任務四：資優延伸探究 (${tot} ÷ ${per})`;
      if (packed === 0) {
        guideTag.className = 'guide-step-tag';
        guideTag.innerText = '🚀 資優挑戰 ➔ 選擇情境並動手裝載';
        guideText.innerHTML = `當前數值：<strong>${tot} ÷ ${per}</strong>。請操作員點擊<strong>「▶️ 自動流水線裝滿」</strong>，實測能裝幾袋、剩幾粒！也可在上方自訂任何數值！`;
        guideSub.innerText = '💡 數學能力強的同學，可以先口算商與餘數，再點擊裝滿驗證自己的心算！';
      } else if (this.state.scenario === 'none') {
        guideTag.className = 'guide-step-tag step-alert';
        guideTag.innerText = '🚀 資優挑戰 ➔ 雙重情境辯析對比';
        guideText.innerHTML = `實測結果：<strong>${tot} ÷ ${per} ＝ ${maxBags} …… ${finalRemainder}</strong>。請在下方點擊驗證：若是全員保護需要幾份（進一法）？若是足額售賣能賣幾份（去尾法）？`;
        guideSub.innerText = `💡 進一法結果：${finalRemainder > 0 ? maxBags + 1 : maxBags} 份 ｜ 去尾法結果：${maxBags} 份`;
      } else if (this.state.scenario === 'ceil') {
        guideTag.className = 'guide-step-tag step-done';
        guideTag.innerText = '🎉 延伸探究 ➔ 全納進一法驗證成功';
        guideText.innerHTML = `在全員覆蓋情境下：${finalRemainder > 0 ? `${maxBags} ＋ 1 ＝ <strong>${maxBags + 1} 份</strong>` : `剛好除盡，需要 <strong>${maxBags} 份</strong>`}！綠色虛線袋已自動補齊保護剩餘對象！`;
        guideSub.innerText = '💡 換個自訂數值再試試看吧！';
      } else if (this.state.scenario === 'floor') {
        guideTag.className = 'guide-step-tag step-done';
        guideTag.innerText = '🎉 延伸探究 ➔ 足額去尾法驗證成功';
        guideText.innerHTML = `在足額售賣情境下：只能湊出 <strong>${maxBags} 份</strong>合格商品，餘數 ${finalRemainder} 粒必須退回庫存！`;
        guideSub.innerText = '💡 換個自訂數值再試試看吧！';
      }
    }

    if (window.ipadApp) {
      window.ipadApp.updateTeacherSummary(this.getTeacherSummary());
    }
  },

  destroy() {}
};
