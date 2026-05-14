(() => {
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    const W = 640, H = 480;

    canvas.width = W;
    canvas.height = H;

    function resizeCanvas() {
        const ratio = W / H;
        let cw = window.innerWidth;
        let ch = window.innerHeight;
        if (cw / ch > ratio) {
            cw = ch * ratio;
        } else {
            ch = cw / ratio;
        }
        canvas.style.width = cw + 'px';
        canvas.style.height = ch + 'px';
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // ───── On-screen controls ─────
    const controlsDiv = document.getElementById('controls');
    const btnUp = document.getElementById('btn-up');
    const btnDown = document.getElementById('btn-down');
    const btnLeft = document.getElementById('btn-left');
    const btnRight = document.getElementById('btn-right');
    const btnConfirm = document.getElementById('btn-confirm');
    const btnCancel = document.getElementById('btn-cancel');

    function simulateKey(code) {
        if (!keys[code]) justPressed[code] = true;
        keys[code] = true;
        if (!audioInited) {
            Audio8Bit.init();
            audioInited = true;
        }
    }

    function releaseKey(code) {
        keys[code] = false;
    }

    function bindBtn(el, code) {
        if (!el) return;
        el.addEventListener('pointerdown', e => { e.preventDefault(); simulateKey(code); });
        el.addEventListener('pointerup', e => { e.preventDefault(); releaseKey(code); });
        el.addEventListener('pointerleave', e => { releaseKey(code); });
    }

    bindBtn(btnUp, 'ArrowUp');
    bindBtn(btnDown, 'ArrowDown');
    bindBtn(btnLeft, 'ArrowLeft');
    bindBtn(btnRight, 'ArrowRight');
    bindBtn(btnConfirm, 'KeyZ');
    bindBtn(btnCancel, 'KeyX');

    // ───── Input handling ─────
    const keys = {};
    const justPressed = {};
    document.addEventListener('keydown', e => {
        if (!keys[e.code]) justPressed[e.code] = true;
        keys[e.code] = true;
        e.preventDefault();
        if (!audioInited) {
            Audio8Bit.init();
            audioInited = true;
        }
    });
    document.addEventListener('keyup', e => {
        keys[e.code] = false;
    });

    let audioInited = false;
    let gameMode = 'title';
    let titleBlink = 0;
    let transitionAlpha = 1;
    let transitioning = true;
    let lastScene = '';

    function wasPressed(code) {
        if (justPressed[code]) {
            justPressed[code] = false;
            return true;
        }
        return false;
    }

    function getKeyAction() {
        if (wasPressed('KeyZ') || wasPressed('Enter') || wasPressed('Space')) return 'confirm';
        if (wasPressed('KeyX') || wasPressed('Escape') || wasPressed('Backspace')) return 'cancel';
        if (wasPressed('ArrowUp') || wasPressed('KeyW')) return 'up';
        if (wasPressed('ArrowDown') || wasPressed('KeyS')) return 'down';
        if (wasPressed('ArrowLeft') || wasPressed('KeyA')) return 'left';
        if (wasPressed('ArrowRight') || wasPressed('KeyD')) return 'right';
        return null;
    }

    function isHeld(code) {
        return keys[code];
    }

    let lastTime = 0;
    let frameCount = 0;
    let starField = [];
    for (let i = 0; i < 80; i++) {
        starField.push({
            x: Math.random() * W,
            y: Math.random() * H,
            size: Math.random() * 2 + 0.5,
            speed: Math.random() * 0.3 + 0.1,
            brightness: Math.random(),
        });
    }

    function gameLoop(timestamp) {
        const dt = Math.min((timestamp - lastTime) / 1000, 0.05) || 0.016;
        lastTime = timestamp;
        frameCount++;

        update(dt);
        render();

        Object.keys(justPressed).forEach(k => justPressed[k] = false);
        requestAnimationFrame(gameLoop);
    }

    function update(dt) {
        if (transitioning) {
            transitionAlpha -= dt * 3;
            if (transitionAlpha <= 0) {
                transitionAlpha = 0;
                transitioning = false;
            }
        }
        Sprites.updateParticles(dt);

        switch (gameMode) {
            case 'title': updateTitle(dt); break;
            case 'dialogue': updateDialogue(dt); break;
            case 'battle': updateBattle(dt); break;
            case 'explore': updateExplore(dt); break;
        }
    }

    function updateTitle(dt) {
        titleBlink += dt;
        const key = getKeyAction();
        if (key === 'confirm') {
            Audio8Bit.menuConfirm();
            Sprites.emitBurst(W / 2, 120, '#cc0000', 12);
            startScene('intro');
        }
    }

    function startScene(sceneId) {
        GameState.scene = sceneId;

        if (sceneId === 'battle' && GameState.battleData) {
            gameMode = 'battle';
            Battle.start(GameState.battleData, (result, log) => {
                gameMode = 'dialogue';
                const afterScene = GameState.afterBattle || 'ch1_chapter1_end';
                loadDialogue(afterScene);
            });
            return;
        }

        if (sceneId === 'title') {
            gameMode = 'title';
            Audio8Bit.playMelody('title');
            return;
        }

        if (sceneId !== lastScene) {
            GameMap.updateForScene(sceneId);
            lastScene = sceneId;
            transitioning = true;
            transitionAlpha = 0.6;
        }

        gameMode = 'dialogue';
        loadDialogue(sceneId);
    }

    function loadDialogue(sceneId) {
        const node = Story.getNode(sceneId);
        Dialogue.start(node, (result) => {
            if (result && result.effect) {
                result.effect();
                const newScene = GameState.scene;
                if (newScene !== sceneId) {
                    startScene(newScene);
                }
            }
        });

        if (sceneId.includes('ending') || sceneId === 'credits') {
            Audio8Bit.playMelody('ending');
        } else if (sceneId.includes('kob')) {
            Audio8Bit.playMelody('kob');
        } else if (GameState.scene !== 'title') {
            Audio8Bit.playMelody('overworld');
        }
    }

    function updateDialogue(dt) {
        Dialogue.update(dt);
        const key = getKeyAction();
        if (key) {
            Dialogue.handleInput(key);
        }
    }

    function updateBattle(dt) {
        Battle.update(dt);
        const key = getKeyAction();
        if (key) Battle.handleInput(key);

        if (isHeld('ArrowUp') || isHeld('KeyW')) Battle.moveHeart(0, -1);
        if (isHeld('ArrowDown') || isHeld('KeyS')) Battle.moveHeart(0, 1);
        if (isHeld('ArrowLeft') || isHeld('KeyA')) Battle.moveHeart(-1, 0);
        if (isHeld('ArrowRight') || isHeld('KeyD')) Battle.moveHeart(1, 0);
    }

    function updateExplore(dt) {
        const key = getKeyAction();
        if (key === 'confirm') {
            gameMode = 'dialogue';
            loadDialogue(GameState.scene);
        }
    }

    function render() {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, W, H);

        switch (gameMode) {
            case 'title':
                renderTitle();
                break;
            case 'dialogue':
                GameMap.render(ctx, W, H);
                renderNPCs();
                Dialogue.render(ctx, W, H);
                renderHUD();
                break;
            case 'battle':
                Battle.render(ctx, W, H);
                break;
            case 'explore':
                GameMap.render(ctx, W, H);
                renderNPCs();
                renderHUD();
                break;
        }

        Sprites.renderParticles(ctx);

        if (transitioning && transitionAlpha > 0) {
            ctx.fillStyle = `rgba(0,0,0,${transitionAlpha})`;
            ctx.fillRect(0, 0, W, H);
        }
    }

    function renderTitle() {
        // Background gradient
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, '#0a0a1e');
        grad.addColorStop(0.5, '#1a1a3e');
        grad.addColorStop(1, '#0a0a1e');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        // Animated stars
        for (const star of starField) {
            const flicker = Math.sin(frameCount * star.speed + star.x) * 0.3 + 0.7;
            const alpha = star.brightness * flicker;
            ctx.fillStyle = `rgba(255,255,255,${alpha})`;
            ctx.fillRect(
                (star.x + frameCount * star.speed * 0.5) % W,
                star.y,
                star.size, star.size
            );
        }

        ctx.textAlign = 'center';

        // Title shadow
        ctx.fillStyle = '#440000';
        ctx.font = 'bold 48px monospace';
        ctx.fillText('ГЕРОИ ЧАТИКА', W / 2 + 3, 123);

        // Title glow
        const glowAlpha = Math.sin(frameCount * 0.05) * 0.2 + 0.8;
        ctx.fillStyle = `rgba(255,50,50,${glowAlpha})`;
        ctx.font = 'bold 48px monospace';
        ctx.fillText('ГЕРОИ ЧАТИКА', W / 2, 120);

        // Subtitle
        ctx.fillStyle = '#aaaacc';
        ctx.font = '14px monospace';
        ctx.fillText('Пиксельная RPG в стиле Undertale', W / 2, 155);

        // Only Orson on title - he is the main character
        const portrait = Sprites.orsonPortrait();
        const bob = Math.sin(frameCount * 0.04) * 4;

        // Glow behind portrait
        ctx.fillStyle = '#cc444433';
        ctx.fillRect(W / 2 - 48, 178 + bob, 96, 104);

        ctx.drawImage(portrait, W / 2 - 40, 183 + bob, 80, 90);

        // Name plate
        ctx.fillStyle = '#cc444466';
        ctx.font = '14px monospace';
        const nameW = ctx.measureText('Орсон').width + 16;
        ctx.fillRect(W / 2 - nameW / 2, 280, nameW, 22);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Орсон', W / 2, 296);

        // Mystery silhouettes
        ctx.fillStyle = '#222233';
        ctx.font = '10px monospace';
        const silhouettes = [
            { x: 130, label: '???' },
            { x: 380, label: '???' },
            { x: 520, label: '(секрет)' },
        ];
        for (const s of silhouettes) {
            ctx.fillStyle = '#111122';
            ctx.fillRect(s.x - 28, 195, 56, 68);
            ctx.fillStyle = '#333344';
            ctx.fillText(s.label, s.x, 278);
        }

        // Blinking prompt
        const blinkAlpha = Math.sin(frameCount * 0.08) * 0.4 + 0.6;
        ctx.fillStyle = `rgba(255,204,0,${blinkAlpha})`;
        ctx.font = 'bold 22px monospace';
        ctx.fillText('▶ Нажмите Z или ENTER ◀', W / 2, 340);

        // Controls info box
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        ctx.fillRect(60, 375, W - 120, 80);
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 1;
        ctx.strokeRect(60, 375, W - 120, 80);

        ctx.fillStyle = '#999999';
        ctx.font = '13px monospace';
        ctx.fillText('⬆⬇⬅➡ / WASD — движение', W / 2, 398);
        ctx.fillText('Z / Enter — подтвердить  |  X / Esc — отмена', W / 2, 418);
        ctx.fillStyle = '#ccaa44';
        ctx.font = '12px monospace';
        ctx.fillText('1000+ путей  ·  30+ финалов  ·  Секретная линия Коба', W / 2, 442);

        ctx.textAlign = 'left';
    }

    function renderNPCs() {
        const scene = GameState.scene;
        const npcs = [];
        const time = frameCount * 0.05;
        const frame = Math.floor(time) % 4;

        if (scene.includes('orson') || scene.includes('temple') || scene.includes('war') || scene.includes('coronation') || scene.includes('ceremony') || scene.includes('debate') || scene.includes('voice') || scene.includes('reborn')) {
            npcs.push({ sprites: Sprites.orsonWalk(), x: 200, y: 150, color: '#cc4444' });
        }
        if (scene.includes('vaituz') || scene.includes('apple') || scene.includes('peace') || scene.includes('coronation') || scene.includes('ceremony')) {
            npcs.push({ sprites: Sprites.vaituzWalk(), x: 350, y: 180, color: '#44cc44' });
        }
        if (scene.includes('cheb') || scene.includes('fly') || scene.includes('delta') || scene.includes('coronation') || scene.includes('ceremony')) {
            npcs.push({ sprites: Sprites.chebWalk(), x: 450, y: 160, color: '#4488cc' });
        }
        if (scene.includes('kob') && !scene.includes('locked') && !scene.includes('door')) {
            npcs.push({ sprites: Sprites.kobWalk(), x: 300, y: 170, color: '#9966cc' });
        }

        for (const npc of npcs) {
            const sprite = npc.sprites[frame];
            const bob = Math.sin(time + npc.x * 0.1) * 2;

            // Shadow
            ctx.fillStyle = 'rgba(0,0,0,0.3)';
            ctx.beginPath();
            ctx.ellipse(npc.x + 16, npc.y + 48, 14, 4, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.drawImage(sprite, npc.x, npc.y + bob, 32, 48);
        }
    }

    function renderHUD() {
        if (gameMode === 'battle') return;

        // HUD background
        const hudGrad = ctx.createLinearGradient(0, 0, 0, 34);
        hudGrad.addColorStop(0, 'rgba(0,0,0,0.85)');
        hudGrad.addColorStop(1, 'rgba(0,0,0,0.4)');
        ctx.fillStyle = hudGrad;
        ctx.fillRect(0, 0, W, 34);

        // Bottom line
        ctx.fillStyle = 'rgba(100,80,160,0.3)';
        ctx.fillRect(0, 33, W, 1);

        ctx.textAlign = 'left';

        // Heart icon + HP
        const heart = Sprites.createHeartSprite();
        ctx.drawImage(heart, 8, 8, 16, 16);

        // HP bar background
        ctx.fillStyle = '#333';
        ctx.fillRect(28, 11, 60, 12);
        // HP bar fill
        const hpRatio = GameState.hp / GameState.maxHp;
        const hpColor = hpRatio > 0.5 ? '#44cc44' : hpRatio > 0.25 ? '#cccc44' : '#cc4444';
        ctx.fillStyle = hpColor;
        ctx.fillRect(29, 12, Math.floor(58 * hpRatio), 10);
        // HP text
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(`${GameState.hp}/${GameState.maxHp}`, 32, 21);

        // Chapter
        ctx.fillStyle = '#ffcc00';
        ctx.font = 'bold 13px monospace';
        ctx.fillText(`Гл.${GameState.chapter}`, 100, 22);

        // Stats
        ctx.font = '11px monospace';
        const S = GameState.stats;
        const statData = [
            { label: 'УВ', val: S.respect, color: '#ff8888' },
            { label: 'ДР', val: S.friendship, color: '#88ff88' },
            { label: 'ХА', val: S.chaos, color: '#ff4444' },
            { label: 'МД', val: S.wisdom, color: '#88ccff' },
            { label: 'ШЗ', val: S.shiza, color: '#cc88ff' },
        ];
        let sx = 165;
        for (const st of statData) {
            ctx.fillStyle = st.color;
            ctx.fillText(`${st.label}:${st.val}`, sx, 22);
            sx += 55;
        }

        // Inventory
        if (GameState.inventory.length > 0) {
            ctx.fillStyle = '#88cc88';
            ctx.font = '12px monospace';
            ctx.fillText(`🎒${GameState.inventory.length}`, W - 60, 22);
        }

        // Path counter
        ctx.fillStyle = '#555';
        ctx.font = '10px monospace';
        ctx.fillText(`#${GameState.pathCount}`, W - 35, 22);
    }

    Audio8Bit.playMelody('title');
    startScene('title');
    requestAnimationFrame(gameLoop);
})();
