/**
 * lab03.js - 第 3 週：【魔術折紙與雙尺滑行】 (LAB-W03-MG-LINE) - iPad 優化版
 * 教師引導 ➔ 學生主動探究 ➔ 任務切換立即歸零待測
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
    mission: 'ruler', // 'ruler', 'origami'
    angle: 20,
    pos: 100, // 初始在最左邊起點
    line2Drawn: false,
    calipersShown: false,
    origamiStep: 0
  },

  getTeacherSummary() {
    return {
      core: `<h4>💡 核心概念提煉</h4><p><strong>平行（∥）</strong>的本質特徵是：同一平面內兩直線之間的垂直距離<strong>處處相等</strong>，向兩端無限延伸永不相交。無論線條是水平、豎直還是傾斜，只要間距固定就是平行！<strong>垂直（⊥）</strong>的本質特徵是兩線相交夾角為 <strong>90°（直角）</strong>，折紙利用平角 180° 對折平分即可得到標準直角。</p>`,
      formula: `<h4>📐 核心幾何判定與定理</h4><p>• <strong>平行判定：</strong>左、中、右垂直間距 $d_1 = d_2 = d_3 = 4.5\\text{ cm}$（處處等距）$\\implies L_1 \\parallel L_2$<br>• <strong>垂直判定：</strong>平角 $180^\\circ$ 經二次對折均分 $\\implies$ 夾角為 $90^\\circ \\implies L_1 \\perp L_2$</p>`,
      quote: `🎯 <strong>教師總結金句：</strong>「平不平行看距離，處處等距即平行，斜著也是平行線；兩次對折分平角，九十度角定垂直！」`
    };
  },

  render(container) {
    this.container = container;
    this.state = {
      mission: 'ruler',
      angle: 20,
      pos: 100,
      line2Drawn: false,
      calipersShown: false,
      origamiStep: 0
    };

    container.innerHTML = `
      <!-- 任務切換列：點擊任何任務立即歸零 -->
      <div class="ipad-controls-bar">
        <div class="controls-left-group">
          <button class="touch-btn primary" id="w03-tab-ruler">📐 任務一：雙尺滑動平行線</button>
          <button class="touch-btn" id="w03-tab-origami">📄 任務二：魔術折紙生直角</button>
        </div>
        <button class="touch-btn" id="w03-btn-reset">🔄 當前任務歸零待測</button>
      </div>

      <!-- 👨‍🏫 教師引導與學生探究導引條 -->
      <div class="teacher-guide-banner" id="w03-guide-banner">
        <div class="guide-header-row">
          <span class="guide-step-tag" id="w03-guide-tag">👨‍🏫 老師引導 ➔ 第 1 步 / 共 3 步</span>
          <span class="guide-mission-title" id="w03-guide-title">任務一：雙尺滑動平行線</span>
        </div>
        <div class="guide-instruction-text" id="w03-guide-text">
          底尺固定，三角板在起始位置已畫好鐵軌 1。請操作員拖動<strong>【平移三角板】</strong>滑桿，將三角板向右滑動！
        </div>
        <div class="guide-hint-subtext" id="w03-guide-sub">
          💡 三角板初始在起點，第二條鐵軌尚未繪出，等待學生動手操作。
        </div>
      </div>

      <!-- 實驗一：雙尺滑動舞台 -->
      <div id="w03-view-ruler">
        <div class="ipad-controls-bar" style="background:#f8fafc; border-color:#e2e8f0;">
          <div style="display:flex; align-items:center; gap:8px;">
            <label style="font-weight:bold;">📐 平移三角板：</label>
            <input type="range" class="touch-slider" id="w03-slider-pos" min="100" max="320" value="100" step="10" style="width:160px;">
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <label style="font-weight:bold;">🔄 旋轉底尺傾角：<span id="w03-angle-num" style="color:var(--primary); font-size:1.1rem;">20</span>°</label>
            <input type="range" class="touch-slider" id="w03-slider-angle" min="0" max="50" value="20" step="5" style="width:130px;">
          </div>
          <div style="display:flex; gap:8px;">
            <button class="touch-btn primary" id="w03-btn-draw-line2">✏️ 沿邊畫第二條鐵軌</button>
            <button class="touch-btn" id="w03-btn-caliper">📏 卡尺測量間距</button>
          </div>
        </div>

        <div style="background:#fdfdfd; border:2px solid #cbd5e1; border-radius:12px; height:360px; position:relative; overflow:hidden;">
          <svg width="100%" height="360" viewBox="0 0 700 360" id="w03-svg">
            <g id="w03-rot" transform="rotate(20, 350, 190)">
              <!-- 底層固定導向直尺 -->
              <rect x="50" y="210" width="600" height="44" rx="6" fill="#fef08a" stroke="#ca8a04" stroke-width="2.5" />
              <g stroke="#854d0e" stroke-width="1.2">
                ${Array.from({ length: 58 }, (_, i) => `<line x1="${60 + i * 10}" y1="210" x2="${60 + i * 10}" y2="${i % 5 === 0 ? 224 : 217}" />`).join('')}
              </g>
              <text x="350" y="238" fill="#854d0e" font-size="13" font-weight="bold" text-anchor="middle">固定導向直尺 (緊壓在桌面上)</text>

              <!-- 平行鐵軌線 1 (基準線) -->
              <line x1="80" y1="120" x2="620" y2="120" stroke="#2563eb" stroke-width="4.5" stroke-linecap="round" />
              <text x="90" y="112" fill="#2563eb" font-size="12" font-weight="bold">鐵軌線 1 (起始邊線)</text>

              <!-- 平行鐵軌線 2 (等待學生動手繪出) -->
              <g id="w03-line2-g" style="display:none;">
                <line x1="80" y1="60" x2="620" y2="60" stroke="#059669" stroke-width="4.5" stroke-linecap="round" />
                <text x="90" y="52" fill="#059669" font-size="12" font-weight="bold">鐵軌線 2 (沿平移三角板繪出)</text>
              </g>

              <!-- 三處等距卡尺 (等待學生動手呼叫) -->
              <g id="w03-calipers-g" style="display:none;">
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
              <g id="w03-tri" transform="translate(100, 0)">
                <polygon points="100,210 220,210 100,50" fill="rgba(96, 165, 250, 0.6)" stroke="#1d4ed8" stroke-width="2.5" />
                <rect x="100" y="196" width="14" height="14" fill="none" stroke="#1d4ed8" stroke-width="2" />
                <text x="145" y="140" fill="#1e3a8a" font-size="12" font-weight="bold">滑動三角板</text>
              </g>
            </g>
          </svg>
        </div>
      </div>

      <!-- 實驗二：魔術折紙舞台 -->
      <div id="w03-view-origami" style="display:none;">
        <div class="ipad-controls-bar">
          <button class="touch-btn primary" id="w03-btn-ori-next">👉 進行下一步對折</button>
          <button class="touch-btn" id="w03-btn-ori-reset">🔄 展開為原始紙張</button>
          <span id="w03-ori-status" style="font-weight:bold; color:#0284c7; font-size:0.95rem;">步驟 0：不規則平整紙張</span>
        </div>

        <div style="background:#f1f5f9; border-radius:12px; padding:24px; min-height:340px; display:flex; flex-direction:column; align-items:center; justify-content:center;">
          <div id="w03-ori-box" style="width:240px; height:240px; background:#fef08a; border:3px solid #ca8a04; position:relative; box-shadow:0 8px 20px rgba(0,0,0,0.15); transition:all 0.5s;"></div>
          <div id="w03-ori-desc" style="margin-top:16px; font-size:1rem; font-weight:bold; color:#1e293b;">
            步驟 0：拿一張不規則白紙（任意形狀皆可，無需直角）。
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
    bind('w03-tab-ruler', () => {
      this.state.mission = 'ruler';
      this.state.pos = 100;
      this.state.line2Drawn = false;
      this.state.calipersShown = false;
      this.updateTabs('w03-tab-ruler');
      document.getElementById('w03-view-ruler').style.display = 'block';
      document.getElementById('w03-view-origami').style.display = 'none';
      window.soundFx.click();
      this.update();
    });

    bind('w03-tab-origami', () => {
      this.state.mission = 'origami';
      this.state.origamiStep = 0;
      this.updateTabs('w03-tab-origami');
      document.getElementById('w03-view-ruler').style.display = 'none';
      document.getElementById('w03-view-origami').style.display = 'block';
      window.soundFx.click();
      this.updateOrigami();
      this.update();
    });

    bind('w03-btn-reset', () => {
      if (this.state.mission === 'ruler') {
        this.state.pos = 100;
        this.state.line2Drawn = false;
        this.state.calipersShown = false;
        document.getElementById('w03-slider-pos').value = '100';
      } else {
        this.state.origamiStep = 0;
        this.updateOrigami();
      }
      window.soundFx.click();
      this.update();
    });

    // 滑桿平移
    const posSlider = document.getElementById('w03-slider-pos');
    if (posSlider) {
      posSlider.addEventListener('input', (e) => {
        this.state.pos = parseInt(e.target.value);
        const tri = document.getElementById('w03-tri');
        if (tri) tri.setAttribute('transform', `translate(${this.state.pos}, 0)`);
        this.update();
      });
    }

    // 傾角旋轉
    const angleSlider = document.getElementById('w03-slider-angle');
    if (angleSlider) {
      angleSlider.addEventListener('input', (e) => {
        this.state.angle = parseInt(e.target.value);
        document.getElementById('w03-angle-num').innerText = this.state.angle;
        const g = document.getElementById('w03-rot');
        if (g) g.setAttribute('transform', `rotate(${this.state.angle}, 350, 190)`);
      });
    }

    // 畫第二條軌
    bind('w03-btn-draw-line2', () => {
      this.state.line2Drawn = true;
      const l2 = document.getElementById('w03-line2-g');
      if (l2) l2.style.display = 'block';
      window.soundFx.balanceChime();
      this.update();
    });

    // 卡尺測量
    bind('w03-btn-caliper', () => {
      if (!this.state.line2Drawn) {
        window.soundFx.tiltBuzz();
        alert('請先點擊「✏️ 沿邊畫第二條鐵軌」，再使用卡尺測量！');
        return;
      }
      this.state.calipersShown = !this.state.calipersShown;
      const c = document.getElementById('w03-calipers-g');
      if (c) c.style.display = this.state.calipersShown ? 'block' : 'none';
      window.soundFx.stampThud();
      this.update();
    });

    // 折紙按鈕
    bind('w03-btn-ori-next', () => {
      this.state.origamiStep = (this.state.origamiStep + 1) % 4;
      window.soundFx.stampThud();
      this.updateOrigami();
      this.update();
    });

    bind('w03-btn-ori-reset', () => {
      this.state.origamiStep = 0;
      window.soundFx.click();
      this.updateOrigami();
      this.update();
    });
  },

  updateTabs(activeId) {
    ['w03-tab-ruler', 'w03-tab-origami'].forEach(id => {
      const b = document.getElementById(id);
      if (b) {
        if (id === activeId) b.classList.add('primary');
        else b.classList.remove('primary');
      }
    });
  },

  update() {
    const guideTag = document.getElementById('w03-guide-tag');
    const guideTitle = document.getElementById('w03-guide-title');
    const guideText = document.getElementById('w03-guide-text');
    const guideSub = document.getElementById('w03-guide-sub');

    // 三角板位置更新
    const tri = document.getElementById('w03-tri');
    if (tri) tri.setAttribute('transform', `translate(${this.state.pos}, 0)`);

    const l2 = document.getElementById('w03-line2-g');
    if (l2) l2.style.display = this.state.line2Drawn ? 'block' : 'none';

    const c = document.getElementById('w03-calipers-g');
    if (c) c.style.display = this.state.calipersShown ? 'block' : 'none';

    if (this.state.mission === 'ruler') {
      guideTitle.innerText = '任務一：雙尺滑動平行線';

      if (this.state.pos < 160 && !this.state.line2Drawn) {
        guideTag.className = 'guide-step-tag';
        guideTag.innerText = '👨‍🏫 老師引導 ➔ 第 1 步 / 共 3 步';
        guideText.innerHTML = `底尺緊壓桌面固定，直角邊已畫出鐵軌 1。請操作員拖動上方<strong>【平移三角板】</strong>滑桿，將三角板向右滑動！`;
        guideSub.innerText = '💡 請學生觀察三角板是如何貼緊底尺平移滑動的。';
      } else if (!this.state.line2Drawn) {
        guideTag.className = 'guide-step-tag step-alert';
        guideTag.innerText = '👨‍🏫 老師引導 ➔ 第 2 步 / 共 3 步';
        guideText.innerHTML = `三角板已平移到位！請操作員點擊上方<strong>「✏️ 沿邊畫第二條鐵軌」</strong>，畫出第二條線段！`;
        guideSub.innerText = '💡 學生點擊後將沿著直角邊繪出綠色鐵軌線。';
      } else if (!this.state.calipersShown) {
        guideTag.className = 'guide-step-tag step-alert';
        guideTag.innerText = '👨‍🏫 老師引導 ➔ 第 3 步 / 共 3 步';
        guideText.innerHTML = `第二條鐵軌已畫出！看起來斜斜的，小明質疑無限延長會相交。請操作員點擊<strong>「📏 卡尺測量間距」</strong>檢驗垂直距離！`;
        guideSub.innerText = '💡 請全班大膽質疑：斜斜的線真的永遠不會相交嗎？';
      } else {
        guideTag.className = 'guide-step-tag step-done';
        guideTag.innerText = '🎉 探究結論 ➔ 處處等距即平行！';
        guideText.innerHTML = `<strong>左、中、右垂直間距處處相等 (4.5cm)！</strong>試著拖動【旋轉底尺傾角】滑桿，兩線始終等距，永遠不可能相交！`;
        guideSub.innerText = '🎯 教師金句：平不平行看距離，處處等距即平行，斜著也是平行線！';
      }

    } else {
      guideTitle.innerText = '任務二：魔術折紙生直角';

      if (this.state.origamiStep === 0) {
        guideTag.className = 'guide-step-tag';
        guideTag.innerText = '👨‍🏫 老師引導 ➔ 步驟 0：不規則原紙';
        guideText.innerHTML = `手頭只有一張不規則白紙（無直角、無標準邊）。小明不信不拿尺也能折出 90° 直角！請點擊<strong>「👉 進行下一步對折」</strong>！`;
        guideSub.innerText = '💡 任意不規則形狀皆可，無需正方形。';
      } else if (this.state.origamiStep === 1) {
        guideTag.className = 'guide-step-tag';
        guideTag.innerText = '👨‍🏫 老師引導 ➔ 步驟 1：第一次對折';
        guideText.innerHTML = `沿任意直線橫向對折，壓出一條堅實折痕！這條折線就是一條平角（180°）。請點擊<strong>「👉 進行下一步對折」</strong>！`;
        guideSub.innerText = '💡 兩次對折中的第一次：創造一條基準平角。';
      } else if (this.state.origamiStep === 2) {
        guideTag.className = 'guide-step-tag step-alert';
        guideTag.innerText = '👨‍🏫 老師引導 ➔ 步驟 2：邊對邊完全重疊！';
        guideText.innerHTML = `<strong>關鍵手法：</strong>將底邊折痕對齊重疊進行第二次對折！平角 180° 被正好平分！此時夾角已經是 90°！請點擊<strong>「👉 展開驗證直角」</strong>！`;
        guideSub.innerText = '💡 邊對邊重疊是將平角二等分的幾何保證。';
      } else {
        guideTag.className = 'guide-step-tag step-done';
        guideTag.innerText = '🎉 探究結論 ➔ 360° ÷ 4 ＝ 90°！';
        guideText.innerHTML = `<strong>十字折痕完美相交於 90° 直角！</strong>兩次對折將一週 360° 均分為 4 份，折出來必是百分之百的直角與垂直線！`;
        guideSub.innerText = '🎯 教師金句：兩次對折分平角，九十度角定垂直！';
      }
    }

    if (window.ipadApp) {
      window.ipadApp.updateTeacherSummary(this.getTeacherSummary());
    }
  },

  updateOrigami() {
    const box = document.getElementById('w03-ori-box');
    const desc = document.getElementById('w03-ori-desc');
    const status = document.getElementById('w03-ori-status');
    if (!box) return;

    if (this.state.origamiStep === 0) {
      status.innerText = '步驟 0：平整紙張';
      desc.innerHTML = '步驟 0：拿一張不規則白紙（任意形狀皆可，無需直角）。點擊「進行下一步對折」開始！';
      box.style.width = '240px';
      box.style.height = '240px';
      box.innerHTML = '';
    } else if (this.state.origamiStep === 1) {
      status.innerText = '步驟 1：第一次橫向對折';
      desc.innerHTML = '步驟 1：沿任意直線將紙張橫向對折，壓出一條堅實的直折痕（底邊折線，平角 180°）。';
      box.style.width = '240px';
      box.style.height = '120px';
      box.innerHTML = '<div style="position:absolute; bottom:0; width:100%; height:4px; background:#ef4444;"></div>';
    } else if (this.state.origamiStep === 2) {
      status.innerText = '步驟 2：第二次對折（邊對邊完全重疊）';
      desc.innerHTML = '步驟 2：將剛才壓出的底邊折痕對齊重疊進行第二次對折！平角 180° 被平分，得到直角！';
      box.style.width = '120px';
      box.style.height = '120px';
      box.innerHTML = '<div style="position:absolute; bottom:0; width:100%; height:4px; background:#ef4444;"></div><div style="position:absolute; left:0; width:4px; height:100%; background:#ef4444;"></div><span style="position:absolute; bottom:8px; left:20px; font-size:14px; font-weight:bold; color:#2563eb;">90° 直角</span>';
    } else if (this.state.origamiStep === 3) {
      status.innerText = '步驟 3：展開驗證直角！';
      desc.innerHTML = '🎉 <strong>奇蹟揭秘：</strong>展開紙張！兩條十字折痕將圓周 360° 均分為 4 份，360° ÷ 4 ＝ 90°！折出來必是百分之百的直角與垂直線！';
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

  destroy() {}
};
