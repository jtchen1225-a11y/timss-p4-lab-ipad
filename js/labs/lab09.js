/**
 * lab09.js - 第 9 週：【量筒小數水滴探秘】 (LAB-W09-N-DEC) - iPad 優化版
 * 教師引導 ➔ 學生主動探究 ➔ 任務切換立即歸零待測
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
    mission: 'pk1', // 'pk1', 'pk2', 'order'
    l1: 0,
    l2: 0,
    l3: 0,
    l4: 0,
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
    this.state = { mission: 'pk1', l1: 0, l2: 0, l3: 0, l4: 0, showOrder: false };

    container.innerHTML = `
      <!-- 任務切換列：點擊任何任務立即歸零 -->
      <div class="ipad-controls-bar">
        <div class="controls-left-group">
          <button class="touch-btn primary" id="w09-tab-pk1">⚡ 任務一：對決 (0.8 L vs 0.08 L)</button>
          <button class="touch-btn" id="w09-tab-pk2">🥊 任務二：對決 (0.7 L vs 0.354 L)</button>
          <button class="touch-btn" id="w09-tab-order">📊 任務三：四大容量升序大排列</button>
        </div>
        <button class="touch-btn" id="w09-btn-reset">🔄 當前任務歸零排空</button>
      </div>

      <!-- 👨‍🏫 教師引導與學生探究導引條 -->
      <div class="teacher-guide-banner" id="w09-guide-banner">
        <div class="guide-header-row">
          <span class="guide-step-tag" id="w09-guide-tag">👨‍🏫 老師引導 ➔ 第 1 步 / 共 2 步</span>
          <span class="guide-mission-title" id="w09-guide-title">任務一：0.8 L vs 0.08 L 對決</span>
        </div>
        <div class="guide-instruction-text" id="w09-guide-text">
          A 瓶是 0.8 L，B 瓶是 0.08 L。看似只差一個零。請操作員點擊 A 筒下方的<strong>「💧 注入 0.8 L」</strong>！
        </div>
        <div class="guide-hint-subtext" id="w09-guide-sub">
          💡 量筒目前全部為 0 ml 空筒，等待學生動手注入。
        </div>
      </div>

      <!-- 4 支大號量筒陳列架 -->
      <div style="background:white; border:2px solid #cbd5e1; border-radius:14px; padding:20px 10px;">
        <div class="ipad-cylinders-grid">
          <!-- A: 0.8L -->
          <div style="display:flex; flex-direction:column; align-items:center; gap:8px;" id="w09-col-1">
            <strong style="color:#1d4ed8; font-size:1.05rem;">A 瓶：0.8 L</strong>
            <div class="ipad-cylinder-body">
              <div class="ipad-cylinder-liquid" id="w09-l1" style="height:0%;"></div>
              <div style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none;">${this.getTicks()}</div>
            </div>
            <div style="font-size:1.1rem; font-weight:900; color:#2563eb;" id="w09-txt-1">0 ml</div>
            <button class="touch-btn" id="w09-btn-fill-1" style="font-size:0.85rem; padding:6px 12px;">💧 注入 0.8 L</button>
          </div>

          <!-- B: 0.08L -->
          <div style="display:flex; flex-direction:column; align-items:center; gap:8px;" id="w09-col-2">
            <strong style="color:#b91c1c; font-size:1.05rem;">B 瓶：0.08 L</strong>
            <div class="ipad-cylinder-body">
              <div class="ipad-cylinder-liquid" id="w09-l2" style="height:0%; background:linear-gradient(180deg, #f87171, #ef4444);"></div>
              <div style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none;">${this.getTicks()}</div>
            </div>
            <div style="font-size:1.1rem; font-weight:900; color:#dc2626;" id="w09-txt-2">0 ml</div>
            <button class="touch-btn" id="w09-btn-fill-2" style="font-size:0.85rem; padding:6px 12px;">💧 注入 0.08 L</button>
          </div>

          <!-- C: 0.7L -->
          <div style="display:flex; flex-direction:column; align-items:center; gap:8px;" id="w09-col-3">
            <strong style="color:#047857; font-size:1.05rem;">C 瓶：0.7 L</strong>
            <div class="ipad-cylinder-body">
              <div class="ipad-cylinder-liquid" id="w09-l3" style="height:0%; background:linear-gradient(180deg, #34d399, #059669);"></div>
              <div style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none;">${this.getTicks()}</div>
            </div>
            <div style="font-size:1.1rem; font-weight:900; color:#059669;" id="w09-txt-3">0 ml</div>
            <button class="touch-btn" id="w09-btn-fill-3" style="font-size:0.85rem; padding:6px 12px;">💧 注入 0.7 L</button>
          </div>

          <!-- D: 0.354L -->
          <div style="display:flex; flex-direction:column; align-items:center; gap:8px;" id="w09-col-4">
            <strong style="color:#6d28d9; font-size:1.05rem;">D 瓶：0.354 L</strong>
            <div class="ipad-cylinder-body">
              <div class="ipad-cylinder-liquid" id="w09-l4" style="height:0%; background:linear-gradient(180deg, #a78bfa, #7c3aed);"></div>
              <div style="position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none;">${this.getTicks()}</div>
            </div>
            <div style="font-size:1.1rem; font-weight:900; color:#7c3aed;" id="w09-txt-4">0 ml</div>
            <button class="touch-btn" id="w09-btn-fill-4" style="font-size:0.85rem; padding:6px 12px;">💧 注入 0.354 L</button>
          </div>
        </div>

        <!-- 任務三專屬：排序揭曉欄 -->
        <div id="w09-order-box" style="display:none; background:#f8fafc; border:2px dashed #cbd5e1; border-radius:10px; padding:12px; margin-top:14px; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px;">
          <div>
            <strong style="color:#334155;">📊 容量從小到大升序排列：</strong>
            <span id="w09-order-txt" style="font-size:1.1rem; font-weight:900; color:#64748b; font-family:var(--font-math); margin-left:8px;">
              等待注水完成後揭曉...
            </span>
          </div>
          <button class="touch-btn primary" id="w09-btn-reveal-order">🔍 驗證並揭曉升序鏈條</button>
        </div>
      </div>
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

    // 任務切換：一律歸零待測！
    bind('w09-tab-pk1', () => {
      this.state = { mission: 'pk1', l1: 0, l2: 0, l3: 0, l4: 0, showOrder: false };
      this.updateTabs('w09-tab-pk1');
      window.soundFx.click();
      this.update();
    });

    bind('w09-tab-pk2', () => {
      this.state = { mission: 'pk2', l1: 0, l2: 0, l3: 0, l4: 0, showOrder: false };
      this.updateTabs('w09-tab-pk2');
      window.soundFx.click();
      this.update();
    });

    bind('w09-tab-order', () => {
      this.state = { mission: 'order', l1: 0, l2: 0, l3: 0, l4: 0, showOrder: false };
      this.updateTabs('w09-tab-order');
      window.soundFx.click();
      this.update();
    });

    bind('w09-btn-reset', () => {
      this.state.l1 = 0;
      this.state.l2 = 0;
      this.state.l3 = 0;
      this.state.l4 = 0;
      this.state.showOrder = false;
      window.soundFx.click();
      this.update();
    });

    // 逐筒注水按鈕
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

    // 揭曉升序鏈
    bind('w09-btn-reveal-order', () => {
      this.state.showOrder = true;
      window.soundFx.balanceChime();
      this.update();
    });
  },

  updateTabs(activeId) {
    ['w09-tab-pk1', 'w09-tab-pk2', 'w09-tab-order'].forEach(id => {
      const b = document.getElementById(id);
      if (b) {
        if (id === activeId) b.classList.add('primary');
        else b.classList.remove('primary');
      }
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

    document.getElementById('w09-txt-1').innerText = this.state.l1 > 0 ? `${this.state.l1} ml (8個十分位)` : '0 ml (空筒)';
    document.getElementById('w09-txt-2').innerText = this.state.l2 > 0 ? `${this.state.l2} ml (8個百分位)` : '0 ml (空筒)';
    document.getElementById('w09-txt-3').innerText = this.state.l3 > 0 ? `${this.state.l3} ml (7個十分位)` : '0 ml (空筒)';
    document.getElementById('w09-txt-4').innerText = this.state.l4 > 0 ? `${this.state.l4} ml (3個十分位)` : '0 ml (空筒)';

    const b1 = document.getElementById('w09-btn-fill-1');
    const b2 = document.getElementById('w09-btn-fill-2');
    const b3 = document.getElementById('w09-btn-fill-3');
    const b4 = document.getElementById('w09-btn-fill-4');
    if (b1) b1.innerText = this.state.l1 > 0 ? '🚰 排空 A 筒' : '💧 注入 0.8 L';
    if (b2) b2.innerText = this.state.l2 > 0 ? '🚰 排空 B 筒' : '💧 注入 0.08 L';
    if (b3) b3.innerText = this.state.l3 > 0 ? '🚰 排空 C 筒' : '💧 注入 0.7 L';
    if (b4) b4.innerText = this.state.l4 > 0 ? '🚰 排空 D 筒' : '💧 注入 0.354 L';

    // 欄位顯示過濾
    const col1 = document.getElementById('w09-col-1');
    const col2 = document.getElementById('w09-col-2');
    const col3 = document.getElementById('w09-col-3');
    const col4 = document.getElementById('w09-col-4');
    const orderBox = document.getElementById('w09-order-box');

    if (this.state.mission === 'pk1') {
      if (col1) col1.style.display = 'flex';
      if (col2) col2.style.display = 'flex';
      if (col3) col3.style.display = 'none';
      if (col4) col4.style.display = 'none';
      if (orderBox) orderBox.style.display = 'none';
    } else if (this.state.mission === 'pk2') {
      if (col1) col1.style.display = 'none';
      if (col2) col2.style.display = 'none';
      if (col3) col3.style.display = 'flex';
      if (col4) col4.style.display = 'flex';
      if (orderBox) orderBox.style.display = 'none';
    } else {
      if (col1) col1.style.display = 'flex';
      if (col2) col2.style.display = 'flex';
      if (col3) col3.style.display = 'flex';
      if (col4) col4.style.display = 'flex';
      if (orderBox) orderBox.style.display = 'flex';
    }

    // 升序文字
    const orderTxt = document.getElementById('w09-order-txt');
    if (orderTxt) {
      if (this.state.showOrder) {
        orderTxt.innerHTML = `
          <span style="color:#ef4444;">0.08 L (80ml)</span> ＜ 
          <span style="color:#7c3aed;">0.354 L (354ml)</span> ＜ 
          <span style="color:#059669;">0.7 L (700ml)</span> ＜ 
          <span style="color:#2563eb;">0.8 L (800ml)</span>
        `;
      } else {
        orderTxt.innerText = '等待注入完成後點擊右側按鈕揭曉...';
      }
    }

    // 導引條更新
    const guideTag = document.getElementById('w09-guide-tag');
    const guideTitle = document.getElementById('w09-guide-title');
    const guideText = document.getElementById('w09-guide-text');
    const guideSub = document.getElementById('w09-guide-sub');

    if (this.state.mission === 'pk1') {
      guideTitle.innerText = '任務一：0.8 L vs 0.08 L 迷思對決';

      if (this.state.l1 === 0) {
        guideTag.className = 'guide-step-tag';
        guideTag.innerText = '👨‍🏫 老師引導 ➔ 第 1 步 / 共 2 步';
        guideText.innerHTML = `A 瓶是 0.8 L，B 瓶是 0.08 L。看似只差一個零。請操作員為 A 筒點擊<strong>「💧 注入 0.8 L」</strong>！`;
        guideSub.innerText = '💡 目前兩筒皆為 0 ml 空筒。';
      } else if (this.state.l2 === 0) {
        guideTag.className = 'guide-step-tag step-alert';
        guideTag.innerText = '👨‍🏫 老師引導 ➔ 第 2 步 / 共 2 步';
        guideText.innerHTML = `A 筒已達到 800ml！現在請操作員為 B 筒點擊<strong>「💧 注入 0.08 L」</strong>，親眼見證兩者水位差距！`;
        guideSub.innerText = '💡 請全班猜測：B 筒會有多少水？';
      } else {
        guideTag.className = 'guide-step-tag step-done';
        guideTag.innerText = '🎉 探究結論 ➔ 整整差了 10 倍！';
        guideText.innerHTML = `<strong>A 筒 (800ml) 是 B 筒 (80ml) 的整整 10 倍！</strong>0.8 的 8 在十分位（8 個 100ml），0.08 的 8 在百分位（8 個 10ml）！數位往右退一位，數值縮小 10 倍！`;
        guideSub.innerText = '🎯 教師金句：小數點後差一位，容量縮水大十倍！';
      }

    } else if (this.state.mission === 'pk2') {
      guideTitle.innerText = '任務二：0.7 L vs 0.354 L 破除位數迷思';

      if (this.state.l3 === 0) {
        guideTag.className = 'guide-step-tag';
        guideTag.innerText = '👨‍🏫 老師引導 ➔ 第 1 步 / 共 2 步';
        guideText.innerHTML = `小明說：<strong>「0.354 有 3 位小數，肯定比只有 1 位的 0.7 更多！」</strong>請先為 C 筒注入 <strong>0.7 L</strong>！`;
        guideSub.innerText = '💡 請學生觀察 C 筒水位高度。';
      } else if (this.state.l4 === 0) {
        guideTag.className = 'guide-step-tag step-alert';
        guideTag.innerText = '👨‍🏫 老師引導 ➔ 第 2 步 / 共 2 步';
        guideText.innerHTML = `C 筒高達 700ml！現在請為 D 筒注入 <strong>0.354 L</strong>，看看 3 位小數能不能超過 0.7 L！`;
        guideSub.innerText = '💡 學生點擊注水後將看到水位僅有 354ml。';
      } else {
        guideTag.className = 'guide-step-tag step-done';
        guideTag.innerText = '🎉 探究結論 ➔ 比大小先看最高位！';
        guideText.innerHTML = `<strong>0.7 L (700ml) 遠多於 0.354 L (354ml)！</strong>0.7 的十分位是 7，0.354 十分位只有 3！位數多絕對不代表大，比較小數必須從最高位比起動！`;
        guideSub.innerText = '🎯 教師金句：小數比較莫數長，高位排起見真章！';
      }

    } else if (this.state.mission === 'order') {
      guideTitle.innerText = '任務三：四大容量升序大排列';
      const filledCount = (this.state.l1>0?1:0) + (this.state.l2>0?1:0) + (this.state.l3>0?1:0) + (this.state.l4>0?1:0);

      if (filledCount < 4) {
        guideTag.className = 'guide-step-tag step-alert';
        guideTag.innerText = '👨‍🏫 老師引導 ➔ 注水進行中';
        guideText.innerHTML = `請操作員把 4 支量筒全部點擊注水（目前已注 ${filledCount}/4 筒），然後觀察 4 支量筒的高矮順序！`;
        guideSub.innerText = '💡 請全班在工作紙上記錄從矮到高的排序猜想。';
      } else if (!this.state.showOrder) {
        guideTag.className = 'guide-step-tag step-alert';
        guideTag.innerText = '👨‍🏫 老師引導 ➔ 排序猜想表決';
        guideText.innerHTML = `4 支量筒注水完畢！請全班對比液面高度，並點擊下方<strong>「🔍 驗證並揭曉升序鏈條」</strong>！`;
        guideSub.innerText = '💡 從矮到高排序：哪一支最低？哪一支最高？';
      } else {
        guideTag.className = 'guide-step-tag step-done';
        guideTag.innerText = '🎉 探究結論 ➔ 升序排列大揭秘';
        guideText.innerHTML = `<strong>0.08 L (80ml) ＜ 0.354 L (354ml) ＜ 0.7 L (700ml) ＜ 0.8 L (800ml)！</strong>換算為毫升後，小數大小一目了然！`;
        guideSub.innerText = '🎯 教師金句：十分數位定乾坤，長度再長莫被蒙！';
      }
    }

    if (window.ipadApp) {
      window.ipadApp.updateTeacherSummary(this.getTeacherSummary());
    }
  },

  destroy() {}
};
