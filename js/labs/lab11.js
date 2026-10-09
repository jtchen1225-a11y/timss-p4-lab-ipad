/**
 * lab11.js - 第 11 週：【同周界不同面積反例大擂台】 (LAB-W11-MG-COUNTER) - iPad 優化版 (動手拉橡皮筋與反例擊碎戰書)
 * 測量與幾何 ｜ 推理 Reasoning ｜ 選項無劇透、雙釘子板自主選配、數格子驗證面積、粉碎戰書印章
 */

window.TIMSS_LABS = window.TIMSS_LABS || {};

window.TIMSS_LABS['W11'] = {
  id: 'W11',
  code: 'LAB-W11-MG-COUNTER',
  title: '同周界不同面積反例大擂台',
  domain: '測量與幾何 M&G',
  domainType: 'mg',
  cognitive: '推理 Reasoning',
  question: '小明向全班下戰書：『周界都是 16cm 的長方形，面積肯定一模一樣！誰能拉出反例打破我的戰書？』',
  activeRole: '🔴 操作員(D) 拉橡皮筋打擂 ➔ 🟣 質疑員(A) 審查反例證據並蓋章',

  state: {
    fA: '7x1',
    fB: '5x3',
    counted: false, // 是否已點擊數格子揭曉面積
    smashed: false
  },

  getTeacherSummary() {
    const a = this.parse(this.state.fA);
    const b = this.parse(this.state.fB);
    return {
      core: `<h4>💡 核心概念提煉</h4><p>周界（一維線段長度 cm）與面積（二維平面覆蓋 $\\text{cm}^2$）是本質截然不同的幾何度量。在數學科學論證中，要駁倒一個偽命題「周界相等則面積必相等」，<strong>只需構造出一個反例（反例構造法）</strong>。周界固定時，長寬越懸殊面積越小，長寬越接近面積越大！</p>`,
      formula: `<h4>📐 核心擂台反例數據</h4><p>• <strong>選手 A（${a.L}×${a.W}）：</strong>周界 $(${a.L}+${a.W})\\times 2 = \\mathbf{${a.P}\\text{ cm}}$ ｜ 面積 $${a.L}\\times${a.W} = \\mathbf{${a.A}\\text{ cm}^2}$<br>• <strong>選手 B（${b.L}×${b.W}）：</strong>周界 $(${b.L}+${b.W})\\times 2 = \\mathbf{${b.P}\\text{ cm}}$ ｜ 面積 $${b.L}\\times${b.W} = \\mathbf{${b.A}\\text{ cm}^2}$<br>• <strong>科學判決：</strong>${a.P}\\text{cm} = ${b.P}\\text{cm}$，但 ${a.A}\\text{cm}^2 \\neq ${b.A}\\text{cm}^2$（反例鐵證如山，偽命題徹底擊碎！）</p>`,
      quote: `🎯 <strong>教師總結金句：</strong>「周長是一維線長，面積是二維面廣；一個反例破偽命，長寬越近面越大！」`
    };
  },

  render(container) {
    this.container = container;
    this.state = { fA: '7x1', fB: '5x3', counted: false, smashed: false };

    container.innerHTML = `
      <div class="ipad-controls-bar">
        <div class="controls-left-group">
          <label style="font-weight:bold;">🔴 選手 A 尺寸：</label>
          <select id="w11-sel-a" style="padding:6px 12px; font-size:0.95rem; font-weight:bold; border-radius:8px; border:1.5px solid #cbd5e1;">
            <option value="7x1" selected>長 7 cm，寬 1 cm</option>
            <option value="6x2">長 6 cm，寬 2 cm</option>
            <option value="5x3">長 5 cm，寬 3 cm</option>
            <option value="4x4">長 4 cm，寬 4 cm (正方形)</option>
          </select>

          <label style="font-weight:bold; margin-left:12px;">🔵 選手 B 尺寸：</label>
          <select id="w11-sel-b" style="padding:6px 12px; font-size:0.95rem; font-weight:bold; border-radius:8px; border:1.5px solid #cbd5e1;">
            <option value="7x1">長 7 cm，寬 1 cm</option>
            <option value="6x2">長 6 cm，寬 2 cm</option>
            <option value="5x3" selected>長 5 cm，寬 3 cm</option>
            <option value="4x4">長 4 cm，寬 4 cm (正方形)</option>
          </select>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="touch-btn primary" id="w11-btn-count">📐 數格子計算面積</button>
          <button class="touch-btn danger" id="w11-btn-smash" style="font-size:1.05rem;">🔨 蓋章粉碎小明戰書！</button>
        </div>
      </div>

      <!-- 戰書橫幅與蓋章印記 -->
      <div style="background:#fff1f2; border:2px dashed #f43f5e; border-radius:12px; padding:12px 18px; margin-bottom:12px; position:relative; overflow:hidden;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <strong style="color:#be123c; font-size:1.05rem;">📜 小明戰書：『周界都是 16cm 的長方形，面積肯定一模一樣！』</strong>
          <span id="w11-challenge-badge" style="background:#f43f5e; color:white; font-size:0.8rem; padding:3px 10px; border-radius:12px; font-weight:bold;">擂台等待擊碎</span>
        </div>
        <div id="w11-stamp" class="smash-stamp-badge">💥 反例成立！戰書粉碎！</div>
      </div>

      <!-- 雙釘子板大對決 -->
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
        <!-- A -->
        <div style="background:white; border:2.5px solid #ef4444; border-radius:14px; padding:14px; display:flex; flex-direction:column; align-items:center;">
          <h4 style="color:#dc2626; margin-bottom:10px; font-size:1.1rem;" id="w11-t-a">🔴 選手 A：長 7 寬 1</h4>
          <div class="ipad-geoboard-box">
            <svg width="220" height="220" viewBox="0 0 220 220" id="w11-svg-a"></svg>
          </div>
          <div style="margin-top:12px; text-align:center;">
            <div style="font-size:0.9rem; color:#475569;">周界：(7+1)×2 ＝ <strong style="color:#0f172a; font-size:1.1rem;">16 cm</strong></div>
            <div style="font-size:1.4rem; font-weight:900; color:#dc2626;">面積：<span id="w11-a-val">待數格子</span></div>
          </div>
        </div>

        <!-- B -->
        <div style="background:white; border:2.5px solid #2563eb; border-radius:14px; padding:14px; display:flex; flex-direction:column; align-items:center;">
          <h4 style="color:#1d4ed8; margin-bottom:10px; font-size:1.1rem;" id="w11-t-b">🔵 選手 B：長 5 寬 3</h4>
          <div class="ipad-geoboard-box">
            <svg width="220" height="220" viewBox="0 0 220 220" id="w11-svg-b"></svg>
          </div>
          <div style="margin-top:12px; text-align:center;">
            <div style="font-size:0.9rem; color:#475569;">周界：(5+3)×2 ＝ <strong style="color:#0f172a; font-size:1.1rem;">16 cm</strong></div>
            <div style="font-size:1.4rem; font-weight:900; color:#2563eb;">面積：<span id="w11-b-val">待數格子</span></div>
          </div>
        </div>
      </div>

      <div id="w11-verdict" style="margin-top:12px; background:#eff6ff; border:1.5px solid #bfdbfe; border-radius:10px; padding:12px 16px; font-size:0.95rem; color:#1e40af;"></div>
    `;

    this.bindEvents();
    this.update();
  },

  parse(key) {
    const [L, W] = key.split('x').map(Number);
    return { L, W, P: (L + W) * 2, A: L * W };
  },

  bindEvents() {
    const selA = document.getElementById('w11-sel-a');
    const selB = document.getElementById('w11-sel-b');
    const btnCount = document.getElementById('w11-btn-count');
    const btnSmash = document.getElementById('w11-btn-smash');

    if (selA) {
      selA.addEventListener('change', (e) => {
        this.state.fA = e.target.value;
        this.state.counted = false;
        this.state.smashed = false;
        window.soundFx.rubberSnap();
        this.update();
      });
    }

    if (selB) {
      selB.addEventListener('change', (e) => {
        this.state.fB = e.target.value;
        this.state.counted = false;
        this.state.smashed = false;
        window.soundFx.rubberSnap();
        this.update();
      });
    }

    if (btnCount) {
      btnCount.addEventListener('click', () => {
        this.state.counted = true;
        window.soundFx.click();
        this.update();
      });
    }

    if (btnSmash) {
      btnSmash.addEventListener('click', () => {
        const a = this.parse(this.state.fA);
        const b = this.parse(this.state.fB);
        if (a.A === b.A) {
          window.soundFx.tiltBuzz();
          alert('兩位選手面積相同，無法作為反例！請選擇不同長寬組合進行挑戰！');
          return;
        }
        this.state.counted = true;
        this.state.smashed = true;
        window.soundFx.stampThud();
        setTimeout(() => window.soundFx.successFanfare(), 300);
        document.getElementById('w11-stamp')?.classList.add('show');
        this.update();
      });
    }
  },

  drawGeoboard(svgId, L, W, color) {
    const svg = document.getElementById(svgId);
    if (!svg) return;
    const spacing = 24;
    const startX = 20;
    const startY = 20;

    let html = `
      <rect x="${startX}" y="${startY}" width="${L * spacing}" height="${W * spacing}" fill="${color}" fill-opacity="0.25" stroke="${color}" stroke-width="4.5" rx="3" />
    `;

    for (let r = 0; r < W; r++) {
      for (let c = 0; c < L; c++) {
        html += `<rect x="${startX + c * spacing}" y="${startY + r * spacing}" width="${spacing}" height="${spacing}" fill="none" stroke="${color}" stroke-width="0.8" stroke-dasharray="2,2" />`;
      }
    }

    for (let r = 0; r <= 8; r++) {
      for (let c = 0; c <= 8; c++) {
        html += `<circle cx="${startX + c * spacing}" cy="${startY + r * spacing}" r="4" fill="#475569" stroke="#1e293b" stroke-width="1.5" />`;
      }
    }

    svg.innerHTML = html;
  },

  update() {
    const a = this.parse(this.state.fA);
    const b = this.parse(this.state.fB);

    document.getElementById('w11-t-a').innerText = `🔴 選手 A：長 ${a.L} cm 寬 ${a.W} cm`;
    document.getElementById('w11-t-b').innerText = `🔵 選手 B：長 ${b.L} cm 寬 ${b.W} cm`;

    const aVal = document.getElementById('w11-a-val');
    const bVal = document.getElementById('w11-b-val');
    if (this.state.counted) {
      aVal.innerText = `${a.A} cm² (${a.L}×${a.W})`;
      bVal.innerText = `${b.A} cm² (${b.L}×${b.W})`;
    } else {
      aVal.innerText = '❓ 待數格子';
      bVal.innerText = '❓ 待數格子';
    }

    this.drawGeoboard('w11-svg-a', a.L, a.W, '#ef4444');
    this.drawGeoboard('w11-svg-b', b.L, b.W, '#2563eb');

    const stamp = document.getElementById('w11-stamp');
    if (!this.state.smashed && stamp) stamp.classList.remove('show');

    const v = document.getElementById('w11-verdict');
    if (this.state.smashed) {
      v.style.background = '#ecfdf5';
      v.style.borderColor = '#86efac';
      v.style.color = '#065f46';
      v.innerHTML = `🥊 <strong>反例成立！戰書徹底粉碎！</strong>選手 A 與 B 周界完全相同（<strong>都是 16 cm</strong>），但選手 A 面積只有 <strong>${a.A} cm²</strong>，選手 B 面積高達 <strong>${b.A} cm²</strong>！<strong>${a.A} ≠ ${b.A}</strong>！在科學論證中，只要構造出 1 個反例，偽命題就被徹底推翻！`;
    } else if (this.state.counted) {
      if (a.A !== b.A) {
        v.style.background = '#fffbeb';
        v.style.borderColor = '#fde68a';
        v.style.color = '#92400e';
        v.innerHTML = `🔍 <strong>數格子發現：</strong>選手 A 面積為 <strong>${a.A} cm²</strong>，選手 B 面積為 <strong>${b.A} cm²</strong>！兩者周界都是 16 cm，面積卻不相等！請點擊上方<strong>「🔨 蓋章粉碎小明戰書」</strong>！`;
      } else {
        v.style.background = '#eff6ff';
        v.style.borderColor = '#bfdbfe';
        v.style.color = '#1e40af';
        v.innerHTML = `⚠️ 兩位選手目前長寬相同，面積皆為 ${a.A} cm²。請在上方下拉選單切換不同尺寸尋找反例！`;
      }
    } else {
      v.style.background = '#f8fafc';
      v.style.borderColor = '#cbd5e1';
      v.style.color = '#475569';
      v.innerHTML = `👉 <strong>動手探究：</strong>請在上方下拉選單選擇不同長寬組合（周界皆為 16cm），然後點擊<strong>「📐 數格子計算面積」</strong>！`;
    }

    if (window.ipadApp) {
      window.ipadApp.updateTeacherSummary(this.getTeacherSummary());
    }
  },

  destroy() {}
};
