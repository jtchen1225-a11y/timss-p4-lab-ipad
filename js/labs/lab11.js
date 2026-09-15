/**
 * lab11.js - 第 11 週：【同周界不同面積反例大擂台】 (LAB-W11-MG-COUNTER) - iPad 優化版
 * 測量與幾何 ｜ 推理 Reasoning ｜ 雙釘子板對抗、粉碎戰書印章、反例構造法
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
    smashed: false
  },

  getWorksheetGuide() {
    const a = this.parse(this.state.fA);
    const b = this.parse(this.state.fB);
    return {
      step1: `【工作紙第 1 題】：反例選手 A (長 ${a.L} 寬 ${a.W})：周界 <strong>${a.P} cm</strong>，面積 <strong>${a.A} cm²</strong>。`,
      step2: `【工作紙第 2 題】：反例選手 B (長 ${b.L} 寬 ${b.W})：周界 <strong>${b.P} cm</strong>，面積 <strong>${b.A} cm²</strong>。結論：<strong>${a.P}cm ＝ ${b.P}cm，但 ${a.A} ≠ ${b.A}</strong>！`,
      quote: `🗣️ 【發言人說理】：我們組成功攻破小明戰書！反例證據：長 7 寬 1，周界 16cm，面積 7 cm²；長 5 寬 3，周界 16cm，面積 15 cm²。16cm 相同，但 7 ≠ 15！反例成立，戰書粉碎！`
    };
  },

  render(container) {
    this.container = container;
    this.state = { fA: '7x1', fB: '5x3', smashed: false };

    container.innerHTML = `
      <div class="ipad-controls-bar">
        <div class="controls-left-group">
          <label style="font-weight:bold;">🔴 選手 A：</label>
          <select id="w11-sel-a" style="padding:6px 12px; font-size:0.95rem; font-weight:bold; border-radius:8px; border:1.5px solid #cbd5e1;">
            <option value="7x1" selected>長 7 寬 1 (周界16, 面積7)</option>
            <option value="6x2">長 6 寬 2 (周界16, 面積12)</option>
            <option value="5x3">長 5 寬 3 (周界16, 面積15)</option>
            <option value="4x4">長 4 寬 4 (周界16, 面積16)</option>
          </select>

          <label style="font-weight:bold; margin-left:12px;">🔵 選手 B：</label>
          <select id="w11-sel-b" style="padding:6px 12px; font-size:0.95rem; font-weight:bold; border-radius:8px; border:1.5px solid #cbd5e1;">
            <option value="7x1">長 7 寬 1 (周界16, 面積7)</option>
            <option value="6x2">長 6 寬 2 (周界16, 面積12)</option>
            <option value="5x3" selected>長 5 寬 3 (周界16, 面積15)</option>
            <option value="4x4">長 4 寬 4 (周界16, 面積16)</option>
          </select>
        </div>
        <button class="touch-btn danger" id="w11-btn-smash" style="font-size:1.05rem;">🔨 粉碎小明戰書！</button>
      </div>

      <!-- 戰書橫幅與蓋章 -->
      <div style="background:#fff1f2; border:2px dashed #f43f5e; border-radius:12px; padding:12px 18px; margin-bottom:12px; position:relative;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <strong style="color:#be123c; font-size:1.05rem;">📜 小明戰書：『周界都是 16cm 的長方形，面積肯定一模一樣！』</strong>
          <span style="background:#f43f5e; color:white; font-size:0.8rem; padding:3px 10px; border-radius:12px; font-weight:bold;">擂台等待擊碎</span>
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
            <div style="font-size:0.9rem; color:#475569;">周界：<strong style="color:#0f172a; font-size:1.1rem;">16 cm</strong></div>
            <div style="font-size:1.5rem; font-weight:900; color:#dc2626;">面積：<span id="w11-a-val">7</span> cm²</div>
          </div>
        </div>

        <!-- B -->
        <div style="background:white; border:2.5px solid #2563eb; border-radius:14px; padding:14px; display:flex; flex-direction:column; align-items:center;">
          <h4 style="color:#1d4ed8; margin-bottom:10px; font-size:1.1rem;" id="w11-t-b">🔵 選手 B：長 5 寬 3</h4>
          <div class="ipad-geoboard-box">
            <svg width="220" height="220" viewBox="0 0 220 220" id="w11-svg-b"></svg>
          </div>
          <div style="margin-top:12px; text-align:center;">
            <div style="font-size:0.9rem; color:#475569;">周界：<strong style="color:#0f172a; font-size:1.1rem;">16 cm</strong></div>
            <div style="font-size:1.5rem; font-weight:900; color:#2563eb;">面積：<span id="w11-b-val">15</span> cm²</div>
          </div>
        </div>
      </div>

      <div id="w11-verdict" style="margin-top:12px; background:#ecfdf5; border:1.5px solid #86efac; border-radius:10px; padding:12px 16px; font-size:0.95rem; color:#065f46;"></div>
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
    const btnSmash = document.getElementById('w11-btn-smash');

    if (selA) {
      selA.addEventListener('change', (e) => {
        this.state.fA = e.target.value;
        this.state.smashed = false;
        window.soundFx.rubberSnap();
        this.update();
      });
    }

    if (selB) {
      selB.addEventListener('change', (e) => {
        this.state.fB = e.target.value;
        this.state.smashed = false;
        window.soundFx.rubberSnap();
        this.update();
      });
    }

    if (btnSmash) {
      btnSmash.addEventListener('click', () => {
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

    document.getElementById('w11-t-a').innerText = `🔴 選手 A：長 ${a.L} 寬 ${a.W}`;
    document.getElementById('w11-t-b').innerText = `🔵 選手 B：長 ${b.L} 寬 ${b.W}`;
    document.getElementById('w11-a-val').innerText = a.A;
    document.getElementById('w11-b-val').innerText = b.A;

    this.drawGeoboard('w11-svg-a', a.L, a.W, '#ef4444');
    this.drawGeoboard('w11-svg-b', b.L, b.W, '#2563eb');

    const stamp = document.getElementById('w11-stamp');
    if (!this.state.smashed && stamp) stamp.classList.remove('show');

    const v = document.getElementById('w11-verdict');
    if (a.A !== b.A) {
      v.style.background = '#ecfdf5';
      v.style.borderColor = '#86efac';
      v.style.color = '#065f46';
      v.innerHTML = `🥊 <strong>裁判裁決：反例成立！戰書徹底粉碎！</strong>選手 A 與 B 周界完全相同（<strong>都是 16 cm</strong>），但選手 A 面積只有 <strong>${a.A} cm²</strong>，選手 B 面積高達 <strong>${b.A} cm²</strong>！<strong>${a.A} ≠ ${b.A}</strong>！點擊上方<strong>「粉碎小明戰書」</strong>蓋章！`;
    } else {
      v.style.background = '#eff6ff';
      v.style.borderColor = '#bfdbfe';
      v.style.color = '#1e40af';
      v.innerHTML = `請在下拉選單選擇不同選手進行擂台對抗！`;
    }

    if (window.ipadApp) {
      window.ipadApp.updateWorksheetGuide(this.getWorksheetGuide());
    }
  },

  destroy() {}
};
