/**
 * lab01.js - 第 1 週：【百萬位值拼擺天平】 (LAB-W01-N-PV) - iPad 優化版
 * 教師引導 ➔ 學生主動探究 ➔ 任務切換立即歸零待測
 */

window.TIMSS_LABS = window.TIMSS_LABS || {};

window.TIMSS_LABS['W01'] = {
  id: 'W01',
  code: 'LAB-W01-N-PV',
  title: '百萬位值拼擺天平',
  domain: '數與運算 Number',
  domainType: 'number',
  cognitive: '知識 Knowing',
  question: '數字 432,100 中，千位上的 2 和萬位上的 3，在天平上誰更重？百位上的 0 到底有沒有重量？',
  activeRole: '🔴 操作員(D) 主導天平砝碼 ➔ 🟣 質疑員(A) 挑戰 0 的作用',

  state: {
    mission: 'task1', // 'task1', 'task2', 'task3'
    left1k: 0,
    right10k: 0,
    zeroGuard: true
  },

  getTeacherSummary() {
    return {
      core: `<h4>💡 核心概念提煉</h4><p>數字的大小由「<strong>數碼</strong>」與「<strong>位值</strong>」共同決定。萬位的計數單位（10,000）是千位（1,000）的 10 倍，因此萬位 1 比千位 9 還要大。此外，數字中的「0」雖然數值為 0，但在數位中扮演「<strong>佔位守衛</strong>」的關鍵角色，一旦缺失會導致整體數位向右坍塌。</p>`,
      formula: `<h4>📐 核心算式與位值展開</h4><p>天平實測：萬位 1 個（10,000）＞ 千位 9 個（9,000）。<br>432,100 = <strong>4×100,000 + 3×10,000 + 2×1,000 + 1×100 + 0×10 + 0×1</strong>。<br>萬位 3 代表 30,000，千位 2 代表 2,000，萬位價值遠高於千位。</p>`,
      quote: `🎯 <strong>教師總結金句：</strong>「數位高一位，價值大十倍；0 號保鏢不可少，位值守護不坍塌！」`
    };
  },

  render(container) {
    this.container = container;
    // 進入時完全歸零
    this.state = { mission: 'task1', left1k: 0, right10k: 0, zeroGuard: true };

    container.innerHTML = `
      <!-- 任務切換列：點擊任何任務立即歸零 -->
      <div class="ipad-controls-bar">
        <div class="controls-left-group">
          <button class="touch-btn primary" id="w01-tab-t1">🎯 任務一：千位 9 vs 萬位 1</button>
          <button class="touch-btn" id="w01-tab-t2">📖 任務二：課本題 (千位 2 vs 萬位 3)</button>
          <button class="touch-btn" id="w01-tab-t3">🛡️ 任務三：0 號守衛城堡實驗</button>
        </div>
        <button class="touch-btn" id="w01-btn-reset">🔄 當前任務歸零待測</button>
      </div>

      <!-- 👨‍🏫 教師引導與學生探究導引條 -->
      <div class="teacher-guide-banner" id="w01-guide-banner">
        <div class="guide-header-row">
          <span class="guide-step-tag" id="w01-guide-tag">👨‍🏫 老師引導 ➔ 第 1 步 / 共 2 步</span>
          <span class="guide-mission-title" id="w01-guide-title">任務一：千位 9 vs 萬位 1 對決</span>
        </div>
        <div class="guide-instruction-text" id="w01-guide-text">
          請操作員在<strong>【左盤】</strong>使用 ＋ 按鈕放入 <strong>9 個千位砝碼 (1,000g)</strong>，觀察天平如何傾斜！
        </div>
        <div class="guide-hint-subtext" id="w01-guide-sub">
          💡 天平目前處於 0g 歸零狀態，請由學生親自動手按 ＋ 號操作。
        </div>
      </div>

      <!-- 大天平視覺區 -->
      <div class="big-balance-wrapper">
        <svg class="big-balance-svg" viewBox="0 0 680 380">
          <polygon points="280,360 400,360 360,180 320,180" fill="#475569" />
          <rect x="330" y="140" width="20" height="50" fill="#334155" />
          <circle cx="340" cy="150" r="40" fill="#ffffff" stroke="#94a3b8" stroke-width="2.5" />
          <line x1="340" y1="115" x2="340" y2="128" stroke="#059669" stroke-width="3" />
          
          <!-- 橫樑組件 -->
          <g id="w01-beam" class="beam-rotate-group" transform="rotate(0, 340, 150)">
            <rect x="90" y="144" width="500" height="12" rx="5" fill="#64748b" />
            <circle cx="340" cy="150" r="10" fill="#1e293b" />
            
            <!-- 左吊盤 (千位) -->
            <line x1="140" y1="150" x2="140" y2="230" stroke="#94a3b8" stroke-width="2.5" />
            <ellipse cx="140" cy="235" rx="75" ry="16" fill="#cbd5e1" stroke="#64748b" stroke-width="2.5" />
            
            <!-- 右吊盤 (萬位) -->
            <line x1="540" y1="150" x2="540" y2="230" stroke="#94a3b8" stroke-width="2.5" />
            <ellipse cx="540" cy="235" rx="75" ry="16" fill="#cbd5e1" stroke="#64748b" stroke-width="2.5" />
            
            <line id="w01-needle" x1="340" y1="150" x2="340" y2="95" class="needle-indicator" />
          </g>

          <!-- 左右砝碼圖形 -->
          <g id="w01-left-g"></g>
          <g id="w01-right-g"></g>
        </svg>
      </div>

      <!-- iPad 觸控步進器 (+ - 大按鈕，親自放砝碼) -->
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-top:14px;" id="w01-steppers-area">
        <div style="background:#eff6ff; border:2px solid #bfdbfe; border-radius:12px; padding:12px; display:flex; align-items:center; justify-content:space-between;">
          <div>
            <strong style="color:#1d4ed8; font-size:1rem;">🔵 左盤：千位砝碼 (每個 1,000g)</strong>
            <div style="font-size:0.85rem; color:#64748b;">盤上數量：<span id="w01-l-cnt" style="font-weight:bold; color:#1d4ed8;">0</span> 個 ｜ 總重：<strong id="w01-l-tot" style="color:#1d4ed8; font-size:1.15rem;">0</strong> g</div>
          </div>
          <div class="ipad-stepper">
            <button class="stepper-btn" id="w01-l-sub">−</button>
            <span class="stepper-val" id="w01-l-val">0</span>
            <button class="stepper-btn" id="w01-l-add">+</button>
          </div>
        </div>

        <div style="background:#f5f3ff; border:2px solid #ddd6fe; border-radius:12px; padding:12px; display:flex; align-items:center; justify-content:space-between;">
          <div>
            <strong style="color:#7c3aed; font-size:1rem;">🟣 右盤：萬位砝碼 (每個 10,000g)</strong>
            <div style="font-size:0.85rem; color:#64748b;">盤上數量：<span id="w01-r-cnt" style="font-weight:bold; color:#7c3aed;">0</span> 個 ｜ 總重：<strong id="w01-r-tot" style="color:#7c3aed; font-size:1.15rem;">0</strong> g</div>
          </div>
          <div class="ipad-stepper">
            <button class="stepper-btn" id="w01-r-sub">−</button>
            <span class="stepper-val" id="w01-r-val">0</span>
            <button class="stepper-btn" id="w01-r-add">+</button>
          </div>
        </div>
      </div>

      <!-- 任務三專屬：0 號守衛城堡操作區 -->
      <div id="w01-zero-panel" style="display:none; margin-top:14px; background:#f0fdf4; border:2px solid #86efac; border-radius:12px; padding:14px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <div>
            <strong style="color:#166534; font-size:1.05rem;">🛡️ 百萬數位卡片：</strong>
            <span style="font-size:0.85rem; color:#15803d;">百位上的 0 正在守衛數位崗位</span>
          </div>
          <button class="touch-btn danger" id="w01-btn-toggle-zero" style="font-weight:800;">
            👆 點擊抽走百位「0」守衛！
          </button>
        </div>
        <div id="w01-digits-display" style="display:flex; gap:8px; justify-content:center; margin-top:14px; font-family:monospace; font-size:1.3rem; font-weight:900;"></div>
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
    bind('w01-tab-t1', () => {
      this.state = { mission: 'task1', left1k: 0, right10k: 0, zeroGuard: true };
      this.updateTabs('w01-tab-t1');
      window.soundFx.click();
      this.update();
    });

    bind('w01-tab-t2', () => {
      this.state = { mission: 'task2', left1k: 0, right10k: 0, zeroGuard: true };
      this.updateTabs('w01-tab-t2');
      window.soundFx.click();
      this.update();
    });

    bind('w01-tab-t3', () => {
      this.state = { mission: 'task3', left1k: 0, right10k: 0, zeroGuard: true };
      this.updateTabs('w01-tab-t3');
      window.soundFx.click();
      this.update();
    });

    bind('w01-btn-reset', () => {
      this.state.left1k = 0;
      this.state.right10k = 0;
      this.state.zeroGuard = true;
      window.soundFx.click();
      this.update();
    });

    // 步進按鈕
    bind('w01-l-add', () => {
      if (this.state.left1k < 15) {
        this.state.left1k++;
        window.soundFx.click();
        this.update();
      }
    });
    bind('w01-l-sub', () => {
      if (this.state.left1k > 0) {
        this.state.left1k--;
        window.soundFx.click();
        this.update();
      }
    });

    bind('w01-r-add', () => {
      if (this.state.right10k < 5) {
        this.state.right10k++;
        window.soundFx.click();
        this.update();
      }
    });
    bind('w01-r-sub', () => {
      if (this.state.right10k > 0) {
        this.state.right10k--;
        window.soundFx.click();
        this.update();
      }
    });

    // 抽走/補回 0 號
    bind('w01-btn-toggle-zero', () => {
      this.state.zeroGuard = !this.state.zeroGuard;
      if (this.state.zeroGuard) {
        window.soundFx.balanceChime();
      } else {
        window.soundFx.tiltBuzz();
      }
      this.update();
    });
  },

  updateTabs(activeId) {
    ['w01-tab-t1', 'w01-tab-t2', 'w01-tab-t3'].forEach(id => {
      const b = document.getElementById(id);
      if (b) {
        if (id === activeId) b.classList.add('primary');
        else b.classList.remove('primary');
      }
    });
  },

  update() {
    const lTot = this.state.left1k * 1000;
    const rTot = this.state.right10k * 10000;

    document.getElementById('w01-l-val').innerText = this.state.left1k;
    document.getElementById('w01-l-cnt').innerText = this.state.left1k;
    document.getElementById('w01-l-tot').innerText = lTot.toLocaleString();

    document.getElementById('w01-r-val').innerText = this.state.right10k;
    document.getElementById('w01-r-cnt').innerText = this.state.right10k;
    document.getElementById('w01-r-tot').innerText = rTot.toLocaleString();

    // 角度計算
    const diff = rTot - lTot;
    let angle = 0;
    if (diff !== 0) {
      angle = Math.max(-15, Math.min(15, (diff / 1000) * 1.5));
    }

    const beam = document.getElementById('w01-beam');
    if (beam) beam.setAttribute('transform', `rotate(${angle}, 340, 150)`);

    const needle = document.getElementById('w01-needle');
    if (needle) {
      if (diff === 0 && (lTot > 0 || rTot > 0)) needle.style.stroke = '#059669';
      else if (diff === 0) needle.style.stroke = '#64748b';
      else needle.style.stroke = '#ef4444';
    }

    // 渲染堆疊砝碼
    this.renderWeights('w01-left-g', 140, angle, this.state.left1k, '#3b82f6', '1k');
    this.renderWeights('w01-right-g', 540, -angle, this.state.right10k, '#8b5cf6', '10k');

    // 根據任務模式動態更新「老師引導 ➔ 學生探究」
    const guideTag = document.getElementById('w01-guide-tag');
    const guideTitle = document.getElementById('w01-guide-title');
    const guideText = document.getElementById('w01-guide-text');
    const guideSub = document.getElementById('w01-guide-sub');
    const zeroPanel = document.getElementById('w01-zero-panel');
    const steppersArea = document.getElementById('w01-steppers-area');

    if (this.state.mission === 'task1') {
      zeroPanel.style.display = 'none';
      steppersArea.style.display = 'grid';
      guideTitle.innerText = '任務一：千位 9 vs 萬位 1 對決';

      if (this.state.left1k < 9) {
        guideTag.className = 'guide-step-tag';
        guideTag.innerText = '👨‍🏫 老師引導 ➔ 第 1 步 / 共 2 步';
        guideText.innerHTML = `請操作員在<strong>【左盤】</strong>使用 ＋ 按鈕放入 <strong>9 個千位砝碼 (1,000g)</strong>，觀察左盤如何傾斜！（目前已有 ${this.state.left1k} 個）`;
        guideSub.innerText = '💡 左盤尚未放滿 9 個，請引導學生持續點擊 ＋ 號放入。';
      } else if (this.state.right10k === 0) {
        guideTag.className = 'guide-step-tag step-alert';
        guideTag.innerText = '👨‍🏫 老師引導 ➔ 第 2 步 / 共 2 步';
        guideText.innerHTML = `左盤已達到 9,000g！<strong>請全班大膽猜測：</strong>如果右盤只放 <strong>1 個萬位砝碼 (10,000g)</strong>，誰會沉下去？請操作員在【右盤】放入 1 個萬位砝碼！`;
        guideSub.innerText = '💡 請老師先讓全班舉手表決「9 個千位重」還是「1 個萬位重」，再請學生點擊 ＋ 號見證！';
      } else {
        guideTag.className = 'guide-step-tag step-done';
        guideTag.innerText = '🎉 探究發現 ➔ 結論揭秘';
        guideText.innerHTML = `<strong>右盤萬位沉下去了！</strong>萬位 1 個（10,000g）＞ 千位 9 個（9,000g）！千位雖然個數多達 9 個，但萬位的計數單位是千位的 <strong>10 倍</strong>！`;
        guideSub.innerText = '🎯 教師提煉：數位高一位，價值大十倍！1 個萬位比 9 個千位還要重！';
      }

    } else if (this.state.mission === 'task2') {
      zeroPanel.style.display = 'none';
      steppersArea.style.display = 'grid';
      guideTitle.innerText = '任務二：課本題 432,100 (千位 2 vs 萬位 3)';

      if (this.state.left1k < 2) {
        guideTag.className = 'guide-step-tag';
        guideTag.innerText = '👨‍🏫 老師引導 ➔ 第 1 步 / 共 2 步';
        guideText.innerHTML = `課本數字 432,100 中，千位上是 <strong>2</strong>。請操作員在<strong>【左盤】</strong>放入 <strong>2 個千位砝碼 (2,000g)</strong>。`;
        guideSub.innerText = '💡 請學生觀察數位，找出千位上的數字「2」。';
      } else if (this.state.right10k < 3) {
        guideTag.className = 'guide-step-tag step-alert';
        guideTag.innerText = '👨‍🏫 老師引導 ➔ 第 2 步 / 共 2 步';
        guideText.innerHTML = `萬位上是 <strong>3</strong>。請操作員在<strong>【右盤】</strong>放入 <strong>3 個萬位砝碼 (30,000g)</strong>，看看兩邊差距有多震撼！`;
        guideSub.innerText = '💡 請學生點擊右盤 ＋ 號放至 3 個萬位。';
      } else {
        guideTag.className = 'guide-step-tag step-done';
        guideTag.innerText = '🎉 探究發現 ➔ 結論揭秘';
        guideText.innerHTML = `<strong>右盤 30,000g 徹底壓沉左盤 2,000g！</strong>萬位 3 代表 30,000，千位 2 代表 2,000，萬位的價值足足是千位的 <strong>15 倍</strong>！`;
        guideSub.innerText = '🎯 教師提煉：看數字不能只看數碼大小，更要看數位位值！';
      }

    } else if (this.state.mission === 'task3') {
      zeroPanel.style.display = 'block';
      steppersArea.style.display = 'none';
      guideTitle.innerText = '任務三：0 號守衛城堡實驗 (數字 432,100)';

      const btnZero = document.getElementById('w01-btn-toggle-zero');
      const disp = document.getElementById('w01-digits-display');

      if (this.state.zeroGuard) {
        guideTag.className = 'guide-step-tag';
        guideTag.innerText = '👨‍🏫 老師引導 ➔ 質疑挑戰';
        guideText.innerHTML = `在數字 432,100 中，百位上的 0 代表沒有百。小明質疑：<strong>「既然 0 代表沒有，把它拿掉有差別嗎？」</strong>請操作員點擊下方按鈕，抽走百位 0 號守衛！`;
        guideSub.innerText = '💡 請老師引導學生思考：0 雖然數值為 0，但它的位置能拿掉嗎？';

        if (btnZero) btnZero.innerText = '👆 點擊抽走百位「0」守衛！';
        if (disp) {
          disp.innerHTML = `
            <div style="text-align:center;"><div style="background:#e0f2fe; padding:6px 14px; border-radius:6px; color:#0369a1;">4</div><span style="font-size:0.75rem; color:#64748b;">十萬</span></div>
            <div style="text-align:center;"><div style="background:#f3e8ff; padding:6px 14px; border-radius:6px; color:#7e22ce;">3</div><span style="font-size:0.75rem; color:#64748b;">萬位</span></div>
            <div style="text-align:center;"><div style="background:#dbeafe; padding:6px 14px; border-radius:6px; color:#1d4ed8;">2</div><span style="font-size:0.75rem; color:#64748b;">千位</span></div>
            <div style="text-align:center;"><div style="background:#dcfce7; padding:6px 14px; border-radius:6px; color:#15803d; border:2.5px solid #22c55e;">0</div><span style="font-size:0.75rem; color:#15803d; font-weight:bold;">百位(0號)</span></div>
            <div style="text-align:center;"><div style="background:#fef9c3; padding:6px 14px; border-radius:6px; color:#a16207;">0</div><span style="font-size:0.75rem; color:#64748b;">十位</span></div>
            <div style="text-align:center;"><div style="background:#fef9c3; padding:6px 14px; border-radius:6px; color:#a16207;">0</div><span style="font-size:0.75rem; color:#64748b;">個位</span></div>
          `;
        }
      } else {
        guideTag.className = 'guide-step-tag step-alert';
        guideTag.innerText = '💥 數位大坍塌災難！';
        guideText.innerHTML = `<strong>全體數位向右坍塌成 43,210！</strong>原來的萬位 <strong>3</strong> 直接掉到了千位 <strong>3</strong>，價值從 30,000 暴跌成 3,000（縮水 10 倍！）！0 雖然沒有重量，卻是絕對不可少的佔位守衛！`;
        guideSub.innerText = '🎯 教師金句：0 號保鏢不可少，位值守護不坍塌！';

        if (btnZero) btnZero.innerText = '🛡️ 讓「0」號守衛歸位保護數位';
        if (disp) {
          disp.innerHTML = `
            <div style="text-align:center;"><div style="background:#fee2e2; padding:6px 14px; border-radius:6px; color:#ef4444; border:2px dashed #ef4444;">空</div><span style="font-size:0.75rem; color:#ef4444;">坍塌！</span></div>
            <div style="text-align:center;"><div style="background:#e0f2fe; padding:6px 14px; border-radius:6px; color:#0369a1;">4</div><span style="font-size:0.75rem; color:#64748b;">萬位</span></div>
            <div style="text-align:center;"><div style="background:#f3e8ff; padding:6px 14px; border-radius:6px; color:#7e22ce;">3</div><span style="font-size:0.75rem; color:#7e22ce; font-weight:bold;">掉到千位!</span></div>
            <div style="text-align:center;"><div style="background:#dbeafe; padding:6px 14px; border-radius:6px; color:#1d4ed8;">2</div><span style="font-size:0.75rem; color:#64748b;">百位</span></div>
            <div style="text-align:center;"><div style="background:#fef9c3; padding:6px 14px; border-radius:6px; color:#a16207;">1</div><span style="font-size:0.75rem; color:#64748b;">十位</span></div>
            <div style="text-align:center;"><div style="background:#fef9c3; padding:6px 14px; border-radius:6px; color:#a16207;">0</div><span style="font-size:0.75rem; color:#64748b;">個位</span></div>
          `;
        }
      }
    }

    if (window.ipadApp) {
      window.ipadApp.updateTeacherSummary(this.getTeacherSummary());
    }
  },

  renderWeights(gId, baseX, angle, count, color, label) {
    const g = document.getElementById(gId);
    if (!g) return;
    let html = '';
    const rad = (angle * Math.PI) / 180;
    const dy = (baseX - 340) * Math.sin(rad);
    const panY = 235 + dy;

    for (let i = 0; i < Math.min(count, 10); i++) {
      const cy = panY - 12 - i * 9;
      html += `<rect x="${baseX - 30}" y="${cy}" width="${60}" height="8" rx="3" fill="${color}" stroke="#0f172a" stroke-width="1.2" />
               <text x="${baseX}" y="${cy + 7}" font-size="8" fill="white" font-weight="bold" text-anchor="middle">${label}</text>`;
    }
    if (count > 10) {
      html += `<text x="${baseX}" y="${panY - 110}" font-size="11" fill="#ef4444" font-weight="bold" text-anchor="middle">+${count - 10}個</text>`;
    }
    g.innerHTML = html;
  },

  destroy() {}
};
