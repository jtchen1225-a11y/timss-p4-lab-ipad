/**
 * lab08.js - 第 8 週：【俄羅斯方塊變形獸】 (LAB-W08-MG-AREA) - iPad 優化版
 * 教師引導 ➔ 學生主動探究 ➔ 任務切換立即歸零待數 ➔ 資優延伸探究 (8 塊極限變形挑戰)
 */

window.TIMSS_LABS = window.TIMSS_LABS || {};

window.TIMSS_LABS['W08'] = {
  id: 'W08',
  code: 'LAB-W08-MG-AREA',
  title: '俄羅斯方塊變形獸',
  domain: '測量與幾何 Measurement & Geometry',
  domainType: 'geometry',
  cognitive: '認識 Knowing',
  question: '用 6 個相同的正方形方塊拼出不同圖形，它們的「面積」和「周界」會保持不變嗎？接縫到底偷走了多少長度？',
  activeRole: '🔴 操作員(D) 變換磁板方塊拼法 ➔ 🟢 發言人(B) 解密周界縮水真相',

  state: {
    mission: 'strip', // 'strip', 'rect', 'lshape', 'extend'
    extType: 'ext_rect', // 'ext_strip', 'ext_rect', 'ext_stair'
    showPerimeter: false,
    showSeams: false,
    blocks: []
  },

  getTeacherSummary() {
    return {
      core: `<h4>💡 核心概念提煉</h4><p>在平面幾何中，「<strong>面積守恆</strong>」指圖形只要由固定數量的等大方塊拼成，其面積永遠不變。但「<strong>周界並不守恆</strong>」！當方塊靠攏拼合時，相鄰的邊會重疊變成內部「<strong>內部接縫（肚裡藏邊）</strong>」。<strong>每形成 1 條接縫，就有 2 條邊被吞入內部</strong>，導致外露周界減少 2 個單位！</p>`,
      formula: `<h4>📐 核心接縫周界公式</h4><p>• <strong>獨立散裝總邊數：</strong>$4 \\times N$<br>• <strong>外露周界定理：</strong>$\\text{周界} = 4N - 2 \\times \\mathbf{(\\text{內部接縫數})}$<br>• <strong>極值結論：</strong>圖形越緊湊，內部接縫越多，吞掉的邊越多，外露周界越短！</p>`,
      quote: `🎯 <strong>教師總結金句：</strong>「拼塊不變面守恆，接縫一現吞兩邊；越是緊湊周越短，展開長蛇周界長！」`
    };
  },

  render(container) {
    this.container = container;
    this.state = { mission: 'strip', extType: 'ext_rect', showPerimeter: false, showSeams: false, blocks: [] };
    this.setPreset('strip');

    container.innerHTML = `
      <!-- 任務切換列：點擊任何任務立即歸零 -->
      <div class="ipad-controls-bar">
        <div class="controls-left-group">
          <button class="touch-btn primary" id="w08-tab-s">🐍 任務一：1×6 一字長蛇形</button>
          <button class="touch-btn" id="w08-tab-r">📦 任務二：2×3 緊湊矩形</button>
          <button class="touch-btn" id="w08-tab-l">🦎 任務三：L 形變形獸</button>
          <button class="touch-btn" id="w08-tab-ext">🚀 任務四：資優延伸探究 (8塊極限變形)</button>
        </div>
        <button class="touch-btn" id="w08-btn-reset">🔄 當前造型歸零待數</button>
      </div>

      <!-- 👨‍🏫 教師引導與學生探究導引條 -->
      <div class="teacher-guide-banner" id="w08-guide-banner">
        <div class="guide-header-row">
          <span class="guide-step-tag" id="w08-guide-tag">👨‍🏫 老師引導 ➔ 第 1 步 / 共 2 步</span>
          <span class="guide-mission-title" id="w08-guide-title">任務一：1×6 一字長蛇形</span>
        </div>
        <div class="guide-instruction-text" id="w08-guide-text">
          磁板上排出了 6 個方格的一字長蛇。面積恆為 6 格。請操作員點擊下方<strong>「🔍 掃描外露周界 (數外邊)」</strong>，親手數數外圍周界！
        </div>
        <div class="guide-hint-subtext" id="w08-guide-sub">
          💡 目前外圍周界處於隱藏待數狀態。
        </div>
      </div>

      <!-- 任務四專用子造型切換列 -->
      <div class="ipad-controls-bar" style="background:#f0fdf4; border:2px solid #86efac; display:none;" id="w08-ext-bar">
        <span style="font-weight:bold; color:#166534;">🚀 8 塊挑戰（面積恆為 8 格）：</span>
        <div style="display:flex; gap:8px;">
          <button class="touch-btn" id="w08-ext-b-strip">1×8 長條</button>
          <button class="touch-btn primary" id="w08-ext-b-rect">2×4 矩形 (最緊湊)</button>
          <button class="touch-btn" id="w08-ext-b-stair">階梯特殊形</button>
        </div>
      </div>

      <!-- 操作按鈕列 -->
      <div class="ipad-controls-bar" style="background:#f8fafc;">
        <span style="font-weight:bold; color:#334155;">動手探究工具：</span>
        <div style="display:flex; gap:10px;">
          <button class="touch-btn primary" id="w08-btn-scan">🔍 掃描外露周界 (數外邊)</button>
          <button class="touch-btn warning" id="w08-btn-seams">✂️ 透視「肚裡藏邊」接縫</button>
        </div>
      </div>

      <!-- 網格磁板主舞台 -->
      <div style="background:white; border:2px solid #cbd5e1; border-radius:14px; padding:20px; display:flex; flex-direction:column; align-items:center;">
        <svg width="520" height="300" viewBox="0 0 520 300" id="w08-svg">
          <defs>
            <pattern id="w08-pat" width="44" height="44" patternUnits="userSpaceOnUse">
              <rect width="44" height="44" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.2" />
            </pattern>
          </defs>
          <rect width="520" height="300" fill="url(#w08-pat)" rx="8" />
          <g id="w08-blocks-g"></g>
          <g id="w08-seams-g"></g>
        </svg>

        <!-- 面積與周界即時大對比 -->
        <div style="display:flex; justify-content:center; gap:24px; margin-top:16px; width:100%; max-width:640px;">
          <div style="flex:1; background:#ecfdf5; border:2.5px solid #10b981; border-radius:12px; padding:12px; text-align:center;">
            <div style="font-size:0.85rem; color:#065f46; font-weight:bold;">📦 總面積 (方塊個數)</div>
            <div style="font-size:1.8rem; font-weight:900; color:#059669;" id="w08-area-val">6 格 (守恆！)</div>
            <span style="font-size:0.8rem; color:#047857;" id="w08-area-cm">每格 2cm×2cm ＝ 24 cm²</span>
          </div>

          <div style="flex:1; background:#eff6ff; border:2.5px solid #3b82f6; border-radius:12px; padding:12px; text-align:center;">
            <div style="font-size:0.85rem; color:#1d4ed8; font-weight:bold;">🧶 外圍周界 (外露邊長)</div>
            <div style="font-size:1.8rem; font-weight:900; color:#2563eb;" id="w08-p-val">❓ 待數邊線</div>
            <span style="font-size:0.8rem; color:#1d4ed8;" id="w08-p-cm">點擊上方「掃描外露周界」揭曉</span>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
    this.update();
  },

  setPreset(type) {
    this.state.mission = type;
    if (type === 'strip') {
      this.state.blocks = [
        { r: 3, c: 3 }, { r: 3, c: 4 }, { r: 3, c: 5 },
        { r: 3, c: 6 }, { r: 3, c: 7 }, { r: 3, c: 8 }
      ];
    } else if (type === 'rect') {
      this.state.blocks = [
        { r: 2, c: 4 }, { r: 2, c: 5 }, { r: 2, c: 6 },
        { r: 3, c: 4 }, { r: 3, c: 5 }, { r: 3, c: 6 }
      ];
    } else if (type === 'lshape') {
      this.state.blocks = [
        { r: 1, c: 4 }, { r: 2, c: 4 }, { r: 3, c: 4 },
        { r: 4, c: 4 }, { r: 4, c: 5 }, { r: 4, c: 6 }
      ];
    } else if (type === 'ext_strip') {
      this.state.blocks = [
        { r: 3, c: 2 }, { r: 3, c: 3 }, { r: 3, c: 4 }, { r: 3, c: 5 },
        { r: 3, c: 6 }, { r: 3, c: 7 }, { r: 3, c: 8 }, { r: 3, c: 9 }
      ];
    } else if (type === 'ext_rect') {
      this.state.blocks = [
        { r: 2, c: 4 }, { r: 2, c: 5 }, { r: 2, c: 6 }, { r: 2, c: 7 },
        { r: 3, c: 4 }, { r: 3, c: 5 }, { r: 3, c: 6 }, { r: 3, c: 7 }
      ];
    } else if (type === 'ext_stair') {
      this.state.blocks = [
        { r: 1, c: 5 }, { r: 1, c: 6 },
        { r: 2, c: 4 }, { r: 2, c: 5 }, { r: 2, c: 6 }, { r: 2, c: 7 },
        { r: 3, c: 5 }, { r: 3, c: 6 }
      ];
    }
  },

  bindEvents() {
    const bind = (id, fn) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', fn);
    };

    // 任務切換：一律歸零待數！
    bind('w08-tab-s', () => {
      this.setPreset('strip');
      this.state.showPerimeter = false;
      this.state.showSeams = false;
      this.updateTabs('w08-tab-s');
      document.getElementById('w08-ext-bar').style.display = 'none';
      window.soundFx.stampThud();
      this.update();
    });

    bind('w08-tab-r', () => {
      this.setPreset('rect');
      this.state.showPerimeter = false;
      this.state.showSeams = false;
      this.updateTabs('w08-tab-r');
      document.getElementById('w08-ext-bar').style.display = 'none';
      window.soundFx.stampThud();
      this.update();
    });

    bind('w08-tab-l', () => {
      this.setPreset('lshape');
      this.state.showPerimeter = false;
      this.state.showSeams = false;
      this.updateTabs('w08-tab-l');
      document.getElementById('w08-ext-bar').style.display = 'none';
      window.soundFx.stampThud();
      this.update();
    });

    bind('w08-tab-ext', () => {
      this.setPreset('ext_rect');
      this.state.mission = 'extend';
      this.state.extType = 'ext_rect';
      this.state.showPerimeter = false;
      this.state.showSeams = false;
      this.updateTabs('w08-tab-ext');
      document.getElementById('w08-ext-bar').style.display = 'flex';
      window.soundFx.stampThud();
      this.update();
    });

    bind('w08-btn-reset', () => {
      this.state.showPerimeter = false;
      this.state.showSeams = false;
      window.soundFx.click();
      this.update();
    });

    // 任務四子按鈕
    bind('w08-ext-b-strip', () => {
      this.setPreset('ext_strip');
      this.state.mission = 'extend';
      this.state.extType = 'ext_strip';
      this.state.showPerimeter = false;
      this.state.showSeams = false;
      ['w08-ext-b-strip', 'w08-ext-b-rect', 'w08-ext-b-stair'].forEach(id => document.getElementById(id)?.classList.remove('primary'));
      document.getElementById('w08-ext-b-strip')?.classList.add('primary');
      window.soundFx.click();
      this.update();
    });

    bind('w08-ext-b-rect', () => {
      this.setPreset('ext_rect');
      this.state.mission = 'extend';
      this.state.extType = 'ext_rect';
      this.state.showPerimeter = false;
      this.state.showSeams = false;
      ['w08-ext-b-strip', 'w08-ext-b-rect', 'w08-ext-b-stair'].forEach(id => document.getElementById(id)?.classList.remove('primary'));
      document.getElementById('w08-ext-b-rect')?.classList.add('primary');
      window.soundFx.click();
      this.update();
    });

    bind('w08-ext-b-stair', () => {
      this.setPreset('ext_stair');
      this.state.mission = 'extend';
      this.state.extType = 'ext_stair';
      this.state.showPerimeter = false;
      this.state.showSeams = false;
      ['w08-ext-b-strip', 'w08-ext-b-rect', 'w08-ext-b-stair'].forEach(id => document.getElementById(id)?.classList.remove('primary'));
      document.getElementById('w08-ext-b-stair')?.classList.add('primary');
      window.soundFx.click();
      this.update();
    });

    // 掃描外露周界
    bind('w08-btn-scan', () => {
      this.state.showPerimeter = true;
      window.soundFx.balanceChime();
      this.update();
    });

    // 透視接縫
    bind('w08-btn-seams', () => {
      this.state.showSeams = !this.state.showSeams;
      window.soundFx.click();
      this.update();
    });
  },

  updateTabs(activeId) {
    ['w08-tab-s', 'w08-tab-r', 'w08-tab-l', 'w08-tab-ext'].forEach(id => {
      const b = document.getElementById(id);
      if (b) {
        if (id === activeId) b.classList.add('primary');
        else b.classList.remove('primary');
      }
    });
  },

  update() {
    const g = document.getElementById('w08-blocks-g');
    const seamsG = document.getElementById('w08-seams-g');
    const pVal = document.getElementById('w08-p-val');
    const pCm = document.getElementById('w08-p-cm');
    const aVal = document.getElementById('w08-area-val');
    const aCm = document.getElementById('w08-area-cm');

    const blocks = this.state.blocks;
    const count = blocks.length;
    const sz = 44;
    const set = new Set(blocks.map(b => `${b.r},${b.c}`));

    if (aVal) aVal.innerText = `${count} 格 (守恆！)`;
    if (aCm) aCm.innerText = `每格 2cm×2cm ＝ ${count * 4} cm²`;

    let html = '';
    let seamsHTML = '';
    let exposed = 0;
    let internalSeams = 0;

    blocks.forEach((b, i) => {
      const x = b.c * sz;
      const y = b.r * sz;
      html += `
        <rect x="${x}" y="${y}" width="${sz}" height="${sz}" rx="5" fill="#fbbf24" stroke="#b45309" stroke-width="2.5" />
        <text x="${x + sz / 2}" y="${y + sz / 2 + 5}" font-size="15" fill="#78350f" font-weight="900" text-anchor="middle">${i + 1}</text>
      `;

      // 檢查外露邊
      [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dr, dc]) => {
        if (!set.has(`${b.r + dr},${b.c + dc}`)) exposed++;
      });

      // 檢查內部接縫
      if (set.has(`${b.r},${b.c + 1}`)) {
        internalSeams++;
        seamsHTML += `<line x1="${x + sz}" y1="${y}" x2="${x + sz}" y2="${y + sz}" stroke="#ef4444" stroke-width="4" stroke-dasharray="3,3" />`;
      }
      if (set.has(`${b.r + 1},${b.c}`)) {
        internalSeams++;
        seamsHTML += `<line x1="${x}" y1="${y + sz}" x2="${x + sz}" y2="${y + sz}" stroke="#ef4444" stroke-width="4" stroke-dasharray="3,3" />`;
      }
    });

    g.innerHTML = html;
    seamsG.innerHTML = this.state.showSeams ? seamsHTML : '';

    if (this.state.showPerimeter) {
      pVal.innerText = `${exposed} 單位`;
      pCm.innerText = `${exposed} × 2cm ＝ ${exposed * 2} cm`;
    } else {
      pVal.innerText = '❓ 待數邊線';
      pCm.innerText = '請點擊上方「掃描外露周界」按鈕！';
    }

    // 導引條更新
    const guideTag = document.getElementById('w08-guide-tag');
    const guideTitle = document.getElementById('w08-guide-title');
    const guideText = document.getElementById('w08-guide-text');
    const guideSub = document.getElementById('w08-guide-sub');
    const buriedEdges = internalSeams * 2;

    if (this.state.mission === 'strip') {
      guideTitle.innerText = '任務一：1×6 一字長蛇形';

      if (!this.state.showPerimeter) {
        guideTag.className = 'guide-step-tag';
        guideTag.innerText = '👨‍🏫 老師引導 ➔ 第 1 步 / 共 2 步';
        guideText.innerHTML = `6 塊方格排成一字長蛇形。面積是幾格？（6格）。請操作員點擊上方<strong>「🔍 掃描外露周界 (數外邊)」</strong>數一數！`;
        guideSub.innerText = '💡 目前周界隱藏，讓學生先數數看外面有多少條邊。';
      } else if (!this.state.showSeams) {
        guideTag.className = 'guide-step-tag step-alert';
        guideTag.innerText = '👨‍🏫 老師引導 ➔ 第 2 步：透視接縫';
        guideText.innerHTML = `外露周界高達 <strong>14 單位 (28cm)</strong>！請操作員點擊<strong>「✂️ 透視「肚裡藏邊」接縫」</strong>，看看相鄰接縫藏了幾條邊！`;
        guideSub.innerText = '💡 原始 6 塊方塊有 24 條邊，接縫吞掉了幾條邊？';
      } else {
        guideTag.className = 'guide-step-tag step-done';
        guideTag.innerText = '🎉 探究結論 ➔ 一字形周界最長！';
        guideText.innerHTML = `相鄰接縫只有 <strong>${internalSeams} 條</strong>（吞掉 ${buriedEdges} 條邊）！外露周界為 <strong>24 − ${buriedEdges} ＝ 14 單位（28 cm）</strong>！展開越散，周界越長！`;
        guideSub.innerText = '🎯 教師金句：拼塊不增面積同，內部貼合吞邊線！';
      }

    } else if (this.state.mission === 'rect') {
      guideTitle.innerText = '任務二：2×3 緊湊矩形 (對比挑戰)';

      if (!this.state.showPerimeter) {
        guideTag.className = 'guide-step-tag step-alert';
        guideTag.innerText = '👨‍🏫 老師引導 ➔ 猜想周界變化';
        guideText.innerHTML = `同樣用這 6 塊拼成 2×3 緊湊長方形。面積依然是 6 格！<strong>請全班猜測：周界會變長、不變、還是變短？</strong>請點擊<strong>「🔍 掃描外露周界」</strong>驗證！`;
        guideSub.innerText = '💡 請全班舉手表決，再揭曉周界！';
      } else if (!this.state.showSeams) {
        guideTag.className = 'guide-step-tag step-alert';
        guideTag.innerText = '👨‍🏫 老師引導 ➔ 揭秘周界縮水原因';
        guideText.innerHTML = `周界驟降至 <strong>10 單位 (20cm)</strong>！為什麼周界少了 4 單位？請操作員點擊<strong>「✂️ 透視「肚裡藏邊」接縫」</strong>！`;
        guideSub.innerText = '💡 學生點擊後將看到紅色虛線接縫大幅增加。';
      } else {
        guideTag.className = 'guide-step-tag step-done';
        guideTag.innerText = '🎉 探究結論 ➔ 越緊湊周界越短！';
        guideText.innerHTML = `相鄰接縫高達 <strong>${internalSeams} 條</strong>！把足足 <strong>${buriedEdges} 條邊藏進肚子裡</strong>了！外露周界只有 <strong>24 − ${buriedEdges} ＝ 10 單位（20 cm）</strong>！周界最短！`;
        guideSub.innerText = '🎯 教師金句：越緊湊者接縫多，吞邊越多周越短！';
      }

    } else if (this.state.mission === 'lshape') {
      guideTitle.innerText = '任務三：L 形變形獸 (凹凸形狀)';

      if (!this.state.showPerimeter) {
        guideTag.className = 'guide-step-tag';
        guideTag.innerText = '👨‍🏫 老師引導 ➔ 凹凸造型測量';
        guideText.innerHTML = `拼成 L 形怪獸。面積依然是 6 格！請操作員點擊<strong>「🔍 掃描外露周界」</strong>，數數凹凸外緣的周界是多少！`;
        guideSub.innerText = '💡 觀察轉角凹凸對周界的影響。';
      } else {
        guideTag.className = 'guide-step-tag step-done';
        guideTag.innerText = '🎉 探究結論 ➔ 周界 12 單位';
        guideText.innerHTML = `相鄰接縫有 <strong>${internalSeams} 條</strong>（吞掉 ${buriedEdges} 條邊），外圍周界為 <strong>24 − ${buriedEdges} ＝ ${exposed} 單位（${exposed * 2} cm）</strong>！面積相同，形狀不同周界截然不同！`;
        guideSub.innerText = '🎯 教師金句：面積守恆周界變，形狀千變見真章！';
      }

    } else if (this.state.mission === 'extend') {
      guideTitle.innerText = '任務四：資優延伸探究 (8 塊極限變形挑戰)';

      if (!this.state.showPerimeter) {
        guideTag.className = 'guide-step-tag';
        guideTag.innerText = '🚀 資優探究 ➔ 待掃描周界';
        guideText.innerHTML = `8 塊正方形拼合（面積固定為 8 格）。請全班預測當前造型的周界，然後點擊<strong>「🔍 掃描外露周界」</strong>！`;
        guideSub.innerText = '💡 原始 8 塊共有 32 條邊，觀察接縫能吃掉多少！';
      } else {
        guideTag.className = 'guide-step-tag step-done';
        guideTag.innerText = '🎉 探究發現 ➔ 極限周界揭秘';
        guideText.innerHTML = `內部接縫 <strong>${internalSeams} 條</strong>（吞掉 ${buriedEdges} 條邊）！外露周界為 <strong>32 − ${buriedEdges} ＝ ${exposed} 單位 (${exposed * 2} cm)</strong>！對比 2×4 矩形 (12單位) 與 1×8 長條 (18單位)，驗證了「越緊湊周界越短」的奧數極值定理！`;
        guideSub.innerText = '🎯 體會長寬越接近、內部藏邊越多的深刻規律！';
      }
    }

    if (window.ipadApp) {
      window.ipadApp.updateTeacherSummary(this.getTeacherSummary());
    }
  },

  destroy() {}
};
