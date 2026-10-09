/**
 * lab09.js - 第 9 週：【量筒小數水滴探秘】 (LAB-W09-N-DEC) - iPad 優化版 (動手逐筒注水與小數排序探索)
 * 數與運算 ｜ 應用 Applying ｜ 空量筒起點、逐筒手動注入、小數對抗、點擊揭示升序鏈
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
    l1: 0, // A: 0.8L (800ml)
    l2: 0, // B: 0.08L (80ml)
    l3: 0, // C: 0.7L (700ml)
    l4: 0, // D: 0.354L (354ml)
    showOrder: false
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
    this.state = { l1: 0, l2: 0, l3: 0, l4: 0, showOrder: false };

    container.innerHTML = `
      <div class="ipad-controls-bar">
        <div class="controls-left-group">
          <button class="touch-btn primary" id="w09-btn-all">🌊 全部注水到位</button>
          <button class="touch-btn warning" id="w09-btn-pk1">⚡ 對決一：0.8 L vs 0.08 L</button>
          <button class="touch-btn success" id="w09-btn-pk2">🥊 對決二：0.7 L vs 0.354 L</button>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="touch-btn" id="w09-btn-drain">🚰 全部排空清零</button>
        </div>
      </div>

      <!-- 4 支大號量筒陳列架 (附個別注水按鈕) -->
      <div style="background:white; border:2px solid #cbd5e1; border-radius:14px; padding:20px 10px;">
        <div class="ipad-cylinders-grid">
          <!-- A: 0.8L -->
          <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
            <strong style="color:#1d4ed8; font-size:1.05rem;">A 瓶：0.8 L</strong>
            <div class="ipad-cylinder-body">
              <div class="ipad-cylinder-liquid" id="w09-l1" style="height:0%;"></div>
              <div style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none;">${this.getTicks()}</div>
            </div>
            <div style="font-size:1.1rem; font-weight:900; color:#2563eb;" id="w09-txt-1">0 ml</div>
            <button class="touch-btn" id="w09-btn-fill-1" style="font-size:0.8rem; padding:4px 8px;">💧 注入 0.8 L</button>
          </div>

          <!-- B: 0.08L -->
          <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
            <strong style="color:#b91c1c; font-size:1.05rem;">B 瓶：0.08 L</strong>
            <div class="ipad-cylinder-body">
              <div class="ipad-cylinder-liquid" id="w09-l2" style="height:0%; background:linear-gradient(180deg, #f87171, #ef4444);"></div>
              <div style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none;">${this.getTicks()}</div>
            </div>
            <div style="font-size:1.1rem; font-weight:900; color:#dc2626;" id="w09-txt-2">0 ml</div>
            <button class="touch-btn" id="w09-btn-fill-2" style="font-size:0.8rem; padding:4px 8px;">💧 注入 0.08 L</button>
          </div>

          <!-- C: 0.7L -->
          <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
            <strong style="color:#047857; font-size:1.05rem;">C 瓶：0.7 L</strong>
            <div class="ipad-cylinder-body">
              <div class="ipad-cylinder-liquid" id="w09-l3" style="height:0%; background:linear-gradient(180deg, #34d399, #059669);"></div>
              <div style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none;">${this.getTicks()}</div>
            </div>
            <div style="font-size:1.1rem; font-weight:900; color:#059669;" id="w09-txt-3">0 ml</div>
            <button class="touch-btn" id="w09-btn-fill-3" style="font-size:0.8rem; padding:4px 8px;">💧 注入 0.7 L</button>
          </div>

          <!-- D: 0.354L -->
          <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
            <strong style="color:#6d28d9; font-size:1.05rem;">D 瓶：0.354 L</strong>
            <div class="ipad-cylinder-body">
              <div class="ipad-cylinder-liquid" id="w09-l4" style="height:0%; background:linear-gradient(180deg, #a78bfa, #7c3aed);"></div>
              <div style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none;">${this.getTicks()}</div>
            </div>
            <div style="font-size:1.1rem; font-weight:900; color:#7c3aed;" id="w09-txt-4">0 ml</div>
            <button class="touch-btn" id="w09-btn-fill-4" style="font-size:0.8rem; padding:4px 8px;">💧 注入 0.354 L</button>
          </div>
        </div>

        <!-- 升序隊列驗證卡 -->
        <div style="background:#f8fafc; border:2px dashed #cbd5e1; border-radius:10px; padding:12px; margin-top:12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-weight:bold; color:#334155;">📊 容量從小到大排序探索：</span>
            <span id="w09-order-txt" style="font-size:1.05rem; font-weight:900; color:#64748b; font-family:var(--font-math);">
              等待注入飲料並揭曉...
            </span>
          </div>
          <button class="touch-btn primary" id="w09-btn-reveal-order">🔍 驗證並揭曉升序鏈</button>
        </div>
      </div>

      <div id="w09-desc" style="margin-top:10px; background:#eff6ff; border:1.5px solid #bfdbfe; border-radius:10px; padding:12px 16px; font-size:0.95rem; color:#1e40af;"></div>
    `;

    this.bindEvents();
    this.update();
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

    // 單筒獨立注水
    bind('w09-btn-fill-1', () => {
      this.state.l1 = this.state.l1 > 0 ? 0 : 800;
      window.soundFx.waterDrop();
      this.update();
    });

    bind('w09-btn-fill-2', () => {
      this.state.l2 = this.state.l2 > 0 ? 0 : 80;
      window.soundFx.waterDrop();
      this.update();
    });

    bind('w09-btn-fill-3', () => {
      this.state.l3 = this.state.l3 > 0 ? 0 : 700;
      window.soundFx.waterDrop();
      this.update();
    });

    bind('w09-btn-fill-4', () => {
      this.state.l4 = this.state.l4 > 0 ? 0 : 354;
      window.soundFx.waterDrop();
      this.update();
    });

    // 快捷情境按鈕
    bind('w09-btn-all', () => {
      window.soundFx.waterDrop();
      this.state.l1 = 800;
      this.state.l2 = 80;
      this.state.l3 = 700;
      this.state.l4 = 354;
      this.update();
    });

    bind('w09-btn-pk1', () => {
      window.soundFx.waterDrop();
      this.state.l1 = 800;
      this.state.l2 = 80;
      this.state.l3 = 0;
      this.state.l4 = 0;
      this.update();
    });

    bind('w09-btn-pk2', () => {
      window.soundFx.waterDrop();
      this.state.l1 = 0;
      this.state.l2 = 0;
      this.state.l3 = 700;
      this.state.l4 = 354;
      this.update();
    });

    bind('w09-btn-drain', () => {
      window.soundFx.click();
      this.state.l1 = 0;
      this.state.l2 = 0;
      this.state.l3 = 0;
      this.state.l4 = 0;
      this.state.showOrder = false;
      this.update();
    });

    // 揭示升序鏈
    bind('w09-btn-reveal-order', () => {
      this.state.showOrder = true;
      window.soundFx.balanceChime();
      this.update();
    });
  },

  update() {
    const l1 = document.getElementById('w09-l1');
    const l2 = document.getElementById('w09-l2');
    const l3 = document.getElementById('w09-l3');
    const l4 = document.getElementById('w09-l4');

    if (l1) l1.style.height = `${(this.state.l1 / 1000) * 100}%`;
    if (l2) l2.style.height = `${(this.state.l2 / 1000) * 100}%`;
    if (l3) l3.style.height = `${(this.state.l3 / 1000) * 100}%`;
    if (l4) l4.style.height = `${(this.state.l4 / 1000) * 100}%`;

    // 毫升文字
    document.getElementById('w09-txt-1').innerText = this.state.l1 > 0 ? `${this.state.l1} ml (8個十分位)` : '0 ml (空筒)';
    document.getElementById('w09-txt-2').innerText = this.state.l2 > 0 ? `${this.state.l2} ml (8個百分位)` : '0 ml (空筒)';
    document.getElementById('w09-txt-3').innerText = this.state.l3 > 0 ? `${this.state.l3} ml (7個十分位)` : '0 ml (空筒)';
    document.getElementById('w09-txt-4').innerText = this.state.l4 > 0 ? `${this.state.l4} ml (3個十分位)` : '0 ml (空筒)';

    // 按鈕文字更新
    const b1 = document.getElementById('w09-btn-fill-1');
    const b2 = document.getElementById('w09-btn-fill-2');
    const b3 = document.getElementById('w09-btn-fill-3');
    const b4 = document.getElementById('w09-btn-fill-4');
    if (b1) b1.innerText = this.state.l1 > 0 ? '🚰 排空 A' : '💧 注入 0.8 L';
    if (b2) b2.innerText = this.state.l2 > 0 ? '🚰 排空 B' : '💧 注入 0.08 L';
    if (b3) b3.innerText = this.state.l3 > 0 ? '🚰 排空 C' : '💧 注入 0.7 L';
    if (b4) b4.innerText = this.state.l4 > 0 ? '🚰 排空 D' : '💧 注入 0.354 L';

    // 升序鏈
    const orderTxt = document.getElementById('w09-order-txt');
    if (this.state.showOrder) {
      orderTxt.innerHTML = `
        <span style="color:#ef4444;">0.08 L (80ml)</span> ＜ 
        <span style="color:#7c3aed;">0.354 L (354ml)</span> ＜ 
        <span style="color:#059669;">0.7 L (700ml)</span> ＜ 
        <span style="color:#2563eb;">0.8 L (800ml)</span>
      `;
    } else {
      orderTxt.innerText = '等待點擊「驗證並揭曉升序鏈」...';
    }

    // 說明文字
    const desc = document.getElementById('w09-desc');
    const totalFilled = (this.state.l1 > 0 ? 1 : 0) + (this.state.l2 > 0 ? 1 : 0) + (this.state.l3 > 0 ? 1 : 0) + (this.state.l4 > 0 ? 1 : 0);

    if (totalFilled === 0) {
      desc.style.background = '#f8fafc';
      desc.style.borderColor = '#cbd5e1';
      desc.style.color = '#475569';
      desc.innerHTML = `🚰 <strong>量筒全為空筒狀態（0 ml）。</strong>請點擊各量筒下方的「💧 注入」按鈕，或點擊上方「🌊 全部注水」，觀察水面高度！`;
    } else if (this.state.l1 > 0 && this.state.l2 > 0 && this.state.l3 === 0 && this.state.l4 === 0) {
      desc.style.background = '#fffbeb';
      desc.style.borderColor = '#fde68a';
      desc.style.color = '#92400e';
      desc.innerHTML = `⚡ <strong>對決一（0.8 L vs 0.08 L）：</strong>800 ml 與 80 ml 天壤之別！小數點後第一位（十分位）代表大格（100ml），<strong>整整差了 10 倍！</strong>看似只差一個零，容量完全不同！`;
    } else if (this.state.l3 > 0 && this.state.l4 > 0 && this.state.l1 === 0 && this.state.l2 === 0) {
      desc.style.background = '#f5f3ff';
      desc.style.borderColor = '#ddd6fe';
      desc.style.color = '#6d28d9';
      desc.innerHTML = `🥊 <strong>對決二（0.7 L vs 0.354 L）：</strong>破除位數陷阱！0.7 的十分位是 7 (700ml)，0.354 十分位只有 3 (354ml)！<strong>位數多的不一定大，比大小先看十分位！</strong>`;
    } else {
      desc.style.background = '#eff6ff';
      desc.style.borderColor = '#bfdbfe';
      desc.style.color = '#1e40af';
      desc.innerHTML = `🌊 <strong>四大容量全景對照：</strong>最高的是 0.8 L (800ml)，最低的是 0.08 L (80ml)。小數位數最多（三位小數）的 0.354 L 還不到半筒！`;
    }

    if (window.ipadApp) {
      window.ipadApp.updateTeacherSummary(this.getTeacherSummary());
    }
  },

  destroy() {}
};
