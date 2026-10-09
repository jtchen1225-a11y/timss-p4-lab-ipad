/**
 * lab08.js - 第 8 週：【俄羅斯方塊變形獸】 (LAB-W08-MG-AREA) - iPad 優化版
 * 教師引導 ➔ 學生主動探究 ➔ 任務切換立即歸零待測
 */

window.TIMSS_LABS = window.TIMSS_LABS || {};

window.TIMSS_LABS['W08'] = {
  id: 'W08',
  code: 'LAB-W08-MG-AREA',
  title: '俄羅斯方塊變形獸',
  domain: '測量與幾何 M&G',
  domainType: 'mg',
  cognitive: '推理 Reasoning',
  question: '用 6 塊方塊拼成一字長蛇形、2×3 長方形、L 形怪獸。它們的面積變了嗎？它們的外圍周界會一樣嗎？',
  activeRole: '🔴 操作員(D) 拼擺不同怪獸 ➔ 🟢 發言人(B) 解密肚裡藏邊',

  state: {
    mission: 'strip', // 'strip', 'rect', 'lshape'
    showPerimeter: false,
    showSeams: false,
    blocks: []
  },

  getTeacherSummary() {
    return {
      core: `<h4>💡 核心概念提煉</h4><p>幾何拼擺中存在「<strong>面積守恆定律</strong>」：只要方塊總數不變（6 個方格），無論擺成一字長蛇、緊湊矩形還是 L 形，面積恆為 6 單位。但<strong>周界絕不守恆</strong>！兩個方塊每拼接一條邊，就會有 2 條邊被「吞進內部」不再計入周界。拼擺越緊湊、重合接縫越多，外圍周界就越短！</p>`,
      formula: `<h4>📐 核心計算與邊長折損模型</h4><p>• <strong>原始邊長總數：</strong>$6 \\times 4 = 24$ 條邊<br>• <strong>一字長條（重合 5 縫）：</strong>$C = 24 - (5 \\times 2) = \\mathbf{14\\text{ 單位}}$（最長周界）<br>• <strong>2×3 矩形（重合 7 縫）：</strong>$C = 24 - (7 \\times 2) = \\mathbf{10\\text{ 單位}}$（最短周界）<br>• <strong>面積結論：</strong>$S \\equiv 6\\text{ 格}$（面積相同，周界可以截然不同！）</p>`,
      quote: `🎯 <strong>教師總結金句：</strong>「拼塊不增面積同，形狀千變周界殊；內部貼合吞邊線，越緊湊者周越短！」`
    };
  },

  render(container) {
    this.container = container;
    this.state = { mission: 'strip', showPerimeter: false, showSeams: false, blocks: [] };
    this.setPreset('strip');

    container.innerHTML = `
      <!-- 任務切換列：點擊任何任務立即歸零 -->
      <div class="ipad-controls-bar">
        <div class="controls-left-group">
          <button class="touch-btn primary" id="w08-tab-s">🐍 任務一：1×6 一字長蛇形</button>
          <button class="touch-btn" id="w08-tab-r">📦 任務二：2×3 緊湊矩形</button>
          <button class="touch-btn" id="w08-tab-l">🦎 任務三：L 形變形獸</button>
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
            <div style="font-size:1.8rem; font-weight:900; color:#059669;">6 格 (守恆！)</div>
            <span style="font-size:0.8rem; color:#047857;">每格 2cm×2cm ＝ 24 cm²</span>
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
      window.soundFx.stampThud();
      this.update();
    });

    bind('w08-tab-r', () => {
      this.setPreset('rect');
      this.state.showPerimeter = false;
      this.state.showSeams = false;
      this.updateTabs('w08-tab-r');
      window.soundFx.stampThud();
      this.update();
    });

    bind('w08-tab-l', () => {
      this.setPreset('lshape');
      this.state.showPerimeter = false;
      this.state.showSeams = false;
      this.updateTabs('w08-tab-l');
      window.soundFx.stampThud();
      this.update();
    });

    bind('w08-btn-reset', () => {
      this.state.showPerimeter = false;
      this.state.showSeams = false;
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
    ['w08-tab-s', 'w08-tab-r', 'w08-tab-l'].forEach(id => {
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

    const sz = 44;
    const blocks = this.state.blocks;
    const set = new Set(blocks.map(b => `${b.r},${b.c}`));

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
    }

    if (window.ipadApp) {
      window.ipadApp.updateTeacherSummary(this.getTeacherSummary());
    }
  },

  destroy() {}
};
