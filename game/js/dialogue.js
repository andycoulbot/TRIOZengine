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
    let textSpeed = 2;
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
            default: speakerPortrait = null;
        }

        choices = node.choices || [];
    }

    function update(dt) {
        if (!active) return;
        if (!showChoices) {
            textTimer += dt;
            if (textTimer >= textSpeed) {
                textTimer = 0;
                if (textIndex < fullText.length) {
                    displayText += fullText[textIndex];
                    textIndex++;
                    blipCounter++;
                    if (blipCounter % 3 === 0) {
                        Audio8Bit.textBlip();
                    }
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

        const boxH = 150;
        const boxY = H - boxH - 10;
        const boxX = 10;
        const boxW = W - 20;

        ctx.fillStyle = '#000000';
        ctx.fillRect(boxX, boxY, boxW, boxH);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.strokeRect(boxX, boxY, boxW, boxH);

        let textStartX = boxX + 20;
        if (speakerPortrait) {
            ctx.drawImage(speakerPortrait, boxX + 10, boxY + 10, 64, 72);
            ctx.strokeStyle = '#888';
            ctx.lineWidth = 1;
            ctx.strokeRect(boxX + 9, boxY + 9, 66, 74);
            textStartX = boxX + 90;
        }

        if (speakerName) {
            ctx.fillStyle = '#ffcc00';
            ctx.font = '16px monospace';
            ctx.fillText(speakerName, textStartX, boxY + 25);
        }

        ctx.fillStyle = '#ffffff';
        ctx.font = '14px monospace';
        const maxLineW = boxW - (textStartX - boxX) - 20;
        const words = displayText.split(' ');
        let line = '';
        let lineY = boxY + (speakerName ? 45 : 30);
        const lineHeight = 18;

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

        if (showChoices && choices.length > 0) {
            const choiceStartY = boxY - choices.length * 30 - 10;
            ctx.fillStyle = '#000000';
            ctx.fillRect(boxX, choiceStartY, boxW, choices.length * 30 + 10);
            ctx.strokeStyle = '#ffcc00';
            ctx.lineWidth = 2;
            ctx.strokeRect(boxX, choiceStartY, boxW, choices.length * 30 + 10);

            ctx.font = '14px monospace';
            for (let i = 0; i < choices.length; i++) {
                const cy = choiceStartY + 25 + i * 30;
                if (i === selectedChoice) {
                    ctx.drawImage(Sprites.createMenuCursor(), textStartX - 20, cy - 12, 16, 16);
                    ctx.fillStyle = '#ffcc00';
                } else {
                    ctx.fillStyle = '#ffffff';
                }
                ctx.fillText(choices[i].text, textStartX, cy);
            }
        }

        if (textIndex >= fullText.length && !showChoices && choices.length === 0) {
            const blink = Date.now() % 1000 < 500;
            if (blink) {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(boxX + boxW - 30, boxY + boxH - 20, 8, 8);
            }
        }
    }

    function isActive() { return active; }
    function close() { active = false; }

    return { start, update, handleInput, render, isActive, close };
})();
