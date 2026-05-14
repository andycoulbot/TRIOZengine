(() => {
    const canvas = document.getElementById('game');
    const ctx = canvas.getContext('2d');
    const W = 640, H = 480;
    const SCALE = 2;

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
    let titleSelection = 0;
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
            transitionAlpha -= dt * 2;
            if (transitionAlpha <= 0) {
                transitionAlpha = 0;
                transitioning = false;
            }
        }

        switch (gameMode) {
            case 'title':
                updateTitle(dt);
                break;
            case 'dialogue':
                updateDialogue(dt);
                break;
            case 'battle':
                updateBattle(dt);
                break;
            case 'explore':
                updateExplore(dt);
                break;
        }
    }

    function updateTitle(dt) {
        titleBlink += dt;
        const key = getKeyAction();
        if (key === 'confirm') {
            Audio8Bit.menuConfirm();
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
            transitionAlpha = 0.5;
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

        if (transitioning && transitionAlpha > 0) {
            ctx.fillStyle = `rgba(0,0,0,${transitionAlpha})`;
            ctx.fillRect(0, 0, W, H);
        }
    }

    function renderTitle() {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, W, H);

        ctx.fillStyle = '#1a1a2e';
        for (let i = 0; i < 50; i++) {
            const x = (i * 137 + frameCount * 0.3) % W;
            const y = (i * 97 + frameCount * 0.2) % H;
            ctx.fillRect(x, y, 2, 2);
        }

        ctx.textAlign = 'center';

        ctx.fillStyle = '#cc0000';
        ctx.font = 'bold 48px monospace';
        ctx.fillText('ГЕРОИ ЧАТИКА', W / 2, 120);

        ctx.fillStyle = '#888888';
        ctx.font = '14px monospace';
        ctx.fillText('Пиксельная RPG в стиле Undertale', W / 2, 155);

        const portraits = [
            { fn: Sprites.orsonPortrait, label: 'Орсон', x: 100 },
            { fn: Sprites.vaituzPortrait, label: 'Вайтуз', x: 240 },
            { fn: Sprites.kobPortrait, label: 'Коб', x: 380 },
            { fn: Sprites.chebPortrait, label: 'Чеб', x: 520 },
        ];

        for (const p of portraits) {
            const portrait = p.fn();
            const bob = Math.sin(frameCount * 0.03 + p.x * 0.01) * 3;
            ctx.drawImage(portrait, p.x - 32, 185 + bob, 64, 72);
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px monospace';
            ctx.fillText(p.label, p.x, 275);
        }

        if (Math.floor(titleBlink * 2) % 2 === 0) {
            ctx.fillStyle = '#ffcc00';
            ctx.font = '20px monospace';
            ctx.fillText('Нажмите Z или ENTER', W / 2, 340);
        }

        ctx.fillStyle = '#666666';
        ctx.font = '12px monospace';
        ctx.fillText('WASD/Стрелки — движение | Z/Enter — подтвердить | X/Esc — отмена', W / 2, 400);
        ctx.fillText('1000+ путей | 30+ финалов | Секретная линия Коба', W / 2, 420);
        ctx.fillText('v1.0 — Powered by TRIOZengine', W / 2, 450);

        ctx.textAlign = 'left';
    }

    function renderNPCs() {
        const scene = GameState.scene;
        const npcs = [];
        const time = frameCount * 0.05;
        const frame = Math.floor(time) % 4;

        if (scene.includes('orson') || scene.includes('temple') || scene.includes('war') || scene.includes('coronation') || scene.includes('ceremony') || scene.includes('debate') || scene.includes('voice') || scene.includes('reborn')) {
            npcs.push({ sprites: Sprites.orsonWalk(), x: 200, y: 150 });
        }
        if (scene.includes('vaituz') || scene.includes('apple') || scene.includes('peace') || scene.includes('coronation') || scene.includes('ceremony')) {
            npcs.push({ sprites: Sprites.vaituzWalk(), x: 350, y: 180 });
        }
        if (scene.includes('cheb') || scene.includes('fly') || scene.includes('delta') || scene.includes('coronation') || scene.includes('ceremony')) {
            npcs.push({ sprites: Sprites.chebWalk(), x: 450, y: 160 });
        }
        if (scene.includes('kob') && !scene.includes('locked') && !scene.includes('door')) {
            npcs.push({ sprites: Sprites.kobWalk(), x: 300, y: 170 });
        }

        for (const npc of npcs) {
            const sprite = npc.sprites[frame];
            const bob = Math.sin(time + npc.x * 0.1) * 2;
            ctx.drawImage(sprite, npc.x, npc.y + bob, 32, 48);
        }
    }

    function renderHUD() {
        if (gameMode === 'battle') return;

        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, W, 30);

        ctx.fillStyle = '#cc0000';
        ctx.font = '14px monospace';
        ctx.textAlign = 'left';

        const heart = Sprites.createHeartSprite();
        ctx.drawImage(heart, 5, 7, 14, 14);
        ctx.fillText(`${GameState.hp}/${GameState.maxHp}`, 24, 21);

        ctx.fillStyle = '#ffcc00';
        ctx.fillText(`Гл.${GameState.chapter}`, 100, 21);

        ctx.fillStyle = '#aaaaaa';
        ctx.font = '11px monospace';
        const S = GameState.stats;
        ctx.fillText(`УВ:${S.respect} ДР:${S.friendship} ХА:${S.chaos} МД:${S.wisdom} ШЗ:${S.shiza}`, 160, 21);

        if (GameState.inventory.length > 0) {
            ctx.fillStyle = '#88cc88';
            ctx.fillText(`[${GameState.inventory.length}]`, W - 40, 21);
        }

        ctx.fillStyle = '#555';
        ctx.font = '10px monospace';
        ctx.fillText(`Путь #${GameState.pathCount}`, W - 120, 21);
    }

    Audio8Bit.playMelody('title');
    startScene('title');
    requestAnimationFrame(gameLoop);
})();
