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
        skin1: '#e8b89d', skin2: '#d4a186', skin3: '#c4916e',
        hair_dark: '#3d2b1f', hair_dark2: '#2a1a10', hair_light: '#a0825a', hair_light2: '#c4a87a',
        white: '#ffffff', black: '#000000', gray: '#888888', dark_gray: '#444444', light_gray: '#bbbbbb',
        green: '#44cc44', green_dark: '#228822', green_bright: '#66ee66',
        red: '#cc4444', red_dark: '#992222', red_bright: '#ff6666',
        blue: '#4444cc', blue_dark: '#222299', blue_bright: '#6666ff',
        yellow: '#cccc44', orange: '#cc8844', brown: '#8b6543', light_brown: '#c4a07a',
        tux_black: '#1a1a2e', tux_dark: '#12121e', shirt_white: '#e8e8e8', shirt_gray: '#d0d0d0',
        tie_brown: '#8b7355', tie_dark: '#6a5540',
        apple_red: '#cc3333', apple_green: '#55aa33', apple_stem: '#5a3a1a',
        headset: '#333333', headset2: '#222222', mic: '#666666', mic2: '#555555',
        eye_brown: '#4a3520', eye_white: '#f0f0f0', eye_shine: '#ffffff',
        pilot_blue: '#2c3e6b', pilot_blue2: '#1e2e55', pilot_gold: '#ccaa44', pilot_gold2: '#aa8833',
        laptop: '#555577', laptop2: '#444466',
        kob_purple: '#6644aa', kob_cloak: '#443366', kob_cloak2: '#332255', mystery: '#9966cc', mystery2: '#bb88ee',
        mouth: '#cc6666', mouth2: '#aa4444', teeth: '#eeeedd',
        bg_dark: '#1a1a2e', bg_purple: '#2d1b4e',
        smoke: '#aaaaaa', smoke2: '#888888',
        cig_white: '#ddddcc', cig_orange: '#ee6633',
    };

    function orsonPortrait() {
        if (cache.orson) return cache.orson;
        const _ = null;
        const s = C.skin1, s2 = C.skin2, s3 = C.skin3;
        const h = C.hair_dark, h2 = C.hair_dark2;
        const b = C.black, w = C.white;
        const e = C.eye_brown, hs = C.headset, hs2 = C.headset2, m = C.mic, m2 = C.mic2;
        const g = C.gray, dg = C.dark_gray;
        const mo = C.mouth, mo2 = C.mouth2, ew = C.eye_white, es = C.eye_shine;
        const t = C.teeth, r = C.red;
        const data = [
            [_,_,_,_,h2,h,h,h,h,h,h,h2,_,_,_,_],
            [_,_,_,h2,h,h,h,h,h,h,h,h,h2,_,_,_],
            [_,_,h2,h,h,h,h,h,h,h,h,h,h,h2,_,_],
            [_,h2,h,h,h,h,h,h,h,h,h,h,h,h,h2,_],
            [_,h,h,h,s,s,s,s,s,s,s,s,h,h,h,_],
            [h,h,h,s,s,s,s,s,s,s,s,s,s,h,h,h],
            [h,hs2,h,s,s,s,s,s,s,s,s,s,s,h,hs2,h],
            [h,hs,s,ew,ew,e,s,s,s,ew,ew,e,s,s,hs,h],
            [h,hs,s,ew,b,e,s,s,s,es,b,e,s,s,hs,h],
            [h,hs,s,s,s,s,s,s2,s,s,s,s,s,s,hs,h],
            [_,hs,s,s,s,s2,s2,s3,s2,s2,s,s,s,hs,_,_],
            [_,hs2,s,s,s,s,s2,s2,s2,s,s,s,s,hs2,_,_],
            [_,_,hs,s,mo,mo,mo,t,mo,mo,mo,s,hs,_,_,_],
            [_,_,m,hs,s,mo2,mo,t,mo,mo2,s,hs,m,_,_,_],
            [_,_,m2,m,s,s2,s,s2,s,s2,s,m,m2,_,_,_],
            [_,_,_,_,r,dg,dg,dg,dg,dg,r,_,_,_,_,_],
            [_,_,_,r,dg,dg,dg,dg,dg,dg,dg,r,_,_,_,_],
            [_,_,r,dg,dg,dg,dg,dg,dg,dg,dg,dg,r,_,_,_],
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
        const s = '#f0c8a8', s2 = '#e0b898', s3 = '#d0a888';
        const h = C.hair_light, h2 = C.hair_light2;
        const b = C.black, w = C.white;
        const e = '#5577aa', ew = C.eye_white, es = C.eye_shine;
        const gn = C.green, gd = C.green_dark, gb = C.green_bright;
        const tx = C.tux_black, txd = C.tux_dark, sh = C.shirt_white, shg = C.shirt_gray;
        const tie = C.tie_brown, tied = C.tie_dark;
        const mo = C.mouth, ar = C.apple_green, ars = C.apple_stem;
        const data = [
            [_,_,_,_,_,h2,h,h,h,h,h2,_,_,_,_,_],
            [_,_,_,h2,h,h,h2,h,h2,h,h,h2,_,_,_,_],
            [_,_,h2,h,h,h2,h,h,h,h2,h,h,h2,_,_,_],
            [_,gb,gn,h,h,h,h,h,h,h,h,h,h,gn,gb,_],
            [gn,gb,gd,s,s,s,s,s,s,s,s,s,s,gd,gb,gn],
            [gn,gn,s,s,s,s,s,s,s,s,s,s,s,s,gn,gn],
            [_,gd,s,s,s,s,s,s,s,s,s,s,s,s,gd,_],
            [_,_,s,ew,ew,e,s,s,s,ew,ew,e,s,s,_,_],
            [_,_,s,es,b,e,s,s,s,es,b,e,s,s,_,_],
            [_,_,s,s,s,s,s,s2,s,s,s,s,s,s,_,_],
            [_,_,s,s,s,s,s2,s3,s2,s,s,s,s,s,_,_],
            [_,_,s,s,s,s,s,s2,s,s,s,s,s,s,_,_],
            [_,_,s,s,s,mo,mo,mo,mo,mo,s,s,s,_,_,_],
            [_,_,_,s,s2,s,s,s,s,s,s2,s,_,_,_,_],
            [_,_,_,txd,tx,sh,shg,sh,shg,sh,tx,txd,_,_,_,_],
            [_,_,txd,tx,tx,sh,tie,tied,sh,sh,tx,tx,txd,_,_,_],
            [_,txd,tx,tx,tx,sh,shg,sh,shg,sh,tx,tx,tx,txd,_,_],
            [ar,ars,tx,tx,tx,tx,tx,tx,tx,tx,tx,tx,tx,tx,_,_],
        ];
        const c = createCanvas(64, 72);
        const ctx = c.getContext('2d');
        drawPixels(ctx, data, 4);
        cache.vaituz = c;
        return c;
    }

    function kobPortrait() {
        // Коб — нарцисс с деньгами
        if (cache.kob) return cache.kob;
        const _ = null;
        const s = '#d4a88c', s2 = '#c49880', s3 = '#b48870';
        const h = '#2a2a3a', h2 = '#1a1a2a';
        const b = C.black, w = C.white;
        const e = '#6644aa', ew = C.eye_white, es = C.eye_shine;
        const cl = C.kob_cloak, cl2 = C.kob_cloak2, p = C.kob_purple;
        const mo = C.mouth, my = C.mystery, my2 = C.mystery2;
        const gld = '#ccaa22', gd2 = '#eebb33'; // gold coins
        const data = [
            [_,_,_,gld,cl2,cl,cl,cl,cl,cl,cl,cl2,gd2,_,_,_],
            [_,_,gd2,cl2,cl,cl,my,cl,cl,my,cl,cl,cl2,gld,_,_],
            [_,_,cl2,cl,h2,h,h,h,h,h,h,h2,cl,cl2,_,_],
            [_,cl2,cl,h,h,h2,h,h,h,h2,h,h,h,cl,cl2,_],
            [_,cl,h,h,s,s,s,s,s,s,s,s,h,h,cl,_],
            [_,cl,h,s,s,s,s,s,s,s,s,s,s,h,cl,_],
            [_,_,s,s,s,s,s,s,s,s,s,s,s,s,_,_],
            [_,_,s,ew,ew,e,s,s,s,ew,ew,e,s,s,_,_],
            [_,_,s,es,p,e,s,s,s,es,p,e,s,s,_,_],
            [_,_,s,s,s,s,s,s2,s,s,s,s,s,s,_,_],
            [_,_,s,s,s,s,s2,s3,s2,s,s,s,s,s,_,_],
            [_,_,s,s,s,s,s,s2,s,s,s,s,s,s,_,_],
            [_,_,s,s,mo,mo,mo,mo,mo,mo,s,s,s,_,_,_],
            [_,_,_,s,s2,s,s,s,s,s,s2,s,_,_,_,_],
            [gld,_,cl2,cl,cl,cl,cl,cl,cl,cl,cl,cl,cl2,_,gd2,_],
            [gd2,cl2,cl,cl,gld,cl,my,my2,cl,gld,cl,cl,cl,cl2,gld,_],
            [cl2,cl,cl,gd2,cl,cl,gld,gld,cl,cl,gd2,cl,cl,cl,cl2,_],
            [cl,cl,gld,cl,cl,gd2,cl,cl,gd2,cl,cl,gld,cl,cl,cl,_],
        ];
        const c = createCanvas(64, 72);
        const ctx = c.getContext('2d');
        drawPixels(ctx, data, 4);
        cache.kob = c;
        return c;
    }

    function chebPortrait() {
        // Чеб — человек в костюме креветки
        if (cache.cheb) return cache.cheb;
        const _ = null;
        const s = '#e0b898', s2 = '#d0a888', s3 = '#c09878';
        const h = '#5a4030', h2 = '#4a3020';
        const b = C.black, w = C.white;
        const e = '#446688', ew = C.eye_white, es = C.eye_shine;
        const mo = C.mouth;
        const sh = '#ff7744', sh2 = '#ee5533', sh3 = '#cc4422'; // shrimp colors
        const wh = '#ffccbb', wh2 = '#eebb99'; // shrimp white belly
        const ant = '#ff9966'; // antenna
        const data = [
            [_,_,_,ant,_,_,_,_,_,_,_,_,ant,_,_,_],
            [_,_,ant,sh,sh,sh,sh,sh,sh,sh,sh,sh,sh,ant,_,_],
            [_,ant,sh,sh2,sh,sh,sh,sh,sh,sh,sh,sh2,sh,sh,ant,_],
            [_,sh,sh,sh,h2,h,h,h,h,h,h,h2,sh,sh,sh,_],
            [_,sh,sh,s,s,s,s,s,s,s,s,s,s,sh,sh,_],
            [_,sh2,s,s,s,s,s,s,s,s,s,s,s,s,sh2,_],
            [_,_,s,s,s,s,s,s,s,s,s,s,s,s,_,_],
            [_,_,s,ew,ew,e,s,s,s,ew,ew,e,s,s,_,_],
            [_,_,s,es,b,e,s,s,s,es,b,e,s,s,_,_],
            [_,_,s,s,s,s,s,s2,s,s,s,s,s,s,_,_],
            [_,_,s,s,s,s,s2,s3,s2,s,s,s,s,s,_,_],
            [_,_,s,s,s,s,s,s2,s,s,s,s,s,s,_,_],
            [_,_,s,s,mo,mo,mo,mo,mo,mo,s,s,s,_,_,_],
            [_,_,_,s,s2,s,s,s,s,s,s2,s,_,_,_,_],
            [_,_,sh3,sh,wh,wh,wh,wh,wh,wh,wh,sh,sh3,_,_,_],
            [_,sh3,sh,sh,wh,wh2,wh,wh,wh,wh2,wh,sh,sh,sh3,_,_],
            [_,sh,sh2,sh,wh,wh,wh,wh,wh,wh,wh,sh,sh2,sh,_,_],
            [sh,sh2,sh3,sh,sh,sh,sh,sh,sh,sh,sh,sh,sh3,sh2,sh,_],
        ];
        const c = createCanvas(64, 72);
        const ctx = c.getContext('2d');
        drawPixels(ctx, data, 4);
        cache.cheb = c;
        return c;
    }

    function periclesPortrait() {
        // Периклес — лысый гном
        if (cache.pericles) return cache.pericles;
        const _ = null;
        const s = '#d4a88c', s2 = '#c49880', s3 = '#b48870';
        const b = C.black;
        const e = '#556644', ew = C.eye_white, es = C.eye_shine;
        const mo = C.mouth;
        const br = '#8b6543', br2 = '#6a4a30'; // brown robe
        const bd = '#aaa090'; // bald head shine
        const bt = '#c4a07a'; // beard tan
        const data = [
            [_,_,_,_,_,bd,bd,bd,bd,bd,bd,_,_,_,_,_],
            [_,_,_,_,bd,s,s,s,s,s,s,bd,_,_,_,_],
            [_,_,_,bd,s,s,s,s,s,s,s,s,bd,_,_,_],
            [_,_,bd,s,s,s,s,s,s,s,s,s,s,bd,_,_],
            [_,_,s,s,s,s,s,s,s,s,s,s,s,s,_,_],
            [_,_,s,s,s,s,s,s,s,s,s,s,s,s,_,_],
            [_,_,s,ew,ew,e,s,s,s,ew,ew,e,s,s,_,_],
            [_,_,s,es,b,e,s,s,s,es,b,e,s,s,_,_],
            [_,_,s,s,s,s,s,s2,s,s,s,s,s,s,_,_],
            [_,_,s,s,s,s,s2,s3,s2,s,s,s,s,s,_,_],
            [_,_,s,bt,bt,bt,bt,bt,bt,bt,bt,bt,bt,s,_,_],
            [_,_,s,bt,bt,mo,mo,mo,mo,mo,bt,bt,s,_,_,_],
            [_,_,_,s,bt,bt,bt,bt,bt,bt,bt,s,_,_,_,_],
            [_,_,_,s,s2,bt,bt,bt,bt,bt,s2,s,_,_,_,_],
            [_,_,br2,br,br,br,br,br,br,br,br,br,br2,_,_,_],
            [_,br2,br,br,br,br,br,br,br,br,br,br,br,br2,_,_],
            [br2,br,br,br,br,br,br,br,br,br,br,br,br,br,br2,_],
            [br,br,br,br,br,br,br,br,br,br,br,br,br,br,br,_],
        ];
        const c = createCanvas(64, 72);
        const ctx = c.getContext('2d');
        drawPixels(ctx, data, 4);
        cache.pericles = c;
        return c;
    }

    function madyarPortrait() {
        // Мадьяр — большой айтишник с лёгкой щетиной
        if (cache.madyar) return cache.madyar;
        const _ = null;
        const s = '#d8a890', s2 = '#c89880', s3 = '#b88870';
        const h = '#4a3a2a', h2 = '#3a2a1a';
        const b = C.black;
        const e = '#445566', ew = C.eye_white, es = C.eye_shine;
        const mo = C.mouth;
        const st = '#a09080'; // stubble
        const sh = '#334455', sh2 = '#223344'; // hoodie/shirt dark
        const gl = '#88aacc'; // glasses
        const data = [
            [_,_,_,_,h2,h,h,h,h,h,h,h2,_,_,_,_],
            [_,_,_,h2,h,h,h,h,h,h,h,h,h2,_,_,_],
            [_,_,h2,h,h,h,h,h,h,h,h,h,h,h2,_,_],
            [_,h2,h,h,h,h,h,h,h,h,h,h,h,h,h2,_],
            [_,h,s,s,s,s,s,s,s,s,s,s,s,s,h,_],
            [_,s,s,s,s,s,s,s,s,s,s,s,s,s,s,_],
            [_,s,gl,gl,gl,gl,s,s,s,gl,gl,gl,gl,s,_,_],
            [_,s,gl,ew,ew,e,gl,b,gl,ew,ew,e,gl,s,_,_],
            [_,s,s,es,b,e,s,s,s,es,b,e,s,s,_,_],
            [_,_,s,s,s,s,s,s2,s,s,s,s,s,s,_,_],
            [_,_,s,s,s,st,st,s3,st,st,s,s,s,s,_,_],
            [_,_,s,st,st,st,st,st,st,st,st,st,s,_,_,_],
            [_,_,s,st,mo,mo,mo,mo,mo,mo,st,s,s,_,_,_],
            [_,_,_,s,s2,s,s,s,s,s,s2,s,_,_,_,_],
            [_,sh2,sh,sh,sh,sh,sh,sh,sh,sh,sh,sh,sh,sh2,_,_],
            [sh2,sh,sh,sh,sh,sh,sh,sh,sh,sh,sh,sh,sh,sh,sh2,_],
            [sh,sh,sh,sh,sh,sh,sh,sh,sh,sh,sh,sh,sh,sh,sh,sh],
            [sh,sh,sh,sh,sh,sh,sh,sh,sh,sh,sh,sh,sh,sh,sh,sh],
        ];
        const c = createCanvas(64, 72);
        const ctx = c.getContext('2d');
        drawPixels(ctx, data, 4);
        cache.madyar = c;
        return c;
    }

    function akulbotPortrait() {
        // Акулбот — молодой парень с белыми волосами
        if (cache.akulbot) return cache.akulbot;
        const _ = null;
        const s = '#f0c0a0', s2 = '#e0b090', s3 = '#d0a080';
        const h = '#e8e8f0', h2 = '#d0d0e0'; // white/platinum hair
        const b = C.black;
        const e = '#5566dd', ew = C.eye_white, es = C.eye_shine;
        const mo = C.mouth;
        const hd = '#555577', hd2 = '#444466'; // hoodie
        const sh = '#6688ff'; // shark accent
        const data = [
            [_,_,_,h2,h,h,h,h,h,h,h,h,h2,_,_,_],
            [_,_,h2,h,h,h,h,h,h,h,h,h,h,h2,_,_],
            [_,h2,h,h,h,h,h,h,h,h,h,h,h,h,h2,_],
            [_,h,h,h,h,h,h,h,h,h,h,h,h,h,h,_],
            [_,h,h,s,s,s,s,s,s,s,s,s,s,h,h,_],
            [h,h,s,s,s,s,s,s,s,s,s,s,s,s,h,h],
            [_,h,s,s,s,s,s,s,s,s,s,s,s,s,h,_],
            [_,_,s,ew,ew,e,s,s,s,ew,ew,e,s,s,_,_],
            [_,_,s,es,b,e,s,s,s,es,b,e,s,s,_,_],
            [_,_,s,s,s,s,s,s2,s,s,s,s,s,s,_,_],
            [_,_,s,s,s,s,s2,s3,s2,s,s,s,s,s,_,_],
            [_,_,s,s,s,s,s,s2,s,s,s,s,s,s,_,_],
            [_,_,s,s,mo,mo,mo,mo,mo,mo,s,s,s,_,_,_],
            [_,_,_,s,s2,s,s,s,s,s,s2,s,_,_,_,_],
            [_,_,hd2,hd,hd,hd,hd,hd,hd,hd,hd,hd,hd2,_,_,_],
            [_,hd2,hd,hd,sh,hd,hd,hd,hd,hd,sh,hd,hd,hd2,_,_],
            [hd2,hd,hd,hd,sh,sh,hd,hd,hd,sh,sh,hd,hd,hd,hd2,_],
            [hd,hd,hd,hd,hd,sh,hd,hd,hd,sh,hd,hd,hd,hd,hd,_],
        ];
        const c = createCanvas(64, 72);
        const ctx = c.getContext('2d');
        drawPixels(ctx, data, 4);
        cache.akulbot = c;
        return c;
    }

    function chekistPortrait() {
        // Чекист — форма коммуниста
        if (cache.chekist) return cache.chekist;
        const _ = null;
        const s = '#d8a890', s2 = '#c89880', s3 = '#b88870';
        const h = '#4a3020', h2 = '#3a2010';
        const b = C.black;
        const e = '#556644', ew = C.eye_white, es = C.eye_shine;
        const mo = C.mouth;
        const rd = '#cc2222', rd2 = '#aa1111'; // red uniform
        const gd = '#ccaa22'; // gold star/buttons
        const cp = '#882222'; // cap
        const st = '#ffcc33'; // star
        const data = [
            [_,_,_,_,cp,cp,cp,cp,cp,cp,cp,cp,_,_,_,_],
            [_,_,cp,cp,cp,cp,st,st,st,cp,cp,cp,cp,_,_,_],
            [_,_,_,cp,h2,h,h,h,h,h,h,h2,cp,_,_,_],
            [_,_,_,h2,h,h,h,h,h,h,h,h,h2,_,_,_],
            [_,_,h,s,s,s,s,s,s,s,s,s,s,h,_,_],
            [_,_,s,s,s,s,s,s,s,s,s,s,s,s,_,_],
            [_,_,s,s,s,s,s,s,s,s,s,s,s,s,_,_],
            [_,_,s,ew,ew,e,s,s,s,ew,ew,e,s,s,_,_],
            [_,_,s,es,b,e,s,s,s,es,b,e,s,s,_,_],
            [_,_,s,s,s,s,s,s2,s,s,s,s,s,s,_,_],
            [_,_,s,s,s,s,s2,s3,s2,s,s,s,s,s,_,_],
            [_,_,s,s,s,s,s,s2,s,s,s,s,s,s,_,_],
            [_,_,s,s,mo,mo,mo,mo,mo,mo,s,s,s,_,_,_],
            [_,_,_,s,s2,s,s,s,s,s,s2,s,_,_,_,_],
            [_,_,rd2,rd,rd,rd,rd,rd,rd,rd,rd,rd,rd2,_,_,_],
            [_,rd2,rd,gd,rd,rd,st,st,rd,rd,gd,rd,rd,rd2,_,_],
            [rd2,rd,rd,gd,rd,rd,st,st,rd,rd,gd,rd,rd,rd,rd2,_],
            [rd,rd,rd,rd,rd,rd,rd,rd,rd,rd,rd,rd,rd,rd,rd,_],
        ];
        const c = createCanvas(64, 72);
        const ctx = c.getContext('2d');
        drawPixels(ctx, data, 4);
        cache.chekist = c;
        return c;
    }

    function gerostratPortrait() {
        // Герострат — футболист
        if (cache.gerostrat) return cache.gerostrat;
        const _ = null;
        const s = '#e0b898', s2 = '#d0a888', s3 = '#c09878';
        const h = '#3a2a1a', h2 = '#2a1a0a';
        const b = C.black;
        const e = '#665544', ew = C.eye_white, es = C.eye_shine;
        const mo = C.mouth;
        const jy = '#44aa44', jy2 = '#338833'; // jersey green
        const wt = '#ffffff', wt2 = '#dddddd'; // white stripes
        const nm = '#ffcc33'; // number
        const data = [
            [_,_,_,_,h2,h,h,h,h,h,h,h2,_,_,_,_],
            [_,_,_,h2,h,h,h,h,h,h,h,h,h2,_,_,_],
            [_,_,h2,h,h,h,h,h,h,h,h,h,h,h2,_,_],
            [_,_,h,h,h,h,h,h,h,h,h,h,h,h,_,_],
            [_,_,h,s,s,s,s,s,s,s,s,s,s,h,_,_],
            [_,_,s,s,s,s,s,s,s,s,s,s,s,s,_,_],
            [_,_,s,s,s,s,s,s,s,s,s,s,s,s,_,_],
            [_,_,s,ew,ew,e,s,s,s,ew,ew,e,s,s,_,_],
            [_,_,s,es,b,e,s,s,s,es,b,e,s,s,_,_],
            [_,_,s,s,s,s,s,s2,s,s,s,s,s,s,_,_],
            [_,_,s,s,s,s,s2,s3,s2,s,s,s,s,s,_,_],
            [_,_,s,s,s,s,s,s2,s,s,s,s,s,s,_,_],
            [_,_,s,s,mo,mo,mo,mo,mo,mo,s,s,s,_,_,_],
            [_,_,_,s,s2,s,s,s,s,s,s2,s,_,_,_,_],
            [_,_,jy2,jy,wt,jy,jy,jy,jy,jy,wt,jy,jy2,_,_,_],
            [_,jy2,jy,jy,wt,jy,nm,nm,jy,jy,wt,jy,jy,jy2,_,_],
            [jy2,jy,jy,jy,wt,jy,nm,nm,jy,jy,wt,jy,jy,jy,jy2,_],
            [jy,jy,jy,jy,jy,jy,jy,jy,jy,jy,jy,jy,jy,jy,jy,_],
        ];
        const c = createCanvas(64, 72);
        const ctx = c.getContext('2d');
        drawPixels(ctx, data, 4);
        cache.gerostrat = c;
        return c;
    }

    function auromolinPortrait() {
        // Ауромолин — таинственная фигура
        if (cache.auromolin) return cache.auromolin;
        const _ = null;
        const s = '#c8a888', s2 = '#b89878', s3 = '#a88868';
        const b = C.black;
        const e = '#8866cc', ew = C.eye_white, es = C.eye_shine;
        const mo = C.mouth;
        const dk = '#1a1a2e', dk2 = '#0e0e1e'; // dark cloak
        const gl = '#8866ff', gl2 = '#6644dd'; // glow purple
        const cd = '#2a2a4e'; // code color
        const data = [
            [_,_,_,dk2,dk,dk,dk,dk,dk,dk,dk,dk,dk2,_,_,_],
            [_,_,dk2,dk,dk,dk,dk,dk,dk,dk,dk,dk,dk,dk2,_,_],
            [_,dk2,dk,dk,dk,dk,dk,dk,dk,dk,dk,dk,dk,dk,dk2,_],
            [_,dk,dk,dk,s,s,s,s,s,s,s,s,dk,dk,dk,_],
            [_,dk,dk,s,s,s,s,s,s,s,s,s,s,dk,dk,_],
            [_,dk,s,s,s,s,s,s,s,s,s,s,s,s,dk,_],
            [_,_,s,s,s,s,s,s,s,s,s,s,s,s,_,_],
            [_,_,s,ew,ew,e,s,s,s,ew,ew,e,s,s,_,_],
            [_,_,s,es,gl,e,s,s,s,es,gl,e,s,s,_,_],
            [_,_,s,s,s,s,s,s2,s,s,s,s,s,s,_,_],
            [_,_,s,s,s,s,s2,s3,s2,s,s,s,s,s,_,_],
            [_,_,s,s,s,s,s,s2,s,s,s,s,s,s,_,_],
            [_,_,s,s,mo,mo,mo,mo,mo,mo,s,s,s,_,_,_],
            [_,_,_,s,s2,s,s,s,s,s,s2,s,_,_,_,_],
            [_,dk2,dk,dk,dk,dk,dk,dk,dk,dk,dk,dk,dk,dk2,_,_],
            [dk2,dk,dk,gl,dk,cd,gl2,gl,cd,dk,gl,dk,dk,dk,dk2,_],
            [dk,dk,dk,gl2,dk,cd,dk,dk,cd,dk,gl2,dk,dk,dk,dk,_],
            [dk,dk,dk,dk,dk,dk,dk,dk,dk,dk,dk,dk,dk,dk,dk,_],
        ];
        const c = createCanvas(64, 72);
        const ctx = c.getContext('2d');
        drawPixels(ctx, data, 4);
        cache.auromolin = c;
        return c;
    }

    function vilgefortzPortrait() {
        // Вильгефортс — злой маг/босс
        if (cache.vilgefortz) return cache.vilgefortz;
        const _ = null;
        const s = '#c8a080', s2 = '#b89070', s3 = '#a88060';
        const h = '#1a1a2e', h2 = '#0e0e1e';
        const b = C.black;
        const e = '#ff4444', ew = C.eye_white, es = C.eye_shine;
        const mo = C.mouth;
        const robe = '#2a1a4e', rb2 = '#1a0a3e';
        const fire = '#ff6633', fr2 = '#ff4411', fr3 = '#ffaa33';
        const data = [
            [_,_,_,_,h2,h,h,h,h,h,h,h2,_,_,_,_],
            [_,_,_,h2,h,h,h,h,h,h,h,h,h2,_,_,_],
            [_,_,h2,h,h,h,h,h,h,h,h,h,h,h2,_,_],
            [_,h2,h,h,h,h,h,h,h,h,h,h,h,h,h2,_],
            [_,h,h,s,s,s,s,s,s,s,s,s,s,h,h,_],
            [h,h,s,s,s,s,s,s,s,s,s,s,s,s,h,h],
            [_,_,s,s,s,s,s,s,s,s,s,s,s,s,_,_],
            [_,_,s,ew,ew,e,s,s,s,ew,ew,e,s,s,_,_],
            [_,_,s,es,e,e,s,s,s,es,e,e,s,s,_,_],
            [_,_,s,s,s,s,s,s2,s,s,s,s,s,s,_,_],
            [_,_,s,s,s,s,s2,s3,s2,s,s,s,s,s,_,_],
            [_,_,s,s,s,s,s,s2,s,s,s,s,s,s,_,_],
            [_,_,s,s,mo,mo,mo,mo,mo,mo,s,s,s,_,_,_],
            [_,_,_,s,s2,s,s,s,s,s,s2,s,_,_,_,_],
            [_,_,rb2,robe,robe,robe,robe,robe,robe,robe,robe,robe,rb2,_,_,_],
            [fire,rb2,robe,robe,robe,robe,robe,robe,robe,robe,robe,robe,robe,rb2,fr2,_],
            [fr3,fire,robe,robe,robe,robe,robe,robe,robe,robe,robe,robe,fire,fr3,_,_],
            [_,fr2,fire,robe,robe,robe,robe,robe,robe,robe,robe,robe,fr2,fire,_,_],
        ];
        const c = createCanvas(64, 72);
        const ctx = c.getContext('2d');
        drawPixels(ctx, data, 4);
        cache.vilgefortz = c;
        return c;
    }

    function createWalkSprite(name, colors) {
        const key = name + '_walk';
        if (cache[key]) return cache[key];
        const frames = [];
        const { head, headDark, body, bodyDark, legs, legsDark, accent, accent2, hair } = colors;
        for (let f = 0; f < 4; f++) {
            const c = createCanvas(16, 24);
            const ctx = c.getContext('2d');

            // Hair
            if (hair) {
                ctx.fillStyle = hair;
                ctx.fillRect(3, 0, 10, 4);
            }

            // Head with shading
            ctx.fillStyle = head;
            ctx.fillRect(4, hair ? 2 : 0, 8, 8);
            if (headDark) {
                ctx.fillStyle = headDark;
                ctx.fillRect(4, hair ? 7 : 5, 8, 3);
            }

            // Eyes with shine
            ctx.fillStyle = '#000';
            ctx.fillRect(5, (hair ? 4 : 2), 2, 2);
            ctx.fillRect(9, (hair ? 4 : 2), 2, 2);
            ctx.fillStyle = '#fff';
            ctx.fillRect(5, (hair ? 4 : 2), 1, 1);
            ctx.fillRect(9, (hair ? 4 : 2), 1, 1);

            // Body with shading
            ctx.fillStyle = body;
            ctx.fillRect(3, 8, 10, 8);
            if (bodyDark) {
                ctx.fillStyle = bodyDark;
                ctx.fillRect(3, 8, 2, 8);
                ctx.fillRect(11, 8, 2, 8);
            }

            // Accent details
            if (accent) {
                ctx.fillStyle = accent;
                ctx.fillRect(5, 8, 6, 2);
            }
            if (accent2) {
                ctx.fillStyle = accent2;
                ctx.fillRect(7, 10, 2, 3);
            }

            // Legs with animation
            ctx.fillStyle = legs;
            const legOffset = [0, 1, 0, -1][f];
            ctx.fillRect(4 + legOffset, 16, 3, 8);
            ctx.fillRect(9 - legOffset, 16, 3, 8);
            if (legsDark) {
                ctx.fillStyle = legsDark;
                ctx.fillRect(4 + legOffset, 22, 3, 2);
                ctx.fillRect(9 - legOffset, 22, 3, 2);
            }

            frames.push(c);
        }
        cache[key] = frames;
        return frames;
    }

    function orsonWalk() {
        return createWalkSprite('orson', {
            head: C.skin1, headDark: C.skin2, body: C.dark_gray, bodyDark: '#333',
            legs: '#2a2a2a', legsDark: '#1a1a1a', accent: null, hair: C.hair_dark
        });
    }

    function vaituzWalk() {
        return createWalkSprite('vaituz', {
            head: '#f0c8a8', headDark: '#e0b898', body: C.tux_black, bodyDark: '#101020',
            legs: '#1a1a1a', legsDark: '#0a0a0a', accent: C.shirt_white, accent2: C.tie_brown,
            hair: C.hair_light
        });
    }

    function kobWalk() {
        return createWalkSprite('kob', {
            head: '#d4a88c', headDark: '#c49880', body: C.kob_cloak, bodyDark: C.kob_cloak2,
            legs: '#332255', legsDark: '#221144', accent: C.kob_purple, hair: '#2a2a3a'
        });
    }

    function chebWalk() {
        return createWalkSprite('cheb', {
            head: '#e0b898', headDark: '#d0a888', body: C.pilot_blue, bodyDark: C.pilot_blue2,
            legs: '#1a2a4a', legsDark: '#0a1a3a', accent: C.pilot_gold, hair: '#5a4030'
        });
    }

    function playerWalk() {
        return createWalkSprite('player', {
            head: '#ffcc99', headDark: '#eebb88', body: '#cc4444', bodyDark: '#aa2222',
            legs: '#4444cc', legsDark: '#2222aa', accent: '#ffff44', hair: '#885533'
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
                // Subtle texture
                ctx.fillStyle = '#1e1e34';
                ctx.fillRect(4, 4, 2, 2);
                ctx.fillRect(10, 10, 2, 2);
                ctx.fillRect(8, 2, 1, 1);
                ctx.fillRect(2, 12, 1, 1);
            },
            floor_light: () => {
                ctx.fillStyle = '#2a2a3e';
                ctx.fillRect(0, 0, 16, 16);
                ctx.fillStyle = '#333355';
                ctx.fillRect(0, 0, 16, 1);
                ctx.fillRect(0, 0, 1, 16);
                // Checker pattern
                ctx.fillStyle = '#2e2e44';
                ctx.fillRect(0, 0, 8, 8);
                ctx.fillRect(8, 8, 8, 8);
            },
            wall: () => {
                ctx.fillStyle = '#443366';
                ctx.fillRect(0, 0, 16, 16);
                ctx.fillStyle = '#554477';
                ctx.fillRect(1, 1, 14, 14);
                ctx.fillStyle = '#332255';
                ctx.fillRect(0, 14, 16, 2);
                // Brick lines
                ctx.fillStyle = '#3a2a55';
                ctx.fillRect(0, 5, 16, 1);
                ctx.fillRect(0, 10, 16, 1);
                ctx.fillRect(4, 0, 1, 5);
                ctx.fillRect(12, 5, 1, 5);
                ctx.fillRect(8, 10, 1, 6);
                // Highlight
                ctx.fillStyle = '#665588';
                ctx.fillRect(1, 1, 14, 1);
            },
            grass: () => {
                ctx.fillStyle = '#2a5a2a';
                ctx.fillRect(0, 0, 16, 16);
                // Varied grass tufts (deterministic)
                ctx.fillStyle = '#3a7a3a';
                ctx.fillRect(2, 3, 2, 2);
                ctx.fillRect(8, 6, 2, 2);
                ctx.fillRect(12, 2, 2, 2);
                ctx.fillRect(5, 11, 2, 2);
                ctx.fillRect(1, 8, 1, 3);
                ctx.fillRect(10, 12, 1, 3);
                // Flowers
                ctx.fillStyle = '#cccc44';
                ctx.fillRect(6, 1, 1, 1);
                ctx.fillStyle = '#cc88cc';
                ctx.fillRect(13, 9, 1, 1);
            },
            water: () => {
                ctx.fillStyle = '#2244aa';
                ctx.fillRect(0, 0, 16, 16);
                ctx.fillStyle = '#3366cc';
                ctx.fillRect(2, 4, 12, 2);
                ctx.fillRect(0, 10, 10, 2);
                ctx.fillStyle = '#4488dd';
                ctx.fillRect(4, 4, 3, 1);
                ctx.fillRect(1, 10, 4, 1);
                // Sparkle
                ctx.fillStyle = '#88aaee';
                ctx.fillRect(6, 7, 1, 1);
            },
            path: () => {
                ctx.fillStyle = '#8b7355';
                ctx.fillRect(0, 0, 16, 16);
                ctx.fillStyle = '#a08868';
                ctx.fillRect(2, 2, 12, 12);
                // Stones
                ctx.fillStyle = '#9a8060';
                ctx.fillRect(3, 4, 3, 2);
                ctx.fillRect(9, 8, 4, 3);
                ctx.fillStyle = '#7a6345';
                ctx.fillRect(5, 10, 2, 2);
            },
            door: () => {
                ctx.fillStyle = '#443366';
                ctx.fillRect(0, 0, 16, 16);
                ctx.fillStyle = '#8b6543';
                ctx.fillRect(2, 0, 12, 16);
                ctx.fillStyle = '#a07850';
                ctx.fillRect(4, 2, 8, 12);
                // Door details
                ctx.fillStyle = '#7a5533';
                ctx.fillRect(4, 7, 8, 1);
                ctx.fillStyle = '#ccaa44';
                ctx.fillRect(10, 7, 2, 2);
                // Arch
                ctx.fillStyle = '#665588';
                ctx.fillRect(2, 0, 1, 16);
                ctx.fillRect(13, 0, 1, 16);
                ctx.fillRect(2, 0, 12, 1);
            },
            table: () => {
                ctx.fillStyle = '#1a1a2e';
                ctx.fillRect(0, 0, 16, 16);
                ctx.fillStyle = '#6b4523';
                ctx.fillRect(1, 4, 14, 10);
                ctx.fillStyle = '#8b6543';
                ctx.fillRect(2, 5, 12, 8);
                // Wood grain
                ctx.fillStyle = '#7b5533';
                ctx.fillRect(3, 7, 10, 1);
                ctx.fillRect(4, 10, 8, 1);
                // Legs
                ctx.fillStyle = '#5a3a1a';
                ctx.fillRect(2, 13, 2, 3);
                ctx.fillRect(12, 13, 2, 3);
            },
            pc: () => {
                ctx.fillStyle = '#1a1a2e';
                ctx.fillRect(0, 0, 16, 16);
                // Monitor
                ctx.fillStyle = '#222';
                ctx.fillRect(2, 1, 12, 9);
                ctx.fillStyle = '#4488cc';
                ctx.fillRect(3, 2, 10, 7);
                // Screen content (code lines)
                ctx.fillStyle = '#66aaee';
                ctx.fillRect(4, 3, 6, 1);
                ctx.fillStyle = '#44cc88';
                ctx.fillRect(4, 5, 4, 1);
                ctx.fillStyle = '#ee8844';
                ctx.fillRect(5, 7, 7, 1);
                // Stand
                ctx.fillStyle = '#444';
                ctx.fillRect(6, 10, 4, 2);
                ctx.fillRect(4, 12, 8, 1);
                // Keyboard
                ctx.fillStyle = '#555';
                ctx.fillRect(3, 13, 10, 2);
                ctx.fillStyle = '#666';
                ctx.fillRect(4, 13, 2, 1);
                ctx.fillRect(7, 13, 2, 1);
                ctx.fillRect(10, 13, 2, 1);
            },
            apple_tree: () => {
                ctx.fillStyle = '#2a5a2a';
                ctx.fillRect(0, 0, 16, 16);
                // Trunk with texture
                ctx.fillStyle = '#5a3a1a';
                ctx.fillRect(6, 8, 4, 8);
                ctx.fillStyle = '#4a2a0a';
                ctx.fillRect(7, 8, 1, 8);
                // Leaves with depth
                ctx.fillStyle = '#1a6622';
                ctx.fillRect(2, 1, 12, 9);
                ctx.fillStyle = '#228822';
                ctx.fillRect(3, 0, 10, 8);
                ctx.fillStyle = '#33aa33';
                ctx.fillRect(4, 1, 4, 3);
                // Apples
                ctx.fillStyle = '#cc3333';
                ctx.fillRect(4, 3, 2, 2);
                ctx.fillRect(10, 4, 2, 2);
                ctx.fillStyle = '#ee4444';
                ctx.fillRect(7, 2, 2, 2);
            },
            runway: () => {
                ctx.fillStyle = '#555555';
                ctx.fillRect(0, 0, 16, 16);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(7, 0, 2, 4);
                ctx.fillRect(7, 8, 2, 4);
                // Edge lines
                ctx.fillStyle = '#cccc44';
                ctx.fillRect(0, 0, 1, 16);
                ctx.fillRect(15, 0, 1, 16);
                // Texture
                ctx.fillStyle = '#4a4a4a';
                ctx.fillRect(3, 6, 3, 1);
                ctx.fillRect(10, 14, 4, 1);
            },
            burger: () => {
                ctx.fillStyle = '#1a1a2e';
                ctx.fillRect(0, 0, 16, 16);
                // Burger with detail
                ctx.fillStyle = '#cc9944';
                ctx.fillRect(3, 3, 10, 2);
                ctx.fillStyle = '#ddaa55';
                ctx.fillRect(4, 3, 8, 1);
                ctx.fillStyle = '#55aa33';
                ctx.fillRect(3, 5, 10, 1);
                ctx.fillStyle = '#cc4444';
                ctx.fillRect(3, 6, 10, 2);
                ctx.fillStyle = '#ffcc44';
                ctx.fillRect(3, 8, 10, 1);
                ctx.fillStyle = '#cc9944';
                ctx.fillRect(3, 9, 10, 2);
                ctx.fillStyle = '#bb8833';
                ctx.fillRect(4, 10, 8, 1);
            },
            bookshelf: () => {
                ctx.fillStyle = '#5a3a1a';
                ctx.fillRect(0, 0, 16, 16);
                ctx.fillStyle = '#4a2a0a';
                ctx.fillRect(0, 7, 16, 1);
                // Top shelf books
                ctx.fillStyle = '#cc4444';
                ctx.fillRect(1, 1, 3, 6);
                ctx.fillStyle = '#4444cc';
                ctx.fillRect(5, 1, 3, 6);
                ctx.fillStyle = '#44cc44';
                ctx.fillRect(9, 2, 3, 5);
                ctx.fillStyle = '#cccc44';
                ctx.fillRect(13, 1, 2, 6);
                // Bottom shelf books
                ctx.fillStyle = '#cc88cc';
                ctx.fillRect(1, 8, 4, 7);
                ctx.fillStyle = '#88cccc';
                ctx.fillRect(6, 9, 4, 6);
                ctx.fillStyle = '#aa8844';
                ctx.fillRect(11, 8, 4, 7);
                // Book spines
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(2, 2, 1, 1);
                ctx.fillRect(6, 3, 1, 1);
                ctx.fillRect(12, 9, 2, 1);
            },
            throne: () => {
                ctx.fillStyle = '#1a1a2e';
                ctx.fillRect(0, 0, 16, 16);
                // Back
                ctx.fillStyle = '#aa8833';
                ctx.fillRect(3, 0, 10, 14);
                ctx.fillStyle = '#ccaa44';
                ctx.fillRect(4, 1, 8, 12);
                // Cushion
                ctx.fillStyle = '#cc3333';
                ctx.fillRect(5, 5, 6, 7);
                ctx.fillStyle = '#aa2222';
                ctx.fillRect(5, 10, 6, 2);
                // Crown detail
                ctx.fillStyle = '#eedd33';
                ctx.fillRect(5, 1, 2, 2);
                ctx.fillRect(9, 1, 2, 2);
                ctx.fillRect(7, 0, 2, 3);
                // Armrests
                ctx.fillStyle = '#aa8833';
                ctx.fillRect(2, 5, 2, 9);
                ctx.fillRect(12, 5, 2, 9);
            },
            arena_floor: () => {
                ctx.fillStyle = '#2e1a1a';
                ctx.fillRect(0, 0, 16, 16);
                ctx.fillStyle = '#442222';
                ctx.fillRect(0, 0, 16, 1);
                ctx.fillRect(0, 0, 1, 16);
                // Blood splatter marks
                ctx.fillStyle = '#3a1515';
                ctx.fillRect(5, 5, 2, 1);
                ctx.fillRect(11, 9, 1, 2);
                ctx.fillRect(3, 12, 2, 1);
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
        const rb = '#ff3333';
        const rd = '#990000';
        const _ = null;
        const data = [
            [_,_,r,r,_,_,r,r],
            [_,r,rb,r,r,r,rb,r],
            [r,rb,r,r,r,r,r,r],
            [r,r,r,r,r,r,r,r],
            [_,r,r,r,r,r,r,_],
            [_,_,r,r,r,rd,_,_],
            [_,_,_,r,rd,_,_,_],
            [_,_,_,_,_,_,_,_],
        ];
        drawPixels(ctx, data.map(row => row.map(c => c)), 2);
        cache.heart = c;
        return c;
    }

    function createMenuCursor() {
        if (cache.cursor) return cache.cursor;
        const c = createCanvas(16, 16);
        const ctx = c.getContext('2d');
        const r = '#cc0000';
        const rb = '#ff4444';
        const data = [
            [0,0,1,1,0,0,1,1],
            [0,1,2,1,1,1,2,1],
            [1,2,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1],
            [0,1,1,1,1,1,1,0],
            [0,0,1,1,1,1,0,0],
            [0,0,0,1,1,0,0,0],
        ];
        data.forEach((row, y) => row.forEach((v, x) => {
            if (v === 1) { ctx.fillStyle = r; ctx.fillRect(x * 2, y * 2, 2, 2); }
            if (v === 2) { ctx.fillStyle = rb; ctx.fillRect(x * 2, y * 2, 2, 2); }
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
                ctx.fillStyle = '#44aa22';
                ctx.fillRect(5, 3, 6, 9);
                ctx.fillStyle = '#55bb33';
                ctx.fillRect(6, 4, 4, 7);
                ctx.fillStyle = '#66cc44';
                ctx.fillRect(7, 5, 2, 2);
                ctx.fillStyle = '#5a3a1a';
                ctx.fillRect(7, 0, 2, 4);
                ctx.fillStyle = '#33aa11';
                ctx.fillRect(9, 1, 2, 2);
                break;
            case 'laptop':
                ctx.fillStyle = '#444466';
                ctx.fillRect(2, 3, 12, 8);
                ctx.fillStyle = '#4488cc';
                ctx.fillRect(3, 4, 10, 6);
                ctx.fillStyle = '#66aaee';
                ctx.fillRect(4, 5, 4, 1);
                ctx.fillStyle = '#555577';
                ctx.fillRect(1, 11, 14, 2);
                ctx.fillStyle = '#666688';
                ctx.fillRect(3, 11, 2, 1);
                ctx.fillRect(7, 11, 2, 1);
                ctx.fillRect(11, 11, 2, 1);
                break;
            case 'headset':
                ctx.fillStyle = '#222';
                ctx.fillRect(3, 0, 10, 3);
                ctx.fillStyle = '#333';
                ctx.fillRect(2, 3, 3, 8);
                ctx.fillRect(11, 3, 3, 8);
                ctx.fillStyle = '#444';
                ctx.fillRect(3, 4, 1, 6);
                ctx.fillRect(12, 4, 1, 6);
                ctx.fillStyle = '#666';
                ctx.fillRect(11, 9, 2, 5);
                ctx.fillStyle = '#888';
                ctx.fillRect(12, 10, 1, 3);
                break;
            case 'burger':
                ctx.fillStyle = '#ddaa55';
                ctx.fillRect(3, 2, 10, 2);
                ctx.fillStyle = '#cc9944';
                ctx.fillRect(4, 2, 8, 1);
                ctx.fillStyle = '#55aa33';
                ctx.fillRect(3, 4, 10, 1);
                ctx.fillStyle = '#cc4444';
                ctx.fillRect(3, 5, 10, 2);
                ctx.fillStyle = '#ffcc44';
                ctx.fillRect(3, 7, 10, 1);
                ctx.fillStyle = '#ddaa55';
                ctx.fillRect(3, 8, 10, 2);
                break;
            case 'heroes5':
                ctx.fillStyle = '#3333bb';
                ctx.fillRect(2, 1, 12, 14);
                ctx.fillStyle = '#4444dd';
                ctx.fillRect(3, 2, 10, 12);
                ctx.fillStyle = '#ccaa44';
                ctx.fillRect(5, 5, 6, 5);
                ctx.fillStyle = '#eedd44';
                ctx.fillRect(6, 6, 4, 3);
                ctx.fillStyle = '#fff';
                ctx.font = '5px monospace';
                ctx.fillText('V', 7, 13);
                break;
            case 'key':
                ctx.fillStyle = '#ccaa44';
                ctx.fillRect(3, 3, 4, 4);
                ctx.fillStyle = '#eedd44';
                ctx.fillRect(4, 4, 2, 2);
                ctx.fillStyle = '#ccaa44';
                ctx.fillRect(7, 5, 6, 2);
                ctx.fillRect(11, 5, 2, 4);
                ctx.fillRect(9, 5, 2, 4);
                break;
            case 'microphone':
                ctx.fillStyle = '#777';
                ctx.fillRect(6, 1, 4, 6);
                ctx.fillStyle = '#999';
                ctx.fillRect(7, 2, 2, 4);
                ctx.fillStyle = '#555';
                ctx.fillRect(7, 7, 2, 5);
                ctx.fillRect(4, 12, 8, 2);
                ctx.fillStyle = '#666';
                ctx.fillRect(5, 12, 6, 1);
                break;
            case 'videocard':
                ctx.fillStyle = '#228822';
                ctx.fillRect(1, 3, 14, 9);
                ctx.fillStyle = '#33aa33';
                ctx.fillRect(2, 4, 1, 7);
                ctx.fillStyle = '#333';
                ctx.fillRect(3, 4, 5, 7);
                ctx.fillStyle = '#444';
                ctx.fillRect(4, 5, 3, 5);
                ctx.fillStyle = '#888';
                ctx.fillRect(9, 4, 5, 7);
                ctx.fillStyle = '#aaa';
                ctx.fillRect(10, 5, 3, 5);
                // Connectors
                ctx.fillStyle = '#ccaa44';
                ctx.fillRect(2, 12, 2, 2);
                ctx.fillRect(6, 12, 2, 2);
                ctx.fillRect(10, 12, 2, 2);
                // Fan
                ctx.fillStyle = '#555';
                ctx.fillRect(10, 6, 2, 2);
                break;
        }
        cache[key] = c;
        return c;
    }

    // Particle system for visual effects
    const particles = [];

    function addParticle(x, y, color, life, vx, vy) {
        particles.push({ x, y, color, life, maxLife: life, vx: vx || 0, vy: vy || 0 });
    }

    function updateParticles(dt) {
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.life -= dt;
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            if (p.life <= 0) particles.splice(i, 1);
        }
    }

    function renderParticles(ctx) {
        for (const p of particles) {
            const alpha = Math.max(0, p.life / p.maxLife);
            ctx.globalAlpha = alpha;
            ctx.fillStyle = p.color;
            const size = 2 + alpha * 2;
            ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
        }
        ctx.globalAlpha = 1;
    }

    function emitBurst(x, y, color, count) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = 30 + Math.random() * 40;
            addParticle(x, y, color, 0.5 + Math.random() * 0.5,
                Math.cos(angle) * speed, Math.sin(angle) * speed);
        }
    }

    return {
        orsonPortrait, vaituzPortrait, kobPortrait, chebPortrait,
        periclesPortrait, madyarPortrait, akulbotPortrait,
        chekistPortrait, gerostratPortrait, auromolinPortrait, vilgefortzPortrait,
        orsonWalk, vaituzWalk, kobWalk, chebWalk, playerWalk,
        createTile, createHeartSprite, createMenuCursor, itemSprite,
        particles, addParticle, updateParticles, renderParticles, emitBurst,
        C
    };
})();
