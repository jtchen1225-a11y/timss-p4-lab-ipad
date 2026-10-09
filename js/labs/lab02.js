/**
 * lab02.js - 第 2 週：【糖果裝袋真實流水線】 (LAB-W02-N-DIVR) - iPad 優化版 (動手分裝探索)
 * 數與運算 ｜ 應用 Applying ｜ 逐步裝袋、散糖滯留、情境進一與去尾抉擇
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
    total: 87,
    perBag: 6,
    packedBags: 0, // 初始 0 袋，等待學生動手裝袋！
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
    this.state = { total: 87, perBag: 6, packedBags: 0, scenario: 'none' };

    container.innerHTML = `
      <div class="ipad-controls-bar">
        <div class="controls-left-group">
          <!-- 糖果總數步進器 -->
          <div style="display:flex; align-items:center; gap:8px;">
            <label style="font-weight:bold; font-size:0.95rem;">🍬 糖果總數：</label>
            <div class="ipad-stepper">
              <button class="stepper-btn" id="w02-tot-sub">−</button>
              <span class="stepper-val" id="w02-tot-val" style="min-width:48px;">87</span>
              <button class="stepper-btn" id="w02-tot-add">+</button>
            </div>
          </div>

          <!-- 每袋容量步進器 -->
          <div style="display:flex; align-items:center; gap:8px;">
            <label style="font-weight:bold; font-size:0.95rem;">🛍️ 每袋容量：</label>
            <div class="ipad-stepper">
              <button class="stepper-btn" id="w02-per-sub">−</button>
              <span class="stepper-val" id="w02-per-val">6</span>
              <button class="stepper-btn" id="w02-per-add">+</button>
            </div>
          </div>
        </div>

        <button class="touch-btn" id="w02-btn-reset">🔄 恢復初始狀態 (87粒未裝)</button>
      </div>

      <!-- 動態流水線操作面板 -->
      <div style="background:#f8fafc; border:2px solid #cbd5e1; border-radius:12px; padding:12px 18px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
        <div style="font-size:1.35rem; font-weight:900; color:#0f172a; font-family:var(--font-math);" id="w02-formula-text">
          87 ÷ 6 ＝ 等待動手裝袋...
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button class="touch-btn primary" id="w02-btn-pack-one">📦 裝入 1 袋 (6粒)</button>
          <button class="touch-btn success" id="w02-btn-pack-all">▶️ 自動流水線裝滿</button>
        </div>
      </div>

      <!-- 傳送帶與包裝展示區 -->
      <div class="ipad-conveyor-wrap">
        <div style="display:flex; justify-content:space-between; align-items:center; color:#e2e8f0; margin-bottom:8px; font-weight:bold;">
          <span>⚙️ 糖果自動流水傳送帶</span>
          <span id="w02-badge" style="background:#0284c7; padding:4px 12px; border-radius:14px; font-size:0.85rem;">已封口 0 袋 ｜ 輸送帶待分裝 87 粒</span>
        </div>

        <div class="ipad-conveyor-track"></div>

        <!-- 滿袋陳列架 -->
        <div style="margin-top:14px;">
          <div style="color:#94a3b8; font-size:0.85rem; font-weight:bold; margin-bottom:6px;">📦 已封口標準滿袋陳列架：</div>
          <div id="w02-bags-area" style="display:flex; flex-wrap:wrap; min-height:80px; max-height:160px; overflow-y:auto; gap:6px; background:rgba(0,0,0,0.25); padding:8px; border-radius:8px;">
            <div id="w02-bags-placeholder" style="color:#64748b; font-size:0.85rem; display:flex; align-items:center; justify-content:center; width:100%; height:60px;">
              暫無已封口袋子，請點擊上方按鈕開始裝袋！
            </div>
          </div>
        </div>

        <!-- 散裝待裝/落單糖果托盤 -->
        <div style="margin-top:12px; background:rgba(239, 68, 68, 0.2); border:1.5px dashed #ef4444; border-radius:8px; padding:10px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong style="color:#fca5a5; font-size:0.9rem;" id="w02-loose-title">🍬 輸送帶待分裝糖果：<span id="w02-loose-num" style="color:#ef4444; font-size:1.2rem;">87</span> 粒</strong>
            <span id="w02-loose-desc" style="color:#fecaca; font-size:0.8rem;">尚未封入標準袋的散糖</span>
          </div>
          <div id="w02-loose-items" style="display:flex; flex-wrap:wrap; gap:4px; margin-top:8px; max-height:90px; overflow-y:auto;"></div>
        </div>
      </div>

      <!-- 情境決策大挑戰按鈕區 (分裝完成後引導探究) -->
      <div id="w02-decision-bar" style="display:none; margin-top:12px; background:#fff; border:2px solid #fbbf24; border-radius:12px; padding:12px 16px;">
        <div style="font-weight:bold; color:#b45309; margin-bottom:8px;">
          🤔 輸送帶只剩下 3 粒散糖，不夠裝滿 1 整袋！在真實生活中該怎麼決策？
        </div>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <button class="touch-btn primary" id="w02-btn-ceil">🚌 情境 A：全納進一法 (校車/全體裝箱運走)</button>
          <button class="touch-btn warning" id="w02-btn-floor">🛒 情境 B：足額去尾法 (超市論袋標準售賣)</button>
        </div>
      </div>

      <!-- 情境決策解釋橫幅 -->
      <div id="w02-verdict-box" style="margin-top:10px; background:#eff6ff; border:1.5px solid #93c5fd; border-radius:10px; padding:10px 14px; font-size:0.9rem; color:#1e40af;"></div>
    `;

    this.bindEvents();
    this.update();
  },

  bindEvents() {
    const bind = (id, fn) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', fn);
    };

    bind('w02-tot-add', () => {
      if (this.state.total < 120) {
        this.state.total++;
        this.state.packedBags = 0;
        this.state.scenario = 'none';
        window.soundFx.click();
        this.update();
      }
    });
    bind('w02-tot-sub', () => {
      if (this.state.total > 10) {
        this.state.total--;
        this.state.packedBags = 0;
        this.state.scenario = 'none';
        window.soundFx.click();
        this.update();
      }
    });

    bind('w02-per-add', () => {
      if (this.state.perBag < 12) {
        this.state.perBag++;
        this.state.packedBags = 0;
        this.state.scenario = 'none';
        window.soundFx.click();
        this.update();
      }
    });
    bind('w02-per-sub', () => {
      if (this.state.perBag > 2) {
        this.state.perBag--;
        this.state.packedBags = 0;
        this.state.scenario = 'none';
        window.soundFx.click();
        this.update();
      }
    });

    // 逐袋裝入
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

    // 一鍵裝滿
    bind('w02-btn-pack-all', () => {
      const maxBags = Math.floor(this.state.total / this.state.perBag);
      this.state.packedBags = maxBags;
      window.soundFx.balanceChime();
      this.update();
    });

    bind('w02-btn-ceil', () => {
      this.state.scenario = 'ceil';
      window.soundFx.stampThud();
      this.update();
    });

    bind('w02-btn-floor', () => {
      this.state.scenario = 'floor';
      window.soundFx.tiltBuzz();
      this.update();
    });

    bind('w02-btn-reset', () => {
      this.state = { total: 87, perBag: 6, packedBags: 0, scenario: 'none' };
      window.soundFx.click();
      this.update();
    });
  },

  update() {
    const tot = this.state.total;
    const per = this.state.perBag;
    const maxBags = Math.floor(tot / per);
    const finalRemainder = tot % per;
    const packed = this.state.packedBags;
    const remainingCandies = tot - packed * per;

    document.getElementById('w02-tot-val').innerText = tot;
    document.getElementById('w02-per-val').innerText = per;

    // 算式動態回饋
    const formulaText = document.getElementById('w02-formula-text');
    if (packed === 0) {
      formulaText.innerText = `${tot} ÷ ${per} ＝ 等待裝袋... (每 ${per} 粒裝 1 袋)`;
      formulaText.style.color = '#64748b';
    } else if (packed < maxBags) {
      formulaText.innerText = `${tot} ÷ ${per} ➔ 已裝 ${packed} 袋 (還剩 ${remainingCandies} 粒待裝)`;
      formulaText.style.color = '#0284c7';
    } else {
      formulaText.innerText = `${tot} ÷ ${per} ＝ ${maxBags} …… ${finalRemainder}`;
      formulaText.style.color = '#0f172a';
    }

    document.getElementById('w02-badge').innerText = `已密封 ${packed} 袋 ｜ 輸送帶剩餘 ${remainingCandies} 粒`;
    document.getElementById('w02-loose-num').innerText = remainingCandies;

    const looseTitle = document.getElementById('w02-loose-title');
    if (packed === maxBags) {
      looseTitle.innerHTML = `🍬 散裝落單糖果（餘數）：<span style="color:#ef4444; font-size:1.2rem;">${finalRemainder}</span> 粒`;
    } else {
      looseTitle.innerHTML = `🍬 輸送帶待分裝糖果：<span style="color:#ef4444; font-size:1.2rem;">${remainingCandies}</span> 粒`;
    }

    // 渲染袋子
    const bagsArea = document.getElementById('w02-bags-area');
    let bagsHTML = '';
    if (packed === 0) {
      bagsHTML = `<div style="color:#64748b; font-size:0.85rem; display:flex; align-items:center; justify-content:center; width:100%; height:60px;">暫無已封口袋子，請點擊上方「📦 裝入 1 袋」或「▶️ 自動流水線裝滿」開始！</div>`;
    } else {
      for (let i = 1; i <= packed; i++) {
        bagsHTML += `<div class="big-candy-bag"><span style="color:#0284c7; font-size:0.75rem;">袋 #${i}</span><div style="display:flex; flex-wrap:wrap; max-width:65px; justify-content:center;">`;
        for (let c = 0; c < per; c++) {
          bagsHTML += `<span class="big-candy-dot"></span>`;
        }
        bagsHTML += `</div><span style="font-size:0.7rem; color:#64748b;">${per}粒</span></div>`;
      }
    }

    // 全納進一法額外呈現的第 15 袋
    if (this.state.scenario === 'ceil' && finalRemainder > 0 && packed === maxBags) {
      bagsHTML += `<div class="big-candy-bag" style="border:2.5px dashed #10b981; background:#ecfdf5;"><span style="color:#059669; font-size:0.75rem;">第 ${maxBags + 1} 袋 (進一保護)</span><div style="display:flex; flex-wrap:wrap; max-width:65px; justify-content:center;">`;
      for (let c = 0; c < finalRemainder; c++) {
        bagsHTML += `<span class="big-candy-dot" style="background:#10b981;"></span>`;
      }
      bagsHTML += `</div><span style="font-size:0.7rem; color:#059669; font-weight:bold;">${finalRemainder}粒 (全納)</span></div>`;
    }

    bagsArea.innerHTML = bagsHTML;

    // 渲染散裝糖果
    const looseItems = document.getElementById('w02-loose-items');
    let looseHTML = '';
    const showCount = Math.min(remainingCandies, 40);
    for (let i = 0; i < showCount; i++) {
      looseHTML += `<span class="big-candy-dot" style="margin:2px;"></span>`;
    }
    if (remainingCandies > 40) {
      looseHTML += `<span style="color:#ef4444; font-weight:bold; align-self:center; font-size:0.85rem; margin-left:8px;">+${remainingCandies - 40} 粒</span>`;
    }
    looseItems.innerHTML = looseHTML;

    // 決策列顯示控制
    const decisionBar = document.getElementById('w02-decision-bar');
    if (packed === maxBags) {
      decisionBar.style.display = 'block';
    } else {
      decisionBar.style.display = 'none';
    }

    // 決策提示
    const verdict = document.getElementById('w02-verdict-box');
    if (this.state.scenario === 'ceil') {
      const needed = finalRemainder > 0 ? maxBags + 1 : maxBags;
      verdict.style.background = '#ecfdf5';
      verdict.style.borderColor = '#86efac';
      verdict.style.color = '#065f46';
      verdict.innerHTML = `🚌 <strong>全納進一法（校車/裝箱情境）：</strong>桌上一粒糖不能剩，或全體同學都要搭校車！剩下的 <strong>${finalRemainder}</strong> 粒糖不能被遺棄！必須多拿 1 個袋子（多派 1 輛車），共需 <strong>${maxBags} + 1 ＝ ${needed}</strong> 袋！`;
    } else if (this.state.scenario === 'floor') {
      verdict.style.background = '#fffbeb';
      verdict.style.borderColor = '#fde68a';
      verdict.style.color = '#92400e';
      verdict.innerHTML = `🛒 <strong>足額去尾法（超市論袋售賣情境）：</strong>顧客是按每袋 ${per} 粒付錢的，桌上這 <strong>${finalRemainder}</strong> 粒是不足額散件，不能當正品袋出售！最多只能賣出 <strong>${maxBags}</strong> 整袋！剩下的 ${finalRemainder} 粒退回或捨去。`;
    } else if (packed === maxBags) {
      verdict.style.background = '#eff6ff';
      verdict.style.borderColor = '#bfdbfe';
      verdict.style.color = '#1e40af';
      verdict.innerHTML = `💡 <strong>標準包裝已完成！</strong>87 ÷ 6 ＝ 14 袋，輸送帶還剩 3 粒散糖！請在上方黃色區域點擊「情境 A」或「情境 B」，探究這 3 粒糖在現實中的命運！`;
    } else {
      verdict.style.background = '#f8fafc';
      verdict.style.borderColor = '#cbd5e1';
      verdict.style.color = '#475569';
      verdict.innerHTML = `👉 <strong>流水線準備就緒：</strong>請點擊上方「📦 裝入 1 袋」或「▶️ 自動流水線裝滿」，親自體驗每 6 粒裝一袋的過程！`;
    }

    // 更新教師總結
    if (window.ipadApp) {
      window.ipadApp.updateTeacherSummary(this.getTeacherSummary());
    }
  },

  destroy() {}
};
