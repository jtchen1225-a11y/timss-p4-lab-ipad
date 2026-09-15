/**
 * lab05.js - 第 5 週：【購物天平與代數天平】 (LAB-W05-N-MSTEP) - iPad 優化版
 * 數與運算 ｜ 應用 Applying ｜ 括號保險箱、代數天平失衡動畫、大觸控模式切換
 */

window.TIMSS_LABS = window.TIMSS_LABS || {};

window.TIMSS_LABS['W05'] = {
  id: 'W05',
  code: 'LAB-W05-N-MSTEP',
  title: '購物天平與代數天平',
  domain: '數與運算 Number',
  domainType: 'number',
  cognitive: '應用 Applying',
  question: '小明拿 $100 買了 3 本每本 $15 的筆記本，找回 $55。天平兩邊該放甚麼才能保持平衡？算式括號該加在哪？',
  activeRole: '🔴 操作員(D) 切換括號模式 ➔ 🟢 發言人(B) 解釋括號保險箱',

  state: {
    mode: 'forward' // 'forward', 'paren', 'noparen'
  },

  getTeacherSummary() {
    return {
      core: `<h4>💡 核心概念提煉</h4><p>在兩步運算與購物情境中，「<strong>付出總額 = 物品總花費 + 找回零錢</strong>」是恆成立的等量關係。當我們要反求每本書的單價時，必須先求出 3 本書的總花費（100 − 55），再除以本數 3。由於乘除運算級別高於加減，若要打破規則強制先算減法，就必須加上「<strong>小括號保險箱</strong>」！</p>`,
      formula: `<h4>📐 核心算式與運算順序對比</h4><p>• <strong>購物守恆方程：</strong>$100 = 3 \\times 15 + 55$<br>• <strong>加括號正確求解：</strong>$(100 - 55) \\div 3 = 45 \\div 3 = \\mathbf{15\\text{ 元}}$（平衡）<br>• ❌ <strong>漏括號致命錯誤：</strong>$100 - 55 \\div 3 \\approx 100 - 18.3 = \\mathbf{81.7\\text{ 元}}$（天平崩潰！）</p>`,
      quote: `🎯 <strong>教師總結金句：</strong>「兩步運算理清序，反求單價先求差；小括號是保險箱，先減後除不走樣！」`
    };
  },

  render(container) {
    this.container = container;
    this.state = { mode: 'forward' };

    container.innerHTML = `
      <div class="ipad-controls-bar">
        <div class="controls-left-group">
          <button class="touch-btn primary" id="w05-btn-fwd">🛍️ 模式一：購物守恆平衡 ($100 = 3×$15 + $55)</button>
          <button class="touch-btn success" id="w05-btn-par">🔒 模式二：反求單價 (加括號保險箱)</button>
          <button class="touch-btn danger" id="w05-btn-nopar">💥 模式三：反求單價 (漏寫括號悲劇)</button>
        </div>
      </div>

      <!-- 大天平視覺區 -->
      <div class="big-balance-wrapper">
        <svg class="big-balance-svg" viewBox="0 0 680 380">
          <polygon points="280,360 400,360 360,180 320,180" fill="#475569" />
          <circle cx="340" cy="150" r="40" fill="#ffffff" stroke="#94a3b8" stroke-width="2.5" />
          <line x1="340" y1="115" x2="340" y2="128" stroke="#059669" stroke-width="3" />
          
          <g id="w05-beam" class="beam-rotate-group" transform="rotate(0, 340, 150)">
            <rect x="90" y="144" width="500" height="12" rx="5" fill="#64748b" />
            <circle cx="340" cy="150" r="10" fill="#1e293b" />
            
            <line x1="140" y1="150" x2="140" y2="230" stroke="#94a3b8" stroke-width="2.5" />
            <ellipse cx="140" cy="235" rx="80" ry="18" fill="#cbd5e1" stroke="#64748b" stroke-width="2.5" />
            
            <line x1="540" y1="150" x2="540" y2="230" stroke="#94a3b8" stroke-width="2.5" />
            <ellipse cx="540" cy="235" rx="80" ry="18" fill="#cbd5e1" stroke="#64748b" stroke-width="2.5" />
            
            <line id="w05-needle" x1="340" y1="150" x2="340" y2="95" class="needle-indicator" />
          </g>

          <g id="w05-left-g"></g>
          <g id="w05-right-g"></g>
        </svg>
      </div>

      <!-- 說明橫幅 -->
      <div id="w05-desc-box" style="margin-top:14px; background:#ecfdf5; border:1.5px solid #86efac; border-radius:10px; padding:12px 16px; font-size:0.95rem;"></div>
    `;

    this.bindEvents();
    this.update();
  },

  bindEvents() {
    const bind = (id, mode, snd) => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('click', () => {
          this.state.mode = mode;
          ['w05-btn-fwd', 'w05-btn-par', 'w05-btn-nopar'].forEach(b => {
            document.getElementById(b)?.classList.remove('primary');
          });
          el.classList.add('primary');
          if (snd === 'chime') window.soundFx.balanceChime();
          else window.soundFx.tiltBuzz();
          this.update();
        });
      }
    };

    bind('w05-btn-fwd', 'forward', 'chime');
    bind('w05-btn-par', 'paren', 'chime');
    bind('w05-btn-nopar', 'noparen', 'buzz');
  },

  update() {
    const beam = document.getElementById('w05-beam');
    const needle = document.getElementById('w05-needle');
    const lG = document.getElementById('w05-left-g');
    const rG = document.getElementById('w05-right-g');
    const desc = document.getElementById('w05-desc-box');

    if (this.state.mode === 'forward') {
      beam.setAttribute('transform', 'rotate(0, 340, 150)');
      needle.style.stroke = '#10b981';

      lG.innerHTML = `
        <rect x="90" y="200" width="100" height="30" rx="4" fill="#10b981" stroke="#047857" stroke-width="2" />
        <text x="140" y="220" fill="white" font-size="13" font-weight="bold" text-anchor="middle">💵 $100 代幣</text>
      `;

      rG.innerHTML = `
        <rect x="470" y="195" width="40" height="38" rx="4" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.5" />
        <text x="490" y="218" fill="white" font-size="10" font-weight="bold" text-anchor="middle">$15</text>
        
        <rect x="500" y="195" width="40" height="38" rx="4" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.5" />
        <text x="520" y="218" fill="white" font-size="10" font-weight="bold" text-anchor="middle">$15</text>
        
        <rect x="530" y="195" width="40" height="38" rx="4" fill="#3b82f6" stroke="#1d4ed8" stroke-width="1.5" />
        <text x="550" y="218" fill="white" font-size="10" font-weight="bold" text-anchor="middle">$15</text>
        
        <rect x="575" y="205" width="40" height="28" rx="4" fill="#f59e0b" stroke="#b45309" stroke-width="1.5" />
        <text x="595" y="223" fill="white" font-size="11" font-weight="bold" text-anchor="middle">$55</text>
      `;

      desc.style.background = '#ecfdf5';
      desc.style.borderColor = '#86efac';
      desc.style.color = '#065f46';
      desc.innerHTML = `⚖️ <strong>購物守恆平衡：</strong>付出的 <strong>$100</strong> ＝ 買下的 3 本筆記本 <strong>3 × $15 ($45)</strong> ＋ 找回的零錢 <strong>$55</strong>！天平完全平衡！`;

    } else if (this.state.mode === 'paren') {
      beam.setAttribute('transform', 'rotate(0, 340, 150)');
      needle.style.stroke = '#10b981';

      lG.innerHTML = `
        <rect x="85" y="195" width="110" height="35" rx="5" fill="#6366f1" stroke="#4338ca" stroke-width="2" />
        <text x="140" y="218" fill="white" font-size="12" font-weight="bold" text-anchor="middle">(100 − 55) ÷ 3</text>
      `;

      rG.innerHTML = `
        <rect x="505" y="190" width="70" height="42" rx="5" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2" />
        <text x="540" y="216" fill="white" font-size="13" font-weight="bold" text-anchor="middle">1 本 $15</text>
      `;

      desc.style.background = '#ecfdf5';
      desc.style.borderColor = '#86efac';
      desc.style.color = '#065f46';
      desc.innerHTML = `🔒 <strong>括號保險箱立大功：</strong>反求單價寫成 <strong>(100 − 55) ÷ 3 ＝ 45 ÷ 3 ＝ 15 元</strong>！括號把 100 減 55 打包在一起先算出花費，天平穩如泰山！`;

    } else if (this.state.mode === 'noparen') {
      beam.setAttribute('transform', 'rotate(-16, 340, 150)');
      needle.style.stroke = '#ef4444';

      lG.innerHTML = `
        <rect x="85" y="170" width="110" height="35" rx="5" fill="#ef4444" stroke="#b91c1c" stroke-width="2" />
        <text x="140" y="192" fill="white" font-size="12" font-weight="bold" text-anchor="middle">100 − 55 ÷ 3</text>
        <text x="140" y="222" fill="#dc2626" font-size="12" font-weight="bold" text-anchor="middle">≈ 81.7 元</text>
      `;

      rG.innerHTML = `
        <rect x="505" y="215" width="70" height="42" rx="5" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2" />
        <text x="540" y="241" fill="white" font-size="13" font-weight="bold" text-anchor="middle">1 本 $15</text>
      `;

      desc.style.background = '#fef2f2';
      desc.style.borderColor = '#fca5a5';
      desc.style.color = '#991b1b';
      desc.innerHTML = `💥 <strong>天平倒下！漏寫括號大悲劇：</strong>若寫成 <strong>100 − 55 ÷ 3</strong>，運算規則強制先算 55 ÷ 3 ≈ 18.3，再算 100 − 18.3 ＝ <strong>81.7 元</strong>！左邊 81.7 元，右邊單價只有 15 元，天平劇烈崩塌！`;
    }

    if (window.ipadApp) {
      window.ipadApp.updateTeacherSummary(this.getTeacherSummary());
    }
  },

  destroy() {}
};
