const Dialogue = (() => {
    let active = false;
    let currentNode = null;
    let textIndex = 0;
    let textTimer = 0;
    let displayText = '';
    let fullText = '';
    let speakerName = '';
    let speakerPortrait = null;
    let choices = [];
    let selectedChoice = 0;
    let showChoices = false;
    let onComplete = null;
    let textSpeed = 0.02;
    let blipCounter = 0;

    function start(node, callback) {
        active = true;
        currentNode = node;
        onComplete = callback || null;
        showNode(node);
    }

    function showNode(node) {
        speakerName = node.speaker || '';
        fullText = node.text || '';
        textIndex = 0;
        displayText = '';
        textTimer = 0;
        showChoices = false;
        selectedChoice = 0;
        blipCounter = 0;

        switch (speakerName) {
            case 'Орсон': speakerPortrait = Sprites.orsonPortrait(); break;
            case 'Вайтуз': speakerPortrait = Sprites.vaituzPortrait(); break;
            case 'Коб': speakerPortrait = Sprites.kobPortrait(); break;
            case 'Чеб': speakerPortrait = Sprites.chebPortrait(); break;
            case 'Периклес': speakerPortrait = Sprites.periclesPortrait(); break;
            case 'Мадьяр': speakerPortrait = Sprites.madyarPortrait(); break;
            case 'Акулбот': speakerPortrait = Sprites.akulbotPortrait(); break;
            case 'Чекист': speakerPortrait = Sprites.chekistPortrait(); break;
            case 'Герострат': speakerPortrait = Sprites.gerostratPortrait(); break;
            case 'Ауромолин': speakerPortrait = Sprites.auromolinPortrait(); break;
            case 'Вильгефортс': speakerPortrait = Sprites.vilgefortzPortrait(); break;
            case 'Евгения Германовна': speakerPortrait = Sprites.periclesPortrait(); break;
            case 'Аркадий': speakerPortrait = Sprites.kobPortrait(); break;
            case 'Shadowban': speakerPortrait = Sprites.auromolinPortrait(); break;
            default: speakerPortrait = null;
        }

        choices = node.choices || [];
    }

    function update(dt) {
        if (!active) return;
        if (!showChoices) {
            textTimer += dt;
            while (textTimer >= textSpeed && textIndex < fullText.length) {
                textTimer -= textSpeed;
                displayText += fullText[textIndex];
                textIndex++;
                blipCounter++;
                if (blipCounter % 3 === 0) {
                    Audio8Bit.textBlip();
                }
            }
        }
    }

    function handleInput(key) {
        if (!active) return null;

        if (key === 'confirm') {
            if (textIndex < fullText.length) {
                displayText = fullText;
                textIndex = fullText.length;
                return null;
            }

            if (choices.length > 0) {
                if (!showChoices) {
                    showChoices = true;
                    selectedChoice = 0;
                    return null;
                }
                Audio8Bit.menuConfirm();
                const chosen = choices[selectedChoice];
                if (chosen.next) {
                    showNode(chosen.next);
                    return null;
                }
                active = false;
                if (onComplete) onComplete(chosen);
                return chosen;
            }

            active = false;
            if (onComplete) onComplete(null);
            return 'done';
        }

        if (showChoices) {
            if (key === 'up') {
                selectedChoice = Math.max(0, selectedChoice - 1);
                Audio8Bit.menuSelect();
            } else if (key === 'down') {
                selectedChoice = Math.min(choices.length - 1, selectedChoice + 1);
                Audio8Bit.menuSelect();
            }
        }

        return null;
    }

    function render(ctx, W, H) {
        if (!active) return;

        const boxH = 160;
        const boxY = H - boxH - 10;
        const boxX = 10;
        const boxW = W - 20;

        // Box background with gradient effect
        ctx.fillStyle = '#0a0a1e';
        ctx.fillRect(boxX, boxY, boxW, boxH);
        ctx.fillStyle = 'rgba(30,20,60,0.5)';
        ctx.fillRect(boxX + 2, boxY + 2, boxW - 4, boxH - 4);

        // Double border (outer white, inner colored)
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.strokeRect(boxX, boxY, boxW, boxH);

        // Inner decorative border
        ctx.strokeStyle = 'rgba(100,80,160,0.4)';
        ctx.lineWidth = 1;
        ctx.strokeRect(boxX + 4, boxY + 4, boxW - 8, boxH - 8);

        let textStartX = boxX + 20;
        if (speakerPortrait) {
            // Portrait background glow
            const speakerColors = {
                'Орсон': '#cc4444',
                'Вайтуз': '#44cc44',
                'Периклес': '#8b6543',
                'Мадьяр': '#334455',
                'Акулбот': '#5566dd',
                'Чекист': '#cc2222',
                'Герострат': '#44aa44',
                'Ауромолин': '#8866cc',
                'Вильгефортс': '#ff4444',
                'Евгения Германовна': '#ffffff',
                'Shadowban': '#444466',
                'Коб': '#9966cc',
                'Чеб': '#4488cc',
            };
            const glowColor = speakerColors[speakerName] || '#888';
            ctx.fillStyle = glowColor + '33';
            ctx.fillRect(boxX + 6, boxY + 6, 76, 84);

            ctx.drawImage(speakerPortrait, boxX + 10, boxY + 10, 68, 76);

            // Portrait border
            ctx.strokeStyle = glowColor;
            ctx.lineWidth = 2;
            ctx.strokeRect(boxX + 9, boxY + 9, 70, 78);
            textStartX = boxX + 96;
        }

        if (speakerName) {
            // Speaker name with colored background
            const nameColors = {
                'Орсон': '#cc4444',
                'Вайтуз': '#44cc44',
                'Коб': '#9966cc',
                'Чеб': '#ff7744',
                'Периклес': '#c4a07a',
                'Мадьяр': '#88aacc',
                'Акулбот': '#6688ff',
                'Чекист': '#ff4444',
                'Герострат': '#66cc66',
                'Ауромолин': '#aa88ff',
                'Вильгефортс': '#ff6633',
                'Евгения Германовна': '#eeeeff',
                'Аркадий': '#ccaa66',
                'Shadowban': '#666688',
            };
            const nameColor = nameColors[speakerName] || '#ffcc00';
            ctx.fillStyle = nameColor;
            ctx.font = 'bold 16px monospace';
            ctx.fillText(speakerName, textStartX, boxY + 25);

            // Underline
            const nameWidth = ctx.measureText(speakerName).width;
            ctx.fillStyle = nameColor + '66';
            ctx.fillRect(textStartX, boxY + 28, nameWidth, 2);
        }

        // Main text
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px monospace';
        const maxLineW = boxW - (textStartX - boxX) - 20;
        const words = displayText.split(' ');
        let line = '';
        let lineY = boxY + (speakerName ? 50 : 35);
        const lineHeight = 20;

        for (const word of words) {
            const test = line + word + ' ';
            if (ctx.measureText(test).width > maxLineW) {
                ctx.fillText(line, textStartX, lineY);
                line = word + ' ';
                lineY += lineHeight;
            } else {
                line = test;
            }
        }
        ctx.fillText(line, textStartX, lineY);

        // Choices
        if (showChoices && choices.length > 0) {
            const choiceH = choices.length * 32 + 16;
            const choiceStartY = boxY - choiceH - 6;

            // Choice box background
            ctx.fillStyle = '#0a0a1e';
            ctx.fillRect(boxX, choiceStartY, boxW, choiceH);
            ctx.strokeStyle = '#ffcc00';
            ctx.lineWidth = 2;
            ctx.strokeRect(boxX, choiceStartY, boxW, choiceH);

            ctx.font = '14px monospace';
            for (let i = 0; i < choices.length; i++) {
                const cy = choiceStartY + 26 + i * 32;
                if (i === selectedChoice) {
                    // Highlight bar
                    ctx.fillStyle = 'rgba(204,170,0,0.15)';
                    ctx.fillRect(boxX + 4, cy - 16, boxW - 8, 28);
                    ctx.drawImage(Sprites.createMenuCursor(), textStartX - 22, cy - 12, 16, 16);
                    ctx.fillStyle = '#ffcc00';
                } else {
                    ctx.fillStyle = '#aaaaaa';
                }
                ctx.fillText(choices[i].text, textStartX, cy);
            }
        }

        // Continue indicator (blinking arrow)
        if (textIndex >= fullText.length && !showChoices && choices.length === 0) {
            const blink = Date.now() % 800 < 500;
            if (blink) {
                ctx.fillStyle = '#ffffff';
                const ax = boxX + boxW - 30;
                const ay = boxY + boxH - 22;
                ctx.beginPath();
                ctx.moveTo(ax, ay);
                ctx.lineTo(ax + 10, ay);
                ctx.lineTo(ax + 5, ay + 8);
                ctx.closePath();
                ctx.fill();
            }
        }
    }

    function isActive() { return active; }
    function close() { active = false; }

    return { start, update, handleInput, render, isActive, close };
})();
