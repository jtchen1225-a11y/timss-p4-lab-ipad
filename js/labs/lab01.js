/**
 * lab01.js - 第 1 週：【百萬位值拼擺天平】 (LAB-W01-N-PV) - iPad 優化版 (一步步動手探索)
 * 數與運算 ｜ 知識 Knowing ｜ 歸零待測、逐步加減砝碼、0號守衛數位坍塌
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
    left1k: 0,
    right10k: 0,
    zeroGuard: true
  },

  getTeacherSummary() {
    const leftTotal = this.state.left1k * 1000;
    const rightTotal = this.state.right10k * 10000;
    return {
      core: `<h4>💡 核心概念提煉</h4><p>數字的大小由「<strong>數碼</strong>」與「<strong>位值</strong>」共同決定。萬位的計數單位（10,000）是千位（1,000）的 10 倍，因此萬位 1 比千位 9 還要大。此外，數字中的「0」雖然數值為 0，但在數位中扮演「<strong>佔位守衛</strong>」的關鍵角色，一旦缺失會導致整體數位向右坍塌。</p>`,
      formula: `<h4>📐 核心算式與位值展開</h4><p>天平實測：萬位 1 個（10,000）＞ 千位 9 個（9,000）。<br>432,100 = <strong>4×100,000 + 3×10,000 + 2×1,000 + 1×100 + 0×10 + 0×1</strong>。<br>萬位 3 代表 30,000，千位 2 代表 2,000，萬位價值遠高於千位。</p>`,
      quote: `🎯 <strong>教師總結金句：</strong>「數位高一位，價值大十倍；0 號保鏢不可少，位值守護不坍塌！」`
    };
  },

  render(container) {
    this.container = container;
    this.state = { left1k: 0, right10k: 0, zeroGuard: true };

    container.innerHTML = `
      <div class="ipad-controls-bar">
        <div class="controls-left-group">
          <button class="touch-btn" id="w01-btn-conflict">🎯 任務一：千位 9 vs 萬位 1</button>
          <button class="touch-btn" id="w01-btn-432100">📖 任務二：課本題 (千位 2 vs 萬位 3)</button>
          <button class="touch-btn warning" id="w01-btn-zero">🛡️ 0 號守衛城堡：<span id="w01-zero-text">在崗守衛</span></button>
        </div>
        <button class="touch-btn" id="w01-btn-reset">🔄 歸零天平 (0g vs 0g)</button>
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
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin-top:14px;">
        <div style="background:#eff6ff; border:2px solid #bfdbfe; border-radius:12px; padding:12px; display:flex; align-items:center; justify-content:space-between;">
          <div>
            <strong style="color:#1d4ed8; font-size:1rem;">🔵 左盤：千位砝碼 (每個 1,000g)</strong>
            <div style="font-size:0.85rem; color:#64748b;">盤上數量：<span id="w01-l-cnt" style="font-weight:bold; color:#1d4ed8;">0</span> 個 ｜ 總重：<strong id="w01-l-tot" style="color:#1d4ed8; font-size:1.15rem;">0</strong> g</div>
          </div>
          <div class="ipad-stepper">
            <button class="stepper-btn" id="w01-l-sub" title="減少一個千位砝碼">−</button>
            <span class="stepper-val" id="w01-l-val">0</span>
            <button class="stepper-btn" id="w01-l-add" title="增加一個千位砝碼">+</button>
          </div>
        </div>

        <div style="background:#f5f3ff; border:2px solid #ddd6fe; border-radius:12px; padding:12px; display:flex; align-items:center; justify-content:space-between;">
          <div>
            <strong style="color:#7c3aed; font-size:1rem;">🟣 右盤：萬位砝碼 (每個 10,000g)</strong>
            <div style="font-size:0.85rem; color:#64748b;">盤上數量：<span id="w01-r-cnt" style="font-weight:bold; color:#7c3aed;">0</span> 個 ｜ 總重：<strong id="w01-r-tot" style="color:#7c3aed; font-size:1.15rem;">0</strong> g</div>
          </div>
          <div class="ipad-stepper">
            <button class="stepper-btn" id="w01-r-sub" title="減少一個萬位砝碼">−</button>
            <span class="stepper-val" id="w01-r-val">0</span>
            <button class="stepper-btn" id="w01-r-add">+</button>
          </div>
        </div>
      </div>

      <!-- 動態天平狀態回饋與 0 號守衛卡片 -->
      <div id="w01-status-box" style="margin-top:12px; background:#f8fafc; border:1.5px solid #cbd5e1; border-radius:10px; padding:10px 14px; font-size:0.92rem; color:#334155;"></div>

      <div id="w01-zero-box" style="margin-top:10px; background:#f0fdf4; border:1.5px solid #86efac; border-radius:10px; padding:12px 14px; font-size:0.9rem; color:#166534;"></div>
    `;

    this.bindEvents();
    this.update();
  },

  bindEvents() {
    const bind = (id, fn) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', fn);
    };

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

    bind('w01-btn-conflict', () => {
      this.state.left1k = 9;
      this.state.right10k = 1;
      this.state.zeroGuard = true;
      window.soundFx.tiltBuzz();
      this.update();
    });

    bind('w01-btn-432100', () => {
      this.state.left1k = 2;
      this.state.right10k = 3;
      this.state.zeroGuard = true;
      window.soundFx.balanceChime();
      this.update();
    });

    bind('w01-btn-zero', () => {
      this.state.zeroGuard = !this.state.zeroGuard;
      window.soundFx.tiltBuzz();
      this.update();
    });

    bind('w01-btn-reset', () => {
      this.state = { left1k: 0, right10k: 0, zeroGuard: true };
      window.soundFx.click();
      this.update();
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

    // 指針顏色
    const needle = document.getElementById('w01-needle');
    if (needle) {
      if (diff === 0 && (lTot > 0 || rTot > 0)) {
        needle.style.stroke = '#059669';
      } else if (diff === 0) {
        needle.style.stroke = '#64748b';
      } else {
        needle.style.stroke = '#ef4444';
      }
    }

    // 渲染堆疊砝碼
    this.renderWeights('w01-left-g', 140, angle, this.state.left1k, '#3b82f6', '1k');
    this.renderWeights('w01-right-g', 540, -angle, this.state.right10k, '#8b5cf6', '10k');

    // 天平實況文字提示
    const statusBox = document.getElementById('w01-status-box');
    if (statusBox) {
      if (lTot === 0 && rTot === 0) {
        statusBox.style.background = '#f8fafc';
        statusBox.style.borderColor = '#cbd5e1';
        statusBox.style.color = '#475569';
        statusBox.innerHTML = `⚖️ <strong>天平處於 0g 歸零平衡待測狀態。</strong>請點擊上方任務按鈕或點擊 <strong>＋/−</strong>，親自為兩端放上砝碼展開探索！`;
      } else if (diff === 0) {
        statusBox.style.background = '#ecfdf5';
        statusBox.style.borderColor = '#86efac';
        statusBox.style.color = '#065f46';
        statusBox.innerHTML = `⚖️ <strong>兩端完全平衡！</strong>左盤 ${lTot.toLocaleString()}g ＝ 右盤 ${rTot.toLocaleString()}g。`;
      } else if (diff > 0) {
        statusBox.style.background = '#f5f3ff';
        statusBox.style.borderColor = '#ddd6fe';
        statusBox.style.color = '#6b21a8';
        statusBox.innerHTML = `🟣 <strong>右盤萬位沉下去！</strong>右盤比左盤重 <strong>${diff.toLocaleString()}g</strong>！即使千位放了多顆，萬位 1 顆（10,000g）依然更重！`;
      } else {
        statusBox.style.background = '#eff6ff';
        statusBox.style.borderColor = '#bfdbfe';
        statusBox.style.color = '#1e40af';
        statusBox.innerHTML = `🔵 <strong>左盤千位沉下去！</strong>左盤總重 ${lTot.toLocaleString()}g 大於右盤 ${rTot.toLocaleString()}g。`;
      }
    }

    // 0 號守衛城堡展示卡片
    const zeroBtnText = document.getElementById('w01-zero-text');
    const zeroBox = document.getElementById('w01-zero-box');
    if (this.state.zeroGuard) {
      if (zeroBtnText) zeroBtnText.innerText = '堅守崗位 (432,100)';
      if (zeroBox) {
        zeroBox.style.background = '#f0fdf4';
        zeroBox.style.borderColor = '#86efac';
        zeroBox.style.color = '#166534';
        zeroBox.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
            <div>
              🛡️ <strong>【0 號守衛城堡】在崗狀態：</strong>當前數位完整為 <strong>432,100</strong>
              <div style="font-size:0.85rem; margin-top:4px; color:#15803d;">
                百位 0 堅守在崗 ➔ 萬位上的 <strong>3</strong> 代表 <strong>30,000</strong>，千位上的 <strong>2</strong> 代表 <strong>2,000</strong>！
              </div>
            </div>
            <div style="display:inline-flex; gap:4px; font-family:monospace; font-size:1.1rem; font-weight:bold;">
              <span style="background:#e0f2fe; padding:2px 8px; border-radius:4px; color:#0369a1;">4</span>
              <span style="background:#f3e8ff; padding:2px 8px; border-radius:4px; color:#7e22ce;">3</span>
              <span style="background:#dbeafe; padding:2px 8px; border-radius:4px; color:#1d4ed8;">2</span>
              <span style="background:#dcfce7; padding:2px 8px; border-radius:4px; color:#15803d; border:2px solid #22c55e;">0</span>
              <span style="background:#fef9c3; padding:2px 8px; border-radius:4px; color:#a16207;">0</span>
              <span style="background:#fef9c3; padding:2px 8px; border-radius:4px; color:#a16207;">0</span>
            </div>
          </div>
        `;
      }
    } else {
      if (zeroBtnText) zeroBtnText.innerText = '⚠️ 擅離職守 (坍塌為 43,210)';
      if (zeroBox) {
        zeroBox.style.background = '#fef2f2';
        zeroBox.style.borderColor = '#fca5a5';
        zeroBox.style.color = '#991b1b';
        zeroBox.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
            <div>
              💥 <strong>【數位大坍塌災難！】</strong>百位的 0 被抽走，全體數位向右坍塌成 <strong>43,210</strong>！
              <div style="font-size:0.85rem; margin-top:4px; color:#b91c1c;">
                原來的萬位 <strong>3</strong>（30,000）直接掉成了千位 <strong>3</strong>（3,000，縮水 10 倍！），0 雖看似沒重量，卻是絕對不可缺少的守衛！
              </div>
            </div>
            <div style="display:inline-flex; gap:4px; font-family:monospace; font-size:1.1rem; font-weight:bold;">
              <span style="background:#fee2e2; padding:2px 8px; border-radius:4px; color:#991b1b; text-decoration:line-through;">空</span>
              <span style="background:#e0f2fe; padding:2px 8px; border-radius:4px; color:#0369a1;">4</span>
              <span style="background:#f3e8ff; padding:2px 8px; border-radius:4px; color:#7e22ce;">3</span>
              <span style="background:#dbeafe; padding:2px 8px; border-radius:4px; color:#1d4ed8;">2</span>
              <span style="background:#fef9c3; padding:2px 8px; border-radius:4px; color:#a16207;">1</span>
              <span style="background:#fef9c3; padding:2px 8px; border-radius:4px; color:#a16207;">0</span>
            </div>
          </div>
        `;
      }
    }

    // 同步更新下方教師最後的總結
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
      html += `<rect x="${baseX - 30}" y="${cy}" width="60" height="8" rx="3" fill="${color}" stroke="#0f172a" stroke-width="1.2" />
               <text x="${baseX}" y="${cy + 7}" font-size="8" fill="white" font-weight="bold" text-anchor="middle">${label}</text>`;
    }
    if (count > 10) {
      html += `<text x="${baseX}" y="${panY - 110}" font-size="11" fill="#ef4444" font-weight="bold" text-anchor="middle">+${count - 10}個</text>`;
    }
    g.innerHTML = html;
  },

  destroy() {}
};
