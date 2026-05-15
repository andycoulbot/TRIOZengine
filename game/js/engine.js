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
            const circle = GameState.circle || 1;
            if (circle > 1) {
                gameMode = 'dialogue';
                loadDialogue('title');
            } else {
                startScene('intro');
            }
        }
    }

    function startScene(sceneId) {
        GameState.scene = sceneId;

        if (sceneId === 'battle' && GameState.battleData) {
            gameMode = 'battle';
            Battle.start(GameState.battleData, (result, log) => {
                gameMode = 'dialogue';
                const afterScene = GameState.afterBattle || 'ch5_after_vilgefortz';
                loadDialogue(afterScene);
            });
            return;
        }

        if (sceneId === 'title') {
            const circle = GameState.circle || 1;
            if (circle > 1) {
                gameMode = 'dialogue';
                loadDialogue('title');
            } else {
                gameMode = 'title';
                Audio8Bit.playMelody('title');
            }
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
        } else if (sceneId.includes('battle') || sceneId.includes('vilgefortz')) {
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
                if (GameState.scene === 'ending_rarity_screen') {
                    renderRarityScreen();
                } else {
                    GameMap.render(ctx, W, H);
                    renderNPCs();
                }
                Dialogue.render(ctx, W, H);
                if (GameState.scene !== 'ending_rarity_screen' && GameState.scene !== 'endings_gallery') renderHUD();
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
        // Background gradient - dark and ominous
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, '#0a0515');
        grad.addColorStop(0.3, '#1a0a2e');
        grad.addColorStop(0.7, '#0d0820');
        grad.addColorStop(1, '#050210');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        // Animated stars
        for (const star of starField) {
            const flicker = Math.sin(frameCount * star.speed + star.x) * 0.3 + 0.7;
            const alpha = star.brightness * flicker;
            ctx.fillStyle = `rgba(255,200,255,${alpha})`;
            ctx.fillRect(
                (star.x + frameCount * star.speed * 0.5) % W,
                star.y,
                star.size, star.size
            );
        }

        // Floating runes/symbols
        ctx.font = '16px monospace';
        const runes = ['⚔', '🛡', '🧠', '💀', '🗡', '👁', '🔥'];
        for (let i = 0; i < 7; i++) {
            const rx = (i * 97 + frameCount * 0.3) % W;
            const ry = (Math.sin(frameCount * 0.02 + i) * 20) + 80 + i * 40;
            const ra = Math.sin(frameCount * 0.03 + i * 2) * 0.15 + 0.15;
            ctx.fillStyle = `rgba(150,100,200,${ra})`;
            ctx.fillText(runes[i], rx, ry);
        }

        ctx.textAlign = 'center';

        // Title shadow
        ctx.fillStyle = '#220033';
        ctx.font = 'bold 36px monospace';
        ctx.fillText('МЕЧ И ШИЗОФРЕНИЯ', W / 2 + 3, 78);

        // Title glow
        const glowAlpha = Math.sin(frameCount * 0.05) * 0.2 + 0.8;
        ctx.fillStyle = `rgba(200,100,255,${glowAlpha})`;
        ctx.font = 'bold 36px monospace';
        ctx.fillText('МЕЧ И ШИЗОФРЕНИЯ', W / 2, 75);

        // Subtitle
        ctx.fillStyle = '#aa88cc';
        ctx.font = '13px monospace';
        ctx.fillText('Приключения Орсона в мире, где всё пошло не так', W / 2, 105);

        // Orson portrait - center
        const portrait = Sprites.orsonPortrait();
        const bob = Math.sin(frameCount * 0.04) * 4;

        // Red glow behind portrait
        ctx.fillStyle = '#cc444422';
        ctx.fillRect(W / 2 - 52, 120 + bob, 104, 112);
        ctx.drawImage(portrait, W / 2 - 44, 125 + bob, 88, 100);

        // Name
        ctx.fillStyle = '#cc444488';
        ctx.font = 'bold 16px monospace';
        const nameW = ctx.measureText('ОРСОН').width + 20;
        ctx.fillRect(W / 2 - nameW / 2, 235, nameW, 24);
        ctx.fillStyle = '#ffffff';
        ctx.fillText('ОРСОН', W / 2, 253);

        // Character description
        ctx.fillStyle = '#887799';
        ctx.font = '11px monospace';
        ctx.fillText('Миллионер · Провокатор · Заклинатель Тряски', W / 2, 275);
        ctx.fillText('Франция · 25 лет · 47 открытых вкладок', W / 2, 292);

        // Shake meter preview
        const shakeW = 200;
        ctx.fillStyle = '#222';
        ctx.fillRect(W / 2 - shakeW / 2, 310, shakeW, 12);
        const shakeFill = Math.sin(frameCount * 0.03) * 0.3 + 0.3;
        ctx.fillStyle = '#cc44aa';
        ctx.fillRect(W / 2 - shakeW / 2 + 1, 311, (shakeW - 2) * shakeFill, 10);
        ctx.fillStyle = '#aa88cc';
        ctx.font = '10px monospace';
        ctx.fillText('ТРЯСКА', W / 2, 320);

        // Blinking prompt
        const blinkAlpha = Math.sin(frameCount * 0.08) * 0.4 + 0.6;
        ctx.fillStyle = `rgba(255,204,0,${blinkAlpha})`;
        ctx.font = 'bold 20px monospace';
        ctx.fillText('▶ Нажмите Z или ENTER ◀', W / 2, 355);

        // Controls info
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        ctx.fillRect(60, 380, W - 120, 80);
        ctx.strokeStyle = 'rgba(150,100,200,0.15)';
        ctx.lineWidth = 1;
        ctx.strokeRect(60, 380, W - 120, 80);

        ctx.fillStyle = '#777788';
        ctx.font = '12px monospace';
        ctx.fillText('⬆⬇⬅➡ / WASD — навигация', W / 2, 400);
        ctx.fillText('Z / Enter — подтвердить  |  X / Esc — отмена', W / 2, 418);
        ctx.fillStyle = '#9966cc';
        ctx.font = '11px monospace';
        ctx.fillText('6 глав · 8 концовок · 5 кругов · Тряска™', W / 2, 440);
        ctx.fillStyle = '#555566';
        ctx.font = '10px monospace';
        const circle = GameState.circle || 1;
        if (circle > 1) {
            ctx.fillStyle = '#cc88ff';
            ctx.fillText(`КРУГ ${circle}/5 · Мудрость: ${GameState.circleWisdom || 0}`, W / 2, 458);
        } else {
            ctx.fillText('Обычная · Редкая · Эпическая · Легендарная', W / 2, 458);
        }

        ctx.textAlign = 'left';
    }

    function renderNPCs() {
        const scene = GameState.scene;
        const npcs = [];
        const time = frameCount * 0.05;
        const frame = Math.floor(time) % 4;

        // Show NPCs based on which characters appear in scene
        if (scene.includes('orson') || scene.includes('ch1_') || scene.includes('ch2_') || scene.includes('ch3_') || scene.includes('ch4_') || scene.includes('ch6_')) {
            npcs.push({ sprites: Sprites.orsonWalk(), x: 200, y: 150, color: '#cc4444' });
        }
        if (scene.includes('vaituz') || scene.includes('ch5_vaituz')) {
            npcs.push({ sprites: Sprites.vaituzWalk(), x: 350, y: 180, color: '#44cc44' });
        }
        if (scene.includes('cheb') || scene.includes('ch5_cheb')) {
            npcs.push({ sprites: Sprites.chebWalk(), x: 450, y: 160, color: '#4488cc' });
        }
        if (scene.includes('kob') || scene.includes('ch5_kob')) {
            npcs.push({ sprites: Sprites.kobWalk(), x: 300, y: 170, color: '#9966cc' });
        }
        if (scene.includes('vilgefortz') || scene.includes('ch5_vilgefortz')) {
            npcs.push({ sprites: Sprites.kobWalk(), x: 250, y: 140, color: '#880088' });
        }
        if (scene.includes('pericles') || scene.includes('ch1_meet_pericles') || scene.includes('ch1_corridor')) {
            npcs.push({ sprites: Sprites.orsonWalk(), x: 400, y: 200, color: '#ccaa44' });
        }
        if (scene.includes('germanovna') || scene.includes('ch6_german')) {
            npcs.push({ sprites: Sprites.vaituzWalk(), x: 350, y: 150, color: '#ffffff' });
        }
        if (scene.includes('ch5_enter_square') || scene.includes('ch5_everyone')) {
            // Show everyone on the square
            npcs.push({ sprites: Sprites.orsonWalk(), x: 150, y: 150, color: '#cc4444' });
            npcs.push({ sprites: Sprites.vaituzWalk(), x: 250, y: 180, color: '#44cc44' });
            npcs.push({ sprites: Sprites.chebWalk(), x: 350, y: 160, color: '#4488cc' });
            npcs.push({ sprites: Sprites.kobWalk(), x: 450, y: 170, color: '#9966cc' });
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

        ctx.fillStyle = 'rgba(100,80,160,0.3)';
        ctx.fillRect(0, 33, W, 1);

        ctx.textAlign = 'left';

        // Heart icon + HP
        const heart = Sprites.createHeartSprite();
        ctx.drawImage(heart, 8, 8, 16, 16);

        // HP bar
        ctx.fillStyle = '#333';
        ctx.fillRect(28, 11, 60, 12);
        const hpRatio = GameState.hp / GameState.maxHp;
        const hpColor = hpRatio > 0.5 ? '#44cc44' : hpRatio > 0.25 ? '#cccc44' : '#cc4444';
        ctx.fillStyle = hpColor;
        ctx.fillRect(29, 12, Math.floor(58 * hpRatio), 10);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(`${GameState.hp}/${GameState.maxHp}`, 32, 21);

        // Chapter
        ctx.fillStyle = '#cc88ff';
        ctx.font = 'bold 13px monospace';
        ctx.fillText(`Гл.${GameState.chapter}`, 100, 22);

        // Stats
        ctx.font = '11px monospace';
        const S = GameState.stats;
        const statData = [
            { label: 'ХР', val: S.charisma, color: '#ffaa44' },
            { label: 'ШЗ', val: S.shiza, color: '#cc88ff' },
            { label: 'ХС', val: S.chaos, color: '#ff4444' },
            { label: 'ПР', val: S.paranoia, color: '#ff8888' },
            { label: 'ТР', val: S.troll, color: '#88ff88' },
        ];
        let sx = 155;
        for (const st of statData) {
            ctx.fillStyle = st.color;
            ctx.fillText(`${st.label}:${st.val}`, sx, 22);
            sx += 50;
        }

        // Shake meter
        ctx.fillStyle = '#444';
        ctx.fillRect(420, 12, 50, 10);
        const shakeRatio = Math.min((GameState.tshake || 0) / 100, 1);
        ctx.fillStyle = shakeRatio > 0.7 ? '#ff0066' : shakeRatio > 0.4 ? '#cc44aa' : '#8844aa';
        ctx.fillRect(421, 13, Math.floor(48 * shakeRatio), 8);
        ctx.fillStyle = '#cc88ff';
        ctx.font = '9px monospace';
        ctx.fillText('ТРС', 475, 21);

        // Inventory
        if (GameState.inventory.length > 0) {
            ctx.fillStyle = '#88cc88';
            ctx.font = '12px monospace';
            ctx.fillText(`🎒${GameState.inventory.length}`, W - 60, 22);
        }

        // Circle indicator
        const circleHud = GameState.circle || 1;
        if (circleHud > 1) {
            ctx.fillStyle = '#cc88ff';
            ctx.font = 'bold 10px monospace';
            ctx.fillText(`◉${circleHud}`, W - 65, 22);
        }

        // Path counter
        ctx.fillStyle = '#555';
        ctx.font = '10px monospace';
        ctx.fillText(`#${GameState.pathCount}`, W - 35, 22);
    }

    function renderRarityScreen() {
        const endingId = GameState.flags.ending || 'hospital';
        const rarity = getEndingRarity(endingId);
        const t = frameCount * 0.02;

        // Background gradient based on rarity
        const rarityBgs = {
            'ОБЫЧНАЯ': ['#111111', '#222233'],
            'РЕДКАЯ': ['#001133', '#002266'],
            'ЭПИЧЕСКАЯ': ['#110033', '#220066'],
            'ЛЕГЕНДАРНАЯ': ['#221100', '#443300'],
        };
        const bg = rarityBgs[rarity.name] || rarityBgs['ОБЫЧНАЯ'];
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, bg[0]);
        grad.addColorStop(1, bg[1]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        // Floating particles based on rarity
        const particleCount = rarity.stars * 8;
        for (let i = 0; i < particleCount; i++) {
            const px = (i * 73 + frameCount * 0.5) % W;
            const py = (i * 51 + Math.sin(t + i * 0.7) * 30) % (H * 0.6);
            const pa = Math.sin(t + i * 1.3) * 0.3 + 0.4;
            const ps = Math.sin(t + i * 0.5) * 2 + 3;
            ctx.fillStyle = rarity.color + Math.floor(pa * 255).toString(16).padStart(2, '0');
            ctx.beginPath();
            ctx.arc(px, py, ps, 0, Math.PI * 2);
            ctx.fill();
        }

        // Stars
        ctx.textAlign = 'center';
        ctx.font = '32px monospace';
        const stars = '★'.repeat(rarity.stars) + '☆'.repeat(4 - rarity.stars);
        ctx.fillStyle = rarity.color;
        ctx.shadowColor = rarity.glow;
        ctx.shadowBlur = 20;
        ctx.fillText(stars, W / 2, 60);
        ctx.shadowBlur = 0;

        // Rarity name with glow
        ctx.font = 'bold 28px monospace';
        ctx.shadowColor = rarity.glow;
        ctx.shadowBlur = 15;
        ctx.fillStyle = rarity.color;
        const nameAlpha = Math.sin(t * 2) * 0.15 + 0.85;
        ctx.globalAlpha = nameAlpha;
        ctx.fillText(rarity.name, W / 2, 100);
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;

        // Circle info
        ctx.fillStyle = '#8888aa';
        ctx.font = '14px monospace';
        const circleNum = GameState.circle || 1;
        ctx.fillText(`Круг ${circleNum}/5`, W / 2, 130);

        ctx.textAlign = 'left';
    }

    Audio8Bit.playMelody('title');
    startScene('title');
    requestAnimationFrame(gameLoop);
})();
