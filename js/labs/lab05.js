/**
 * lab05.js - 第 5 週：【購物天平與代數天平】 (LAB-W05-N-MSTEP) - iPad 優化版 (動手拼擺守恆與括號對抗)
 * 數與運算 ｜ 應用 Applying ｜ 歸零天平、動手放鈔票筆記本、無括號翻倒 vs 括號保險箱平衡
 */

window.TIMSS_LABS = window.TIMSS_LABS || {};

window.TIMSS_LABS['W05'] = {
  id: 'W05',
  code: 'LAB-W05-N-MSTEP',
  title: '購物天平與代數天平',
  domain: '數與運算 Number',
  domainType: 'number',
  cognitive: '應用 Applying',
  question: '小明拿 $100 買了 3 本每本 $15 的筆記本，找回 $55。天平兩邊該放甚麼才能保持平衡？算式括號該加在哪？',
  activeRole: '🔴 操作員(D) 切換括號模式 ➔ 🟢 發言人(B) 解釋括號保險箱',

  state: {
    stage: 'balance', // 'balance', 'algebra'
    leftCash100: false,
    booksCount: 0,
    change55: false,
    algebraMode: 'none' // 'none', 'paren', 'noparen'
  },

  getTeacherSummary() {
    return {
      core: `<h4>💡 核心概念提煉</h4><p>在兩步運算與購物情境中，「<strong>付出總額 = 物品總花費 + 找回零錢</strong>」是恆成立的等量關係。當我們要反求每本書的單價時，必須先求出 3 本書的總花費（100 − 55），再除以本數 3。由於乘除運算級別高於加減，若要打破規則強制先算減法，就必須加上「<strong>小括號保險箱</strong>」！</p>`,
      formula: `<h4>📐 核心算式與運算順序對比</h4><p>• <strong>購物守恆方程：</strong>$100 = 3 \\times 15 + 55$<br>• <strong>加括號正確求解：</strong>$(100 - 55) \\div 3 = 45 \\div 3 = \\mathbf{15\\text{ 元}}$（平衡）<br>• ❌ <strong>漏括號致命錯誤：</strong>$100 - 55 \\div 3 \\approx 100 - 18.3 = \\mathbf{81.7\\text{ 元}}$（天平崩潰！）</p>`,
      quote: `🎯 <strong>教師總結金句：</strong>「兩步運算理清序，反求單價先求差；小括號是保險箱，先減後除不走樣！」`
    };
  },

  render(container) {
    this.container = container;
    this.state = {
      stage: 'balance',
      leftCash100: false,
      booksCount: 0,
      change55: false,
      algebraMode: 'none'
    };

    container.innerHTML = `
      <div class="ipad-controls-bar">
        <div class="controls-left-group">
          <button class="touch-btn primary" id="w05-tab-bal">🛍️ 階段一：動手拼擺購物天平</button>
          <button class="touch-btn" id="w05-tab-alg">🔒 階段二：反求單價與括號對抗</button>
        </div>
        <button class="touch-btn" id="w05-btn-reset">🔄 天平歸零待測</button>
      </div>

      <!-- 階段一操作面板：動手放置物品 -->
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

      <!-- 階段二操作面板：括號算式對抗 -->
      <div id="w05-panel-stage2" class="ipad-controls-bar" style="background:#f8fafc; display:none;">
        <span style="font-weight:bold; color:#334155;">反求每本筆記本單價（右盤為 1 本 $15）：</span>
        <div style="display:flex; gap:10px;">
          <button class="touch-btn danger" id="w05-btn-nopar">❌ 放上無括號算式：100 − 55 ÷ 3</button>
          <button class="touch-btn success" id="w05-btn-par">✅ 放上括號算式：(100 − 55) ÷ 3</button>
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

      <!-- 說明與回饋橫幅 -->
      <div id="w05-desc-box" style="margin-top:14px; background:#ecfdf5; border:1.5px solid #86efac; border-radius:10px; padding:12px 16px; font-size:0.95rem;"></div>
    `;

    this.bindEvents();
    this.update();
  },

  bindEvents() {
    const bind = (id, fn) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', fn);
    };

    // 切換階段
    bind('w05-tab-bal', () => {
      this.state.stage = 'balance';
      document.getElementById('w05-tab-bal').className = 'touch-btn primary';
      document.getElementById('w05-tab-alg').className = 'touch-btn';
      document.getElementById('w05-panel-stage1').style.display = 'flex';
      document.getElementById('w05-panel-stage2').style.display = 'none';
      window.soundFx.click();
      this.update();
    });

    bind('w05-tab-alg', () => {
      this.state.stage = 'algebra';
      document.getElementById('w05-tab-alg').className = 'touch-btn primary';
      document.getElementById('w05-tab-bal').className = 'touch-btn';
      document.getElementById('w05-panel-stage1').style.display = 'none';
      document.getElementById('w05-panel-stage2').style.display = 'flex';
      window.soundFx.click();
      this.update();
    });

    // 階段一放置操作
    bind('w05-btn-toggle-100', () => {
      this.state.leftCash100 = !this.state.leftCash100;
      const btn = document.getElementById('w05-btn-toggle-100');
      if (this.state.leftCash100) {
        btn.classList.add('primary');
        btn.innerText = '💵 取下 $100 鈔票';
        window.soundFx.stampThud();
      } else {
        btn.classList.remove('primary');
        btn.innerText = '💵 放上 $100 鈔票';
        window.soundFx.click();
      }
      this.update();
    });

    bind('w05-b-add', () => {
      if (this.state.booksCount < 5) {
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

    bind('w05-btn-toggle-55', () => {
      this.state.change55 = !this.state.change55;
      const btn = document.getElementById('w05-btn-toggle-55');
      if (this.state.change55) {
        btn.classList.add('primary');
        btn.innerText = '🪙 取下 $55 零錢';
        window.soundFx.stampThud();
      } else {
        btn.classList.remove('primary');
        btn.innerText = '🪙 放上 $55 零錢';
        window.soundFx.click();
      }
      this.update();
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

    // 重置
    bind('w05-btn-reset', () => {
      this.state.leftCash100 = false;
      this.state.booksCount = 0;
      this.state.change55 = false;
      this.state.algebraMode = 'none';
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
      window.soundFx.click();
      this.update();
    });
  },

  update() {
    const beam = document.getElementById('w05-beam');
    const needle = document.getElementById('w05-needle');
    const lG = document.getElementById('w05-left-g');
    const rG = document.getElementById('w05-right-g');
    const desc = document.getElementById('w05-desc-box');

    document.getElementById('w05-b-val').innerText = this.state.booksCount;

    if (this.state.stage === 'balance') {
      const leftVal = this.state.leftCash100 ? 100 : 0;
      const rightVal = this.state.booksCount * 15 + (this.state.change55 ? 55 : 0);
      const diff = rightVal - leftVal;

      let angle = 0;
      if (diff !== 0) {
        angle = Math.max(-15, Math.min(15, (diff / 30) * 8));
      }
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

      // 判斷平衡與回饋
      if (leftVal === 0 && rightVal === 0) {
        needle.style.stroke = '#64748b';
        desc.style.background = '#f8fafc';
        desc.style.borderColor = '#cbd5e1';
        desc.style.color = '#475569';
        desc.innerHTML = `⚖️ <strong>天平處於 0 元空盤狀態：</strong>請在左邊放上 $100 鈔票，並在右邊搭配筆記本與找回零錢，探索如何讓天平恢復平衡！`;
      } else if (leftVal === rightVal && leftVal > 0) {
        needle.style.stroke = '#10b981';
        desc.style.background = '#ecfdf5';
        desc.style.borderColor = '#86efac';
        desc.style.color = '#065f46';
        desc.innerHTML = `🎉 <strong>購物守恆完全平衡！</strong>左盤付出 <strong>$100</strong> ＝ 右盤 <strong>3 本筆記本 (3×$15＝$45) ＋ 找回零錢 $55</strong>！兩邊總額完全相等！`;
      } else if (leftVal > rightVal) {
        needle.style.stroke = '#ef4444';
        desc.style.background = '#eff6ff';
        desc.style.borderColor = '#bfdbfe';
        desc.style.color = '#1e40af';
        desc.innerHTML = `🔵 <strong>左盤沉下去了！</strong>付出 $100 大於右盤現有物品總值（右盤共 $${rightVal}）。請在右盤增加筆記本或放上找回零錢！`;
      } else {
        needle.style.stroke = '#ef4444';
        desc.style.background = '#fffbeb';
        desc.style.borderColor = '#fde68a';
        desc.style.color = '#92400e';
        desc.innerHTML = `🟣 <strong>右盤沉下去了！</strong>右盤總值 $${rightVal} 超過了左盤 $${leftVal}。`;
      }

    } else {
      // 階段二：代數算式對抗
      if (this.state.algebraMode === 'none') {
        beam.setAttribute('transform', 'rotate(0, 340, 150)');
        needle.style.stroke = '#64748b';
        lG.innerHTML = '';
        rG.innerHTML = `
          <rect x="505" y="190" width="70" height="42" rx="5" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2" />
          <text x="540" y="216" fill="white" font-size="13" font-weight="bold" text-anchor="middle">1 本 $15</text>
        `;
        desc.style.background = '#eff6ff';
        desc.style.borderColor = '#bfdbfe';
        desc.style.color = '#1e40af';
        desc.innerHTML = `🎯 <strong>探究任務：</strong>右盤是 1 本筆記本的單價 <strong>$15</strong>。請點擊上方按鈕，實測「無括號算式」與「有括號算式」放入左盤後，天平會發生甚麼！`;
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
        desc.style.background = '#fef2f2';
        desc.style.borderColor = '#fca5a5';
        desc.style.color = '#991b1b';
        desc.innerHTML = `💥 <strong>天平劇烈傾覆！漏寫括號大災難：</strong>若寫成 <strong>100 − 55 ÷ 3</strong>，四則運算規則強制「先乘除後加減」，先算 55 ÷ 3 ≈ 18.3，再算 100 − 18.3 ＝ <strong>81.7 元</strong>！左盤 81.7 元比右盤單價 15 元重得多，天平徹底崩塌！`;
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
        desc.style.background = '#ecfdf5';
        desc.style.borderColor = '#86efac';
        desc.style.color = '#065f46';
        desc.innerHTML = `🔒 <strong>括號保險箱立大功：</strong>加上括號 <strong>(100 − 55) ÷ 3</strong>，保險箱強制先算減法（先求 3 本總花費 $45），再除以 3 得出單價 <strong>$15</strong>！天平穩如泰山！`;
      }
    }

    if (window.ipadApp) {
      window.ipadApp.updateTeacherSummary(this.getTeacherSummary());
    }
  },

  destroy() {}
};
