const GameMap = (() => {
    const TILE = 32;
    let currentMap = 'castle';
    let scrollX = 0, scrollY = 0;

    const maps = {
        castle: {
            width: 20, height: 15,
            tiles: generateMap(20, 15, 'floor_dark', [
                { x: 0, y: 0, w: 20, h: 1, t: 'wall' },
                { x: 0, y: 14, w: 20, h: 1, t: 'wall' },
                { x: 0, y: 0, w: 1, h: 15, t: 'wall' },
                { x: 19, y: 0, w: 1, h: 15, t: 'wall' },
                { x: 5, y: 3, w: 2, h: 1, t: 'throne' },
                { x: 8, y: 3, w: 2, h: 1, t: 'bookshelf' },
                { x: 15, y: 6, w: 1, h: 1, t: 'door' },
                { x: 3, y: 10, w: 3, h: 1, t: 'table' },
            ]),
        },
        city: {
            width: 22, height: 14,
            tiles: generateMap(22, 14, 'floor_light', [
                { x: 0, y: 0, w: 22, h: 1, t: 'wall' },
                { x: 0, y: 13, w: 22, h: 1, t: 'wall' },
                { x: 0, y: 0, w: 1, h: 14, t: 'wall' },
                { x: 21, y: 0, w: 1, h: 14, t: 'wall' },
                { x: 5, y: 3, w: 3, h: 2, t: 'table' },
                { x: 14, y: 5, w: 2, h: 1, t: 'door' },
                { x: 10, y: 8, w: 1, h: 1, t: 'table' },
            ]),
        },
        market: {
            width: 18, height: 12,
            tiles: generateMap(18, 12, 'floor_light', [
                { x: 0, y: 0, w: 18, h: 1, t: 'wall' },
                { x: 0, y: 11, w: 18, h: 1, t: 'wall' },
                { x: 0, y: 0, w: 1, h: 12, t: 'wall' },
                { x: 17, y: 0, w: 1, h: 12, t: 'wall' },
                { x: 3, y: 3, w: 2, h: 1, t: 'table' },
                { x: 7, y: 3, w: 2, h: 1, t: 'table' },
                { x: 12, y: 3, w: 2, h: 1, t: 'table' },
                { x: 5, y: 7, w: 3, h: 1, t: 'table' },
                { x: 10, y: 7, w: 3, h: 1, t: 'table' },
            ]),
        },
        shop: {
            width: 14, height: 10,
            tiles: generateMap(14, 10, 'floor_dark', [
                { x: 0, y: 0, w: 14, h: 1, t: 'wall' },
                { x: 0, y: 9, w: 14, h: 1, t: 'wall' },
                { x: 0, y: 0, w: 1, h: 10, t: 'wall' },
                { x: 13, y: 0, w: 1, h: 10, t: 'wall' },
                { x: 3, y: 2, w: 8, h: 1, t: 'table' },
                { x: 3, y: 5, w: 2, h: 1, t: 'bookshelf' },
                { x: 9, y: 5, w: 2, h: 1, t: 'bookshelf' },
            ]),
        },
        park: {
            width: 20, height: 14,
            tiles: generateMap(20, 14, 'grass', [
                { x: 3, y: 3, w: 1, h: 1, t: 'apple_tree' },
                { x: 8, y: 2, w: 1, h: 1, t: 'apple_tree' },
                { x: 14, y: 5, w: 1, h: 1, t: 'apple_tree' },
                { x: 6, y: 9, w: 1, h: 1, t: 'apple_tree' },
                { x: 16, y: 8, w: 1, h: 1, t: 'apple_tree' },
                { x: 8, y: 6, w: 4, h: 1, t: 'runway' },
            ]),
        },
        computer: {
            width: 12, height: 10,
            tiles: generateMap(12, 10, 'floor_dark', [
                { x: 0, y: 0, w: 12, h: 1, t: 'wall' },
                { x: 0, y: 9, w: 12, h: 1, t: 'wall' },
                { x: 0, y: 0, w: 1, h: 10, t: 'wall' },
                { x: 11, y: 0, w: 1, h: 10, t: 'wall' },
                { x: 5, y: 3, w: 2, h: 1, t: 'pc' },
                { x: 3, y: 5, w: 1, h: 1, t: 'table' },
                { x: 8, y: 5, w: 1, h: 1, t: 'bookshelf' },
            ]),
        },
        square: {
            width: 20, height: 16,
            tiles: generateMap(20, 16, 'arena_floor', [
                { x: 0, y: 0, w: 20, h: 2, t: 'wall' },
                { x: 0, y: 14, w: 20, h: 2, t: 'wall' },
                { x: 0, y: 0, w: 2, h: 16, t: 'wall' },
                { x: 18, y: 0, w: 2, h: 16, t: 'wall' },
                { x: 9, y: 5, w: 2, h: 2, t: 'throne' },
            ]),
        },
        hospital: {
            width: 14, height: 10,
            tiles: generateMap(14, 10, 'floor_light', [
                { x: 0, y: 0, w: 14, h: 1, t: 'wall' },
                { x: 0, y: 9, w: 14, h: 1, t: 'wall' },
                { x: 0, y: 0, w: 1, h: 10, t: 'wall' },
                { x: 13, y: 0, w: 1, h: 10, t: 'wall' },
                { x: 5, y: 3, w: 4, h: 2, t: 'table' },
            ]),
        },
    };

    function generateMap(w, h, base, overlays) {
        const tiles = [];
        for (let y = 0; y < h; y++) {
            tiles[y] = [];
            for (let x = 0; x < w; x++) {
                tiles[y][x] = base;
            }
        }
        for (const o of overlays) {
            for (let dy = 0; dy < o.h; dy++) {
                for (let dx = 0; dx < o.w; dx++) {
                    if (o.y + dy < h && o.x + dx < w) {
                        tiles[o.y + dy][o.x + dx] = o.t;
                    }
                }
            }
        }
        return tiles;
    }

    function render(ctx, W, H) {
        const map = maps[currentMap];
        if (!map) return;

        for (let y = 0; y < map.height; y++) {
            for (let x = 0; x < map.width; x++) {
                const screenX = x * TILE - scrollX;
                const screenY = y * TILE - scrollY;
                if (screenX > -TILE && screenX < W && screenY > -TILE && screenY < H) {
                    const tile = Sprites.createTile(map.tiles[y][x]);
                    ctx.drawImage(tile, screenX, screenY, TILE, TILE);
                }
            }
        }
    }

    function setMap(name) {
        if (maps[name]) currentMap = name;
    }

    function getMapForScene(scene) {
        if (scene.includes('ch1_') && (scene.includes('wake') || scene.includes('look') || scene.includes('search') || scene.includes('window') || scene.includes('yell') || scene.includes('corridor') || scene.includes('pericles') || scene.includes('castle') || scene.includes('scroll') || scene.includes('take_'))) return 'castle';
        if (scene.includes('ch2_market') || scene.includes('ch2_code') || scene.includes('ch2_bread') || scene.includes('ch2_bakery') || scene.includes('ch2_cig') || scene.includes('ch2_alley') || scene.includes('ch2_fan') || scene.includes('ch2_passerby')) return 'market';
        if (scene.includes('ch2_park') || scene.includes('ch2_bench') || scene.includes('ch2_vaituz')) return 'park';
        if (scene.includes('ch3_')) return 'shop';
        if (scene.includes('ch4_')) return 'computer';
        if (scene.includes('ch5_')) return 'square';
        if (scene.includes('ch6_') || scene.includes('ending_hospital') || scene.includes('germanovna')) return 'hospital';
        if (scene.includes('ending_victory') || scene.includes('ending_truth')) return 'castle';
        if (scene.includes('ch1_road') || scene.includes('ch1_comment') || scene.includes('ch1_city') || scene.includes('ch1_enter')) return 'city';
        return 'castle';
    }

    function updateForScene(scene) {
        const mapName = getMapForScene(scene);
        setMap(mapName);
    }

    return { render, setMap, updateForScene, TILE };
})();
