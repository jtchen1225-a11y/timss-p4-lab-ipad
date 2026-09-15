/**
 * lab03.js - 第 3 週：【魔術折紙與雙尺滑行】 (LAB-W03-MG-LINE) - iPad 優化版
 * 測量與幾何 ｜ 知識 Knowing ｜ 大觸控滑動三角板、角度旋轉、4步驟折紙
 */

window.TIMSS_LABS = window.TIMSS_LABS || {};

window.TIMSS_LABS['W03'] = {
  id: 'W03',
  code: 'LAB-W03-MG-LINE',
  title: '魔術折紙與雙尺滑行',
  domain: '測量與幾何 M&G',
  domainType: 'mg',
  cognitive: '知識 Knowing',
  question: '兩條傾斜的鐵軌看起來斜斜的，怎麼向小明證明它們無限延長真的永遠不會相撞？折紙怎樣生出直角？',
  activeRole: '🔴 操作員(D) 滑動三角板 ➔ 🟣 質疑員(A) 旋轉傾角驗證不相交',

  state: {
    tab: 'ruler',
    angle: 20,
    pos: 180,
    showCaliper: true,
    origamiStep: 0
  },

  getWorksheetGuide() {
    return {
      step1: `【工作紙第 1 題】：雙尺滑動繪出的斜線：左端垂直距離 <strong>4.5 cm</strong>、中間 <strong>4.5 cm</strong>、右端 <strong>4.5 cm</strong>。結論：<strong>處處等距，兩線互相平行 (∥)</strong>。`,
      step2: `【工作紙第 2 題】：折紙實驗：兩次對折展開後，兩條折痕互相 <strong>垂直 (⊥)</strong>，夾角測量為 <strong>90° (直角)</strong>。`,
      quote: `🗣️ 【發言人說理】：我們組用雙尺滑動法畫出斜線，實測左、中、右三處垂直寬度都是 4.5 cm！處處等距，永不相交，所以百分之百是平行線！平行只看距離是否處處相等，與線條斜不斜無關！`
    };
  },

  render(container) {
    this.container = container;
    this.state = { tab: 'ruler', angle: 20, pos: 180, showCaliper: true, origamiStep: 0 };

    container.innerHTML = `
      <div class="ipad-controls-bar">
        <div class="controls-left-group">
          <button class="touch-btn primary" id="w03-tab-ruler">📐 實驗一：雙尺滑動平行線</button>
          <button class="touch-btn" id="w03-tab-origami">📄 實驗二：魔術折紙生直角</button>
        </div>
      </div>

      <!-- 實驗一：雙尺滑動舞台 -->
      <div id="w03-view-ruler">
        <div class="ipad-controls-bar" style="background:#f8fafc; border-color:#e2e8f0;">
          <div style="display:flex; align-items:center; gap:10px;">
            <label style="font-weight:bold;">🔄 旋轉底尺傾角：<span id="w03-angle-num" style="color:var(--primary); font-size:1.1rem;">20</span>°</label>
            <input type="range" class="touch-slider" id="w03-slider-angle" min="0" max="60" value="20" step="5">
          </div>
          <div style="display:flex; align-items:center; gap:10px;">
            <label style="font-weight:bold;">📐 平移三角板位置：</label>
            <input type="range" class="touch-slider" id="w03-slider-pos" min="60" max="320" value="180" step="10">
          </div>
          <button class="touch-btn" id="w03-btn-caliper">📏 切換 4.5cm 等距卡尺</button>
        </div>

        <div style="background:#fdfdfd; border:2px solid #cbd5e1; border-radius:12px; height:360px; position:relative; overflow:hidden;">
          <svg width="100%" height="360" viewBox="0 0 700 360" id="w03-svg">
            <g id="w03-rot" transform="rotate(20, 350, 190)">
              <!-- 底層導向直尺 -->
              <rect x="50" y="210" width="600" height="44" rx="6" fill="#fef08a" stroke="#ca8a04" stroke-width="2.5" />
              <g stroke="#854d0e" stroke-width="1.2">
                ${Array.from({ length: 58 }, (_, i) => `<line x1="${60 + i * 10}" y1="210" x2="${60 + i * 10}" y2="${i % 5 === 0 ? 224 : 217}" />`).join('')}
              </g>
              <text x="350" y="238" fill="#854d0e" font-size="13" font-weight="bold" text-anchor="middle">固定導向直尺 (Base Ruler)</text>

              <!-- 平行鐵軌線 1 與 2 -->
              <line x1="80" y1="120" x2="620" y2="120" stroke="#2563eb" stroke-width="4.5" />
              <text x="90" y="112" fill="#2563eb" font-size="12" font-weight="bold">鐵軌線 1</text>
              <line x1="80" y1="60" x2="620" y2="60" stroke="#2563eb" stroke-width="4.5" />
              <text x="90" y="52" fill="#2563eb" font-size="12" font-weight="bold">鐵軌線 2 (無限延長)</text>

              <!-- 三處等距卡尺 -->
              <g id="w03-calipers-g">
                <line x1="160" y1="60" x2="160" y2="120" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="4,3" />
                <rect x="135" y="80" width="50" height="22" rx="4" fill="#fee2e2" stroke="#ef4444" />
                <text x="160" y="95" font-size="11" fill="#dc2626" font-weight="bold" text-anchor="middle">4.5 cm</text>

                <line x1="350" y1="60" x2="350" y2="120" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="4,3" />
                <rect x="325" y="80" width="50" height="22" rx="4" fill="#fee2e2" stroke="#ef4444" />
                <text x="350" y="95" font-size="11" fill="#dc2626" font-weight="bold" text-anchor="middle">4.5 cm</text>

                <line x1="540" y1="60" x2="540" y2="120" stroke="#ef4444" stroke-width="2.5" stroke-dasharray="4,3" />
                <rect x="515" y="80" width="50" height="22" rx="4" fill="#fee2e2" stroke="#ef4444" />
                <text x="540" y="95" font-size="11" fill="#dc2626" font-weight="bold" text-anchor="middle">4.5 cm</text>
              </g>

              <!-- 滑動三角板 -->
              <g id="w03-tri" transform="translate(180, 0)">
                <polygon points="100,210 220,210 100,50" fill="rgba(96, 165, 250, 0.6)" stroke="#1d4ed8" stroke-width="2.5" />
                <rect x="100" y="196" width="14" height="14" fill="none" stroke="#1d4ed8" stroke-width="2" />
                <text x="145" y="140" fill="#1e3a8a" font-size="12" font-weight="bold">滑動三角板</text>
              </g>
            </g>
          </svg>
        </div>

        <div style="margin-top:10px; background:#ecfdf5; border:1.5px solid #86efac; border-radius:10px; padding:10px 14px; font-size:0.9rem; color:#065f46;">
          ✅ <strong>幾何不變性：</strong>不論如何撥動傾角滑桿旋轉底尺，三角板滑動繪出的兩條斜線，左、中、右垂直距離恆為 <strong>4.5 cm</strong>！處處等距，永不相交！
        </div>
      </div>

      <!-- 實驗二：魔術折紙舞台 -->
      <div id="w03-view-origami" style="display:none;">
        <div class="ipad-controls-bar">
          <button class="touch-btn primary" id="w03-btn-ori-next">👉 下一步對折</button>
          <button class="touch-btn" id="w03-btn-ori-reset">🔄 展開原紙</button>
          <span id="w03-ori-status" style="font-weight:bold; color:#0284c7; font-size:0.95rem;">步驟 0：不規則平整紙張</span>
        </div>

        <div style="background:#f1f5f9; border-radius:12px; padding:24px; min-height:340px; display:flex; flex-direction:column; align-items:center; justify-content:center;">
          <div id="w03-ori-box" style="width:240px; height:240px; background:#fef08a; border:3px solid #ca8a04; position:relative; box-shadow:0 8px 20px rgba(0,0,0,0.15); transition:all 0.5s;"></div>
          <div id="w03-ori-desc" style="margin-top:16px; font-size:1rem; font-weight:bold; color:#1e293b;">
            步驟 0：拿一張不規則白紙（不需要正方形，任意形狀皆可）。
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

    bind('w03-tab-ruler', () => {
      this.state.tab = 'ruler';
      document.getElementById('w03-tab-ruler').className = 'touch-btn primary';
      document.getElementById('w03-tab-origami').className = 'touch-btn';
      document.getElementById('w03-view-ruler').style.display = 'block';
      document.getElementById('w03-view-origami').style.display = 'none';
      window.soundFx.click();
    });

    bind('w03-tab-origami', () => {
      this.state.tab = 'origami';
      document.getElementById('w03-tab-ruler').className = 'touch-btn';
      document.getElementById('w03-tab-origami').className = 'touch-btn primary';
      document.getElementById('w03-view-ruler').style.display = 'none';
      document.getElementById('w03-view-origami').style.display = 'block';
      window.soundFx.click();
      this.updateOrigami();
    });

    const angleSlider = document.getElementById('w03-slider-angle');
    if (angleSlider) {
      angleSlider.addEventListener('input', (e) => {
        this.state.angle = parseInt(e.target.value);
        document.getElementById('w03-angle-num').innerText = this.state.angle;
        const g = document.getElementById('w03-rot');
        if (g) g.setAttribute('transform', `rotate(${this.state.angle}, 350, 190)`);
      });
    }

    const posSlider = document.getElementById('w03-slider-pos');
    if (posSlider) {
      posSlider.addEventListener('input', (e) => {
        this.state.pos = parseInt(e.target.value);
        const tri = document.getElementById('w03-tri');
        if (tri) tri.setAttribute('transform', `translate(${this.state.pos}, 0)`);
      });
    }

    bind('w03-btn-caliper', () => {
      this.state.showCaliper = !this.state.showCaliper;
      const c = document.getElementById('w03-calipers-g');
      if (c) c.style.display = this.state.showCaliper ? 'block' : 'none';
      window.soundFx.click();
    });

    bind('w03-btn-ori-next', () => {
      this.state.origamiStep = (this.state.origamiStep + 1) % 4;
      window.soundFx.stampThud();
      this.updateOrigami();
    });

    bind('w03-btn-ori-reset', () => {
      this.state.origamiStep = 0;
      window.soundFx.click();
      this.updateOrigami();
    });
  },

  updateOrigami() {
    const box = document.getElementById('w03-ori-box');
    const desc = document.getElementById('w03-ori-desc');
    const status = document.getElementById('w03-ori-status');
    if (!box) return;

    if (this.state.origamiStep === 0) {
      status.innerText = '步驟 0：平整紙張';
      desc.innerHTML = '步驟 0：拿一張不規則白紙（任意形狀皆可，無需直角）。';
      box.style.width = '240px';
      box.style.height = '240px';
      box.innerHTML = '';
    } else if (this.state.origamiStep === 1) {
      status.innerText = '步驟 1：第一次橫向對折';
      desc.innerHTML = '步驟 1：沿任意直線將紙張橫向對折，壓出一條堅實的直折痕（底邊折線）。';
      box.style.width = '240px';
      box.style.height = '120px';
      box.innerHTML = '<div style="position:absolute; bottom:0; width:100%; height:4px; background:#ef4444;"></div>';
    } else if (this.state.origamiStep === 2) {
      status.innerText = '步驟 2：第二次對折（邊對邊完全重合）';
      desc.innerHTML = '步驟 2：將剛才壓出的底邊折痕對齊重疊進行第二次對折！保證兩條邊完全重疊！';
      box.style.width = '120px';
      box.style.height = '120px';
      box.innerHTML = '<div style="position:absolute; bottom:0; width:100%; height:4px; background:#ef4444;"></div><div style="position:absolute; left:0; width:4px; height:100%; background:#ef4444;"></div><span style="position:absolute; bottom:8px; left:20px; font-size:14px; font-weight:bold; color:#2563eb;">90° 直角</span>';
    } else if (this.state.origamiStep === 3) {
      status.innerText = '步驟 3：展開驗證直角！';
      desc.innerHTML = '🎉 <strong>奇蹟揭秘：</strong>展開紙張！兩條十字折痕將圓周 360° 均分為 4 份，360° ÷ 4 = 90°！折出來必是百分之百的直角與垂直線！';
      box.style.width = '240px';
      box.style.height = '240px';
      box.innerHTML = `
        <div style="position:absolute; top:118px; left:0; width:100%; height:4px; background:#ef4444;"></div>
        <div style="position:absolute; top:0; left:118px; width:4px; height:100%; background:#ef4444;"></div>
        <div style="position:absolute; top:122px; left:122px; width:20px; height:20px; border-bottom:3px solid #2563eb; border-right:3px solid #2563eb;"></div>
        <span style="position:absolute; top:130px; left:150px; font-size:14px; font-weight:bold; color:#2563eb;">90° 直角</span>
      `;
      window.soundFx.successFanfare();
    }
  },

  update() {
    if (window.ipadApp) {
      window.ipadApp.updateWorksheetGuide(this.getWorksheetGuide());
    }
  },

  destroy() {}
};
