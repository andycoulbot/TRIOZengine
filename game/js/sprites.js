const Sprites = (() => {
    const cache = {};

    function createCanvas(w, h) {
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        return c;
    }

    function drawPixels(ctx, data, scale = 1) {
        for (let y = 0; y < data.length; y++) {
            for (let x = 0; x < data[y].length; x++) {
                const color = data[y][x];
                if (color && color !== '.') {
                    ctx.fillStyle = color;
                    ctx.fillRect(x * scale, y * scale, scale, scale);
                }
            }
        }
    }

    const C = {
        skin1: '#e8b89d', skin2: '#d4a186', hair_dark: '#3d2b1f', hair_light: '#a0825a',
        white: '#ffffff', black: '#000000', gray: '#888888', dark_gray: '#444444',
        green: '#44cc44', green_dark: '#228822', red: '#cc4444', blue: '#4444cc',
        yellow: '#cccc44', orange: '#cc8844', brown: '#8b6543', light_brown: '#c4a07a',
        tux_black: '#1a1a2e', shirt_white: '#e8e8e8', tie_brown: '#8b7355',
        apple_red: '#cc3333', apple_green: '#55aa33', headset: '#333333',
        mic: '#666666', eye_brown: '#4a3520', eye_white: '#f0f0f0',
        pilot_blue: '#2c3e6b', pilot_gold: '#ccaa44', laptop: '#555577',
        kob_purple: '#6644aa', kob_cloak: '#443366', mystery: '#9966cc',
        mouth: '#cc6666', bg_dark: '#1a1a2e', bg_purple: '#2d1b4e',
    };

    function orsonPortrait() {
        if (cache.orson) return cache.orson;
        const _ = null;
        const s = C.skin1, s2 = C.skin2, h = C.hair_dark, b = C.black, w = C.white;
        const e = C.eye_brown, hs = C.headset, m = C.mic, g = C.gray, dg = C.dark_gray;
        const mo = C.mouth, ew = C.eye_white;
        const data = [
            [_,_,_,_,_,h,h,h,h,h,h,h,_,_,_,_],
            [_,_,_,h,h,h,h,h,h,h,h,h,h,_,_,_],
            [_,_,h,h,h,h,h,h,h,h,h,h,h,h,_,_],
            [_,h,h,h,h,h,h,h,h,h,h,h,h,h,h,_],
            [_,h,h,h,s,s,s,s,s,s,s,s,h,h,h,_],
            [h,h,h,s,s,s,s,s,s,s,s,s,s,h,h,h],
            [h,h,s,s,s,s,s,s,s,s,s,s,s,s,h,h],
            [h,hs,s,ew,ew,e,s,s,s,ew,ew,e,s,s,h,h],
            [h,hs,s,ew,b,e,s,s,s,ew,b,e,s,s,h,h],
            [h,hs,s,s,s,s,s,s2,s,s,s,s,s,s,h,h],
            [_,hs,s,s,s,s,s2,s2,s2,s,s,s,s,hs,_,_],
            [_,hs,s,s,s,s,s,s2,s,s,s,s,s,hs,_,_],
            [_,_,hs,s,s,mo,mo,mo,mo,mo,s,s,hs,_,_,_],
            [_,_,m,hs,s,s,mo,mo,mo,s,s,hs,m,_,_,_],
            [_,_,m,m,s,s,s,s,s,s,s,m,m,_,_,_],
            [_,_,_,_,dg,dg,dg,dg,dg,dg,dg,_,_,_,_,_],
            [_,_,_,dg,dg,dg,dg,dg,dg,dg,dg,dg,_,_,_,_],
            [_,_,dg,dg,dg,dg,dg,dg,dg,dg,dg,dg,dg,_,_,_],
        ];
        const c = createCanvas(64, 72);
        const ctx = c.getContext('2d');
        drawPixels(ctx, data, 4);
        cache.orson = c;
        return c;
    }

    function vaituzPortrait() {
        if (cache.vaituz) return cache.vaituz;
        const _ = null;
        const s = '#f0c8a8', s2 = '#e0b898', h = C.hair_light, b = C.black, w = C.white;
        const e = '#5577aa', ew = C.eye_white, gn = C.green, gd = C.green_dark;
        const tx = C.tux_black, sh = C.shirt_white, tie = C.tie_brown;
        const mo = C.mouth, ar = C.apple_green;
        const data = [
            [_,_,_,_,_,h,h,h,h,h,h,h,_,_,_,_],
            [_,_,_,h,h,h,h,h,h,h,h,h,h,_,_,_],
            [_,_,h,h,h,h,h,h,h,h,h,h,h,h,_,_],
            [_,gn,gd,h,h,h,h,h,h,h,h,h,h,gd,gn,_],
            [gn,gn,gd,s,s,s,s,s,s,s,s,s,s,gd,gn,gn],
            [gn,gn,s,s,s,s,s,s,s,s,s,s,s,s,gn,gn],
            [_,gd,s,s,s,s,s,s,s,s,s,s,s,s,gd,_],
            [_,_,s,ew,ew,e,s,s,s,ew,ew,e,s,s,_,_],
            [_,_,s,ew,b,e,s,s,s,ew,b,e,s,s,_,_],
            [_,_,s,s,s,s,s,s2,s,s,s,s,s,s,_,_],
            [_,_,s,s,s,s,s2,s2,s2,s,s,s,s,s,_,_],
            [_,_,s,s,s,s,s,s2,s,s,s,s,s,s,_,_],
            [_,_,s,s,s,mo,mo,mo,mo,mo,s,s,s,_,_,_],
            [_,_,_,s,s,s,s,s,s,s,s,s,_,_,_,_],
            [_,_,_,tx,tx,sh,sh,sh,sh,sh,tx,tx,_,_,_,_],
            [_,_,tx,tx,tx,sh,tie,tie,sh,sh,tx,tx,tx,_,_,_],
            [_,tx,tx,tx,tx,sh,sh,sh,sh,sh,tx,tx,tx,tx,_,_],
            [ar,tx,tx,tx,tx,tx,tx,tx,tx,tx,tx,tx,tx,tx,_,_],
        ];
        const c = createCanvas(64, 72);
        const ctx = c.getContext('2d');
        drawPixels(ctx, data, 4);
        cache.vaituz = c;
        return c;
    }

    function kobPortrait() {
        if (cache.kob) return cache.kob;
        const _ = null;
        const s = '#d4a88c', s2 = '#c49880', h = '#2a2a3a', b = C.black, w = C.white;
        const e = '#6644aa', ew = C.eye_white, cl = C.kob_cloak, p = C.kob_purple;
        const mo = C.mouth, my = C.mystery;
        const data = [
            [_,_,_,_,cl,cl,cl,cl,cl,cl,cl,cl,_,_,_,_],
            [_,_,_,cl,cl,cl,cl,cl,cl,cl,cl,cl,cl,_,_,_],
            [_,_,cl,cl,h,h,h,h,h,h,h,h,cl,cl,_,_],
            [_,cl,cl,h,h,h,h,h,h,h,h,h,h,cl,cl,_],
            [_,cl,h,h,s,s,s,s,s,s,s,s,h,h,cl,_],
            [_,cl,h,s,s,s,s,s,s,s,s,s,s,h,cl,_],
            [_,_,s,s,s,s,s,s,s,s,s,s,s,s,_,_],
            [_,_,s,ew,ew,e,s,s,s,ew,ew,e,s,s,_,_],
            [_,_,s,ew,p,e,s,s,s,ew,p,e,s,s,_,_],
            [_,_,s,s,s,s,s,s2,s,s,s,s,s,s,_,_],
            [_,_,s,s,s,s,s2,s2,s2,s,s,s,s,s,_,_],
            [_,_,s,s,s,s,s,s2,s,s,s,s,s,s,_,_],
            [_,_,s,s,mo,mo,mo,mo,mo,mo,s,s,s,_,_,_],
            [_,_,_,s,s,s,s,s,s,s,s,s,_,_,_,_],
            [_,_,cl,cl,cl,cl,cl,cl,cl,cl,cl,cl,cl,_,_,_],
            [_,cl,cl,cl,cl,cl,my,my,cl,cl,cl,cl,cl,cl,_,_],
            [cl,cl,cl,cl,cl,cl,cl,cl,cl,cl,cl,cl,cl,cl,cl,_],
            [cl,cl,cl,cl,cl,cl,cl,cl,cl,cl,cl,cl,cl,cl,cl,_],
        ];
        const c = createCanvas(64, 72);
        const ctx = c.getContext('2d');
        drawPixels(ctx, data, 4);
        cache.kob = c;
        return c;
    }

    function chebPortrait() {
        if (cache.cheb) return cache.cheb;
        const _ = null;
        const s = '#e0b898', s2 = '#d0a888', h = '#5a4030', b = C.black, w = C.white;
        const e = '#446688', ew = C.eye_white, pb = C.pilot_blue, pg = C.pilot_gold;
        const mo = C.mouth, lp = C.laptop;
        const data = [
            [_,_,_,_,pb,pb,pb,pb,pb,pb,pb,pb,_,_,_,_],
            [_,_,_,pb,pg,pb,pb,pb,pb,pb,pg,pb,_,_,_,_],
            [_,_,pb,pb,h,h,h,h,h,h,h,h,pb,pb,_,_],
            [_,_,_,h,h,h,h,h,h,h,h,h,h,_,_,_],
            [_,_,h,s,s,s,s,s,s,s,s,s,s,h,_,_],
            [_,_,s,s,s,s,s,s,s,s,s,s,s,s,_,_],
            [_,_,s,s,s,s,s,s,s,s,s,s,s,s,_,_],
            [_,_,s,ew,ew,e,s,s,s,ew,ew,e,s,s,_,_],
            [_,_,s,ew,b,e,s,s,s,ew,b,e,s,s,_,_],
            [_,_,s,s,s,s,s,s2,s,s,s,s,s,s,_,_],
            [_,_,s,s,s,s,s2,s2,s2,s,s,s,s,s,_,_],
            [_,_,s,s,s,s,s,s2,s,s,s,s,s,s,_,_],
            [_,_,s,s,mo,mo,mo,mo,mo,mo,s,s,s,_,_,_],
            [_,_,_,s,s,s,s,s,s,s,s,s,_,_,_,_],
            [_,_,pb,pb,pb,pb,pb,pb,pb,pb,pb,pb,pb,_,_,_],
            [_,pb,pb,pg,pb,pb,pb,pb,pb,pb,pg,pb,pb,pb,_,_],
            [_,pb,pb,pb,pb,pb,pb,pb,pb,pb,pb,pb,pb,pb,_,_],
            [lp,lp,lp,lp,pb,pb,pb,pb,pb,pb,pb,pb,pb,pb,_,_],
        ];
        const c = createCanvas(64, 72);
        const ctx = c.getContext('2d');
        drawPixels(ctx, data, 4);
        cache.cheb = c;
        return c;
    }

    function createWalkSprite(name, colors) {
        const key = name + '_walk';
        if (cache[key]) return cache[key];
        const frames = [];
        const { head, body, legs, accent } = colors;
        for (let f = 0; f < 4; f++) {
            const c = createCanvas(16, 24);
            const ctx = c.getContext('2d');
            const _ = null;
            ctx.fillStyle = head;
            ctx.fillRect(4, 0, 8, 8);
            ctx.fillStyle = '#000';
            ctx.fillRect(5, 3, 2, 2);
            ctx.fillRect(9, 3, 2, 2);
            ctx.fillStyle = body;
            ctx.fillRect(3, 8, 10, 8);
            if (accent) {
                ctx.fillStyle = accent;
                ctx.fillRect(6, 8, 4, 2);
            }
            ctx.fillStyle = legs;
            const legOffset = f % 2 === 0 ? 0 : 1;
            ctx.fillRect(4 + legOffset, 16, 3, 8);
            ctx.fillRect(9 - legOffset, 16, 3, 8);
            frames.push(c);
        }
        cache[key] = frames;
        return frames;
    }

    function orsonWalk() {
        return createWalkSprite('orson', {
            head: C.skin1, body: C.dark_gray, legs: '#2a2a2a', accent: null
        });
    }

    function vaituzWalk() {
        return createWalkSprite('vaituz', {
            head: '#f0c8a8', body: C.tux_black, legs: '#1a1a1a', accent: C.shirt_white
        });
    }

    function kobWalk() {
        return createWalkSprite('kob', {
            head: '#d4a88c', body: C.kob_cloak, legs: '#332255', accent: C.kob_purple
        });
    }

    function chebWalk() {
        return createWalkSprite('cheb', {
            head: '#e0b898', body: C.pilot_blue, legs: '#1a2a4a', accent: C.pilot_gold
        });
    }

    function playerWalk() {
        return createWalkSprite('player', {
            head: '#ffcc99', body: '#cc4444', legs: '#4444cc', accent: '#ffff44'
        });
    }

    function createTile(type) {
        const key = 'tile_' + type;
        if (cache[key]) return cache[key];
        const c = createCanvas(16, 16);
        const ctx = c.getContext('2d');
        const tileData = {
            floor_dark: () => {
                ctx.fillStyle = '#1a1a2e';
                ctx.fillRect(0, 0, 16, 16);
                ctx.fillStyle = '#222244';
                ctx.fillRect(0, 0, 16, 1);
                ctx.fillRect(0, 0, 1, 16);
            },
            floor_light: () => {
                ctx.fillStyle = '#2a2a3e';
                ctx.fillRect(0, 0, 16, 16);
                ctx.fillStyle = '#333355';
                ctx.fillRect(0, 0, 16, 1);
                ctx.fillRect(0, 0, 1, 16);
            },
            wall: () => {
                ctx.fillStyle = '#443366';
                ctx.fillRect(0, 0, 16, 16);
                ctx.fillStyle = '#554477';
                ctx.fillRect(1, 1, 14, 14);
                ctx.fillStyle = '#332255';
                ctx.fillRect(0, 14, 16, 2);
            },
            grass: () => {
                ctx.fillStyle = '#2a5a2a';
                ctx.fillRect(0, 0, 16, 16);
                ctx.fillStyle = '#3a7a3a';
                for (let i = 0; i < 5; i++) {
                    ctx.fillRect(Math.random() * 14 | 0, Math.random() * 14 | 0, 2, 2);
                }
            },
            water: () => {
                ctx.fillStyle = '#2244aa';
                ctx.fillRect(0, 0, 16, 16);
                ctx.fillStyle = '#3366cc';
                ctx.fillRect(2, 4, 12, 2);
                ctx.fillRect(0, 10, 10, 2);
            },
            path: () => {
                ctx.fillStyle = '#8b7355';
                ctx.fillRect(0, 0, 16, 16);
                ctx.fillStyle = '#a08868';
                ctx.fillRect(2, 2, 12, 12);
            },
            door: () => {
                ctx.fillStyle = '#8b6543';
                ctx.fillRect(2, 0, 12, 16);
                ctx.fillStyle = '#a07850';
                ctx.fillRect(4, 2, 8, 12);
                ctx.fillStyle = '#ccaa44';
                ctx.fillRect(10, 7, 2, 2);
            },
            table: () => {
                ctx.fillStyle = '#6b4523';
                ctx.fillRect(1, 4, 14, 10);
                ctx.fillStyle = '#8b6543';
                ctx.fillRect(2, 5, 12, 8);
            },
            pc: () => {
                ctx.fillStyle = '#333';
                ctx.fillRect(3, 2, 10, 8);
                ctx.fillStyle = '#4488cc';
                ctx.fillRect(4, 3, 8, 6);
                ctx.fillStyle = '#555';
                ctx.fillRect(5, 11, 6, 2);
                ctx.fillRect(3, 13, 10, 2);
            },
            apple_tree: () => {
                ctx.fillStyle = '#2a5a2a';
                ctx.fillRect(0, 0, 16, 16);
                ctx.fillStyle = '#5a3a1a';
                ctx.fillRect(6, 8, 4, 8);
                ctx.fillStyle = '#228822';
                ctx.fillRect(2, 0, 12, 10);
                ctx.fillStyle = '#cc3333';
                ctx.fillRect(4, 3, 2, 2);
                ctx.fillRect(10, 5, 2, 2);
                ctx.fillRect(7, 2, 2, 2);
            },
            runway: () => {
                ctx.fillStyle = '#555555';
                ctx.fillRect(0, 0, 16, 16);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(7, 0, 2, 4);
                ctx.fillRect(7, 8, 2, 4);
            },
            burger: () => {
                ctx.fillStyle = '#1a1a2e';
                ctx.fillRect(0, 0, 16, 16);
                ctx.fillStyle = '#cc8844';
                ctx.fillRect(3, 4, 10, 2);
                ctx.fillStyle = '#55aa33';
                ctx.fillRect(3, 6, 10, 2);
                ctx.fillStyle = '#cc4444';
                ctx.fillRect(3, 8, 10, 2);
                ctx.fillStyle = '#cc8844';
                ctx.fillRect(3, 10, 10, 2);
            },
            bookshelf: () => {
                ctx.fillStyle = '#5a3a1a';
                ctx.fillRect(0, 0, 16, 16);
                ctx.fillStyle = '#cc4444';
                ctx.fillRect(1, 1, 3, 6);
                ctx.fillStyle = '#4444cc';
                ctx.fillRect(5, 1, 3, 6);
                ctx.fillStyle = '#44cc44';
                ctx.fillRect(9, 1, 3, 6);
                ctx.fillStyle = '#cccc44';
                ctx.fillRect(1, 9, 4, 6);
                ctx.fillStyle = '#cc88cc';
                ctx.fillRect(6, 9, 4, 6);
                ctx.fillStyle = '#88cccc';
                ctx.fillRect(11, 9, 4, 6);
            },
            throne: () => {
                ctx.fillStyle = '#1a1a2e';
                ctx.fillRect(0, 0, 16, 16);
                ctx.fillStyle = '#ccaa44';
                ctx.fillRect(3, 0, 10, 14);
                ctx.fillStyle = '#aa8833';
                ctx.fillRect(4, 1, 8, 12);
                ctx.fillStyle = '#cc4444';
                ctx.fillRect(5, 5, 6, 7);
            },
            arena_floor: () => {
                ctx.fillStyle = '#2e1a1a';
                ctx.fillRect(0, 0, 16, 16);
                ctx.fillStyle = '#442222';
                ctx.fillRect(0, 0, 16, 1);
                ctx.fillRect(0, 0, 1, 16);
            },
        };
        if (tileData[type]) tileData[type]();
        cache[key] = c;
        return c;
    }

    function createHeartSprite() {
        if (cache.heart) return cache.heart;
        const c = createCanvas(16, 16);
        const ctx = c.getContext('2d');
        const r = '#cc0000';
        const _ = null;
        const data = [
            [_,_,r,r,_,_,r,r],
            [_,r,r,r,r,r,r,r],
            [r,r,r,r,r,r,r,r],
            [r,r,r,r,r,r,r,r],
            [_,r,r,r,r,r,r,_],
            [_,_,r,r,r,r,_,_],
            [_,_,_,r,r,_,_,_],
            [_,_,_,_,_,_,_,_],
        ];
        drawPixels(ctx, data.map(row => row.map(c => c === r ? r : null)), 2);
        cache.heart = c;
        return c;
    }

    function createMenuCursor() {
        if (cache.cursor) return cache.cursor;
        const c = createCanvas(16, 16);
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#cc0000';
        const data = [
            [0,0,1,1,0,0,1,1],
            [0,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1],
            [0,1,1,1,1,1,1,0],
            [0,0,1,1,1,1,0,0],
            [0,0,0,1,1,0,0,0],
        ];
        data.forEach((row, y) => row.forEach((v, x) => {
            if (v) ctx.fillRect(x * 2, y * 2, 2, 2);
        }));
        cache.cursor = c;
        return c;
    }

    function itemSprite(type) {
        const key = 'item_' + type;
        if (cache[key]) return cache[key];
        const c = createCanvas(16, 16);
        const ctx = c.getContext('2d');
        switch (type) {
            case 'apple':
                ctx.fillStyle = '#55aa33';
                ctx.fillRect(5, 2, 6, 10);
                ctx.fillStyle = '#44aa22';
                ctx.fillRect(6, 3, 4, 8);
                ctx.fillStyle = '#5a3a1a';
                ctx.fillRect(7, 0, 2, 3);
                break;
            case 'laptop':
                ctx.fillStyle = '#555577';
                ctx.fillRect(2, 4, 12, 8);
                ctx.fillStyle = '#4488cc';
                ctx.fillRect(3, 5, 10, 6);
                ctx.fillStyle = '#666688';
                ctx.fillRect(1, 12, 14, 2);
                break;
            case 'headset':
                ctx.fillStyle = '#333';
                ctx.fillRect(3, 1, 10, 2);
                ctx.fillRect(2, 3, 3, 8);
                ctx.fillRect(11, 3, 3, 8);
                ctx.fillStyle = '#666';
                ctx.fillRect(11, 9, 2, 5);
                break;
            case 'burger':
                ctx.fillStyle = '#cc8844';
                ctx.fillRect(3, 3, 10, 2);
                ctx.fillStyle = '#55aa33';
                ctx.fillRect(3, 5, 10, 2);
                ctx.fillStyle = '#cc4444';
                ctx.fillRect(3, 7, 10, 2);
                ctx.fillStyle = '#cc8844';
                ctx.fillRect(3, 9, 10, 2);
                break;
            case 'heroes5':
                ctx.fillStyle = '#4444cc';
                ctx.fillRect(2, 1, 12, 14);
                ctx.fillStyle = '#6666ee';
                ctx.fillRect(3, 2, 10, 12);
                ctx.fillStyle = '#ccaa44';
                ctx.fillRect(5, 5, 6, 6);
                break;
            case 'key':
                ctx.fillStyle = '#ccaa44';
                ctx.fillRect(3, 3, 4, 4);
                ctx.fillRect(7, 5, 6, 2);
                ctx.fillRect(11, 5, 2, 4);
                ctx.fillRect(9, 5, 2, 4);
                break;
            case 'microphone':
                ctx.fillStyle = '#888';
                ctx.fillRect(6, 2, 4, 6);
                ctx.fillStyle = '#666';
                ctx.fillRect(7, 8, 2, 4);
                ctx.fillRect(4, 12, 8, 2);
                break;
            case 'videocard':
                ctx.fillStyle = '#228822';
                ctx.fillRect(1, 4, 14, 8);
                ctx.fillStyle = '#444';
                ctx.fillRect(2, 5, 6, 6);
                ctx.fillStyle = '#888';
                ctx.fillRect(10, 5, 4, 6);
                ctx.fillStyle = '#ccaa44';
                ctx.fillRect(2, 12, 2, 2);
                ctx.fillRect(6, 12, 2, 2);
                ctx.fillRect(10, 12, 2, 2);
                break;
        }
        cache[key] = c;
        return c;
    }

    return {
        orsonPortrait, vaituzPortrait, kobPortrait, chebPortrait,
        orsonWalk, vaituzWalk, kobWalk, chebWalk, playerWalk,
        createTile, createHeartSprite, createMenuCursor, itemSprite,
        C
    };
})();
