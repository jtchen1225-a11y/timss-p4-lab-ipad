/**
 * lab09.js - 第 9 週：【量筒小數水滴探秘】 (LAB-W09-N-DEC) - iPad 優化版
 * 數與運算 ｜ 應用 Applying ｜ 大尺寸量筒、水波注水動畫、升序排列清單
 */

window.TIMSS_LABS = window.TIMSS_LABS || {};

window.TIMSS_LABS['W09'] = {
  id: 'W09',
  code: 'LAB-W09-N-DEC',
  title: '量筒小數水滴探秘',
  domain: '數與運算 Number',
  domainType: 'number',
  cognitive: '應用 Applying',
  question: '飲料瓶上寫著 0.8 L 和 0.08 L，看起來只差一個零，倒在量筒裡視覺差距有多震撼？0.354 L 與 0.7 L 誰更多？',
  activeRole: '🔴 操作員(D) 點擊注水 ➔ 🟣 質疑員(A) 質疑 0.354L 為何少於 0.7L',

  state: {
    w1: 800,
    w2: 80,
    w3: 700,
    w4: 354
  },

  getTeacherSummary() {
    return {
      core: `<h4>💡 核心概念提煉</h4><p>小數大小比較絕不能受整數思維誤導去「數數位長短」！比較小數必須遵循「<strong>從最高位向最低位逐位比較</strong>」的法則。在容量單位中 $1\\text{ L} = 1000\\text{ ml}$，十分位上的 1 代表 $100\\text{ ml}$，百分位上的 1 代表 $10\\text{ ml}$。$0.7\\text{ L}$（700ml）雖然只有 1 位小數，卻遠大於 3 位小數但十分位只有 3 的 $0.354\\text{ L}$（354ml）！</p>`,
      formula: `<h4>📐 核心容量換算與位值排序</h4><p>• <strong>基準換算：</strong>$1\\text{ L} = 1000\\text{ ml}$ ｜ $0.1\\text{ L} = 100\\text{ ml}$ ｜ $0.01\\text{ L} = 10\\text{ ml}$<br>• <strong>量杯實測：</strong>$0.8\\text{ L}=800\\text{ ml}$ ＞ $0.7\\text{ L}=700\\text{ ml}$ ＞ $0.354\\text{ L}=354\\text{ ml}$ ＞ $0.08\\text{ L}=80\\text{ ml}$<br>• <strong>大小排序：</strong>$\\mathbf{0.8\\text{ L} > 0.7\\text{ L} > 0.354\\text{ L} > 0.08\\text{ L}}$</p>`,
      quote: `🎯 <strong>教師總結金句：</strong>「小數比較莫數長，高位排起見真章；十分數位定乾坤，長度再長莫被蒙！」`
    };
  },

  render(container) {
    this.container = container;

    container.innerHTML = `
      <div class="ipad-controls-bar">
        <div class="controls-left-group">
          <button class="touch-btn primary" id="w09-btn-all">🌊 全部注水到位</button>
          <button class="touch-btn warning" id="w09-btn-pk1">⚡ 對決一：0.8 L vs 0.08 L (差 10 倍)</button>
          <button class="touch-btn success" id="w09-btn-pk2">🥊 對決二：0.7 L vs 0.354 L (破位數迷思)</button>
        </div>
        <button class="touch-btn" id="w09-btn-drain">🚰 全部清零</button>
      </div>

      <!-- 4 支大號量筒陳列架 -->
      <div style="background:white; border:2px solid #cbd5e1; border-radius:14px; padding:20px 10px;">
        <div class="ipad-cylinders-grid">
          <!-- A: 0.8L -->
          <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
            <strong style="color:#1d4ed8; font-size:1.05rem;">A：0.8 L</strong>
            <div class="ipad-cylinder-body">
              <div class="ipad-cylinder-liquid" id="w09-l1" style="height:0%;"></div>
              <div style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none;">${this.getTicks()}</div>
            </div>
            <div style="font-size:1.1rem; font-weight:900; color:#2563eb;">800 ml</div>
            <span style="font-size:0.75rem; color:#64748b;">(8 個十分位)</span>
          </div>

          <!-- B: 0.08L -->
          <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
            <strong style="color:#b91c1c; font-size:1.05rem;">B：0.08 L</strong>
            <div class="ipad-cylinder-body">
              <div class="ipad-cylinder-liquid" id="w09-l2" style="height:0%; background:linear-gradient(180deg, #f87171, #ef4444);"></div>
              <div style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none;">${this.getTicks()}</div>
            </div>
            <div style="font-size:1.1rem; font-weight:900; color:#dc2626;">80 ml</div>
            <span style="font-size:0.75rem; color:#b91c1c;">(少 10 倍！)</span>
          </div>

          <!-- C: 0.7L -->
          <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
            <strong style="color:#047857; font-size:1.05rem;">C：0.7 L</strong>
            <div class="ipad-cylinder-body">
              <div class="ipad-cylinder-liquid" id="w09-l3" style="height:0%; background:linear-gradient(180deg, #34d399, #059669);"></div>
              <div style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none;">${this.getTicks()}</div>
            </div>
            <div style="font-size:1.1rem; font-weight:900; color:#059669;">700 ml</div>
            <span style="font-size:0.75rem; color:#047857;">(7 個十分位)</span>
          </div>

          <!-- D: 0.354L -->
          <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
            <strong style="color:#6d28d9; font-size:1.05rem;">D：0.354 L</strong>
            <div class="ipad-cylinder-body">
              <div class="ipad-cylinder-liquid" id="w09-l4" style="height:0%; background:linear-gradient(180deg, #a78bfa, #7c3aed);"></div>
              <div style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none;">${this.getTicks()}</div>
            </div>
            <div style="font-size:1.1rem; font-weight:900; color:#7c3aed;">354 ml</div>
            <span style="font-size:0.75rem; color:#6d28d9;">(位數多卻更少！)</span>
          </div>
        </div>

        <!-- 升序隊列卡 -->
        <div style="background:#f8fafc; border:2px dashed #cbd5e1; border-radius:10px; padding:12px; margin-top:12px; text-align:center;">
          <span style="font-weight:bold; color:#334155;">📊 依容量從小到大升序鏈：</span>
          <strong style="font-size:1.15rem; color:#0f172a; font-family:var(--font-math); margin-left:8px;">
            <span style="color:#ef4444;">0.08 L (80ml)</span> ＜ 
            <span style="color:#7c3aed;">0.354 L (354ml)</span> ＜ 
            <span style="color:#059669;">0.7 L (700ml)</span> ＜ 
            <span style="color:#2563eb;">0.8 L (800ml)</span>
          </strong>
        </div>
      </div>

      <div id="w09-desc" style="margin-top:10px; background:#eff6ff; border:1.5px solid #bfdbfe; border-radius:10px; padding:12px 16px; font-size:0.95rem; color:#1e40af;"></div>
    `;

    this.bindEvents();
    setTimeout(() => this.setLevels(800, 80, 700, 354), 100);
  },

  getTicks() {
    let t = '';
    for (let i = 1; i <= 10; i++) {
      const p = i * 10;
      t += `
        <div style="position:absolute; bottom:${p}%; right:0; width:22px; height:2px; background:#1e293b;"></div>
        <span style="position:absolute; bottom:${p}%; right:26px; font-size:10px; font-weight:bold; color:#334155; transform:translateY(50%); font-family:var(--font-math);">${i * 100}</span>
      `;
    }
    return t;
  },

  bindEvents() {
    const bind = (id, fn) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', fn);
    };

    bind('w09-btn-all', () => {
      window.soundFx.waterDrop();
      this.setLevels(800, 80, 700, 354);
      document.getElementById('w09-desc').innerHTML = `🌊 <strong>四大容量全景對照：</strong>最高的是 0.8 L (800ml)，最低的是 0.08 L (80ml)。小數位數最多的 0.354 L 還不到半筒！`;
    });

    bind('w09-btn-pk1', () => {
      window.soundFx.waterDrop();
      this.setLevels(800, 80, 0, 0);
      document.getElementById('w09-desc').innerHTML = `⚡ <strong>對決一（0.8 L vs 0.08 L）：</strong>800ml 與 80ml 天壤之別！小數點後第一位（十分位）代表大格，差了整整 10 倍！`;
    });

    bind('w09-btn-pk2', () => {
      window.soundFx.waterDrop();
      this.setLevels(0, 0, 700, 354);
      document.getElementById('w09-desc').innerHTML = `🥊 <strong>對決二（0.7 L vs 0.354 L）：</strong>破除小數位數陷阱！0.7 的十分位是 7 (700ml)，0.354 十分位只有 3 (354ml)！比大小先看十分位！`;
    });

    bind('w09-btn-drain', () => {
      window.soundFx.click();
      this.setLevels(0, 0, 0, 0);
      document.getElementById('w09-desc').innerHTML = `🚰 量筒已排空，請點擊上方按鈕注水觀測！`;
    });
  },

  setLevels(a, b, c, d) {
    const l1 = document.getElementById('w09-l1');
    const l2 = document.getElementById('w09-l2');
    const l3 = document.getElementById('w09-l3');
    const l4 = document.getElementById('w09-l4');

    if (l1) l1.style.height = `${(a / 1000) * 100}%`;
    if (l2) l2.style.height = `${(b / 1000) * 100}%`;
    if (l3) l3.style.height = `${(c / 1000) * 100}%`;
    if (l4) l4.style.height = `${(d / 1000) * 100}%`;

    if (window.ipadApp) {
      window.ipadApp.updateTeacherSummary(this.getTeacherSummary());
    }
  },

  destroy() {}
};
