/**
 * pen-tool.js - 獨立防干擾 iPad 專用畫筆與雷射筆模組
 * 解決畫筆寫完後無法取消、阻擋實驗操作的問題
 */

class PenTool {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.isActive = false;
    this.isLaser = false;
    this.isDrawing = false;
    this.color = '#ef4444';
    this.size = 4;
    this.isEraser = false;
    this.laserDot = null;
  }

  init() {
    this.canvas = document.getElementById('whiteboard-canvas');
    this.laserDot = document.getElementById('laser-dot');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // 初始狀態：完全穿透，不阻擋任何觸控
    this.canvas.style.pointerEvents = 'none';

    this.bindEvents();
  }

  resize() {
    if (!this.canvas) return;
    // 儲存現有筆跡
    let imgData = null;
    if (this.ctx && this.canvas.width > 0 && this.canvas.height > 0) {
      imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    if (imgData && this.ctx) {
      this.ctx.putImageData(imgData, 0, 0);
    }
  }

  bindEvents() {
    // 指針繪畫事件（相容 iPad 觸控與滑鼠）
    const getPos = (e) => {
      return { x: e.clientX, y: e.clientY };
    };

    const startDraw = (e) => {
      if (!this.isActive) return;
      this.isDrawing = true;
      const pos = getPos(e);
      this.ctx.beginPath();
      this.ctx.moveTo(pos.x, pos.y);
      if (this.isEraser) {
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.lineWidth = 20;
      } else {
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.size;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
      }
    };

    const draw = (e) => {
      if (!this.isActive || !this.isDrawing) return;
      const pos = getPos(e);
      this.ctx.lineTo(pos.x, pos.y);
      this.ctx.stroke();
    };

    const stopDraw = () => {
      if (this.isDrawing) {
        this.isDrawing = false;
        this.ctx.closePath();
      }
    };

    this.canvas.addEventListener('pointerdown', startDraw);
    this.canvas.addEventListener('pointermove', draw);
    this.canvas.addEventListener('pointerup', stopDraw);
    this.canvas.addEventListener('pointercancel', stopDraw);

    // 雷射筆跟隨游標
    window.addEventListener('pointermove', (e) => {
      if (this.isLaser && this.laserDot) {
        this.laserDot.style.left = `${e.clientX}px`;
        this.laserDot.style.top = `${e.clientY}px`;
      }
    });

    // 鍵盤 Esc 鍵快速退出畫筆
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isActive) {
        this.togglePen(false);
      }
    });
  }

  // 開啟或關閉畫筆
  togglePen(enable) {
    this.isActive = (enable !== undefined) ? enable : !this.isActive;
    const penSubMenu = document.getElementById('pen-sub-menu');
    const mainBtn = document.getElementById('btn-toggle-pen');

    if (this.isActive) {
      // 啟用畫筆：開啟 Canvas 事件攔截
      this.canvas.style.pointerEvents = 'auto';
      this.canvas.style.cursor = 'crosshair';
      if (penSubMenu) penSubMenu.style.display = 'flex';
      if (mainBtn) mainBtn.classList.add('active');
      window.soundFx.click();
    } else {
      // ❌ 退出畫筆：關閉 Canvas 攔截，立即恢復底層實驗的觸控操作！
      this.isDrawing = false;
      this.canvas.style.pointerEvents = 'none';
      this.canvas.style.cursor = 'default';
      if (penSubMenu) penSubMenu.style.display = 'none';
      if (mainBtn) mainBtn.classList.remove('active');
      window.soundFx.click();
    }
  }

  setColor(col) {
    this.color = col;
    this.isEraser = false;
  }

  setEraser() {
    this.isEraser = true;
  }

  clear() {
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      window.soundFx.click();
    }
  }

  toggleLaser(enable) {
    this.isLaser = (enable !== undefined) ? enable : !this.isLaser;
    const laserBtn = document.getElementById('btn-toggle-laser');
    if (this.laserDot) {
      this.laserDot.style.display = this.isLaser ? 'block' : 'none';
    }
    if (laserBtn) {
      laserBtn.classList.toggle('active', this.isLaser);
    }
    window.soundFx.click();
  }
}

window.penTool = new PenTool();
