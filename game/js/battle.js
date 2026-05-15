const Battle = (() => {
    let active = false;
    let enemy = null;
    let playerHP = 20;
    let playerMaxHP = 20;
    let enemyHP = 20;
    let enemyMaxHP = 20;
    let menu = 'main';
    let menuIndex = 0;
    let phase = 'menu'; // menu, timing_attack, timing_defend, dodge, message, death, victory
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

    // Timing mechanic
    let timingBar = 0;        // 0-100, moves back and forth
    let timingDirection = 1;   // 1 = right, -1 = left
    let timingSpeed = 120;     // pixels per second
    let timingZoneStart = 35;  // sweet spot start
    let timingZoneEnd = 65;    // sweet spot end
    let timingType = '';       // 'attack' or 'defend'
    let timingResult = null;   // null, 'perfect', 'good', 'miss'
    let timingResultTimer = 0;

    // Death/victory animation
    let deathTimer = 0;
    let victoryTimer = 0;
    let shakeAmount = 0;

    // Enemy attack phase
    let enemyAttackTimer = 0;
    let enemyDamage = 0;

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
        timingBar = 0;
        timingDirection = 1;
        timingResult = null;
        timingResultTimer = 0;
        deathTimer = 0;
        victoryTimer = 0;
        shakeAmount = 0;
        enemyAttackTimer = 0;
        enemyDamage = 0;
        Audio8Bit.battleStart();
        Audio8Bit.playMelody('battle');
    }

    function update(dt) {
        if (!active) return;

        if (shakeAmount > 0) shakeAmount *= 0.9;

        if (phase === 'message') {
            messageTimer -= dt;
            if (messageTimer <= 0) {
                if (enemyHP <= 0) {
                    phase = 'victory';
                    victoryTimer = 2.5;
                    Audio8Bit.menuConfirm();
                    return;
                }
                if (spareable) {
                    endBattle('spare');
                    return;
                }
                if (playerHP <= 0) {
                    phase = 'death';
                    deathTimer = 3;
                    return;
                }
                // Enemy attacks — start defend timing
                startDefendTiming();
            }
        }

        if (phase === 'timing_attack' || phase === 'timing_defend') {
            timingBar += timingDirection * timingSpeed * dt;
            if (timingBar >= 100) { timingBar = 100; timingDirection = -1; }
            if (timingBar <= 0) { timingBar = 0; timingDirection = 1; }
        }

        if (phase === 'timing_result') {
            timingResultTimer -= dt;
            if (timingResultTimer <= 0) {
                if (timingType === 'attack') {
                    // After attack result, show damage message
                    let dmg = 0;
                    if (timingResult === 'perfect') dmg = 8 + Math.floor(Math.random() * 4);
                    else if (timingResult === 'good') dmg = 4 + Math.floor(Math.random() * 3);
                    else dmg = 1 + Math.floor(Math.random() * 2);

                    enemyHP = Math.max(0, enemyHP - dmg);
                    shakeAmount = dmg * 2;
                    Audio8Bit.damage();
                    battleLog.push({ type: 'attack', dmg, timing: timingResult });

                    const labels = { perfect: 'ИДЕАЛЬНО!', good: 'Хорошо!', miss: 'Промах...' };
                    showMessage(`${labels[timingResult]} Урон: ${dmg}`, 1.5);
                } else {
                    // After defend result, apply enemy damage
                    const baseDmg = enemy.atk || 4;
                    let finalDmg = 0;
                    if (timingResult === 'perfect') finalDmg = 0;
                    else if (timingResult === 'good') finalDmg = Math.max(1, Math.floor(baseDmg * 0.5));
                    else finalDmg = baseDmg + Math.floor(Math.random() * 3);

                    if (finalDmg > 0) {
                        playerHP = Math.max(0, playerHP - finalDmg);
                        GameState.hp = playerHP;
                        shakeAmount = finalDmg * 3;
                        Audio8Bit.damage();
                    }

                    if (finalDmg === 0) {
                        showMessage(`Блок! ${enemy.name} не попал!`, 1.5);
                    } else {
                        showMessage(`${enemy.name} наносит ${finalDmg} урона!`, 1.5);
                    }

                    if (playerHP <= 0) {
                        messageTimer = 1.5;
                    }
                }
            }
        }

        if (phase === 'death') {
            deathTimer -= dt;
            if (deathTimer <= 0) {
                endBattle('death');
            }
        }

        if (phase === 'victory') {
            victoryTimer -= dt;
            if (victoryTimer <= 0) {
                endBattle('kill');
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

    function startAttackTiming() {
        phase = 'timing_attack';
        timingType = 'attack';
        timingBar = 0;
        timingDirection = 1;
        timingSpeed = 100 + (enemyMaxHP - enemyHP) * 2; // faster as enemy gets hurt
        timingResult = null;
        // Sweet spot gets smaller for stronger enemies
        const difficulty = enemy.difficulty || 1;
        const zoneSize = Math.max(10, 30 - difficulty * 5);
        timingZoneStart = 50 - zoneSize / 2;
        timingZoneEnd = 50 + zoneSize / 2;
    }

    function startDefendTiming() {
        phase = 'timing_defend';
        timingType = 'defend';
        timingBar = 0;
        timingDirection = 1;
        timingSpeed = 80 + (enemy.atk || 4) * 15;
        timingResult = null;
        const difficulty = enemy.difficulty || 1;
        const zoneSize = Math.max(12, 35 - difficulty * 5);
        timingZoneStart = 50 - zoneSize / 2;
        timingZoneEnd = 50 + zoneSize / 2;
    }

    function confirmTiming() {
        const pos = timingBar;
        const center = (timingZoneStart + timingZoneEnd) / 2;
        const perfectRange = (timingZoneEnd - timingZoneStart) * 0.3;

        if (Math.abs(pos - center) <= perfectRange) {
            timingResult = 'perfect';
        } else if (pos >= timingZoneStart && pos <= timingZoneEnd) {
            timingResult = 'good';
        } else {
            timingResult = 'miss';
        }

        phase = 'timing_result';
        timingResultTimer = 0.6;
        Audio8Bit.menuConfirm();
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

        for (const p of projectiles) {
            p.x += p.vx * dt;
            p.y += p.vy * dt;

            const dx = p.x - heartX;
            const dy = p.y - heartY;
            if (Math.abs(dx) < (p.size + 6) && Math.abs(dy) < (p.size + 6)) {
                const dmg = 2;
                playerHP = Math.max(0, playerHP - dmg);
                GameState.hp = playerHP;
                Audio8Bit.damage();
                shakeAmount = 8;
                p.x = -100;
                p.y = -100;
                p.vx = 0;
                p.vy = 0;
                if (playerHP <= 0) {
                    phase = 'death';
                    deathTimer = 3;
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

        if (phase === 'timing_attack' || phase === 'timing_defend') {
            if (key === 'confirm') {
                confirmTiming();
            }
            return;
        }

        if (phase === 'dodge') {
            return;
        }

        if (phase === 'message') return;
        if (phase === 'death') return;
        if (phase === 'victory') return;
        if (phase === 'timing_result') return;

        if (phase === 'menu') {
            if (menu === 'main') {
                if (key === 'left') { menuIndex = Math.max(0, menuIndex - 1); Audio8Bit.menuSelect(); }
                if (key === 'right') { menuIndex = Math.min(3, menuIndex + 1); Audio8Bit.menuSelect(); }
                if (key === 'confirm') {
                    Audio8Bit.menuConfirm();
                    switch (menuIndex) {
                        case 0: startAttackTiming(); break;
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
        showMessage(msg, 1.8);
        menu = 'main';
    }

    function doItem() {
        const inv = GameState.inventory || [];
        if (inv.length === 0) {
            showMessage('В инвентаре пусто...', 1.2);
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
            showMessage(effect.msg, 1.5);
        } else {
            showMessage('Нет подходящих предметов для боя!', 1.2);
        }
    }

    function doMercy() {
        if (spareable) {
            showMessage(`Вы пощадили ${enemy.name}!`, 2);
            spareable = true;
            return;
        }
        mercyCount++;
        if (mercyCount >= 5) spareable = true;
        showMessage(spareable ? `${enemy.name} готов к примирению...` : `${enemy.name} не хочет сдаваться!`, 1.5);
    }

    function showMessage(text, duration) {
        messageText = text;
        messageTimer = duration || 1.5;
        phase = 'message';
    }

    function endBattle(result) {
        active = false;
        Audio8Bit.stopMelody();
        if (result === 'death') {
            GameState.hp = 0;
        }
        if (onEnd) onEnd(result, battleLog);
    }

    function render(ctx, W, H) {
        if (!active) return;

        // Screen shake
        if (shakeAmount > 0.5) {
            ctx.save();
            ctx.translate(
                (Math.random() - 0.5) * shakeAmount,
                (Math.random() - 0.5) * shakeAmount
            );
        }

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, W, H);

        // Death screen
        if (phase === 'death') {
            renderDeathScreen(ctx, W, H);
            if (shakeAmount > 0.5) ctx.restore();
            return;
        }

        // Victory screen
        if (phase === 'victory') {
            renderVictoryScreen(ctx, W, H);
            if (shakeAmount > 0.5) ctx.restore();
            return;
        }

        const portrait = getEnemyPortrait();
        if (portrait) {
            ctx.drawImage(portrait, W / 2 - 64, 40, 128, 144);
        }

        ctx.fillStyle = '#ffffff';
        ctx.font = '20px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(enemy.name || 'ВРАГ', W / 2, 210);

        // Enemy HP bar
        ctx.fillStyle = '#444';
        ctx.fillRect(W / 2 - 60, 220, 120, 10);
        ctx.fillStyle = enemyHP > enemyMaxHP * 0.3 ? '#00cc00' : '#cc0000';
        ctx.fillRect(W / 2 - 60, 220, (enemyHP / enemyMaxHP) * 120, 10);
        ctx.fillStyle = '#aaa';
        ctx.font = '10px monospace';
        ctx.fillText(`${enemyHP}/${enemyMaxHP}`, W / 2, 243);

        // Timing bar for attack/defend
        if (phase === 'timing_attack' || phase === 'timing_defend' || phase === 'timing_result') {
            renderTimingBar(ctx, W, H);
        }

        // Dodge phase
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

        // Bottom bar
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
        const hpRatio = playerHP / playerMaxHP;
        ctx.fillStyle = hpRatio > 0.5 ? '#00cc00' : hpRatio > 0.25 ? '#cccc00' : '#cc0000';
        ctx.fillRect(hpBarX, H - 25, hpRatio * hpBarW, 12);

        // Menu
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

        // Message
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

        if (shakeAmount > 0.5) ctx.restore();
    }

    function renderTimingBar(ctx, W, H) {
        const barX = 120, barY = 260, barW = 400, barH = 20;

        // Background
        ctx.fillStyle = '#222';
        ctx.fillRect(barX, barY, barW, barH);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, barY, barW, barH);

        // Sweet zone
        const zoneX = barX + (timingZoneStart / 100) * barW;
        const zoneW = ((timingZoneEnd - timingZoneStart) / 100) * barW;
        ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
        ctx.fillRect(zoneX, barY, zoneW, barH);

        // Perfect zone (inner)
        const center = (timingZoneStart + timingZoneEnd) / 2;
        const perfectRange = (timingZoneEnd - timingZoneStart) * 0.3;
        const perfectX = barX + ((center - perfectRange) / 100) * barW;
        const perfectW = (perfectRange * 2 / 100) * barW;
        ctx.fillStyle = 'rgba(255, 255, 0, 0.4)';
        ctx.fillRect(perfectX, barY, perfectW, barH);

        // Moving indicator
        if (phase !== 'timing_result') {
            const indX = barX + (timingBar / 100) * barW;
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(indX - 2, barY - 4, 4, barH + 8);
        }

        // Labels
        ctx.textAlign = 'center';
        ctx.font = 'bold 14px monospace';
        if (phase === 'timing_result') {
            const colors = { perfect: '#ffff00', good: '#00ff00', miss: '#ff4444' };
            const labels = { perfect: 'ИДЕАЛЬНО!', good: 'ХОРОШО!', miss: 'ПРОМАХ!' };
            ctx.fillStyle = colors[timingResult] || '#fff';
            ctx.fillText(labels[timingResult] || '', W / 2, barY - 10);
        } else {
            ctx.fillStyle = '#ffcc00';
            if (timingType === 'attack') {
                ctx.fillText('АТАКА! Нажми Z в зелёной зоне!', W / 2, barY - 10);
            } else {
                ctx.fillStyle = '#44aaff';
                ctx.fillText('ЗАЩИТА! Нажми Z чтобы блокировать!', W / 2, barY - 10);
            }
        }
    }

    function renderDeathScreen(ctx, W, H) {
        ctx.fillStyle = '#110000';
        ctx.fillRect(0, 0, W, H);

        // Broken heart
        ctx.textAlign = 'center';
        const heartScale = 1 + Math.sin(deathTimer * 3) * 0.2;
        ctx.font = `${Math.floor(60 * heartScale)}px monospace`;
        ctx.fillStyle = '#cc0000';
        ctx.fillText('💔', W / 2, H / 2 - 40);

        ctx.font = 'bold 24px monospace';
        ctx.fillStyle = '#cc0000';
        ctx.fillText('ОРСОН ПОВЕРЖЕН', W / 2, H / 2 + 30);

        ctx.font = '14px monospace';
        ctx.fillStyle = '#884444';
        const deathLines = [
            'Тряска оказалась сильнее...',
            'Даже миллионер может проиграть.',
            'Тишина наступает.',
        ];
        const line = deathLines[Math.floor(Math.random() * 10) % deathLines.length];
        ctx.fillText(line, W / 2, H / 2 + 60);

        ctx.fillStyle = '#666';
        ctx.font = '12px monospace';
        ctx.fillText(`HP: 0/${playerMaxHP}`, W / 2, H / 2 + 90);
    }

    function renderVictoryScreen(ctx, W, H) {
        ctx.fillStyle = '#001100';
        ctx.fillRect(0, 0, W, H);

        ctx.textAlign = 'center';
        ctx.font = '48px monospace';
        ctx.fillStyle = '#ffcc00';
        ctx.fillText('ПОБЕДА!', W / 2, H / 2 - 50);

        ctx.font = 'bold 20px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`${enemy.name} повержен!`, W / 2, H / 2);

        ctx.font = '14px monospace';
        ctx.fillStyle = '#88cc88';
        ctx.fillText(`HP: ${playerHP}/${playerMaxHP}`, W / 2, H / 2 + 40);

        // XP reward
        const xp = enemy.xp || 5;
        ctx.fillStyle = '#ffcc00';
        ctx.fillText(`+${xp} XP`, W / 2, H / 2 + 65);
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
