/**
 * lab07.js - 第 7 週：【透明膠片披薩切割賽】 (LAB-W07-N-FRAC) - iPad 優化版
 * 數與運算 ｜ 推理 Reasoning ｜ 疊加披薩燈箱、大字號圓心角對抗、人數平分滑桿
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
    over: 5  // 1/5
  },

  getWorksheetGuide() {
    const bDeg = (360 / this.state.base).toFixed(1);
    const oDeg = (360 / this.state.over).toFixed(1);
    return {
      step1: `【工作紙第 1 題】：圓心角實測：1/${this.state.base} 是 <strong>${bDeg}°</strong>；1/${this.state.over} 是 <strong>${oDeg}°</strong>。1/${this.state.base} 比 1/${this.state.over} 多出 <strong>${Math.abs(bDeg - oDeg).toFixed(1)}°</strong>！`,
      step2: `【工作紙第 2 題】：大小比較：<strong>1/${this.state.base} ＞ 1/${this.state.over}</strong>。分母越大，份數越多，每份越小！`,
      quote: `🗣️ 【發言人說理】：我們組把 1/5 疊在 1/3 上，親眼看到 1/3 多出了一大塊！量圓心角 1/3 是 120°，1/5 只有 72°。事實證明：分母是平分的人數，分的人越多，每個人吃到的披薩就越小！`
    };
  },

  render(container) {
    this.container = container;
    this.state = { base: 3, over: 5 };

    container.innerHTML = `
      <div class="ipad-controls-bar">
        <div class="controls-left-group">
          <label style="font-weight:bold;">🍕 底層披薩片：</label>
          <button class="touch-btn primary" id="w07-btn-b3">1/3 藍片 (120°)</button>
          <button class="touch-btn" id="w07-btn-b2">1/2 半張 (180°)</button>
          <button class="touch-btn" id="w07-btn-b4">1/4 黃片 (90°)</button>
          
          <span style="font-weight:bold; margin-left:12px;">🧩 疊加比對切片：</span>
          <button class="touch-btn primary" id="w07-btn-o5">1/5 綠片 (72°)</button>
          <button class="touch-btn" id="w07-btn-o6">1/6 紫片 (60°)</button>
          <button class="touch-btn" id="w07-btn-o8">1/8 橙片 (45°)</button>
        </div>
      </div>

      <!-- 燈箱披薩對抗主舞台 -->
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

        <!-- 圓心角巨型對抗卡 -->
        <div style="display:flex; justify-content:center; align-items:center; gap:24px; margin-top:16px;">
          <div style="background:#eff6ff; border:2px solid #3b82f6; border-radius:10px; padding:8px 18px; text-align:center;">
            <div style="font-size:0.85rem; color:#1d4ed8; font-weight:bold;">底層：1/<span id="w07-txt-b">3</span></div>
            <div style="font-size:1.6rem; font-weight:900; color:#2563eb;" id="w07-deg-b">120°</div>
          </div>
          <div style="font-size:1.8rem; font-weight:900; color:#ef4444;">VS</div>
          <div style="background:#ecfdf5; border:2px solid #10b981; border-radius:10px; padding:8px 18px; text-align:center;">
            <div style="font-size:0.85rem; color:#047857; font-weight:bold;">疊加：1/<span id="w07-txt-o">5</span></div>
            <div style="font-size:1.6rem; font-weight:900; color:#059669;" id="w07-deg-o">72°</div>
          </div>
        </div>
      </div>

      <!-- 人數滑桿 -->
      <div class="ipad-controls-bar" style="background:#fff; margin-top:12px;">
        <label style="font-weight:bold;">👨‍👩‍👧‍👦 平分人數動態探究：分給 <strong id="w07-k-txt" style="color:#ef4444; font-size:1.2rem;">5</strong> 個人 ➔ 每人得到 1/<span id="w07-k-frac">5</span> 塊</label>
        <input type="range" class="touch-slider" id="w07-k-slider" min="1" max="12" value="5" step="1" style="width:240px;">
      </div>

      <div id="w07-verdict" style="margin-top:10px; background:#ecfdf5; border:1.5px solid #86efac; border-radius:10px; padding:12px 16px; font-size:0.95rem; color:#065f46;"></div>
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

    const kSlider = document.getElementById('w07-k-slider');
    if (kSlider) {
      kSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        this.state.over = val;
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
    document.getElementById('w07-deg-b').innerText = `${bDeg.toFixed(0)}°`;
    document.getElementById('w07-deg-o').innerText = `${oDeg.toFixed(0)}°`;

    document.getElementById('w07-p-base').setAttribute('d', this.getPath(130, 0, bDeg));
    document.getElementById('w07-p-over').setAttribute('d', this.getPath(130, 0, oDeg));

    const verdict = document.getElementById('w07-verdict');
    const diff = Math.abs(bDeg - oDeg).toFixed(0);

    if (bDeg > oDeg) {
      verdict.style.background = '#ecfdf5';
      verdict.style.borderColor = '#86efac';
      verdict.style.color = '#065f46';
      verdict.innerHTML = `🎉 <strong>真相大白：1/${b} 塊遠大於 1/${o} 塊！</strong>底層 1/${b} 披薩足足多出了 <strong>${diff}° 的藍色大翅膀</strong>！分母是平分人數，平分給 ${o} 個人，每人吃到的必然更少！`;
    } else if (bDeg < oDeg) {
      verdict.style.background = '#eff6ff';
      verdict.style.borderColor = '#bfdbfe';
      verdict.style.color = '#1e40af';
      verdict.innerHTML = `🍕 <strong>1/${o} 塊更大！</strong>因為分給 ${o} 個人（人數更少），每份圓心角多出了 ${diff}°！`;
    }

    if (window.ipadApp) {
      window.ipadApp.updateWorksheetGuide(this.getWorksheetGuide());
    }
  },

  destroy() {}
};
