const Audio8Bit = (() => {
    let ctx = null;
    let masterGain = null;
    let musicOsc = null;
    let musicGain = null;

    function init() {
        if (ctx) return;
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        masterGain = ctx.createGain();
        masterGain.gain.value = 0.3;
        masterGain.connect(ctx.destination);
    }

    function playNote(freq, duration, type = 'square', volume = 0.15) {
        if (!ctx) init();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.value = volume;
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
    }

    function textBlip() {
        if (!ctx) init();
        playNote(400 + Math.random() * 200, 0.05, 'square', 0.08);
    }

    function menuSelect() {
        if (!ctx) init();
        playNote(600, 0.05, 'square', 0.1);
        setTimeout(() => playNote(800, 0.08, 'square', 0.1), 60);
    }

    function menuConfirm() {
        if (!ctx) init();
        playNote(500, 0.06, 'square', 0.12);
        setTimeout(() => playNote(700, 0.06, 'square', 0.12), 70);
        setTimeout(() => playNote(1000, 0.1, 'square', 0.12), 140);
    }

    function damage() {
        if (!ctx) init();
        playNote(200, 0.15, 'sawtooth', 0.2);
        setTimeout(() => playNote(150, 0.15, 'sawtooth', 0.15), 80);
    }

    function heal() {
        if (!ctx) init();
        playNote(400, 0.1, 'sine', 0.12);
        setTimeout(() => playNote(600, 0.1, 'sine', 0.12), 100);
        setTimeout(() => playNote(800, 0.15, 'sine', 0.12), 200);
    }

    function battleStart() {
        if (!ctx) init();
        for (let i = 0; i < 6; i++) {
            setTimeout(() => playNote(300 + i * 100, 0.1, 'square', 0.15), i * 80);
        }
    }

    const melodies = {
        title: [
            [262, 0.3], [330, 0.3], [392, 0.3], [523, 0.6],
            [392, 0.3], [330, 0.3], [262, 0.6],
            [294, 0.3], [349, 0.3], [440, 0.3], [587, 0.6],
            [440, 0.3], [349, 0.3], [294, 0.6],
        ],
        overworld: [
            [330, 0.2], [392, 0.2], [440, 0.2], [392, 0.2],
            [330, 0.2], [294, 0.2], [262, 0.4],
            [294, 0.2], [330, 0.2], [392, 0.2], [440, 0.4],
            [392, 0.2], [330, 0.2], [294, 0.4],
        ],
        battle: [
            [196, 0.15], [262, 0.15], [196, 0.15], [262, 0.15],
            [233, 0.15], [311, 0.15], [233, 0.15], [311, 0.15],
            [196, 0.15], [262, 0.15], [330, 0.15], [392, 0.15],
            [330, 0.15], [262, 0.15], [196, 0.3],
        ],
        kob: [
            [220, 0.4], [262, 0.4], [330, 0.4], [294, 0.4],
            [262, 0.4], [220, 0.8],
            [247, 0.4], [294, 0.4], [349, 0.4], [330, 0.4],
            [294, 0.4], [247, 0.8],
        ],
        ending: [
            [262, 0.4], [330, 0.4], [392, 0.4], [523, 0.8],
            [440, 0.4], [392, 0.4], [330, 0.4], [262, 0.8],
            [294, 0.4], [349, 0.4], [440, 0.6], [523, 0.6],
            [660, 1.0],
        ],
    };

    let currentMelody = null;
    let melodyTimeout = null;
    let melodyIndex = 0;
    let isMelodyPlaying = false;

    function playMelody(name) {
        stopMelody();
        const mel = melodies[name];
        if (!mel) return;
        if (!ctx) init();
        currentMelody = name;
        melodyIndex = 0;
        isMelodyPlaying = true;
        function next() {
            if (!isMelodyPlaying || currentMelody !== name) return;
            if (melodyIndex >= mel.length) melodyIndex = 0;
            const [freq, dur] = mel[melodyIndex];
            playNote(freq, dur * 0.9, 'square', 0.08);
            melodyIndex++;
            melodyTimeout = setTimeout(next, dur * 1000);
        }
        next();
    }

    function stopMelody() {
        isMelodyPlaying = false;
        currentMelody = null;
        if (melodyTimeout) {
            clearTimeout(melodyTimeout);
            melodyTimeout = null;
        }
    }

    return {
        init, playNote, textBlip, menuSelect, menuConfirm,
        damage, heal, battleStart, playMelody, stopMelody
    };
})();
