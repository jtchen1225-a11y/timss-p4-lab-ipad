/**
 * lab06.js - 第 6 週：【毛線籬笆變形記】 (LAB-W06-MG-PER) - iPad 優化版
 * 教師引導 ➔ 學生主動探究 ➔ 任務切換立即歸零待測 ➔ 資優延伸探究 (轉角兩面靠牆與自訂長寬)
 */

window.TIMSS_LABS = window.TIMSS_LABS || {};

window.TIMSS_LABS['W06'] = {
  id: 'W06',
  code: 'LAB-W06-MG-PER',
  title: '毛線籬笆變形記',
  domain: '測量與幾何 Measurement & Geometry',
  domainType: 'geometry',
  cognitive: '應用 Applying',
  question: '一個長 12cm、寬 8cm 的長方形農場，如果有一邊靠著磚牆，或者要留一道 3cm 的大門，圍一週的籬笆長度會如何變化？',
  activeRole: '🔴 操作員(D) 切換農場邊界條件 ➔ 🟢 發言人(B) 說明扣除的道理',

  state: {
    mission: 'full', // 'full', 'wall', 'gate', 'wall_gate', 'corner'
    length: 12,
    width: 8,
    fenceDeployed: false
  },

  getTeacherSummary() {
    const L = this.state.length;
    const W = this.state.width;
    const full = (L + W) * 2;
    const wallVal = full - L;
    const gateVal = full - 3;
    const bothVal = full - L - 3;
    const cornerVal = L + W;
    return {
      core: `<h4>💡 核心概念提煉</h4><p>周界的數學定義是「<strong>封閉圖形一週邊線的長度總和</strong>」。但在真實籬笆工程中，必須考慮實際邊界條件：現成的牆壁可充當天然屏障（<strong>靠牆邊無需圍籬</strong>），大門是出入通道（<strong>留門處必須扣除</strong>）。動態周界計算體現了數學模型與生活工程的完美結合！</p>`,
      formula: `<h4>📐 核心工程算式與扣除法</h4><p>• <strong>四面封閉總周界：</strong>$(${L} + ${W}) \\times 2 = \\mathbf{${full}\\text{ cm}}$<br>• <strong>長邊靠牆籬笆長：</strong>${full} − ${L} = \\mathbf{${wallVal}\\text{ cm}}$（節省 1 條長邊）<br>• <strong>開闢 3cm 門籬笆長：</strong>${full} − 3 = \\mathbf{${gateVal}\\text{ cm}}$ ｜ <strong>雙重扣減：</strong>${full} − ${L} − 3 = \\mathbf{${bothVal}\\text{ cm}}$<br>• <strong>轉角兩面靠牆：</strong>$${L} + ${W} = \\mathbf{${cornerVal}\\text{ cm}}$（節省整整一半！）</p>`,
      quote: `🎯 <strong>教師總結金句：</strong>「周界本是繞一週，靠牆省下一條邊；留門剪出進出路，扣除無須圍線段！」`
    };
  },

  render(container) {
    this.container = container;
    this.state = { mission: 'full', length: 12, width: 8, fenceDeployed: false };

    container.innerHTML = `
      <!-- 任務切換列：點擊任何任務立即歸零 -->
      <div class="ipad-controls-bar">
        <div class="controls-left-group">
          <button class="touch-btn primary" id="w06-tab-full">🏞️ 任務一：四面全圍籬笆</button>
          <button class="touch-btn" id="w06-tab-wall">🧱 任務二：長邊靠磚牆</button>
          <button class="touch-btn" id="w06-tab-gate">🚪 任務三：底邊開 3cm 門</button>
          <button class="touch-btn" id="w06-tab-both">⭐ 任務四：靠牆＋留門雙重組合</button>
          <button class="touch-btn" id="w06-tab-corner">🚀 任務五：資優延伸探究 (轉角兩面靠牆)</button>
        </div>
        <button class="touch-btn" id="w06-btn-reset">🔄 當前任務歸零待測</button>
      </div>

      <!-- 👨‍🏫 教師引導與學生探究導引條 -->
      <div class="teacher-guide-banner" id="w06-guide-banner">
        <div class="guide-header-row">
          <span class="guide-step-tag" id="w06-guide-tag">👨‍🏫 老師引導 ➔ 第 1 步 / 共 2 步</span>
          <span class="guide-mission-title" id="w06-guide-title">任務一：四面全圍籬笆</span>
        </div>
        <div class="guide-instruction-text" id="w06-guide-text">
          農場長 12cm、寬 8cm，四周尚未圍上籬笆。請操作員點擊下方<strong>「🧶 拉毛線繞一週圍籬笆」</strong>，觀察毛線鋪設！
        </div>
        <div class="guide-hint-subtext" id="w06-guide-sub">
          💡 目前尚未拉線，請讓學生動手點擊拉線按鈕。
        </div>
      </div>

      <!-- 農場尺寸滑桿與操作列 -->
      <div class="ipad-controls-bar" style="background:#f8fafc;">
        <div style="display:flex; align-items:center; gap:8px;">
          <label style="font-weight:bold;">📏 長 (L)：<strong id="w06-l-txt" style="color:var(--primary); font-size:1.1rem;">12</strong> cm</label>
          <input type="range" class="touch-slider" id="w06-l-slider" min="6" max="16" value="12" step="1" style="width:120px;">
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <label style="font-weight:bold;">📐 寬 (W)：<strong id="w06-w-txt" style="color:var(--primary); font-size:1.1rem;">8</strong> cm</label>
          <input type="range" class="touch-slider" id="w06-w-slider" min="4" max="12" value="8" step="1" style="width:120px;">
        </div>
        <button class="touch-btn primary" id="w06-btn-deploy" style="font-weight:800;">🧶 拉毛線繞一週圍籬笆</button>
      </div>

      <!-- 農場大畫布 -->
      <div style="background:#f0fdf4; border:2.5px solid #86efac; border-radius:14px; padding:20px; min-height:360px; display:flex; justify-content:center; align-items:center;">
        <svg width="600" height="320" viewBox="0 0 600 320" id="w06-farm-svg">
          <g id="w06-farm-g"></g>
        </svg>
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
    bind('w06-tab-full', () => {
      this.state.mission = 'full';
      this.state.fenceDeployed = false;
      this.updateTabs('w06-tab-full');
      window.soundFx.click();
      this.update();
    });

    bind('w06-tab-wall', () => {
      this.state.mission = 'wall';
      this.state.fenceDeployed = false;
      this.updateTabs('w06-tab-wall');
      window.soundFx.click();
      this.update();
    });

    bind('w06-tab-gate', () => {
      this.state.mission = 'gate';
      this.state.fenceDeployed = false;
      this.updateTabs('w06-tab-gate');
      window.soundFx.click();
      this.update();
    });

    bind('w06-tab-both', () => {
      this.state.mission = 'wall_gate';
      this.state.fenceDeployed = false;
      this.updateTabs('w06-tab-both');
      window.soundFx.click();
      this.update();
    });

    bind('w06-tab-corner', () => {
      this.state.mission = 'corner';
      this.state.fenceDeployed = false;
      this.updateTabs('w06-tab-corner');
      window.soundFx.click();
      this.update();
    });

    bind('w06-btn-reset', () => {
      this.state.fenceDeployed = false;
      window.soundFx.click();
      this.update();
    });

    // 動手拉線 / 應用變形
    bind('w06-btn-deploy', () => {
      this.state.fenceDeployed = true;
      window.soundFx.rubberSnap();
      this.update();
    });

    const lSlider = document.getElementById('w06-l-slider');
    if (lSlider) {
      lSlider.addEventListener('input', (e) => {
        this.state.length = parseInt(e.target.value);
        this.update();
      });
    }

    const wSlider = document.getElementById('w06-w-slider');
    if (wSlider) {
      wSlider.addEventListener('input', (e) => {
        this.state.width = parseInt(e.target.value);
        this.update();
      });
    }
  },

  updateTabs(activeId) {
    ['w06-tab-full', 'w06-tab-wall', 'w06-tab-gate', 'w06-tab-both', 'w06-tab-corner'].forEach(id => {
      const b = document.getElementById(id);
      if (b) {
        if (id === activeId) b.classList.add('primary');
        else b.classList.remove('primary');
      }
    });
  },

  update() {
    const L = this.state.length;
    const W = this.state.width;
    const scale = 20;
    const full = (L + W) * 2;

    document.getElementById('w06-l-txt').innerText = L;
    document.getElementById('w06-w-txt').innerText = W;

    const isWall = this.state.mission === 'wall' || this.state.mission === 'wall_gate';
    const isGate = this.state.mission === 'gate' || this.state.mission === 'wall_gate';
    const isCorner = this.state.mission === 'corner';
    const isDeployed = this.state.fenceDeployed;

    let needed = full;
    if (isCorner) {
      needed = L + W;
    } else {
      if (isWall) needed -= L;
      if (isGate) needed -= 3;
    }

    const g = document.getElementById('w06-farm-g');
    const rW = L * scale;
    const rH = W * scale;
    const sx = (600 - rW) / 2;
    const sy = (320 - rH) / 2;

    let html = `
      <!-- 草坪底色 -->
      <rect x="${sx}" y="${sy}" width="${rW}" height="${rH}" fill="#bbf7d0" stroke="#86efac" stroke-width="2" rx="4" />
      <text x="${sx + rW / 2}" y="${sy + rH / 2}" font-size="16" fill="#15803d" font-weight="900" text-anchor="middle">🍀 綠色農場草坪</text>
      <text x="${sx + rW / 2}" y="${sy + rH / 2 + 22}" font-size="13" fill="#166534" text-anchor="middle">長 ${L}cm × 寬 ${W}cm</text>
    `;

    // 四周待圍虛線
    html += `
      <rect x="${sx}" y="${sy}" width="${rW}" height="${rH}" fill="none" stroke="#94a3b8" stroke-width="2.5" stroke-dasharray="6,4" rx="4" />
    `;

    // 靠牆渲染
    if (isCorner) {
      // 轉角：頂邊與左邊皆為磚牆
      html += `
        <!-- 頂邊磚牆 -->
        <rect x="${sx - 6}" y="${sy - 14}" width="${rW + 12}" height="14" fill="#b91c1c" stroke="#7f1d1d" stroke-width="2" rx="2" />
        <text x="${sx + rW / 2}" y="${sy - 2}" font-size="11" fill="#fef2f2" font-weight="bold" text-anchor="middle">🧱 圍牆轉角 (北牆 ${L}cm)</text>
        <!-- 左邊磚牆 -->
        <rect x="${sx - 14}" y="${sy - 14}" width="14" height="${rH + 28}" fill="#b91c1c" stroke="#7f1d1d" stroke-width="2" rx="2" />
        <text x="${sx - 24}" y="${sy + rH / 2}" font-size="11" fill="#b91c1c" font-weight="bold" text-anchor="middle" transform="rotate(-90, ${sx - 24}, ${sy + rH / 2})">🧱 西牆 (${W}cm)</text>
      `;
    } else if (isWall) {
      // 頂邊紅磚牆
      html += `
        <rect x="${sx - 6}" y="${sy - 14}" width="${rW + 12}" height="14" fill="#b91c1c" stroke="#7f1d1d" stroke-width="2" rx="2" />
        <text x="${sx + rW / 2}" y="${sy - 2}" font-size="11" fill="#fef2f2" font-weight="bold" text-anchor="middle">🧱 現成紅磚牆 (${L}cm - 無需圍籬)</text>
      `;
    }

    // 鋪設紅色毛線籬笆
    if (isDeployed) {
      if (isCorner) {
        // 轉角：只圍右邊和底邊
        html += `
          <!-- 右邊籬笆 -->
          <line x1="${sx + rW}" y1="${sy}" x2="${sx + rW}" y2="${sy + rH}" stroke="#ef4444" stroke-width="6" stroke-linecap="round" />
          <text x="${sx + rW + 16}" y="${sy + rH / 2}" font-size="12" fill="#dc2626" font-weight="bold">🧶 寬 ${W}cm</text>
          <!-- 底邊籬笆 -->
          <line x1="${sx}" y1="${sy + rH}" x2="${sx + rW}" y2="${sy + rH}" stroke="#ef4444" stroke-width="6" stroke-linecap="round" />
          <text x="${sx + rW / 2}" y="${sy + rH + 20}" font-size="12" fill="#dc2626" font-weight="bold" text-anchor="middle">🧶 長 ${L}cm</text>
        `;
      } else {
        // 頂邊
        if (!isWall) {
          html += `<line x1="${sx}" y1="${sy}" x2="${sx + rW}" y2="${sy}" stroke="#ef4444" stroke-width="6" stroke-linecap="round" />`;
        }
        // 左邊與右邊
        html += `<line x1="${sx}" y1="${sy}" x2="${sx}" y2="${sy + rH}" stroke="#ef4444" stroke-width="6" stroke-linecap="round" />`;
        html += `<line x1="${sx + rW}" y1="${sy}" x2="${sx + rW}" y2="${sy + rH}" stroke="#ef4444" stroke-width="6" stroke-linecap="round" />`;

        // 底邊
        if (isGate) {
          const gatePx = 3 * scale;
          const gS = sx + rW / 2 - gatePx / 2;
          const gE = gS + gatePx;
          html += `
            <line x1="${sx}" y1="${sy + rH}" x2="${gS}" y2="${sy + rH}" stroke="#ef4444" stroke-width="6" stroke-linecap="round" />
            <rect x="${gS}" y="${sy + rH - 5}" width="${gatePx}" height="10" fill="#d97706" rx="3" />
            <text x="${(gS + gE) / 2}" y="${sy + rH + 20}" font-size="12" fill="#b45309" font-weight="bold" text-anchor="middle">🚪 3cm 大門 (扣除3cm)</text>
            <line x1="${gE}" y1="${sy + rH}" x2="${sx + rW}" y2="${sy + rH}" stroke="#ef4444" stroke-width="6" stroke-linecap="round" />
          `;
        } else {
          html += `<line x1="${sx}" y1="${sy + rH}" x2="${sx + rW}" y2="${sy + rH}" stroke="#ef4444" stroke-width="6" stroke-linecap="round" />`;
        }
      }
    }

    g.innerHTML = html;

    // 導引條更新
    const guideTag = document.getElementById('w06-guide-tag');
    const guideTitle = document.getElementById('w06-guide-title');
    const guideText = document.getElementById('w06-guide-text');
    const guideSub = document.getElementById('w06-guide-sub');
    const btnDeploy = document.getElementById('w06-btn-deploy');

    if (this.state.mission === 'full') {
      guideTitle.innerText = '任務一：四面全圍籬笆';
      if (btnDeploy) btnDeploy.innerText = '🧶 拉毛線繞一週圍籬笆';

      if (!isDeployed) {
        guideTag.className = 'guide-step-tag';
        guideTag.innerText = '👨‍🏫 老師引導 ➔ 第 1 步 / 共 2 步';
        guideText.innerHTML = `農場長 12cm、寬 8cm，四周尚未圍籬。請操作員點擊上方<strong>「🧶 拉毛線繞一週圍籬笆」</strong>，親自量出四面總長！`;
        guideSub.innerText = '💡 目前尚未鋪設籬笆，等待學生操作。';
      } else {
        guideTag.className = 'guide-step-tag step-done';
        guideTag.innerText = '🎉 探究結論 ➔ 四面封閉總周界';
        guideText.innerHTML = `<strong>紅色毛線繞滿四周！</strong>算式是 <strong>(${L} ＋ ${W}) × 2 ＝ ${full} cm</strong>！圍滿這座農場正好需要 <strong>${full} cm</strong> 毛線！`;
        guideSub.innerText = '🎯 教師金句：周界本是繞一週，四邊相加求總長！';
      }

    } else if (this.state.mission === 'wall') {
      guideTitle.innerText = '任務二：長邊改靠現成磚牆';
      if (btnDeploy) btnDeploy.innerText = '🧱 應用：長邊靠磚牆剪掉頂邊毛線';

      if (!isDeployed) {
        guideTag.className = 'guide-step-tag step-alert';
        guideTag.innerText = '👨‍🏫 老師引導 ➔ 現成牆壁情境探究';
        guideText.innerHTML = `如果農場長邊靠著一堵現成的紅磚牆。小明說：<strong>「頂部已經有牆了，還要圍籬笆嗎？」</strong>請操作員點擊上方<strong>「🧱 應用：長邊靠磚牆」</strong>！`;
        guideSub.innerText = '💡 請全班猜測：毛線能省下多少？';
      } else {
        guideTag.className = 'guide-step-tag step-done';
        guideTag.innerText = '🎉 探究結論 ➔ 靠牆省下一條長邊！';
        guideText.innerHTML = `<strong>磚牆替換了頂邊！</strong>算式是 <strong>${full} − ${L} (牆) ＝ ${needed} cm</strong>！頂邊不需要圍籬笆，<strong>毛線只需 ${needed} cm，省下了整整 ${L} cm！</strong>`;
        guideSub.innerText = '🎯 教師金句：現成磚牆當屏障，省下一條長邊長！';
      }

    } else if (this.state.mission === 'gate') {
      guideTitle.innerText = '任務三：底邊開闢 3cm 大門';
      if (btnDeploy) btnDeploy.innerText = '🚪 應用：底邊剪出 3cm 大門通道';

      if (!isDeployed) {
        guideTag.className = 'guide-step-tag step-alert';
        guideTag.innerText = '👨‍🏫 老師引導 ➔ 大門進出情境探究';
        guideText.innerHTML = `農場需要留一道 3cm 大門讓人進出，出入口不能用毛線封死！請操作員點擊上方<strong>「🚪 應用：底邊剪出 3cm 大門」</strong>！`;
        guideSub.innerText = '💡 門是通道，不能被籬笆攔截。';
      } else {
        guideTag.className = 'guide-step-tag step-done';
        guideTag.innerText = '🎉 探究結論 ➔ 留門扣除門寬！';
        guideText.innerHTML = `<strong>底邊剪開了 3cm 通道！</strong>算式是 <strong>${full} − 3 (門) ＝ ${needed} cm</strong>！開闢大門只需扣除門的寬度，實用毛線只需 <strong>${needed} cm</strong>！`;
        guideSub.innerText = '🎯 教師金句：留門剪出進出路，扣除通道實用長！';
      }

    } else if (this.state.mission === 'wall_gate') {
      guideTitle.innerText = '任務四：靠牆 ＋ 留門雙重組合';
      if (btnDeploy) btnDeploy.innerText = '⭐ 應用：靠牆又留門';

      if (!isDeployed) {
        guideTag.className = 'guide-step-tag step-alert';
        guideTag.innerText = '👨‍🏫 老師引導 ➔ 綜合工程挑戰';
        guideText.innerHTML = `如果農場頂部靠磚牆，底邊又留了 3cm 大門。該怎麼計算需要的毛線？請操作員點擊上方<strong>「⭐ 應用：靠牆又留門」</strong>！`;
        guideSub.innerText = '💡 同時考慮天然屏障與出入通道。';
      } else {
        guideTag.className = 'guide-step-tag step-done';
        guideTag.innerText = '🎉 探究結論 ➔ 雙重扣減模型';
        guideText.innerHTML = `<strong>雙重扣減成功！</strong>算式是 <strong>${full} − ${L} (牆) − 3 (門) ＝ ${needed} cm</strong>！圍籬工程只需 <strong>${needed} cm</strong> 毛線！`;
        guideSub.innerText = '🎯 教師金句：幾何結合真實生活，邊界條件決定算法！';
      }

    } else if (this.state.mission === 'corner') {
      guideTitle.innerText = '任務五：資優延伸探究 (轉角兩面靠牆)';
      if (btnDeploy) btnDeploy.innerText = '🏡 應用：轉角兩面靠牆圍籬';

      if (!isDeployed) {
        guideTag.className = 'guide-step-tag';
        guideTag.innerText = '🚀 資優挑戰 ➔ 轉角農場雙面靠牆';
        guideText.innerHTML = `農場建在圍牆轉角（北邊和西邊都是現成高牆）。請問只需要圍幾條邊？請操作員點擊上方<strong>「🏡 應用：轉角兩面靠牆圍籬」</strong>！`;
        guideSub.innerText = '💡 請學生思考：省下了幾條長、幾條寬？';
      } else {
        guideTag.className = 'guide-step-tag step-done';
        guideTag.innerText = '🎉 探究結論 ➔ 轉角省下一半周界！';
        guideText.innerHTML = `<strong>只需圍剩下的 1 個長和 1 個寬！</strong>算式為 <strong>${L} ＋ ${W} ＝ ${needed} cm</strong>！比起全圍 ${full} cm，省下了整整一半！試著調整長寬滑桿，規律始終成立！`;
        guideSub.innerText = '🎯 體會邊界約束對周界幾何的極限簡化！';
      }
    }

    if (window.ipadApp) {
      window.ipadApp.updateTeacherSummary(this.getTeacherSummary());
    }
  },

  destroy() {}
};
