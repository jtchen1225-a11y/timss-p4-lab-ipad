/**
 * lab05.js - 第 5 週：【購物天平與代數天平】 (LAB-W05-N-MSTEP) - iPad 優化版
 * 教師引導 ➔ 學生主動探究 ➔ 任務切換立即歸零待測 ➔ 資優延伸探究 (多步運算大採購挑戰)
 */

window.TIMSS_LABS = window.TIMSS_LABS || {};

window.TIMSS_LABS['W05'] = {
  id: 'W05',
  code: 'LAB-W05-N-MSTEP',
  title: '購物天平與代數天平',
  domain: '數與運算 Number',
  domainType: 'number',
  cognitive: '推理 Reasoning',
  question: '付 $100 買 3 本筆記本找回 $55。天平上如何達成守恆平衡？反求單價時，小括號到底扮演甚麼保護神角色？',
  activeRole: '🔴 操作員(D) 放置天平物品與算式 ➔ 🟣 質疑員(A) 挑戰四則運算先後順序',

  state: {
    mission: 'balance', // 'balance', 'algebra', 'extend'
    leftCash100: false,
    booksCount: 0,
    change55: false,
    algebraMode: 'none', // 'none', 'noparen', 'paren'
    extMode: 'none'      // 'none', 'noparen', 'paren'
  },

  getTeacherSummary() {
    return {
      core: `<h4>💡 核心概念提煉</h4><p>購物交易本質是「<strong>總付出 = 總花費 + 找回零錢</strong>」的等量代換關係。當逆向求解商品單價時，必須「<strong>先求總花費（付出減找零），再求單價（除以數量）</strong>」。在無括號情況下，四則運算規則會優先執行除法，導致邏輯顛倒；<strong>小括號如同保險箱</strong>，能強制保護減法優先執行！</p>`,
      formula: `<h4>📐 核心代數天平模型</h4><p>• <strong>正向購物守恆：</strong>$100 = 3 \\times 15 + 55$<br>• <strong>逆向反求單價：</strong>$(100 − 55) \\div 3 = 45 \\div 3 = \\mathbf{15\\text{ 元}}$<br>• <strong>致命錯誤辨析：</strong>$100 − 55 \\div 3 \\approx 100 − 18.33 = 81.67\\text{ 元}$（不加括號，天平劇烈失衡！）</p>`,
      quote: `🎯 <strong>教師總結金句：</strong>「兩步運算理清序，反求單價先求差；小括號是保險箱，先減後除不走樣！」`
    };
  },

  render(container) {
    this.container = container;
    this.state = {
      mission: 'balance',
      leftCash100: false,
      booksCount: 0,
      change55: false,
      algebraMode: 'none',
      extMode: 'none'
    };

    container.innerHTML = `
      <!-- 任務切換列：點擊任何任務立即歸零 -->
      <div class="ipad-controls-bar">
        <div class="controls-left-group">
          <button class="touch-btn primary" id="w05-tab-bal">🛍️ 任務一：購物守恆天平</button>
          <button class="touch-btn" id="w05-tab-alg">🔒 任務二：括號保險箱對抗</button>
          <button class="touch-btn" id="w05-tab-ext">🚀 任務三：資優延伸探究 (二重運算挑戰)</button>
        </div>
        <button class="touch-btn" id="w05-btn-reset">🔄 當前任務歸零待測</button>
      </div>

      <!-- 👨‍🏫 教師引導與學生探究導引條 -->
      <div class="teacher-guide-banner" id="w05-guide-banner">
        <div class="guide-header-row">
          <span class="guide-step-tag" id="w05-guide-tag">👨‍🏫 老師引導 ➔ 第 1 步 / 共 3 步</span>
          <span class="guide-mission-title" id="w05-guide-title">任務一：動手拼擺購物守恆天平</span>
        </div>
        <div class="guide-instruction-text" id="w05-guide-text">
          天平目前為 0 元空盤狀態。小明付了 $100 買文具。請操作員在<strong>【左盤】</strong>放上 <strong>$100 鈔票</strong>，觀察天平如何傾斜！
        </div>
        <div class="guide-hint-subtext" id="w05-guide-sub">
          💡 請學生點擊下方按鈕放入 $100。
        </div>
      </div>

      <!-- 任務一操作面板：動手放置物品 -->
      <div id="w05-panel-stage1" class="ipad-controls-bar" style="background:#f8fafc;">
        <div style="display:flex; align-items:center; gap:8px;">
          <strong style="color:#047857;">左盤：</strong>
          <button class="touch-btn" id="w05-btn-toggle-100">💵 放上 $100 鈔票</button>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <strong style="color:#1d4ed8;">右盤物品：</strong>
          <div style="display:inline-flex; align-items:center; gap:4px;">
            <span>📓 筆記本($15)：</span>
            <div class="ipad-stepper">
              <button class="stepper-btn" id="w05-b-sub">−</button>
              <span class="stepper-val" id="w05-b-val">0</span>
              <button class="stepper-btn" id="w05-b-add">+</button>
            </div>
          </div>
          <button class="touch-btn" id="w05-btn-toggle-55">🪙 放上 $55 零錢</button>
        </div>
      </div>

      <!-- 任務二操作面板：括號算式對抗 -->
      <div id="w05-panel-stage2" class="ipad-controls-bar" style="background:#f8fafc; display:none;">
        <span style="font-weight:bold; color:#334155;">反求單價算式放入左盤（右盤為 1 本 $15）：</span>
        <div style="display:flex; gap:10px;">
          <button class="touch-btn danger" id="w05-btn-nopar">❌ 放上無括號算式：100 − 55 ÷ 3</button>
          <button class="touch-btn success" id="w05-btn-par">✅ 放上括號算式：(100 − 55) ÷ 3</button>
        </div>
      </div>

      <!-- 任務三操作面板：資優多步運算挑戰 -->
      <div id="w05-panel-stage3" class="ipad-controls-bar" style="background:#f0fdf4; border:2px solid #86efac; display:none;">
        <div style="display:flex; flex-direction:column; gap:6px; width:100%;">
          <div style="font-size:0.9rem; color:#166534; font-weight:bold;">
            情境：$200 買 4 盒色筆（每盒 $35），剩餘錢買每把 $10 直尺，能買幾把？（右盤目標：6把直尺）
          </div>
          <div style="display:flex; gap:10px; flex-wrap:wrap;">
            <button class="touch-btn danger" id="w05-ext-btn-nopar">❌ 放上無括號冒失算式：200 − 4 × 35 ÷ 10</button>
            <button class="touch-btn success" id="w05-ext-btn-par">✅ 放上括號保護算式：(200 − 4 × 35) ÷ 10</button>
          </div>
        </div>
      </div>

      <!-- 大天平視覺區 -->
      <div class="big-balance-wrapper">
        <svg class="big-balance-svg" viewBox="0 0 680 380">
          <polygon points="280,360 400,360 360,180 320,180" fill="#475569" />
          <circle cx="340" cy="150" r="40" fill="#ffffff" stroke="#94a3b8" stroke-width="2.5" />
          <line x1="340" y1="115" x2="340" y2="128" stroke="#059669" stroke-width="3" />
          
          <g id="w05-beam" class="beam-rotate-group" transform="rotate(0, 340, 150)">
            <rect x="90" y="144" width="500" height="12" rx="5" fill="#64748b" />
            <circle cx="340" cy="150" r="10" fill="#1e293b" />
            
            <line x1="140" y1="150" x2="140" y2="230" stroke="#94a3b8" stroke-width="2.5" />
            <ellipse cx="140" cy="235" rx="80" ry="18" fill="#cbd5e1" stroke="#64748b" stroke-width="2.5" />
            
            <line x1="540" y1="150" x2="540" y2="230" stroke="#94a3b8" stroke-width="2.5" />
            <ellipse cx="540" cy="235" rx="80" ry="18" fill="#cbd5e1" stroke="#64748b" stroke-width="2.5" />
            
            <line id="w05-needle" x1="340" y1="150" x2="340" y2="95" class="needle-indicator" />
          </g>

          <g id="w05-left-g"></g>
          <g id="w05-right-g"></g>
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
    bind('w05-tab-bal', () => {
      this.state = {
        mission: 'balance',
        leftCash100: false,
        booksCount: 0,
        change55: false,
        algebraMode: 'none',
        extMode: 'none'
      };
      this.updateTabs('w05-tab-bal');
      document.getElementById('w05-panel-stage1').style.display = 'flex';
      document.getElementById('w05-panel-stage2').style.display = 'none';
      document.getElementById('w05-panel-stage3').style.display = 'none';
      this.resetButtonsUI();
      window.soundFx.click();
      this.update();
    });

    bind('w05-tab-alg', () => {
      this.state = {
        mission: 'algebra',
        leftCash100: false,
        booksCount: 0,
        change55: false,
        algebraMode: 'none',
        extMode: 'none'
      };
      this.updateTabs('w05-tab-alg');
      document.getElementById('w05-panel-stage1').style.display = 'none';
      document.getElementById('w05-panel-stage2').style.display = 'flex';
      document.getElementById('w05-panel-stage3').style.display = 'none';
      this.resetButtonsUI();
      window.soundFx.click();
      this.update();
    });

    bind('w05-tab-ext', () => {
      this.state = {
        mission: 'extend',
        leftCash100: false,
        booksCount: 0,
        change55: false,
        algebraMode: 'none',
        extMode: 'none'
      };
      this.updateTabs('w05-tab-ext');
      document.getElementById('w05-panel-stage1').style.display = 'none';
      document.getElementById('w05-panel-stage2').style.display = 'none';
      document.getElementById('w05-panel-stage3').style.display = 'flex';
      this.resetButtonsUI();
      window.soundFx.click();
      this.update();
    });

    bind('w05-btn-reset', () => {
      this.state.leftCash100 = false;
      this.state.booksCount = 0;
      this.state.change55 = false;
      this.state.algebraMode = 'none';
      this.state.extMode = 'none';
      this.resetButtonsUI();
      window.soundFx.click();
      this.update();
    });

    // 階段一放置操作
    bind('w05-btn-toggle-100', () => {
      this.state.leftCash100 = !this.state.leftCash100;
      const btn = document.getElementById('w05-btn-toggle-100');
      if (this.state.leftCash100) {
        if (btn) {
          btn.classList.add('primary');
          btn.innerText = '💵 取下 $100 鈔票';
        }
        window.soundFx.stampThud();
      } else {
        if (btn) {
          btn.classList.remove('primary');
          btn.innerText = '💵 放上 $100 鈔票';
        }
        window.soundFx.click();
      }
      this.update();
    });

    bind('w05-btn-toggle-55', () => {
      this.state.change55 = !this.state.change55;
      const btn = document.getElementById('w05-btn-toggle-55');
      if (this.state.change55) {
        if (btn) {
          btn.classList.add('primary');
          btn.innerText = '🪙 取下 $55 零錢';
        }
        window.soundFx.stampThud();
      } else {
        if (btn) {
          btn.classList.remove('primary');
          btn.innerText = '🪙 放上 $55 零錢';
        }
        window.soundFx.click();
      }
      this.update();
    });

    bind('w05-b-add', () => {
      if (this.state.booksCount < 6) {
        this.state.booksCount++;
        window.soundFx.click();
        this.update();
      }
    });

    bind('w05-b-sub', () => {
      if (this.state.booksCount > 0) {
        this.state.booksCount--;
        window.soundFx.click();
        this.update();
      }
    });

    // 階段二算式選擇
    bind('w05-btn-nopar', () => {
      this.state.algebraMode = 'noparen';
      window.soundFx.tiltBuzz();
      this.update();
    });

    bind('w05-btn-par', () => {
      this.state.algebraMode = 'paren';
      window.soundFx.balanceChime();
      this.update();
    });

    // 階段三延伸算式選擇
    bind('w05-ext-btn-nopar', () => {
      this.state.extMode = 'noparen';
      window.soundFx.tiltBuzz();
      this.update();
    });

    bind('w05-ext-btn-par', () => {
      this.state.extMode = 'paren';
      window.soundFx.balanceChime();
      this.update();
    });
  },

  resetButtonsUI() {
    const btn100 = document.getElementById('w05-btn-toggle-100');
    if (btn100) {
      btn100.classList.remove('primary');
      btn100.innerText = '💵 放上 $100 鈔票';
    }
    const btn55 = document.getElementById('w05-btn-toggle-55');
    if (btn55) {
      btn55.classList.remove('primary');
      btn55.innerText = '🪙 放上 $55 零錢';
    }
  },

  updateTabs(activeId) {
    ['w05-tab-bal', 'w05-tab-alg', 'w05-tab-ext'].forEach(id => {
      const b = document.getElementById(id);
      if (b) {
        if (id === activeId) b.classList.add('primary');
        else b.classList.remove('primary');
      }
    });
  },

  update() {
    const beam = document.getElementById('w05-beam');
    const needle = document.getElementById('w05-needle');
    const lG = document.getElementById('w05-left-g');
    const rG = document.getElementById('w05-right-g');
    const guideTag = document.getElementById('w05-guide-tag');
    const guideTitle = document.getElementById('w05-guide-title');
    const guideText = document.getElementById('w05-guide-text');
    const guideSub = document.getElementById('w05-guide-sub');

    document.getElementById('w05-b-val').innerText = this.state.booksCount;

    if (this.state.mission === 'balance') {
      guideTitle.innerText = '任務一：動手拼擺購物守恆天平';

      const leftVal = this.state.leftCash100 ? 100 : 0;
      const rightVal = this.state.booksCount * 15 + (this.state.change55 ? 55 : 0);
      const diff = rightVal - leftVal;

      let angle = 0;
      if (diff !== 0) angle = Math.max(-15, Math.min(15, (diff / 30) * 8));
      beam.setAttribute('transform', `rotate(${angle}, 340, 150)`);

      // 渲染左盤
      let lHTML = '';
      if (this.state.leftCash100) {
        lHTML += `
          <rect x="90" y="${200 - angle * 2}" width="100" height="30" rx="4" fill="#10b981" stroke="#047857" stroke-width="2" />
          <text x="140" y="${220 - angle * 2}" fill="white" font-size="13" font-weight="bold" text-anchor="middle">💵 付出 $100</text>
        `;
      }
      lG.innerHTML = lHTML;

      // 渲染右盤
      let rHTML = '';
      const bCnt = this.state.booksCount;
      const bBaseX = 460;
      for (let i = 0; i < bCnt; i++) {
        const bx = bBaseX + i * 26;
        rHTML += `
          <rect x="${bx}" y="${195 + angle * 2}" width="28" height="36" rx="3" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.5" />
          <text x="${bx + 14}" y="${217 + angle * 2}" fill="white" font-size="9" font-weight="bold" text-anchor="middle">$15</text>
        `;
      }
      if (this.state.change55) {
        rHTML += `
          <rect x="570" y="${202 + angle * 2}" width="42" height="28" rx="4" fill="#f59e0b" stroke="#b45309" stroke-width="1.5" />
          <text x="591" y="${220 + angle * 2}" fill="white" font-size="11" font-weight="bold" text-anchor="middle">🪙$55</text>
        `;
      }
      rG.innerHTML = rHTML;

      // 步驟導引判斷
      if (!this.state.leftCash100 && this.state.booksCount === 0 && !this.state.change55) {
        needle.style.stroke = '#64748b';
        guideTag.className = 'guide-step-tag';
        guideTag.innerText = '👨‍🏫 老師引導 ➔ 第 1 步 / 共 3 步';
        guideText.innerHTML = `天平目前處於 0 元空盤狀態。小明買書付了 $100。請操作員在<strong>【左盤】</strong>放上 <strong>$100 鈔票</strong>，觀察天平如何傾斜！`;
        guideSub.innerText = '💡 請點擊下方「💵 放上 $100 鈔票」。';
      } else if (this.state.leftCash100 && this.state.booksCount < 3) {
        needle.style.stroke = '#ef4444';
        guideTag.className = 'guide-step-tag step-alert';
        guideTag.innerText = '👨‍🏫 老師引導 ➔ 第 2 步 / 共 3 步';
        guideText.innerHTML = `左盤被 $100 壓沉下去了！小明買了 <strong>3 本每本 $15 的筆記本</strong>。請操作員在<strong>【右盤】</strong>使用 ＋ 號放入 <strong>3 本筆記本</strong>！`;
        guideSub.innerText = `💡 目前右盤已有 ${this.state.booksCount} 本 ($${this.state.booksCount * 15})，請加滿 3 本。`;
      } else if (this.state.leftCash100 && this.state.booksCount >= 3 && !this.state.change55) {
        needle.style.stroke = '#ef4444';
        guideTag.className = 'guide-step-tag step-alert';
        guideTag.innerText = '👨‍🏫 老師引導 ➔ 第 3 步 / 共 3 步';
        guideText.innerHTML = `右盤 3 本書共 $45，天平依然偏向左盤！售貨員找回了 <strong>$55 零錢</strong>。請操作員在<strong>【右盤】</strong>放上 <strong>$55 零錢</strong>！`;
        guideSub.innerText = '💡 請點擊下方「🪙 放上 $55 零錢」。';
      } else if (leftVal === rightVal && leftVal > 0) {
        needle.style.stroke = '#10b981';
        guideTag.className = 'guide-step-tag step-done';
        guideTag.innerText = '🎉 探究結論 ➔ 購物等量守恆完全平衡！';
        guideText.innerHTML = `<strong>天平穩穩平衡！</strong>左盤付出 <strong>$100</strong> ＝ 右盤 <strong>3 本書花費 $45 ＋ 找回零錢 $55</strong>！兩邊總額完全守恆相等！`;
        guideSub.innerText = '🎯 教師金句：付出總額等於花費加找零，等量守恆天平平！';
      }

    } else if (this.state.mission === 'algebra') {
      guideTitle.innerText = '任務二：反求單價與括號保險箱對決';

      if (this.state.algebraMode === 'none') {
        beam.setAttribute('transform', 'rotate(0, 340, 150)');
        needle.style.stroke = '#64748b';
        lG.innerHTML = '';
        rG.innerHTML = `
          <rect x="505" y="190" width="70" height="42" rx="5" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2" />
          <text x="540" y="216" fill="white" font-size="13" font-weight="bold" text-anchor="middle">1 本 $15</text>
        `;
        guideTag.className = 'guide-step-tag';
        guideTag.innerText = '👨‍🏫 老師引導 ➔ 第 1 步：挑戰漏寫括號';
        guideText.innerHTML = `右盤是 1 本筆記本的真實單價 <strong>$15</strong>。小明反求單價時忘了加括號，寫成 <strong>100 − 55 ÷ 3</strong>。請操作員點擊下方<strong>「❌ 放上無括號算式」</strong>，看看天平會發生甚麼！`;
        guideSub.innerText = '💡 請全班猜測：不加括號，天平能平衡嗎？';

      } else if (this.state.algebraMode === 'noparen') {
        beam.setAttribute('transform', 'rotate(-16, 340, 150)');
        needle.style.stroke = '#ef4444';
        lG.innerHTML = `
          <rect x="85" y="170" width="115" height="44" rx="5" fill="#ef4444" stroke="#b91c1c" stroke-width="2" />
          <text x="142" y="190" fill="white" font-size="11" font-weight="bold" text-anchor="middle">100 − 55 ÷ 3</text>
          <text x="142" y="206" fill="#fecaca" font-size="11" font-weight="bold" text-anchor="middle">≈ 81.7 元</text>
        `;
        rG.innerHTML = `
          <rect x="505" y="215" width="70" height="42" rx="5" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2" />
          <text x="540" y="241" fill="white" font-size="13" font-weight="bold" text-anchor="middle">1 本 $15</text>
        `;
        guideTag.className = 'guide-step-tag step-alert';
        guideTag.innerText = '💥 天平劇烈傾覆！';
        guideText.innerHTML = `<strong>天平徹底崩潰！</strong>四則運算強制「先乘除後加減」，先算了 55 ÷ 3 ≈ 18.3，再算 100 − 18.3 ＝ <strong>81.7 元</strong>！左盤 81.7 元遠重於單價 15 元！請操作員點擊<strong>「✅ 放上括號算式」</strong>！`;
        guideSub.innerText = '💡 請引導學生理解：為什麼會算出 81.7 這種荒唐數字？';

      } else if (this.state.algebraMode === 'paren') {
        beam.setAttribute('transform', 'rotate(0, 340, 150)');
        needle.style.stroke = '#10b981';
        lG.innerHTML = `
          <rect x="85" y="195" width="115" height="40" rx="5" fill="#6366f1" stroke="#4338ca" stroke-width="2" />
          <text x="142" y="215" fill="white" font-size="11" font-weight="bold" text-anchor="middle">(100 − 55) ÷ 3</text>
          <text x="142" y="229" fill="#c7d2fe" font-size="10" font-weight="bold" text-anchor="middle">＝ 45 ÷ 3 ＝ 15</text>
        `;
        rG.innerHTML = `
          <rect x="505" y="190" width="70" height="42" rx="5" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2" />
          <text x="540" y="216" fill="white" font-size="13" font-weight="bold" text-anchor="middle">1 本 $15</text>
        `;
        guideTag.className = 'guide-step-tag step-done';
        guideTag.innerText = '🎉 探究結論 ➔ 括號保險箱立大功！';
        guideText.innerHTML = `<strong>天平穩如泰山！</strong>加上括號 <strong>(100 − 55) ÷ 3</strong>，保險箱強制先算減法（求 3 本總價 $45），再除以 3 得出單價 <strong>$15</strong>！天平完美平衡！`;
        guideSub.innerText = '🎯 教師金句：小括號是保險箱，先減後除不走樣！';
      }

    } else if (this.state.mission === 'extend') {
      guideTitle.innerText = '任務三：資優延伸探究 (多步運算大採購)';

      if (this.state.extMode === 'none') {
        beam.setAttribute('transform', 'rotate(0, 340, 150)');
        needle.style.stroke = '#64748b';
        lG.innerHTML = '';
        rG.innerHTML = `
          <rect x="505" y="190" width="75" height="42" rx="5" fill="#059669" stroke="#047857" stroke-width="2" />
          <text x="542" y="216" fill="white" font-size="12" font-weight="bold" text-anchor="middle">6 把直尺</text>
        `;
        guideTag.className = 'guide-step-tag';
        guideTag.innerText = '🚀 資優探究 ➔ 待放算式';
        guideText.innerHTML = `小紅帶 $200 買 4 盒色筆（每盒 $35），剩餘錢買每把 $10 直尺。右盤已放好目標 <strong>6 把直尺</strong>。請操作員點擊放上<strong>「無括號冒失算式」</strong>測試！`;
        guideSub.innerText = '💡 先在心中口算：不加括號會先算哪一步？';

      } else if (this.state.extMode === 'noparen') {
        beam.setAttribute('transform', 'rotate(-16, 340, 150)');
        needle.style.stroke = '#ef4444';
        lG.innerHTML = `
          <rect x="75" y="166" width="135" height="48" rx="5" fill="#ef4444" stroke="#b91c1c" stroke-width="2" />
          <text x="142" y="186" fill="white" font-size="10" font-weight="bold" text-anchor="middle">200 − 4×35 ÷ 10</text>
          <text x="142" y="204" fill="#fecaca" font-size="10" font-weight="bold" text-anchor="middle">＝ 200 − 14 ＝ 186</text>
        `;
        rG.innerHTML = `
          <rect x="505" y="215" width="75" height="42" rx="5" fill="#059669" stroke="#047857" stroke-width="2" />
          <text x="542" y="241" fill="white" font-size="12" font-weight="bold" text-anchor="middle">6 把直尺</text>
        `;
        guideTag.className = 'guide-step-tag step-alert';
        guideTag.innerText = '💥 致命算錯：天平傾覆！';
        guideText.innerHTML = `<strong>不加括號算出 186 把直尺的荒唐結果！</strong>先乘除優先算了 4×35÷10＝14，再算 200−14＝186！左盤 186 徹底砸垮右盤 6 把！請點擊<strong>「✅ 括號保護算式」</strong>！`;
        guideSub.innerText = '💡 這證明了在多步運算中，括號能改變運算優先級！';

      } else if (this.state.extMode === 'paren') {
        beam.setAttribute('transform', 'rotate(0, 340, 150)');
        needle.style.stroke = '#10b981';
        lG.innerHTML = `
          <rect x="75" y="190" width="135" height="46" rx="5" fill="#10b981" stroke="#047857" stroke-width="2" />
          <text x="142" y="210" fill="white" font-size="10" font-weight="bold" text-anchor="middle">(200 − 4×35) ÷ 10</text>
          <text x="142" y="226" fill="#d1fae5" font-size="10" font-weight="bold" text-anchor="middle">＝ 60 ÷ 10 ＝ 6</text>
        `;
        rG.innerHTML = `
          <rect x="505" y="190" width="75" height="42" rx="5" fill="#059669" stroke="#047857" stroke-width="2" />
          <text x="542" y="216" fill="white" font-size="12" font-weight="bold" text-anchor="middle">6 把直尺</text>
        `;
        guideTag.className = 'guide-step-tag step-done';
        guideTag.innerText = '🎉 探究結論 ➔ 二重多步括號完美守恆！';
        guideText.innerHTML = `<strong>天平精確水平平衡！</strong>括號先鎖住買色筆的花費 $140，算出剩餘錢 $60，再除以單價 $10 得出 <strong>6 把直尺</strong>！等量守恆完全成立！`;
        guideSub.innerText = '🎯 體會多步複合應用題中，括號對運算順序的絕對支配權！';
      }
    }

    if (window.ipadApp) {
      window.ipadApp.updateTeacherSummary(this.getTeacherSummary());
    }
  },

  destroy() {}
};
