const Battle = (() => {
    let active = false;
    let enemy = null;
    let playerHP = 20;
    let playerMaxHP = 20;
    let enemyHP = 20;
    let enemyMaxHP = 20;
    let menu = 'main';
    let menuIndex = 0;
    let phase = 'menu';
    let messageText = '';
    let messageTimer = 0;
    let dodgePhase = false;
    let dodgeTimer = 0;
    let dodgeDuration = 4;
    let heartX = 0, heartY = 0;
    let projectiles = [];
    let onEnd = null;
    let actOptions = [];
    let selectedAct = 0;
    let battleLog = [];
    let mercyCount = 0;
    let spareable = false;

    const mainMenuItems = ['АТАКА', 'ДЕЙСТВИЕ', 'ПРЕДМЕТ', 'ПОЩАДА'];

    function start(enemyData, callback) {
        active = true;
        enemy = enemyData;
        enemyHP = enemyData.hp || 20;
        enemyMaxHP = enemyHP;
        playerHP = GameState.hp || 20;
        playerMaxHP = GameState.maxHp || 20;
        menu = 'main';
        menuIndex = 0;
        phase = 'menu';
        messageText = '';
        messageTimer = 0;
        dodgePhase = false;
        dodgeTimer = 0;
        projectiles = [];
        onEnd = callback;
        actOptions = enemyData.acts || ['Поговорить', 'Похвалить', 'Потроллить', 'Проигнорить'];
        selectedAct = 0;
        battleLog = [];
        mercyCount = 0;
        spareable = false;
        Audio8Bit.battleStart();
        Audio8Bit.playMelody('battle');
    }

    function update(dt) {
        if (!active) return;

        if (phase === 'message') {
            messageTimer -= dt;
            if (messageTimer <= 0) {
                if (enemyHP <= 0) {
                    endBattle('kill');
                    return;
                }
                if (spareable) {
                    endBattle('spare');
                    return;
                }
                startDodgePhase();
            }
        }

        if (phase === 'dodge') {
            dodgeTimer -= dt;
            updateProjectiles(dt);
            if (dodgeTimer <= 0) {
                phase = 'menu';
                menu = 'main';
                menuIndex = 0;
            }
        }
    }

    function startDodgePhase() {
        phase = 'dodge';
        dodgeTimer = dodgeDuration;
        heartX = 320;
        heartY = 340;
        projectiles = [];
        generateProjectiles();
    }

    function generateProjectiles() {
        const patterns = enemy.patterns || ['random'];
        const pattern = patterns[Math.floor(Math.random() * patterns.length)];

        switch (pattern) {
            case 'horizontal':
                for (let i = 0; i < 8; i++) {
                    projectiles.push({
                        x: -20 - i * 60, y: 300 + Math.random() * 80,
                        vx: 100 + Math.random() * 50, vy: 0, size: 8
                    });
                }
                break;
            case 'vertical':
                for (let i = 0; i < 8; i++) {
                    projectiles.push({
                        x: 200 + Math.random() * 240, y: -20 - i * 50,
                        vx: 0, vy: 80 + Math.random() * 40, size: 8
                    });
                }
                break;
            case 'spiral':
                for (let i = 0; i < 12; i++) {
                    const angle = (i / 12) * Math.PI * 2;
                    projectiles.push({
                        x: 320 + Math.cos(angle) * 150,
                        y: 340 + Math.sin(angle) * 80,
                        vx: -Math.cos(angle) * 60,
                        vy: -Math.sin(angle) * 60,
                        size: 6
                    });
                }
                break;
            default:
                for (let i = 0; i < 10; i++) {
                    const side = Math.floor(Math.random() * 4);
                    let x, y, vx, vy;
                    switch (side) {
                        case 0: x = -10; y = 280 + Math.random() * 100; vx = 80 + Math.random() * 60; vy = (Math.random() - 0.5) * 40; break;
                        case 1: x = 650; y = 280 + Math.random() * 100; vx = -(80 + Math.random() * 60); vy = (Math.random() - 0.5) * 40; break;
                        case 2: x = 200 + Math.random() * 240; y = 260; vx = (Math.random() - 0.5) * 40; vy = 60 + Math.random() * 40; break;
                        default: x = 200 + Math.random() * 240; y = 400; vx = (Math.random() - 0.5) * 40; vy = -(60 + Math.random() * 40); break;
                    }
                    projectiles.push({ x, y, vx, vy, size: 8 });
                }
        }
    }

    function updateProjectiles(dt) {
        const boxL = 180, boxR = 460, boxT = 280, boxB = 400;
        const speed = 3;

        for (const p of projectiles) {
            p.x += p.vx * dt;
            p.y += p.vy * dt;

            const dx = p.x - heartX;
            const dy = p.y - heartY;
            if (Math.abs(dx) < (p.size + 6) && Math.abs(dy) < (p.size + 6)) {
                playerHP = Math.max(0, playerHP - 1);
                GameState.hp = playerHP;
                Audio8Bit.damage();
                p.x = -100;
                p.y = -100;
                p.vx = 0;
                p.vy = 0;
                if (playerHP <= 0) {
                    endBattle('death');
                    return;
                }
            }
        }

        projectiles = projectiles.filter(p =>
            p.x > boxL - 50 && p.x < boxR + 50 && p.y > boxT - 50 && p.y < boxB + 50
        );
    }

    function moveHeart(dx, dy) {
        if (phase !== 'dodge') return;
        const speed = 4;
        const boxL = 188, boxR = 452, boxT = 288, boxB = 392;
        heartX = Math.max(boxL, Math.min(boxR, heartX + dx * speed));
        heartY = Math.max(boxT, Math.min(boxB, heartY + dy * speed));
    }

    function handleInput(key) {
        if (!active) return;

        if (phase === 'dodge') {
            return;
        }

        if (phase === 'message') return;

        if (phase === 'menu') {
            if (menu === 'main') {
                if (key === 'left') { menuIndex = Math.max(0, menuIndex - 1); Audio8Bit.menuSelect(); }
                if (key === 'right') { menuIndex = Math.min(3, menuIndex + 1); Audio8Bit.menuSelect(); }
                if (key === 'confirm') {
                    Audio8Bit.menuConfirm();
                    switch (menuIndex) {
                        case 0: doAttack(); break;
                        case 1: menu = 'act'; selectedAct = 0; break;
                        case 2: doItem(); break;
                        case 3: doMercy(); break;
                    }
                }
            } else if (menu === 'act') {
                if (key === 'up') { selectedAct = Math.max(0, selectedAct - 1); Audio8Bit.menuSelect(); }
                if (key === 'down') { selectedAct = Math.min(actOptions.length - 1, selectedAct + 1); Audio8Bit.menuSelect(); }
                if (key === 'confirm') {
                    Audio8Bit.menuConfirm();
                    doAct(selectedAct);
                }
                if (key === 'cancel') { menu = 'main'; Audio8Bit.menuSelect(); }
            }
        }
    }

    function doAttack() {
        const dmg = 3 + Math.floor(Math.random() * 4);
        enemyHP = Math.max(0, enemyHP - dmg);
        Audio8Bit.damage();
        showMessage(`Вы нанесли ${dmg} урона!`);
        battleLog.push({ type: 'attack', dmg });
    }

    function doAct(index) {
        const act = actOptions[index];
        let msg = '';
        let effect = '';

        if (act === 'Поговорить' || act === 'Обсудить Героев') {
            msg = enemy.actResponses?.talk || `${enemy.name} слушает с интересом...`;
            mercyCount++;
            effect = 'talk';
        } else if (act === 'Похвалить' || act === 'Комплимент') {
            msg = enemy.actResponses?.praise || `${enemy.name} польщён!`;
            mercyCount += 2;
            effect = 'praise';
        } else if (act === 'Потроллить' || act === 'Подколоть') {
            msg = enemy.actResponses?.troll || `${enemy.name} в ярости!`;
            effect = 'troll';
        } else if (act === 'Проигнорить' || act === 'Игнор') {
            msg = enemy.actResponses?.ignore || `${enemy.name} не понимает...`;
            mercyCount++;
            effect = 'ignore';
        } else {
            msg = `Вы выбрали "${act}"...`;
            mercyCount++;
        }

        if (mercyCount >= 5) spareable = true;

        battleLog.push({ type: 'act', act, effect });
        showMessage(msg);
        menu = 'main';
    }

    function doItem() {
        const inv = GameState.inventory || [];
        if (inv.length === 0) {
            showMessage('В инвентаре пусто...');
            return;
        }
        const healItems = {
            'bread': { hp: 5, msg: 'Съели багет! (+5 HP)' },
            'baguette': { hp: 3, msg: 'Ударили багетом! (+3 к морали)' },
            'apple': { hp: 8, msg: 'Съели яблоко! (+8 HP)' },
            'energy': { hp: 10, msg: 'Выпили энергетик! (+10 HP)' },
            'clear_mind': { hp: 0, msg: 'Ясный ум! Тряска -20!', shake: -20 },
        };
        const usable = inv.find(i => healItems[i.id]);
        if (usable) {
            const effect = healItems[usable.id];
            if (effect.hp > 0) {
                playerHP = Math.min(playerMaxHP, playerHP + effect.hp);
                GameState.hp = playerHP;
            }
            if (effect.shake) GameState.tshake = Math.max(0, GameState.tshake + effect.shake);
            GameState.inventory = inv.filter(i => i !== usable);
            Audio8Bit.heal();
            showMessage(effect.msg);
        } else {
            showMessage('Нет подходящих предметов для боя!');
        }
    }

    function doMercy() {
        if (spareable) {
            showMessage(`Вы пощадили ${enemy.name}!`);
            phase = 'message';
            messageTimer = 60;
            spareable = true;
            return;
        }
        mercyCount++;
        if (mercyCount >= 5) spareable = true;
        showMessage(spareable ? `${enemy.name} готов к примирению...` : `${enemy.name} не хочет сдаваться!`);
    }

    function showMessage(text) {
        messageText = text;
        messageTimer = 90;
        phase = 'message';
    }

    function endBattle(result) {
        active = false;
        Audio8Bit.stopMelody();
        if (onEnd) onEnd(result, battleLog);
    }

    function render(ctx, W, H) {
        if (!active) return;

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, W, H);

        const portrait = getEnemyPortrait();
        if (portrait) {
            ctx.drawImage(portrait, W / 2 - 64, 40, 128, 144);
        }

        ctx.fillStyle = '#ffffff';
        ctx.font = '20px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(enemy.name || 'ВРАГ', W / 2, 210);

        ctx.fillStyle = '#444';
        ctx.fillRect(W / 2 - 60, 220, 120, 10);
        ctx.fillStyle = enemyHP > enemyMaxHP * 0.3 ? '#00cc00' : '#cc0000';
        ctx.fillRect(W / 2 - 60, 220, (enemyHP / enemyMaxHP) * 120, 10);

        if (phase === 'dodge') {
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            ctx.strokeRect(180, 280, 280, 120);
            ctx.fillStyle = '#000';
            ctx.fillRect(181, 281, 278, 118);

            for (const p of projectiles) {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
            }

            const heart = Sprites.createHeartSprite();
            ctx.drawImage(heart, heartX - 8, heartY - 8, 16, 16);

            ctx.fillStyle = '#ffcc00';
            ctx.font = '14px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`Уклоняйтесь! ${Math.ceil(dodgeTimer)}с`, W / 2, 275);
        }

        ctx.fillStyle = '#000';
        ctx.fillRect(0, H - 60, W, 60);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, H - 60, W, 60);

        ctx.textAlign = 'left';
        ctx.font = '14px monospace';
        ctx.fillStyle = '#ffcc00';
        ctx.fillText(`HP: ${playerHP}/${playerMaxHP}`, 20, H - 15);

        const hpBarX = 100, hpBarW = 100;
        ctx.fillStyle = '#444';
        ctx.fillRect(hpBarX, H - 25, hpBarW, 12);
        ctx.fillStyle = playerHP > playerMaxHP * 0.3 ? '#00cc00' : '#cc0000';
        ctx.fillRect(hpBarX, H - 25, (playerHP / playerMaxHP) * hpBarW, 12);

        if (phase === 'menu') {
            if (menu === 'main') {
                const startX = 240;
                const spacing = 100;
                ctx.font = '16px monospace';
                for (let i = 0; i < mainMenuItems.length; i++) {
                    const x = startX + i * spacing;
                    if (i === menuIndex) {
                        const cursor = Sprites.createMenuCursor();
                        ctx.drawImage(cursor, x - 20, H - 45, 16, 16);
                        ctx.fillStyle = '#ffcc00';
                    } else {
                        ctx.fillStyle = '#ffffff';
                    }
                    ctx.fillText(mainMenuItems[i], x, H - 33);
                }
            } else if (menu === 'act') {
                ctx.fillStyle = '#000';
                ctx.fillRect(180, 280, 280, actOptions.length * 30 + 20);
                ctx.strokeStyle = '#ffcc00';
                ctx.lineWidth = 2;
                ctx.strokeRect(180, 280, 280, actOptions.length * 30 + 20);

                ctx.font = '14px monospace';
                for (let i = 0; i < actOptions.length; i++) {
                    const y = 305 + i * 30;
                    if (i === selectedAct) {
                        ctx.drawImage(Sprites.createMenuCursor(), 190, y - 12, 16, 16);
                        ctx.fillStyle = '#ffcc00';
                    } else {
                        ctx.fillStyle = '#ffffff';
                    }
                    ctx.fillText(actOptions[i], 215, y);
                }
            }
        }

        if (phase === 'message' && messageText) {
            ctx.fillStyle = '#000000';
            ctx.fillRect(50, 280, W - 100, 40);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.strokeRect(50, 280, W - 100, 40);
            ctx.fillStyle = '#ffffff';
            ctx.font = '14px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(messageText, W / 2, 305);
        }

        if (spareable) {
            ctx.fillStyle = '#ffcc00';
            ctx.font = '12px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('* Имя врага стало жёлтым', W / 2, 245);
        }

        ctx.textAlign = 'left';
    }

    function getEnemyPortrait() {
        switch (enemy?.sprite || enemy?.id) {
            case 'orson': return Sprites.orsonPortrait();
            case 'vaituz': return Sprites.vaituzPortrait();
            case 'kob': return Sprites.kobPortrait();
            case 'cheb': return Sprites.chebPortrait();
            case 'vilgefortz': return Sprites.vilgefortzPortrait();
            case 'akulbot': return Sprites.akulbotPortrait();
            case 'madyar': return Sprites.madyarPortrait();
            case 'pericles': return Sprites.periclesPortrait();
            case 'chekist': return Sprites.chekistPortrait();
            case 'gerostrat': return Sprites.gerostratPortrait();
            case 'auromolin': return Sprites.auromolinPortrait();
            default: return Sprites.orsonPortrait();
        }
    }

    function isActive() { return active; }

    return { start, update, handleInput, moveHeart, render, isActive };
})();
