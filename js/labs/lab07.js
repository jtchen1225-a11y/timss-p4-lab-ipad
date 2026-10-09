/**
 * lab07.js - 第 7 週：【透明膠片披薩切割賽】 (LAB-W07-N-FRAC) - iPad 優化版
 * 教師引導 ➔ 學生主動探究 ➔ 任務切換立即歸零待測
 */

window.TIMSS_LABS = window.TIMSS_LABS || {};

window.TIMSS_LABS['W07'] = {
  id: 'W07',
  code: 'LAB-W07-N-FRAC',
  title: '透明膠片披薩切割賽',
  domain: '數與運算 Number',
  domainType: 'number',
  cognitive: '推理 Reasoning',
  question: '小明堅稱：『5 大於 3，所以 1/5 塊披薩絕對比 1/3 塊披薩更大！』今天用透明披薩片疊加投影，親眼見證誰才是大贏家！',
  activeRole: '🔴 操作員(D) 疊加披薩切片 ➔ 🟣 質疑員(A) 挑戰 1/100 塊會不會更大',

  state: {
    mission: 'pk', // 'pk', 'custom', 'people'
    base: 3, // 1/3
    over: 5, // 1/5
    overlaid: false
  },

  getTeacherSummary() {
    const bDeg = (360 / this.state.base).toFixed(1);
    const oDeg = (360 / this.state.over).toFixed(1);
    return {
      core: `<h4>💡 核心概念提煉</h4><p>幾分之一（同分子分數）的本質是「<strong>對同一個整體（單位 1）進行平均分</strong>」。分數中的「<strong>分母</strong>」代表平分的總份數（即分給多少人）。整體總量固定時，平均分的份數越多，每份所能得到的實體份額就越小！</p>`,
      formula: `<h4>📐 核心圓心角幾何模型與不等式</h4><p>• <strong>圓心角公式：</strong>$\\theta = 360^\\circ \\div \\text{分母}$<br>• <strong>實測數據：</strong>$\\frac{1}{${this.state.base}}$ 扇形角為 <strong>${bDeg}°</strong> ｜ $\\frac{1}{${this.state.over}}$ 扇形角為 <strong>${oDeg}°</strong><br>• <strong>定則：</strong>當分子均為 1 時，分母越小，分數反而越大：$\\mathbf{\\frac{1}{${Math.min(this.state.base, this.state.over)}} > \\frac{1}{${Math.max(this.state.base, this.state.over)}}}$。</p>`,
      quote: `🎯 <strong>教師總結金句：</strong>「分子同為一，分母看人頭；分給人越多，每塊肉越小；分母越小塊越大！」`
    };
  },

  render(container) {
    this.container = container;
    this.state = { mission: 'pk', base: 3, over: 5, overlaid: false };

    container.innerHTML = `
      <!-- 任務切換列：點擊任何任務立即歸零 -->
      <div class="ipad-controls-bar">
        <div class="controls-left-group">
          <button class="touch-btn primary" id="w07-tab-pk">🥊 任務一：迷思對決 (1/3 藍片 vs 1/5 綠片)</button>
          <button class="touch-btn" id="w07-tab-custom">🧩 任務二：自由選配切片對抗</button>
          <button class="touch-btn" id="w07-tab-people">👨‍👩‍👧‍👦 任務三：平分人數動態探究 (1~12人)</button>
        </div>
        <button class="touch-btn" id="w07-btn-reset">🔄 當前任務歸零待測</button>
      </div>

      <!-- 👨‍🏫 教師引導與學生探究導引條 -->
      <div class="teacher-guide-banner" id="w07-guide-banner">
        <div class="guide-header-row">
          <span class="guide-step-tag" id="w07-guide-tag">👨‍🏫 老師引導 ➔ 第 1 步 / 共 2 步</span>
          <span class="guide-mission-title" id="w07-guide-title">任務一：迷思對決 (1/3 vs 1/5)</span>
        </div>
        <div class="guide-instruction-text" id="w07-guide-text">
          小明堅稱：<strong>「5 大於 3，所以 1/5 塊披薩絕對比 1/3 塊大！」</strong>請全班表決。然後請操作員點擊上方<strong>「💡 開啟透光投影對齊」</strong>驗證！
        </div>
        <div class="guide-hint-subtext" id="w07-guide-sub">
          💡 目前尚未投影對齊，圓心角度數處於隱藏待測狀態。
        </div>
      </div>

      <!-- 切片挑選控制列 -->
      <div class="ipad-controls-bar" style="background:#f8fafc;" id="w07-selector-bar">
        <div style="display:flex; align-items:center; gap:8px;">
          <label style="font-weight:bold;">🍕 底層披薩：</label>
          <button class="touch-btn primary" id="w07-btn-b3">1/3 藍片</button>
          <button class="touch-btn" id="w07-btn-b2">1/2 半張</button>
          <button class="touch-btn" id="w07-btn-b4">1/4 黃片</button>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <label style="font-weight:bold;">🧩 比對切片：</label>
          <button class="touch-btn primary" id="w07-btn-o5">1/5 綠片</button>
          <button class="touch-btn" id="w07-btn-o6">1/6 紫片</button>
          <button class="touch-btn" id="w07-btn-o8">1/8 橙片</button>
        </div>
        <button class="touch-btn success" id="w07-btn-overlay" style="font-weight:800;">💡 開啟透光投影對齊</button>
      </div>

      <!-- 人數滑桿列 (任務三專用) -->
      <div class="ipad-controls-bar" style="background:#fff; display:none;" id="w07-people-bar">
        <label style="font-weight:bold;">👨‍👩‍👧‍👦 平分人數動態探究：分給 <strong id="w07-k-txt" style="color:#ef4444; font-size:1.2rem;">5</strong> 個人 ➔ 每人分得 1/<span id="w07-k-frac">5</span> 塊</label>
        <input type="range" class="touch-slider" id="w07-k-slider" min="1" max="12" value="5" step="1" style="width:260px;">
      </div>

      <!-- 燈箱披薩主舞台 -->
      <div style="background:#f8fafc; border:2px solid #cbd5e1; border-radius:14px; padding:20px; display:flex; flex-direction:column; align-items:center;">
        <div style="width:300px; height:300px; border-radius:50%; background:radial-gradient(circle, #fff 40%, #f1f5f9 90%); border:4px solid #94a3b8; position:relative; box-shadow:0 0 30px rgba(59, 130, 246, 0.25);">
          <svg width="300" height="300" viewBox="-150 -150 300 300" id="w07-svg">
            <circle cx="0" cy="0" r="130" fill="none" stroke="#e2e8f0" stroke-width="2" stroke-dasharray="4,4" />
            <!-- 底層披薩 -->
            <path id="w07-p-base" fill="rgba(59, 130, 246, 0.55)" stroke="#1d4ed8" stroke-width="2.5" />
            <!-- 疊加披薩 -->
            <path id="w07-p-over" fill="rgba(16, 185, 129, 0.7)" stroke="#047857" stroke-width="2.5" />
            <circle cx="0" cy="0" r="6" fill="#0f172a" />
          </svg>
        </div>

        <!-- 圓心角對抗大字牌 -->
        <div style="display:flex; justify-content:center; align-items:center; gap:24px; margin-top:16px;">
          <div style="background:#eff6ff; border:2px solid #3b82f6; border-radius:10px; padding:8px 18px; text-align:center; min-width:130px;">
            <div style="font-size:0.85rem; color:#1d4ed8; font-weight:bold;">底層：1/<span id="w07-txt-b">3</span> 塊</div>
            <div style="font-size:1.6rem; font-weight:900; color:#2563eb;" id="w07-deg-b">待測量</div>
          </div>
          <div style="font-size:1.8rem; font-weight:900; color:#ef4444;">VS</div>
          <div style="background:#ecfdf5; border:2px solid #10b981; border-radius:10px; padding:8px 18px; text-align:center; min-width:130px;">
            <div style="font-size:0.85rem; color:#047857; font-weight:bold;">比對：1/<span id="w07-txt-o">5</span> 塊</div>
            <div style="font-size:1.6rem; font-weight:900; color:#059669;" id="w07-deg-o">待測量</div>
          </div>
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

    // 任務切換：一律歸零待測！
    bind('w07-tab-pk', () => {
      this.state = { mission: 'pk', base: 3, over: 5, overlaid: false };
      this.updateTabs('w07-tab-pk');
      document.getElementById('w07-selector-bar').style.display = 'flex';
      document.getElementById('w07-people-bar').style.display = 'none';
      this.updateSelectorButtons();
      window.soundFx.click();
      this.update();
    });

    bind('w07-tab-custom', () => {
      this.state = { mission: 'custom', base: 2, over: 4, overlaid: false };
      this.updateTabs('w07-tab-custom');
      document.getElementById('w07-selector-bar').style.display = 'flex';
      document.getElementById('w07-people-bar').style.display = 'none';
      this.updateSelectorButtons();
      window.soundFx.click();
      this.update();
    });

    bind('w07-tab-people', () => {
      this.state = { mission: 'people', base: 1, over: 5, overlaid: true };
      this.updateTabs('w07-tab-people');
      document.getElementById('w07-selector-bar').style.display = 'none';
      document.getElementById('w07-people-bar').style.display = 'flex';
      window.soundFx.click();
      this.update();
    });

    bind('w07-btn-reset', () => {
      this.state.overlaid = false;
      window.soundFx.click();
      this.update();
    });

    // 選擇底層
    const bindB = (id, val) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('click', () => {
          this.state.base = val;
          this.state.overlaid = false;
          ['w07-btn-b2', 'w07-btn-b3', 'w07-btn-b4'].forEach(b => document.getElementById(b)?.classList.remove('primary'));
          el.classList.add('primary');
          window.soundFx.click();
          this.update();
        });
      }
    };

    // 選擇比對
    const bindO = (id, val) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('click', () => {
          this.state.over = val;
          this.state.overlaid = false;
          ['w07-btn-o5', 'w07-btn-o6', 'w07-btn-o8'].forEach(b => document.getElementById(b)?.classList.remove('primary'));
          el.classList.add('primary');
          window.soundFx.click();
          this.update();
        });
      }
    };

    bindB('w07-btn-b3', 3);
    bindB('w07-btn-b2', 2);
    bindB('w07-btn-b4', 4);

    bindO('w07-btn-o5', 5);
    bindO('w07-btn-o6', 6);
    bindO('w07-btn-o8', 8);

    // 開啟透光投影
    bind('w07-btn-overlay', () => {
      this.state.overlaid = true;
      window.soundFx.balanceChime();
      this.update();
    });

    // 人數滑桿
    const kSlider = document.getElementById('w07-k-slider');
    if (kSlider) {
      kSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        this.state.over = val;
        this.state.overlaid = true;
        document.getElementById('w07-k-txt').innerText = val;
        document.getElementById('w07-k-frac').innerText = val;
        this.update();
      });
    }
  },

  updateTabs(activeId) {
    ['w07-tab-pk', 'w07-tab-custom', 'w07-tab-people'].forEach(id => {
      const b = document.getElementById(id);
      if (b) {
        if (id === activeId) b.classList.add('primary');
        else b.classList.remove('primary');
      }
    });
  },

  updateSelectorButtons() {
    ['w07-btn-b2', 'w07-btn-b3', 'w07-btn-b4'].forEach(b => {
      const el = document.getElementById(b);
      if (el) {
        if (b === `w07-btn-b${this.state.base}`) el.classList.add('primary');
        else el.classList.remove('primary');
      }
    });
    ['w07-btn-o5', 'w07-btn-o6', 'w07-btn-o8'].forEach(b => {
      const el = document.getElementById(b);
      if (el) {
        if (b === `w07-btn-o${this.state.over}`) el.classList.add('primary');
        else el.classList.remove('primary');
      }
    });
  },

  getPath(radius, startAngle, endAngle) {
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    const x1 = radius * Math.cos(startRad);
    const y1 = radius * Math.sin(startRad);
    const x2 = radius * Math.cos(endRad);
    const y2 = radius * Math.sin(endRad);
    const large = endAngle - startAngle > 180 ? 1 : 0;
    return `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2} Z`;
  },

  update() {
    const b = this.state.base;
    const o = this.state.over;
    const bDeg = 360 / b;
    const oDeg = 360 / o;

    document.getElementById('w07-txt-b').innerText = b;
    document.getElementById('w07-txt-o').innerText = o;

    const pBase = document.getElementById('w07-p-base');
    const pOver = document.getElementById('w07-p-over');

    pBase.setAttribute('d', this.getPath(130, 0, bDeg));

    if (this.state.overlaid) {
      pOver.setAttribute('d', this.getPath(130, 0, oDeg));
      pOver.style.display = 'block';
      document.getElementById('w07-deg-b').innerText = `${bDeg.toFixed(0)}°`;
      document.getElementById('w07-deg-o').innerText = `${oDeg.toFixed(0)}°`;
    } else {
      pOver.style.display = 'none';
      document.getElementById('w07-deg-b').innerText = '待測量';
      document.getElementById('w07-deg-o').innerText = '待測量';
    }

    // 導引條更新
    const guideTag = document.getElementById('w07-guide-tag');
    const guideTitle = document.getElementById('w07-guide-title');
    const guideText = document.getElementById('w07-guide-text');
    const guideSub = document.getElementById('w07-guide-sub');
    const diff = Math.abs(bDeg - oDeg).toFixed(0);

    if (this.state.mission === 'pk') {
      guideTitle.innerText = '任務一：迷思對決 (1/3 藍片 vs 1/5 綠片)';

      if (!this.state.overlaid) {
        guideTag.className = 'guide-step-tag';
        guideTag.innerText = '👨‍🏫 老師引導 ➔ 第 1 步 / 共 2 步';
        guideText.innerHTML = `小明堅稱：<strong>「5 大於 3，所以 1/5 塊披薩絕對比 1/3 塊更大！」</strong>請全班表決。然後請操作員點擊上方<strong>「💡 開啟透光投影對齊」</strong>！`;
        guideSub.innerText = '💡 目前尚未投影對齊，圓心角度數處於隱藏待測狀態。';
      } else {
        guideTag.className = 'guide-step-tag step-done';
        guideTag.innerText = '🎉 探究結論 ➔ 1/3 塊遠大於 1/5 塊！';
        guideText.innerHTML = `<strong>真相大白：1/3 (120°) 遠大於 1/5 (72°)！</strong>底層 1/3 披薩足足多出了 <strong>${diff}° 的藍色大翅膀</strong>！分母是平分人數，分給 5 個人，每人吃到的份額必然更小！`;
        guideSub.innerText = '🎯 教師金句：分子同為一，分母看人頭；分給人越多，每塊肉越小！';
      }

    } else if (this.state.mission === 'custom') {
      guideTitle.innerText = '任務二：自由選配切片對抗';

      if (!this.state.overlaid) {
        guideTag.className = 'guide-step-tag step-alert';
        guideTag.innerText = '👨‍🏫 老師引導 ➔ 自主挑選切片';
        guideText.innerHTML = `請操作員在上方挑選底層切片（1/2 或 1/4）與比對切片（1/6 或 1/8），然後點擊<strong>「💡 開啟透光投影對齊」</strong>！`;
        guideSub.innerText = '💡 讓學生自主選擇兩塊切片進行度數對抗。';
      } else {
        guideTag.className = 'guide-step-tag step-done';
        guideTag.innerText = '🎉 探究結論 ➔ 圓心角對抗揭秘';
        guideText.innerHTML = bDeg > oDeg
          ? `<strong>1/${b} 塊 (${bDeg.toFixed(0)}°) 大於 1/${o} 塊 (${oDeg.toFixed(0)}°)！</strong>多出 ${diff}°！分母越小（平分人數越少），切片越大！`
          : `<strong>1/${o} 塊 (${oDeg.toFixed(0)}°) 大於 1/${b} 塊 (${bDeg.toFixed(0)}°)！</strong>多出 ${diff}°！`;
        guideSub.innerText = '🎯 教師金句：分母越小塊越大，圓心角就是鐵證！';
      }

    } else if (this.state.mission === 'people') {
      guideTitle.innerText = '任務三：平分人數動態探究 (1~12人)';
      guideTag.className = 'guide-step-tag step-done';
      guideTag.innerText = '👨‍🏫 老師引導 ➔ 動態滑動觀察';
      guideText.innerHTML = `整張披薩平分給 <strong>${o} 個人</strong>，每人分得 1/${o} 塊，圓心角為 <strong>${oDeg.toFixed(0)}°</strong>。請拖動上方滑桿，觀察人越多切片會變成怎樣！`;
      guideSub.innerText = '💡 當人數增加到 12 人時，每塊披薩只剩細細的一條，直觀感受分母增大的縮小效應。';
    }

    if (window.ipadApp) {
      window.ipadApp.updateTeacherSummary(this.getTeacherSummary());
    }
  },

  destroy() {}
};
