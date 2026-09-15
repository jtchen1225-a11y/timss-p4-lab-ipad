/**
 * lab08.js - 第 8 週：【俄羅斯方塊變形獸】 (LAB-W08-MG-AREA) - iPad 優化版
 * 測量與幾何 ｜ 推理 Reasoning ｜ 面積守恆、大方格磁板、肚裡藏邊紅虛線解析
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
    preset: 'strip',
    blocks: [
      { r: 3, c: 3 }, { r: 3, c: 4 }, { r: 3, c: 5 },
      { r: 3, c: 6 }, { r: 3, c: 7 }, { r: 3, c: 8 }
    ]
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
    this.state = { preset: 'strip', blocks: [] };
    this.setPreset('strip');

    container.innerHTML = `
      <div class="ipad-controls-bar">
        <div class="controls-left-group">
          <button class="touch-btn primary" id="w08-btn-s">🐍 造型 A：1×6 一字長蛇 (周界 14)</button>
          <button class="touch-btn" id="w08-btn-r">📦 造型 B：2×3 緊湊長方形 (周界 10 最短)</button>
          <button class="touch-btn" id="w08-btn-l">🦎 造型 C：L 形變形獸 (周界 12)</button>
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
            <div style="font-size:1.8rem; font-weight:900; color:#2563eb;" id="w08-p-val">14 單位</div>
            <span style="font-size:0.8rem; color:#1d4ed8;" id="w08-p-cm">14 × 2cm ＝ 28 cm</span>
          </div>
        </div>
      </div>

      <div id="w08-tip-box" style="margin-top:12px; background:#eff6ff; border:1.5px solid #93c5fd; border-radius:10px; padding:12px 16px; font-size:0.95rem; color:#1e40af;"></div>
    `;

    this.bindEvents();
    this.update();
  },

  setPreset(type) {
    this.state.preset = type;
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
    const bind = (id, type) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('click', () => {
          ['w08-btn-s', 'w08-btn-r', 'w08-btn-l'].forEach(b => document.getElementById(b)?.classList.remove('primary'));
          el.classList.add('primary');
          this.setPreset(type);
          window.soundFx.stampThud();
          this.update();
        });
      }
    };

    bind('w08-btn-s', 'strip');
    bind('w08-btn-r', 'rect');
    bind('w08-btn-l', 'lshape');
  },

  update() {
    const g = document.getElementById('w08-blocks-g');
    const tip = document.getElementById('w08-tip-box');
    const pVal = document.getElementById('w08-p-val');
    const pCm = document.getElementById('w08-p-cm');

    const sz = 44;
    const blocks = this.state.blocks;
    const set = new Set(blocks.map(b => `${b.r},${b.c}`));

    let html = '';
    let exposed = 0;

    blocks.forEach((b, i) => {
      const x = b.c * sz;
      const y = b.r * sz;
      html += `
        <rect x="${x}" y="${y}" width="${sz}" height="${sz}" rx="5" fill="#fbbf24" stroke="#b45309" stroke-width="2.5" />
        <text x="${x + sz / 2}" y="${y + sz / 2 + 5}" font-size="15" fill="#78350f" font-weight="900" text-anchor="middle">${i + 1}</text>
      `;

      // 檢查 4 條邊
      [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dr, dc]) => {
        if (!set.has(`${b.r + dr},${b.c + dc}`)) exposed++;
      });
    });

    g.innerHTML = html;
    pVal.innerText = `${exposed} 單位`;
    pCm.innerText = `${exposed} × 2cm ＝ ${exposed * 2} cm`;

    if (this.state.preset === 'strip') {
      tip.style.background = '#eff6ff';
      tip.style.borderColor = '#93c5fd';
      tip.style.color = '#1e40af';
      tip.innerHTML = `🐍 <strong>1×6 一字長蛇形：</strong>內縫只有 5 條，絕大部分邊露在外面！外露周界高達 <strong>14 單位（28 cm）</strong>！周界最長！`;
    } else if (this.state.preset === 'rect') {
      tip.style.background = '#ecfdf5';
      tip.style.borderColor = '#86efac';
      tip.style.color = '#065f46';
      tip.innerHTML = `📦 <strong>2×3 緊湊長方形：</strong>相鄰內縫高達 7 條！7 條接縫把 14 條邊<strong>「藏進肚子裡」</strong>了！外圍周界驟降至 <strong>10 單位（20 cm）</strong>！周界最短！`;
    } else {
      tip.style.background = '#fffbeb';
      tip.style.borderColor = '#fde68a';
      tip.style.color = '#92400e';
      tip.innerHTML = `🦎 <strong>L 形變形獸：</strong>面積依然是 6 格，但凹凸外緣讓周界變為 <strong>12 單位（24 cm）</strong>！面積相同，周界隨造型劇變！`;
    }

    if (window.ipadApp) {
      window.ipadApp.updateTeacherSummary(this.getTeacherSummary());
    }
  },

  destroy() {}
};
