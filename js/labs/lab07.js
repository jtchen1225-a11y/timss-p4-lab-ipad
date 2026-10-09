/**
 * lab07.js - 第 7 週：【透明膠片披薩切割賽】 (LAB-W07-N-FRAC) - iPad 優化版 (動手疊加與透光投影)
 * 數與運算 ｜ 推理 Reasoning ｜ 淨空燈箱、自主選片疊加、圓心角投影揭秘、人數動態切片
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
    base: 3, // 1/3
    over: 5, // 1/5
    overlaid: false // 初始尚未疊加投影，等待學生動手！
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
    this.state = { base: 3, over: 5, overlaid: false };

    container.innerHTML = `
      <div class="ipad-controls-bar">
        <div class="controls-left-group">
          <label style="font-weight:bold;">🍕 選擇底層披薩：</label>
          <button class="touch-btn primary" id="w07-btn-b3">1/3 藍片</button>
          <button class="touch-btn" id="w07-btn-b2">1/2 半張</button>
          <button class="touch-btn" id="w07-btn-b4">1/4 黃片</button>
          
          <span style="font-weight:bold; margin-left:12px;">🧩 選擇比對切片：</span>
          <button class="touch-btn primary" id="w07-btn-o5">1/5 綠片</button>
          <button class="touch-btn" id="w07-btn-o6">1/6 紫片</button>
          <button class="touch-btn" id="w07-btn-o8">1/8 橙片</button>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="touch-btn success" id="w07-btn-overlay">💡 開啟透光投影對齊</button>
          <button class="touch-btn" id="w07-btn-reset">🔄 重置燈箱</button>
        </div>
      </div>

      <!-- 燈箱披薩主舞台 -->
      <div style="background:#f8fafc; border:2px solid #cbd5e1; border-radius:14px; padding:20px; display:flex; flex-direction:column; align-items:center;">
        <div style="width:300px; height:300px; border-radius:50%; background:radial-gradient(circle, #fff 40%, #f1f5f9 90%); border:4px solid #94a3b8; position:relative; box-shadow:0 0 30px rgba(59, 130, 246, 0.25);">
          <svg width="300" height="300" viewBox="-150 -150 300 300" id="w07-svg">
            <circle cx="0" cy="0" r="130" fill="none" stroke="#e2e8f0" stroke-width="2" stroke-dasharray="4,4" />
            <!-- 底層披薩 -->
            <path id="w07-p-base" fill="rgba(59, 130, 246, 0.55)" stroke="#1d4ed8" stroke-width="2.5" />
            <!-- 疊加披薩 (等待開啟投影) -->
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

      <!-- 人數平分動態探究滑桿 -->
      <div class="ipad-controls-bar" style="background:#fff; margin-top:12px;">
        <label style="font-weight:bold;">👨‍👩‍👧‍👦 平分人數動態探究：分給 <strong id="w07-k-txt" style="color:#ef4444; font-size:1.2rem;">5</strong> 個人 ➔ 每人得到 1/<span id="w07-k-frac">5</span> 塊</label>
        <input type="range" class="touch-slider" id="w07-k-slider" min="1" max="12" value="5" step="1" style="width:240px;">
      </div>

      <!-- 解釋反饋框 -->
      <div id="w07-verdict" style="margin-top:10px; background:#eff6ff; border:1.5px solid #bfdbfe; border-radius:10px; padding:12px 16px; font-size:0.95rem; color:#1e40af;"></div>
    `;

    this.bindEvents();
    this.update();
  },

  bindEvents() {
    const bindB = (id, val) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('click', () => {
          this.state.base = val;
          ['w07-btn-b2', 'w07-btn-b3', 'w07-btn-b4'].forEach(b => document.getElementById(b)?.classList.remove('primary'));
          el.classList.add('primary');
          window.soundFx.click();
          this.update();
        });
      }
    };

    const bindO = (id, val) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('click', () => {
          this.state.over = val;
          ['w07-btn-o5', 'w07-btn-o6', 'w07-btn-o8'].forEach(b => document.getElementById(b)?.classList.remove('primary'));
          el.classList.add('primary');
          const kSlider = document.getElementById('w07-k-slider');
          if (kSlider) kSlider.value = val;
          document.getElementById('w07-k-txt').innerText = val;
          document.getElementById('w07-k-frac').innerText = val;
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
    const btnOverlay = document.getElementById('w07-btn-overlay');
    if (btnOverlay) {
      btnOverlay.addEventListener('click', () => {
        this.state.overlaid = true;
        window.soundFx.balanceChime();
        this.update();
      });
    }

    // 重置
    const btnReset = document.getElementById('w07-btn-reset');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        this.state.base = 3;
        this.state.over = 5;
        this.state.overlaid = false;
        ['w07-btn-b2', 'w07-btn-b4'].forEach(b => document.getElementById(b)?.classList.remove('primary'));
        document.getElementById('w07-btn-b3')?.classList.add('primary');
        ['w07-btn-o6', 'w07-btn-o8'].forEach(b => document.getElementById(b)?.classList.remove('primary'));
        document.getElementById('w07-btn-o5')?.classList.add('primary');
        const kSlider = document.getElementById('w07-k-slider');
        if (kSlider) kSlider.value = 5;
        document.getElementById('w07-k-txt').innerText = 5;
        document.getElementById('w07-k-frac').innerText = 5;
        window.soundFx.click();
        this.update();
      });
    }

    const kSlider = document.getElementById('w07-k-slider');
    if (kSlider) {
      kSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        this.state.over = val;
        this.state.overlaid = true;
        document.getElementById('w07-k-txt').innerText = val;
        document.getElementById('w07-k-frac').innerText = val;
        window.soundFx.click();
        this.update();
      });
    }
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
      document.getElementById('w07-deg-b').innerText = '待投影';
      document.getElementById('w07-deg-o').innerText = '待投影';
    }

    const verdict = document.getElementById('w07-verdict');
    const diff = Math.abs(bDeg - oDeg).toFixed(0);

    if (!this.state.overlaid) {
      verdict.style.background = '#f8fafc';
      verdict.style.borderColor = '#cbd5e1';
      verdict.style.color = '#475569';
      verdict.innerHTML = `💡 <strong>披薩切片已就位：</strong>請點擊上方<strong>「💡 開啟透光投影對齊」</strong>，親眼比對 1/${b} 塊與 1/${o} 塊的大小與圓心角！`;
    } else if (bDeg > oDeg) {
      verdict.style.background = '#ecfdf5';
      verdict.style.borderColor = '#86efac';
      verdict.style.color = '#065f46';
      verdict.innerHTML = `🎉 <strong>真相大白：1/${b} 塊遠大於 1/${o} 塊！</strong>底層 1/${b} 披薩足足多出了 <strong>${diff}° 的藍色大翅膀</strong>！分母是平分人數，平分給 ${o} 個人，每人吃到的份額必然更小！`;
    } else if (bDeg < oDeg) {
      verdict.style.background = '#eff6ff';
      verdict.style.borderColor = '#bfdbfe';
      verdict.style.color = '#1e40af';
      verdict.innerHTML = `🍕 <strong>1/${o} 塊更大！</strong>因為分給 ${o} 個人（平分人數更少），每份圓心角多出了 <strong>${diff}°</strong>！`;
    } else {
      verdict.style.background = '#eff6ff';
      verdict.style.borderColor = '#bfdbfe';
      verdict.style.color = '#1e40af';
      verdict.innerHTML = `🍕 <strong>兩塊完全相等！</strong>都是平分為 ${b} 份，圓心角皆為 ${bDeg.toFixed(0)}°！`;
    }

    if (window.ipadApp) {
      window.ipadApp.updateTeacherSummary(this.getTeacherSummary());
    }
  },

  destroy() {}
};
