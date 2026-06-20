/**
 * 音效模块
 * 优先使用Web Audio API生成，回退到预加载的音频文件
 */
const AudioFX = {
    audioCtx: null,
    loaded: {},

    init() {
        try {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        } catch(e) {
            console.warn('Web Audio API not available');
        }
    },

    // 确保AudioContext在用户交互后恢复
    ensureContext() {
        if (!this.audioCtx) this.init();
        if (this.audioCtx && this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    },

    // === 破门声（低频撞击 + 噪音） ===
    doorBreak() {
        this.ensureContext();
        if (!this.audioCtx) return;
        const ctx = this.audioCtx;
        const now = ctx.currentTime;

        // 低频撞击
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.3);
        gain.gain.setValueAtTime(0.8, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);

        // 噪音层（木头碎裂感）
        const bufferSize = ctx.sampleRate * 0.3;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.05));
        }
        const noise = ctx.createBufferSource();
        const noiseGain = ctx.createGain();
        noise.buffer = buffer;
        noiseGain.gain.setValueAtTime(0.3, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        noise.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start(now);
    },

    // === 玻璃碎裂（高频清脆撞击 + 碎片散落） ===
    glassBreak() {
        this.ensureContext();
        if (!this.audioCtx) return;
        const ctx = this.audioCtx;
        const now = ctx.currentTime;

        // 主撞击
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(2000, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.15);
        gain.gain.setValueAtTime(0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);

        // 碎片散落（多次短促高频）
        for (let i = 0; i < 8; i++) {
            const t = now + 0.05 + i * 0.04;
            const f = 3000 + Math.random() * 4000;
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = 'sine';
            o.frequency.setValueAtTime(f, t);
            g.gain.setValueAtTime(0.15, t);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
            o.connect(g);
            g.connect(ctx.destination);
            o.start(t);
            o.stop(t + 0.06);
        }
    },

    // === 电子故障音（glitch效果） ===
    glitch() {
        this.ensureContext();
        if (!this.audioCtx) return;
        const ctx = this.audioCtx;
        const now = ctx.currentTime;

        // 多个短促噪音脉冲
        for (let i = 0; i < 12; i++) {
            const t = now + i * 0.08;
            const dur = 0.02 + Math.random() * 0.06;
            const freq = 200 + Math.random() * 3000;
            
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = Math.random() > 0.5 ? 'square' : 'sawtooth';
            osc.frequency.setValueAtTime(freq, t);
            gain.gain.setValueAtTime(0.2, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(t);
            osc.stop(t + dur);
        }

        // 低频嗡嗡声（系统故障感）
        const hum = ctx.createOscillator();
        const humGain = ctx.createGain();
        hum.type = 'sine';
        hum.frequency.setValueAtTime(50, now);
        humGain.gain.setValueAtTime(0.15, now);
        humGain.gain.setValueAtTime(0.15, now + 0.3);
        humGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        hum.connect(humGain);
        humGain.connect(ctx.destination);
        hum.start(now);
        hum.stop(now + 0.8);
    },

    // === 打字机音效（短促点击） ===
    typewriter() {
        this.ensureContext();
        if (!this.audioCtx) return;
        const ctx = this.audioCtx;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.03);
    },

    // === 门铃声（双音交替） ===
    doorbell() {
        this.ensureContext();
        if (!this.audioCtx) return;
        const ctx = this.audioCtx;
        const now = ctx.currentTime;

        [800, 1000].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            const t = now + i * 0.25;
            osc.frequency.setValueAtTime(freq, t);
            gain.gain.setValueAtTime(0.3, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(t);
            osc.stop(t + 0.2);
        });
    },

    // === 播放指定音效 ===
    play(id) {
        // 先尝试HTML audio元素
        const audioEl = document.getElementById('sfx-' + id);
        if (audioEl && audioEl.src && !audioEl.src.endsWith('mp3')) {
            // 有实际音频文件
            try {
                audioEl.currentTime = 0;
                audioEl.play().catch(() => {});
                return;
            } catch(e) {}
        }
        
        // 回退到Web Audio生成
        switch(id) {
            case 'doorbreak': this.doorBreak(); break;
            case 'glassbreak': this.glassBreak(); break;
            case 'glitch': this.glitch(); break;
            case 'typewriter': this.typewriter(); break;
            case 'doorbell': this.doorbell(); break;
            default: break;
        }
    }
};

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
    AudioFX.init();
});
