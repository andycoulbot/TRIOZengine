const GameMap = (() => {
    const TILE = 32;
    let currentMap = 'chatik';
    let scrollX = 0, scrollY = 0;

    const maps = {
        chatik: {
            width: 20, height: 15,
            tiles: generateMap(20, 15, 'floor_dark', [
                { x: 0, y: 0, w: 20, h: 1, t: 'wall' },
                { x: 0, y: 14, w: 20, h: 1, t: 'wall' },
                { x: 0, y: 0, w: 1, h: 15, t: 'wall' },
                { x: 19, y: 0, w: 1, h: 15, t: 'wall' },
                { x: 5, y: 3, w: 2, h: 1, t: 'pc' },
                { x: 8, y: 3, w: 2, h: 1, t: 'table' },
                { x: 12, y: 3, w: 2, h: 1, t: 'bookshelf' },
                { x: 15, y: 6, w: 1, h: 1, t: 'door' },
                { x: 3, y: 10, w: 3, h: 1, t: 'table' },
                { x: 10, y: 8, w: 1, h: 1, t: 'pc' },
            ]),
        },
        temple: {
            width: 16, height: 12,
            tiles: generateMap(16, 12, 'floor_light', [
                { x: 0, y: 0, w: 16, h: 1, t: 'wall' },
                { x: 0, y: 11, w: 16, h: 1, t: 'wall' },
                { x: 0, y: 0, w: 1, h: 12, t: 'wall' },
                { x: 15, y: 0, w: 1, h: 12, t: 'wall' },
                { x: 7, y: 2, w: 2, h: 2, t: 'throne' },
                { x: 3, y: 4, w: 1, h: 1, t: 'bookshelf' },
                { x: 12, y: 4, w: 1, h: 1, t: 'bookshelf' },
            ]),
        },
        chebovka: {
            width: 20, height: 12,
            tiles: generateMap(20, 12, 'grass', [
                { x: 3, y: 4, w: 14, h: 2, t: 'runway' },
                { x: 0, y: 0, w: 20, h: 1, t: 'wall' },
                { x: 0, y: 11, w: 20, h: 1, t: 'wall' },
            ]),
        },
        apple_field: {
            width: 18, height: 14,
            tiles: generateMap(18, 14, 'grass', [
                { x: 3, y: 3, w: 1, h: 1, t: 'apple_tree' },
                { x: 7, y: 5, w: 1, h: 1, t: 'apple_tree' },
                { x: 11, y: 2, w: 1, h: 1, t: 'apple_tree' },
                { x: 5, y: 9, w: 1, h: 1, t: 'apple_tree' },
                { x: 14, y: 7, w: 1, h: 1, t: 'apple_tree' },
                { x: 9, y: 11, w: 1, h: 1, t: 'apple_tree' },
            ]),
        },
        voice_canyon: {
            width: 16, height: 16,
            tiles: generateMap(16, 16, 'arena_floor', [
                { x: 0, y: 0, w: 16, h: 2, t: 'wall' },
                { x: 0, y: 14, w: 16, h: 2, t: 'wall' },
                { x: 0, y: 0, w: 2, h: 16, t: 'wall' },
                { x: 14, y: 0, w: 2, h: 16, t: 'wall' },
            ]),
        },
        kob_lair: {
            width: 12, height: 10,
            tiles: generateMap(12, 10, 'floor_dark', [
                { x: 0, y: 0, w: 12, h: 1, t: 'wall' },
                { x: 0, y: 9, w: 12, h: 1, t: 'wall' },
                { x: 0, y: 0, w: 1, h: 10, t: 'wall' },
                { x: 11, y: 0, w: 1, h: 10, t: 'wall' },
                { x: 4, y: 3, w: 4, h: 1, t: 'table' },
                { x: 3, y: 5, w: 2, h: 1, t: 'burger' },
                { x: 7, y: 5, w: 2, h: 1, t: 'burger' },
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
        if (scene.includes('temple') || scene.includes('pray') || scene.includes('throne') || scene.includes('coronation') || scene.includes('ceremony')) return 'temple';
        if (scene.includes('cheb') || scene.includes('fly') || scene.includes('delta') || scene.includes('runway') || scene.includes('kazakhstan')) return 'chebovka';
        if (scene.includes('apple') || scene.includes('field')) return 'apple_field';
        if (scene.includes('voice') || scene.includes('canyon') || scene.includes('debate') || scene.includes('arena')) return 'voice_canyon';
        if (scene.includes('kob') && (scene.includes('lair') || scene.includes('secret') || scene.includes('burger'))) return 'kob_lair';
        return 'chatik';
    }

    function updateForScene(scene) {
        const mapName = getMapForScene(scene);
        setMap(mapName);
    }

    return { render, setMap, updateForScene, TILE };
})();
