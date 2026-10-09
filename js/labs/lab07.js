/**
 * lab07.js - 第 7 週：【透明膠片披薩切割賽】 (LAB-W07-N-FRAC) - iPad 優化版
 * 教師引導 ➔ 學生主動探究 ➔ 任務切換立即歸零待測 ➔ 資優延伸探究 (真分數多切片 PK)
 */

window.TIMSS_LABS = window.TIMSS_LABS || {};

window.TIMSS_LABS['W07'] = {
  id: 'W07',
  code: 'LAB-W07-N-FRAC',
  title: '透明膠片披薩切割賽',
  domain: '數與運算 Number',
  domainType: 'number',
  cognitive: '認識 Knowing',
  question: '小明認為「5 比 3 大，所以 1/5 塊披薩肯定比 1/3 塊更大」。如何用透明幾何膠片疊加投影，打破這個直覺迷思？',
  activeRole: '🔴 操作員(D) 疊加透明膠片 ➔ 🟣 質疑員(A) 挑戰分母越大塊越小的原理',

  state: {
    mission: 'pk', // 'pk', 'custom', 'people', 'extend'
    base: 3,
    baseNum: 1,
    over: 5,
    overNum: 1,
    overlaid: false
  },

  getTeacherSummary() {
    const bDeg = (360 * (this.state.baseNum || 1)) / this.state.base;
    const oDeg = (360 * (this.state.overNum || 1)) / this.state.over;
    return {
      core: `<h4>💡 核心概念提煉</h4><p>在分數意義中，<strong>分母表示把整體平分成的總份數</strong>。分母越大，代表分的人越多，每一份的份額（圓心角）反而越小。當分子均為 1 時，分母與份額呈嚴格反比。對於一般真分數 $\\frac{a}{b}$，其幾何大小由圓心角 $\\theta = 360^\\circ \\times \\frac{a}{b}$ 唯一決定。</p>`,
      formula: `<h4>📐 核心圓心角幾何模型與不等式</h4><p>• <strong>圓心角公式：</strong>$\\theta = 360^\\circ \\times \\frac{\\text{分子}}{\\text{分母}}$<br>• <strong>實測數據：</strong>底層扇形角為 <strong>${bDeg.toFixed(0)}°</strong> ｜ 比對扇形角為 <strong>${oDeg.toFixed(0)}°</strong><br>• <strong>真諦：</strong>幾何疊加投影讓分數大小看得見、摸得著，徹底粉碎整數大小遷移的思維定勢！</p>`,
      quote: `🎯 <strong>教師總結金句：</strong>「分子同為一，分母看人頭；分給人越多，每塊肉越小；分母越小塊越大！」`
    };
  },

  render(container) {
    this.container = container;
    this.state = { mission: 'pk', base: 3, baseNum: 1, over: 5, overNum: 1, overlaid: false };

    container.innerHTML = `
      <!-- 任務切換列：點擊任何任務立即歸零 -->
      <div class="ipad-controls-bar">
        <div class="controls-left-group">
          <button class="touch-btn primary" id="w07-tab-pk">🥊 任務一：迷思對決 (1/3 vs 1/5)</button>
          <button class="touch-btn" id="w07-tab-custom">🧩 任務二：自由選配單位分數</button>
          <button class="touch-btn" id="w07-tab-people">👨‍👩‍👧‍👦 任務三：平分人數動態探究 (1~12人)</button>
          <button class="touch-btn" id="w07-tab-extend">🚀 任務四：資優延伸探究 (真分數多切片PK)</button>
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

      <!-- 切片挑選控制列 (任務一與二) -->
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

      <!-- 資優延伸真分數控制列 (任務四專用) -->
      <div class="ipad-controls-bar" style="background:#f0fdf4; border:2px solid #86efac; display:none;" id="w07-extend-bar">
        <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap; width:100%;">
          <strong style="color:#166534;">🚀 真分數奧數挑戰：</strong>
          <button class="touch-btn primary" id="w07-ext-c1">🏆 挑戰一：2/3 vs 3/5</button>
          <button class="touch-btn" id="w07-ext-c2">🏆 挑戰二：3/4 vs 5/8</button>
          <button class="touch-btn success" id="w07-btn-overlay-ext" style="font-weight:800;">💡 開啟透光投影對齊</button>
        </div>
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
            <div style="font-size:0.85rem; color:#1d4ed8; font-weight:bold;" id="w07-lbl-b">底層：1/3 塊</div>
            <div style="font-size:1.6rem; font-weight:900; color:#2563eb;" id="w07-deg-b">待測量</div>
          </div>
          <div style="font-size:1.8rem; font-weight:900; color:#ef4444;">VS</div>
          <div style="background:#ecfdf5; border:2px solid #10b981; border-radius:10px; padding:8px 18px; text-align:center; min-width:130px;">
            <div style="font-size:0.85rem; color:#047857; font-weight:bold;" id="w07-lbl-o">比對：1/5 塊</div>
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
      this.state = { mission: 'pk', base: 3, baseNum: 1, over: 5, overNum: 1, overlaid: false };
      this.updateTabs('w07-tab-pk');
      document.getElementById('w07-selector-bar').style.display = 'flex';
      document.getElementById('w07-people-bar').style.display = 'none';
      document.getElementById('w07-extend-bar').style.display = 'none';
      this.updateSelectorButtons();
      window.soundFx.click();
      this.update();
    });

    bind('w07-tab-custom', () => {
      this.state = { mission: 'custom', base: 2, baseNum: 1, over: 4, overNum: 1, overlaid: false };
      this.updateTabs('w07-tab-custom');
      document.getElementById('w07-selector-bar').style.display = 'flex';
      document.getElementById('w07-people-bar').style.display = 'none';
      document.getElementById('w07-extend-bar').style.display = 'none';
      this.updateSelectorButtons();
      window.soundFx.click();
      this.update();
    });

    bind('w07-tab-people', () => {
      this.state = { mission: 'people', base: 1, baseNum: 1, over: 5, overNum: 1, overlaid: true };
      this.updateTabs('w07-tab-people');
      document.getElementById('w07-selector-bar').style.display = 'none';
      document.getElementById('w07-people-bar').style.display = 'flex';
      document.getElementById('w07-extend-bar').style.display = 'none';
      window.soundFx.click();
      this.update();
    });

    bind('w07-tab-extend', () => {
      this.state = { mission: 'extend', base: 3, baseNum: 2, over: 5, overNum: 3, overlaid: false };
      this.updateTabs('w07-tab-extend');
      document.getElementById('w07-selector-bar').style.display = 'none';
      document.getElementById('w07-people-bar').style.display = 'none';
      document.getElementById('w07-extend-bar').style.display = 'flex';
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
          this.state.baseNum = 1;
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
          this.state.overNum = 1;
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

    // 投影按鈕
    bind('w07-btn-overlay', () => {
      this.state.overlaid = !this.state.overlaid;
      if (this.state.overlaid) window.soundFx.balanceChime();
      else window.soundFx.click();
      this.update();
    });

    bind('w07-btn-overlay-ext', () => {
      this.state.overlaid = !this.state.overlaid;
      if (this.state.overlaid) window.soundFx.balanceChime();
      else window.soundFx.click();
      this.update();
    });

    // 任務四真分數預設切換
    bind('w07-ext-c1', () => {
      this.state.base = 3;
      this.state.baseNum = 2;
      this.state.over = 5;
      this.state.overNum = 3;
      this.state.overlaid = false;
      document.getElementById('w07-ext-c1')?.classList.add('primary');
      document.getElementById('w07-ext-c2')?.classList.remove('primary');
      window.soundFx.click();
      this.update();
    });

    bind('w07-ext-c2', () => {
      this.state.base = 4;
      this.state.baseNum = 3;
      this.state.over = 8;
      this.state.overNum = 5;
      this.state.overlaid = false;
      document.getElementById('w07-ext-c2')?.classList.add('primary');
      document.getElementById('w07-ext-c1')?.classList.remove('primary');
      window.soundFx.click();
      this.update();
    });

    // 人數滑桿
    const kSlider = document.getElementById('w07-k-slider');
    if (kSlider) {
      kSlider.addEventListener('input', (e) => {
        this.state.over = parseInt(e.target.value);
        this.state.overNum = 1;
        document.getElementById('w07-k-txt').innerText = this.state.over;
        document.getElementById('w07-k-frac').innerText = this.state.over;
        this.update();
      });
    }
  },

  updateTabs(activeId) {
    ['w07-tab-pk', 'w07-tab-custom', 'w07-tab-people', 'w07-tab-extend'].forEach(id => {
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
    const bN = this.state.baseNum || 1;
    const o = this.state.over;
    const oN = this.state.overNum || 1;
    const bDeg = (360 * bN) / b;
    const oDeg = (360 * oN) / o;

    const lblB = document.getElementById('w07-lbl-b');
    const lblO = document.getElementById('w07-lbl-o');
    if (lblB) lblB.innerText = `底層：${bN > 1 ? `${bN}/${b}` : `1/${b}`} 塊`;
    if (lblO) lblO.innerText = `比對：${oN > 1 ? `${oN}/${o}` : `1/${o}`} 塊`;

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
      guideTitle.innerText = '任務二：自由選配單位分數';

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

    } else if (this.state.mission === 'extend') {
      guideTitle.innerText = `任務四：資優延伸探究 (${bN}/${b} vs ${oN}/${o})`;

      if (!this.state.overlaid) {
        guideTag.className = 'guide-step-tag';
        guideTag.innerText = '🚀 資優探究 ➔ 真分數幾何對決';
        guideText.innerHTML = `比一比：<strong>${bN}/${b}</strong> 披薩 vs <strong>${oN}/${o}</strong> 披薩誰更大？請全班先心算通分，再點擊<strong>「💡 開啟透光投影對齊」</strong>實測！`;
        guideSub.innerText = '💡 考驗高階分數大小判斷能力。';
      } else {
        guideTag.className = 'guide-step-tag step-done';
        guideTag.innerText = '🎉 探究結論 ➔ 幾何疊加度數揭秘！';
        const winFrac = bDeg > oDeg ? `${bN}/${b}` : `${oN}/${o}`;
        const loseFrac = bDeg > oDeg ? `${oN}/${o}` : `${bN}/${b}`;
        const winDeg = Math.max(bDeg, oDeg).toFixed(0);
        const loseDeg = Math.min(bDeg, oDeg).toFixed(0);
        guideText.innerHTML = `<strong>${winFrac} (${winDeg}°) ＞ ${loseFrac} (${loseDeg}°)！</strong>圓心角多出了 <strong>${diff}°</strong>！幾何投影印證了通分結果，打破分子與分母的單一數字定勢！`;
        guideSub.innerText = '🎯 體會分子與分母共同決定分數大小的數學本質！';
      }
    }

    if (window.ipadApp) {
      window.ipadApp.updateTeacherSummary(this.getTeacherSummary());
    }
  },

  destroy() {}
};
