import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { DISTRICTS } from './districts-data.js';

/* ═══════════════════════════════════════════════════════════════════════════
   TRIOZengine Web Editor — Main Application
   ═══════════════════════════════════════════════════════════════════════════ */

class Editor {
    constructor() {
        this.canvas = document.getElementById('viewport');
        this.scene = new THREE.Scene();
        this.clock = new THREE.Clock();
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.mouseDown = false;
        this.currentTool = 'select';
        this.brushMode = 'raise';
        this.brushRadius = 20;
        this.brushStrength = 2;
        this.terrainResolution = 128;
        this.terrainSize = 1000;
        this.placedObjects = [];
        this.roadPoints = [];
        this.roadMeshes = [];
        this.selectedObject = null;
        this.districtMeshes = [];
        this.districtVisible = {};
        this.selectedDistrict = null;
        this.brushIndicator = null;
        this.mapOverlay = null;
        this.mapOpacity = 0.5;
        this.showGrid = true;
        this.showDistricts = true;
        this.objectType = 'cube';
        this.objectScale = 1.0;
        this.objectRotation = 0;
        this.currentTextureIndex = 0;
        this.textureBrushRadius = 30;
        this.textureScale = 10;
        this.roadWidth = 6;
        this.districtHeight = 0.5;
        this.districtOpacity = 0.4;

        this.proceduralTextures = {};

        this.init();
        this.createTerrain();
        this.createDistricts();
        this.createBrushIndicator();
        this.generateProceduralTextures();
        this.setupUI();
        this.setupEvents();
        this.animate();
    }

    init() {
        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        this.updateSize();

        // Camera
        this.camera = new THREE.PerspectiveCamera(60, this.canvas.width / this.canvas.height, 1, 5000);
        this.camera.position.set(0, 400, 500);

        // Controls
        this.controls = new OrbitControls(this.camera, this.canvas);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.08;
        this.controls.maxPolarAngle = Math.PI * 0.48;
        this.controls.minDistance = 50;
        this.controls.maxDistance = 2000;
        this.controls.target.set(0, 0, 0);

        // Lighting
        this.scene.background = new THREE.Color(0x87CEEB);
        this.scene.fog = new THREE.FogExp2(0x87CEEB, 0.0004);

        const ambientLight = new THREE.AmbientLight(0x6688aa, 0.6);
        this.scene.add(ambientLight);

        const hemiLight = new THREE.HemisphereLight(0x88bbee, 0x445522, 0.5);
        this.scene.add(hemiLight);

        this.sunLight = new THREE.DirectionalLight(0xffeedd, 1.2);
        this.sunLight.position.set(300, 500, 200);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.mapSize.set(2048, 2048);
        this.sunLight.shadow.camera.left = -600;
        this.sunLight.shadow.camera.right = 600;
        this.sunLight.shadow.camera.top = 600;
        this.sunLight.shadow.camera.bottom = -600;
        this.sunLight.shadow.camera.near = 1;
        this.sunLight.shadow.camera.far = 1500;
        this.sunLight.shadow.bias = -0.001;
        this.scene.add(this.sunLight);

        // Grid helper
        this.gridHelper = new THREE.GridHelper(this.terrainSize, 50, 0x444444, 0x333333);
        this.gridHelper.position.y = 0.2;
        this.scene.add(this.gridHelper);

        // Axes helper
        const axes = new THREE.AxesHelper(50);
        axes.position.y = 0.5;
        this.scene.add(axes);
    }

    updateSize() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.renderer.setSize(rect.width, rect.height, false);
        if (this.camera) {
            this.camera.aspect = rect.width / rect.height;
            this.camera.updateProjectionMatrix();
        }
    }

    /* ─── Terrain ─────────────────────────────────────────────────────── */

    createTerrain() {
        const res = this.terrainResolution;
        const size = this.terrainSize;
        const geometry = new THREE.PlaneGeometry(size, size, res, res);
        geometry.rotateX(-Math.PI / 2);

        this.terrainHeights = new Float32Array((res + 1) * (res + 1));

        // Texture splatmap — stores which texture is painted on each vertex
        const vertexCount = (res + 1) * (res + 1);
        this.terrainSplatmap = new Float32Array(vertexCount * 4); // RGBA = 4 texture channels
        // Default: all grass (channel 0)
        for (let i = 0; i < vertexCount; i++) {
            this.terrainSplatmap[i * 4] = 1.0;
        }

        // Material with vertex colors for texture painting visualization
        const material = new THREE.MeshStandardMaterial({
            color: 0x5a8a3a,
            flatShading: false,
            roughness: 0.85,
            metalness: 0.05,
            vertexColors: true
        });

        // Initialize vertex colors
        const colors = new Float32Array(geometry.attributes.position.count * 3);
        for (let i = 0; i < colors.length; i += 3) {
            colors[i] = 0.35;
            colors[i + 1] = 0.54;
            colors[i + 2] = 0.23;
        }
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        this.terrain = new THREE.Mesh(geometry, material);
        this.terrain.receiveShadow = true;
        this.terrain.castShadow = false;
        this.terrain.name = 'terrain';
        this.scene.add(this.terrain);

        // Water plane
        const waterGeo = new THREE.PlaneGeometry(size * 2, size * 2);
        waterGeo.rotateX(-Math.PI / 2);
        const waterMat = new THREE.MeshStandardMaterial({
            color: 0x2266aa,
            transparent: true,
            opacity: 0.6,
            roughness: 0.1,
            metalness: 0.3
        });
        this.water = new THREE.Mesh(waterGeo, waterMat);
        this.water.position.y = -2;
        this.water.name = 'water';
        this.scene.add(this.water);
    }

    sculptTerrain(point) {
        const geometry = this.terrain.geometry;
        const positions = geometry.attributes.position.array;
        const res = this.terrainResolution;
        const size = this.terrainSize;
        const halfSize = size / 2;
        const cellSize = size / res;

        const cx = point.x;
        const cz = point.z;
        const radius = this.brushRadius;
        const strength = this.brushStrength * 0.3;

        const minX = Math.max(0, Math.floor((cx - radius + halfSize) / cellSize));
        const maxX = Math.min(res, Math.ceil((cx + radius + halfSize) / cellSize));
        const minZ = Math.max(0, Math.floor((cz - radius + halfSize) / cellSize));
        const maxZ = Math.min(res, Math.ceil((cz + radius + halfSize) / cellSize));

        // For flatten mode, compute average height in brush area
        let avgHeight = 0;
        let count = 0;
        if (this.brushMode === 'flatten' || this.brushMode === 'smooth') {
            for (let z = minZ; z <= maxZ; z++) {
                for (let x = minX; x <= maxX; x++) {
                    const idx = z * (res + 1) + x;
                    const vx = positions[idx * 3] ;
                    const vz = positions[idx * 3 + 2];
                    const dx = vx - cx;
                    const dz = vz - cz;
                    const dist = Math.sqrt(dx * dx + dz * dz);
                    if (dist <= radius) {
                        avgHeight += positions[idx * 3 + 1];
                        count++;
                    }
                }
            }
            if (count > 0) avgHeight /= count;
        }

        for (let z = minZ; z <= maxZ; z++) {
            for (let x = minX; x <= maxX; x++) {
                const idx = z * (res + 1) + x;
                const vx = positions[idx * 3];
                const vz = positions[idx * 3 + 2];
                const dx = vx - cx;
                const dz = vz - cz;
                const dist = Math.sqrt(dx * dx + dz * dz);

                if (dist <= radius) {
                    const falloff = 1.0 - (dist / radius);
                    const smooth = falloff * falloff * (3 - 2 * falloff);
                    const factor = smooth * strength;

                    switch (this.brushMode) {
                        case 'raise':
                            positions[idx * 3 + 1] += factor;
                            break;
                        case 'lower':
                            positions[idx * 3 + 1] -= factor;
                            break;
                        case 'smooth':
                            positions[idx * 3 + 1] += (avgHeight - positions[idx * 3 + 1]) * factor * 0.3;
                            break;
                        case 'flatten':
                            positions[idx * 3 + 1] += (avgHeight - positions[idx * 3 + 1]) * factor;
                            break;
                    }
                    this.terrainHeights[idx] = positions[idx * 3 + 1];
                }
            }
        }

        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();
    }

    paintTexture(point) {
        const geometry = this.terrain.geometry;
        const positions = geometry.attributes.position.array;
        const colors = geometry.attributes.color.array;
        const res = this.terrainResolution;
        const size = this.terrainSize;
        const halfSize = size / 2;
        const cellSize = size / res;

        const cx = point.x;
        const cz = point.z;
        const radius = this.textureBrushRadius;

        const textureColors = [
            [0.35, 0.54, 0.23],  // Grass
            [0.55, 0.50, 0.40],  // Dirt
            [0.65, 0.62, 0.55],  // Rock
            [0.85, 0.82, 0.70],  // Sand
            [0.92, 0.92, 0.95],  // Snow
            [0.30, 0.30, 0.32],  // Asphalt
        ];

        const color = textureColors[this.currentTextureIndex] || textureColors[0];

        const minX = Math.max(0, Math.floor((cx - radius + halfSize) / cellSize));
        const maxX = Math.min(res, Math.ceil((cx + radius + halfSize) / cellSize));
        const minZ = Math.max(0, Math.floor((cz - radius + halfSize) / cellSize));
        const maxZ = Math.min(res, Math.ceil((cz + radius + halfSize) / cellSize));

        for (let z = minZ; z <= maxZ; z++) {
            for (let x = minX; x <= maxX; x++) {
                const idx = z * (res + 1) + x;
                const vx = positions[idx * 3];
                const vz = positions[idx * 3 + 2];
                const dx = vx - cx;
                const dz = vz - cz;
                const dist = Math.sqrt(dx * dx + dz * dz);

                if (dist <= radius) {
                    const falloff = 1.0 - (dist / radius);
                    const smooth = falloff * falloff;
                    const factor = smooth * 0.3;

                    colors[idx * 3] += (color[0] - colors[idx * 3]) * factor;
                    colors[idx * 3 + 1] += (color[1] - colors[idx * 3 + 1]) * factor;
                    colors[idx * 3 + 2] += (color[2] - colors[idx * 3 + 2]) * factor;
                }
            }
        }

        geometry.attributes.color.needsUpdate = true;
    }

    /* ─── Districts ───────────────────────────────────────────────────── */

    createDistricts() {
        this.districtGroup = new THREE.Group();
        this.districtGroup.name = 'districts';
        this.scene.add(this.districtGroup);

        for (const district of DISTRICTS) {
            this.districtVisible[district.id] = true;
            this.createDistrictMesh(district);
        }
    }

    createDistrictMesh(district) {
        const shape = new THREE.Shape();
        const pts = district.polygon;

        shape.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length; i++) {
            shape.lineTo(pts[i][0], pts[i][1]);
        }
        shape.lineTo(pts[0][0], pts[0][1]);

        // Filled area
        const geometry = new THREE.ShapeGeometry(shape);
        geometry.rotateX(-Math.PI / 2);

        const color = new THREE.Color(district.color);
        const material = new THREE.MeshStandardMaterial({
            color: color,
            transparent: true,
            opacity: this.districtOpacity,
            side: THREE.DoubleSide,
            depthWrite: false
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = this.districtHeight;
        mesh.renderOrder = 1;
        mesh.userData = { districtId: district.id, type: 'district' };
        mesh.name = district.id;
        this.districtGroup.add(mesh);

        // Border outline
        const linePoints = pts.map(p => new THREE.Vector3(p[0], this.districtHeight + 0.1, p[1]));
        linePoints.push(linePoints[0].clone());
        const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
        const lineMat = new THREE.LineBasicMaterial({
            color: color.clone().multiplyScalar(1.3),
            linewidth: 2
        });
        const line = new THREE.Line(lineGeo, lineMat);
        line.userData = { districtId: district.id, type: 'district-border' };
        this.districtGroup.add(line);

        // Label
        const centroid = this.computeCentroid(pts);
        const labelSprite = this.createTextSprite(district.nameRu, district.color);
        labelSprite.position.set(centroid[0], this.districtHeight + 8, centroid[1]);
        labelSprite.userData = { districtId: district.id, type: 'district-label' };
        this.districtGroup.add(labelSprite);

        this.districtMeshes.push({
            id: district.id,
            mesh: mesh,
            line: line,
            label: labelSprite,
            data: district
        });
    }

    computeCentroid(polygon) {
        let cx = 0, cz = 0;
        for (const [x, z] of polygon) {
            cx += x;
            cz += z;
        }
        return [cx / polygon.length, cz / polygon.length];
    }

    createTextSprite(text, bgColor) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;

        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.roundRect(0, 0, 256, 64, 8);
        ctx.fill();

        ctx.font = 'bold 24px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 128, 32);

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            depthTest: false
        });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(80, 20, 1);
        return sprite;
    }

    toggleDistrictVisibility(districtId) {
        this.districtVisible[districtId] = !this.districtVisible[districtId];
        const visible = this.districtVisible[districtId];

        for (const dm of this.districtMeshes) {
            if (dm.id === districtId) {
                dm.mesh.visible = visible;
                dm.line.visible = visible;
                dm.label.visible = visible;
            }
        }
    }

    /* ─── Brush Indicator ─────────────────────────────────────────────── */

    createBrushIndicator() {
        const geometry = new THREE.RingGeometry(0.9, 1, 64);
        geometry.rotateX(-Math.PI / 2);
        const material = new THREE.MeshBasicMaterial({
            color: 0x44aaff,
            transparent: true,
            opacity: 0.6,
            side: THREE.DoubleSide,
            depthTest: false
        });
        this.brushIndicator = new THREE.Mesh(geometry, material);
        this.brushIndicator.visible = false;
        this.brushIndicator.renderOrder = 10;
        this.scene.add(this.brushIndicator);
    }

    updateBrushIndicator(point) {
        if (!this.brushIndicator) return;
        const radius = (this.currentTool === 'texture') ? this.textureBrushRadius : this.brushRadius;
        this.brushIndicator.scale.set(radius, radius, radius);
        this.brushIndicator.position.set(point.x, point.y + 0.5, point.z);
        this.brushIndicator.visible = true;
    }

    /* ─── Roads ───────────────────────────────────────────────────────── */

    addRoadPoint(point) {
        this.roadPoints.push(point.clone());
        this.rebuildRoad();
        this.setStatus(`Точка дороги добавлена (${this.roadPoints.length})`);
    }

    rebuildRoad() {
        // Remove old road mesh
        for (const m of this.roadMeshes) {
            this.scene.remove(m);
            m.geometry.dispose();
            m.material.dispose();
        }
        this.roadMeshes = [];

        if (this.roadPoints.length < 2) return;

        // Build smooth road along points using Catmull-Rom spline
        const curvePoints = this.roadPoints.map(p => new THREE.Vector3(p.x, p.y + 0.3, p.z));
        const curve = new THREE.CatmullRomCurve3(curvePoints, false, 'catmullrom', 0.5);
        const splinePoints = curve.getPoints(this.roadPoints.length * 20);

        // Create road surface as a ribbon
        const vertices = [];
        const indices = [];
        const uvs = [];
        const halfWidth = this.roadWidth / 2;

        for (let i = 0; i < splinePoints.length; i++) {
            const p = splinePoints[i];
            let dir;
            if (i < splinePoints.length - 1) {
                dir = new THREE.Vector3().subVectors(splinePoints[i + 1], p).normalize();
            } else {
                dir = new THREE.Vector3().subVectors(p, splinePoints[i - 1]).normalize();
            }
            const right = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize();

            const left = new THREE.Vector3().addVectors(p, right.clone().multiplyScalar(-halfWidth));
            const rightPt = new THREE.Vector3().addVectors(p, right.clone().multiplyScalar(halfWidth));

            vertices.push(left.x, left.y, left.z);
            vertices.push(rightPt.x, rightPt.y, rightPt.z);

            const t = i / (splinePoints.length - 1);
            uvs.push(0, t * 10);
            uvs.push(1, t * 10);

            if (i < splinePoints.length - 1) {
                const base = i * 2;
                indices.push(base, base + 2, base + 1);
                indices.push(base + 1, base + 2, base + 3);
            }
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        geo.setIndex(indices);
        geo.computeVertexNormals();

        const mat = new THREE.MeshStandardMaterial({
            color: 0x333333,
            roughness: 0.9,
            metalness: 0.0,
            side: THREE.DoubleSide
        });

        const mesh = new THREE.Mesh(geo, mat);
        mesh.receiveShadow = true;
        mesh.name = 'road';
        this.scene.add(mesh);
        this.roadMeshes.push(mesh);

        // Road markings (center dashes)
        if (splinePoints.length > 4) {
            const dashGeo = new THREE.BufferGeometry();
            const dashVerts = [];
            const dashW = 0.3;
            const dashLen = 3;
            const gapLen = 4;
            let dist = 0;
            let drawing = true;
            let segStart = 0;

            for (let i = 1; i < splinePoints.length; i++) {
                const segLen = splinePoints[i].distanceTo(splinePoints[i - 1]);
                dist += segLen;

                if (drawing && dist >= dashLen) {
                    drawing = false;
                    dist = 0;
                } else if (!drawing && dist >= gapLen) {
                    drawing = true;
                    dist = 0;
                }

                if (drawing) {
                    const p = splinePoints[i];
                    let dir;
                    if (i < splinePoints.length - 1) {
                        dir = new THREE.Vector3().subVectors(splinePoints[i + 1], p).normalize();
                    } else {
                        dir = new THREE.Vector3().subVectors(p, splinePoints[i - 1]).normalize();
                    }
                    const right = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).normalize();

                    dashVerts.push(
                        p.x - right.x * dashW, p.y + 0.05, p.z - right.z * dashW,
                        p.x + right.x * dashW, p.y + 0.05, p.z + right.z * dashW
                    );
                }
            }

            if (dashVerts.length >= 12) {
                const dashIdxs = [];
                for (let i = 0; i < dashVerts.length / 3 - 2; i += 2) {
                    dashIdxs.push(i, i + 2, i + 1, i + 1, i + 2, i + 3);
                }
                dashGeo.setAttribute('position', new THREE.Float32BufferAttribute(dashVerts, 3));
                dashGeo.setIndex(dashIdxs);
                const dashMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
                const dashMesh = new THREE.Mesh(dashGeo, dashMat);
                dashMesh.name = 'road-markings';
                this.scene.add(dashMesh);
                this.roadMeshes.push(dashMesh);
            }
        }

        // Road point markers
        for (const pt of this.roadPoints) {
            const markerGeo = new THREE.SphereGeometry(1.5, 8, 8);
            const markerMat = new THREE.MeshBasicMaterial({ color: 0xff4444 });
            const marker = new THREE.Mesh(markerGeo, markerMat);
            marker.position.copy(pt);
            marker.position.y += 1;
            this.scene.add(marker);
            this.roadMeshes.push(marker);
        }
    }

    clearRoad() {
        for (const m of this.roadMeshes) {
            this.scene.remove(m);
            if (m.geometry) m.geometry.dispose();
            if (m.material) m.material.dispose();
        }
        this.roadMeshes = [];
        this.roadPoints = [];
        this.setStatus('Дорога удалена');
    }

    /* ─── Object Placement ────────────────────────────────────────────── */

    placeObject(point) {
        let mesh;
        const s = this.objectScale;
        const color = new THREE.Color().setHSL(Math.random(), 0.6, 0.6);

        switch (this.objectType) {
            case 'cube': {
                const g = new THREE.BoxGeometry(5 * s, 5 * s, 5 * s);
                mesh = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color }));
                mesh.position.set(point.x, point.y + 2.5 * s, point.z);
                break;
            }
            case 'sphere': {
                const g = new THREE.SphereGeometry(3 * s, 16, 16);
                mesh = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color }));
                mesh.position.set(point.x, point.y + 3 * s, point.z);
                break;
            }
            case 'cylinder': {
                const g = new THREE.CylinderGeometry(2 * s, 2 * s, 8 * s, 16);
                mesh = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color }));
                mesh.position.set(point.x, point.y + 4 * s, point.z);
                break;
            }
            case 'tree': {
                mesh = this.createTree(s);
                mesh.position.set(point.x, point.y, point.z);
                break;
            }
            case 'building': {
                mesh = this.createBuilding(s);
                mesh.position.set(point.x, point.y, point.z);
                break;
            }
            default: {
                const g = new THREE.BoxGeometry(5 * s, 5 * s, 5 * s);
                mesh = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ color }));
                mesh.position.set(point.x, point.y + 2.5 * s, point.z);
            }
        }

        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.rotation.y = this.objectRotation * Math.PI / 180;
        mesh.userData = { type: 'placed-object', objectType: this.objectType };
        mesh.name = `${this.objectType}_${this.placedObjects.length}`;
        this.scene.add(mesh);
        this.placedObjects.push(mesh);
        this.setStatus(`Объект "${this.objectType}" размещён`);
        this.updateObjectList();
    }

    createTree(scale) {
        const group = new THREE.Group();

        // Trunk
        const trunkGeo = new THREE.CylinderGeometry(0.8 * scale, 1.2 * scale, 8 * scale, 8);
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x6b4226 });
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.y = 4 * scale;
        trunk.castShadow = true;
        group.add(trunk);

        // Foliage layers
        for (let i = 0; i < 3; i++) {
            const r = (4 - i) * scale;
            const h = 4 * scale;
            const foliageGeo = new THREE.ConeGeometry(r, h, 8);
            const foliageMat = new THREE.MeshStandardMaterial({
                color: new THREE.Color().setHSL(0.3, 0.6, 0.3 + i * 0.05)
            });
            const foliage = new THREE.Mesh(foliageGeo, foliageMat);
            foliage.position.y = (7 + i * 3) * scale;
            foliage.castShadow = true;
            group.add(foliage);
        }

        return group;
    }

    createBuilding(scale) {
        const group = new THREE.Group();
        const floors = 2 + Math.floor(Math.random() * 5);
        const width = (6 + Math.random() * 8) * scale;
        const depth = (6 + Math.random() * 8) * scale;
        const floorHeight = 4 * scale;
        const height = floors * floorHeight;

        // Main body
        const bodyGeo = new THREE.BoxGeometry(width, height, depth);
        const bodyMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color().setHSL(0.08, 0.15, 0.5 + Math.random() * 0.2)
        });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = height / 2;
        body.castShadow = true;
        body.receiveShadow = true;
        group.add(body);

        // Windows
        const windowMat = new THREE.MeshStandardMaterial({
            color: 0x88ccff,
            emissive: 0x223344,
            roughness: 0.1,
            metalness: 0.5
        });

        const winW = 1.5 * scale;
        const winH = 2 * scale;
        const spacing = 3.5 * scale;

        for (let floor = 0; floor < floors; floor++) {
            const y = (floor + 0.5) * floorHeight + winH * 0.3;
            const cols = Math.max(1, Math.floor(width / spacing) - 1);
            for (let c = 0; c < cols; c++) {
                const x = (c - (cols - 1) / 2) * spacing;
                // Front
                const winGeo = new THREE.PlaneGeometry(winW, winH);
                const win = new THREE.Mesh(winGeo, windowMat);
                win.position.set(x, y, depth / 2 + 0.05);
                group.add(win);
                // Back
                const winBack = win.clone();
                winBack.position.z = -depth / 2 - 0.05;
                winBack.rotation.y = Math.PI;
                group.add(winBack);
            }
        }

        // Roof
        const roofGeo = new THREE.BoxGeometry(width + 1, 0.5 * scale, depth + 1);
        const roofMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
        const roof = new THREE.Mesh(roofGeo, roofMat);
        roof.position.y = height + 0.25 * scale;
        roof.castShadow = true;
        group.add(roof);

        return group;
    }

    deleteSelectedObject() {
        if (!this.selectedObject) return;
        this.scene.remove(this.selectedObject);
        const idx = this.placedObjects.indexOf(this.selectedObject);
        if (idx >= 0) this.placedObjects.splice(idx, 1);
        if (this.selectedObject.geometry) this.selectedObject.geometry.dispose();
        if (this.selectedObject.material) this.selectedObject.material.dispose();
        this.selectedObject = null;
        this.updateObjectList();
        this.setStatus('Объект удалён');
    }

    /* ─── Procedural Textures ─────────────────────────────────────────── */

    generateProceduralTextures() {
        const texDefs = [
            { name: 'Трава', key: 'grass', color1: [80, 140, 50], color2: [60, 110, 35] },
            { name: 'Грунт', key: 'dirt', color1: [140, 120, 90], color2: [110, 90, 65] },
            { name: 'Камень', key: 'rock', color1: [150, 145, 135], color2: [120, 115, 105] },
            { name: 'Песок', key: 'sand', color1: [210, 200, 160], color2: [190, 180, 140] },
            { name: 'Снег', key: 'snow', color1: [235, 235, 242], color2: [220, 220, 230] },
            { name: 'Асфальт', key: 'asphalt', color1: [75, 75, 80], color2: [55, 55, 60] },
        ];

        this.textureList = texDefs;

        for (const td of texDefs) {
            const canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 64;
            const ctx = canvas.getContext('2d');

            for (let y = 0; y < 64; y++) {
                for (let x = 0; x < 64; x++) {
                    const noise = (Math.random() - 0.5) * 30;
                    const checker = ((x >> 3) + (y >> 3)) % 2 === 0 ? 1 : 0.9;
                    const r = Math.min(255, Math.max(0, td.color1[0] * checker + noise));
                    const g = Math.min(255, Math.max(0, td.color1[1] * checker + noise));
                    const b = Math.min(255, Math.max(0, td.color1[2] * checker + noise));
                    ctx.fillStyle = `rgb(${r|0},${g|0},${b|0})`;
                    ctx.fillRect(x, y, 1, 1);
                }
            }

            this.proceduralTextures[td.key] = canvas;
        }
    }

    /* ─── Map Overlay ─────────────────────────────────────────────────── */

    loadMapOverlay(url) {
        const loader = new THREE.TextureLoader();
        loader.load(url, (texture) => {
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;

            if (this.mapOverlay) {
                this.scene.remove(this.mapOverlay);
                this.mapOverlay.geometry.dispose();
                this.mapOverlay.material.dispose();
            }

            const geo = new THREE.PlaneGeometry(this.terrainSize, this.terrainSize);
            geo.rotateX(-Math.PI / 2);
            const mat = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                opacity: this.mapOpacity,
                side: THREE.DoubleSide,
                depthWrite: false
            });
            this.mapOverlay = new THREE.Mesh(geo, mat);
            this.mapOverlay.position.y = 0.3;
            this.mapOverlay.renderOrder = 0;
            this.mapOverlay.name = 'map-overlay';
            this.scene.add(this.mapOverlay);
            this.setStatus('Карта загружена');
        });
    }

    setMapOpacity(val) {
        this.mapOpacity = val;
        if (this.mapOverlay) {
            this.mapOverlay.material.opacity = val;
        }
    }

    /* ─── UI Setup ────────────────────────────────────────────────────── */

    setupUI() {
        this.updatePanel();
    }

    updatePanel() {
        const panel = document.getElementById('panel-content');
        const title = document.getElementById('panel-title');

        switch (this.currentTool) {
            case 'select':
                title.textContent = 'Свойства';
                panel.innerHTML = this.renderSelectPanel();
                break;
            case 'terrain':
                title.textContent = 'Ландшафт';
                panel.innerHTML = this.renderTerrainPanel();
                break;
            case 'road':
                title.textContent = 'Дороги';
                panel.innerHTML = this.renderRoadPanel();
                break;
            case 'texture':
                title.textContent = 'Текстуры';
                panel.innerHTML = this.renderTexturePanel();
                break;
            case 'object':
                title.textContent = 'Объекты';
                panel.innerHTML = this.renderObjectPanel();
                break;
            case 'district':
                title.textContent = 'Районы';
                panel.innerHTML = this.renderDistrictPanel();
                break;
        }

        this.bindPanelEvents();
    }

    renderSelectPanel() {
        return `
            <div class="panel-section">
                <div class="section-header">Сцена <span class="arrow">▼</span></div>
                <div class="section-body">
                    <div class="checkbox-row">
                        <input type="checkbox" id="chk-grid" ${this.showGrid ? 'checked' : ''}>
                        <label for="chk-grid">Показать сетку</label>
                    </div>
                    <div class="checkbox-row">
                        <input type="checkbox" id="chk-districts" ${this.showDistricts ? 'checked' : ''}>
                        <label for="chk-districts">Показать районы</label>
                    </div>
                    <div class="form-row">
                        <label>Прозр. районов</label>
                        <input type="range" id="district-opacity" min="0" max="1" step="0.05" value="${this.districtOpacity}">
                        <span class="value-display">${(this.districtOpacity * 100)|0}%</span>
                    </div>
                    <div class="separator"></div>
                    <button class="panel-btn" id="btn-load-map">Загрузить карту</button>
                    <div class="form-row">
                        <label>Прозр. карты</label>
                        <input type="range" id="map-opacity" min="0" max="1" step="0.05" value="${this.mapOpacity}">
                        <span class="value-display">${(this.mapOpacity * 100)|0}%</span>
                    </div>
                </div>
            </div>
            <div class="panel-section">
                <div class="section-header">Камера <span class="arrow">▼</span></div>
                <div class="section-body">
                    <button class="panel-btn" id="btn-cam-top">Вид сверху</button>
                    <button class="panel-btn" id="btn-cam-persp">Перспектива</button>
                    <button class="panel-btn" id="btn-cam-reset">Сбросить камеру</button>
                </div>
            </div>
            <div class="panel-section">
                <div class="section-header">Экспорт <span class="arrow">▼</span></div>
                <div class="section-body">
                    <button class="panel-btn primary" id="btn-export-json">Экспорт сцены (JSON)</button>
                </div>
            </div>
        `;
    }

    renderTerrainPanel() {
        return `
            <div class="panel-section">
                <div class="section-header">Кисть <span class="arrow">▼</span></div>
                <div class="section-body">
                    <div class="form-row">
                        <label>Радиус</label>
                        <input type="range" id="brush-radius" min="5" max="100" value="${this.brushRadius}">
                        <span class="value-display">${this.brushRadius}</span>
                    </div>
                    <div class="form-row">
                        <label>Сила</label>
                        <input type="range" id="brush-strength" min="0.1" max="10" step="0.1" value="${this.brushStrength}">
                        <span class="value-display">${this.brushStrength.toFixed(1)}</span>
                    </div>
                </div>
            </div>
            <div class="panel-section">
                <div class="section-header">Режим <span class="arrow">▼</span></div>
                <div class="section-body">
                    <div style="display:flex;gap:4px;flex-wrap:wrap">
                        <button class="panel-btn ${this.brushMode === 'raise' ? 'primary' : ''}" data-bmode="raise">Поднять</button>
                        <button class="panel-btn ${this.brushMode === 'lower' ? 'primary' : ''}" data-bmode="lower">Опустить</button>
                        <button class="panel-btn ${this.brushMode === 'smooth' ? 'primary' : ''}" data-bmode="smooth">Сгладить</button>
                        <button class="panel-btn ${this.brushMode === 'flatten' ? 'primary' : ''}" data-bmode="flatten">Выровнять</button>
                    </div>
                </div>
            </div>
            <div class="panel-section">
                <div class="section-header">Действия <span class="arrow">▼</span></div>
                <div class="section-body">
                    <button class="panel-btn danger" id="btn-reset-terrain">Сбросить ландшафт</button>
                </div>
            </div>
        `;
    }

    renderRoadPanel() {
        return `
            <div class="panel-section">
                <div class="section-header">Параметры дороги <span class="arrow">▼</span></div>
                <div class="section-body">
                    <div class="form-row">
                        <label>Ширина</label>
                        <input type="range" id="road-width" min="2" max="20" step="0.5" value="${this.roadWidth}">
                        <span class="value-display">${this.roadWidth}</span>
                    </div>
                    <p style="color:var(--text-dim);font-size:11px;margin:8px 0">
                        Кликните по ландшафту чтобы добавить точки дороги.
                        Дорога автоматически строится по сплайну.
                    </p>
                </div>
            </div>
            <div class="panel-section">
                <div class="section-header">Действия <span class="arrow">▼</span></div>
                <div class="section-body">
                    <button class="panel-btn" id="btn-undo-road">Отменить последнюю точку</button>
                    <button class="panel-btn danger" id="btn-clear-road">Удалить дорогу</button>
                    <p style="color:var(--text-dim);font-size:11px;margin-top:6px">
                        Точек: ${this.roadPoints.length}
                    </p>
                </div>
            </div>
        `;
    }

    renderTexturePanel() {
        let textureGrid = '<div class="texture-grid">';
        for (let i = 0; i < this.textureList.length; i++) {
            const td = this.textureList[i];
            const canvas = this.proceduralTextures[td.key];
            const dataUrl = canvas ? canvas.toDataURL() : '';
            textureGrid += `
                <div class="texture-item ${i === this.currentTextureIndex ? 'active' : ''}" data-tex-idx="${i}">
                    <img src="${dataUrl}" style="width:100%;height:100%;display:block" alt="${td.name}">
                    <div class="tex-label">${td.name}</div>
                </div>
            `;
        }
        textureGrid += '</div>';

        return `
            <div class="panel-section">
                <div class="section-header">Текстуры <span class="arrow">▼</span></div>
                <div class="section-body">
                    ${textureGrid}
                    <button class="panel-btn" id="btn-import-texture">Загрузить текстуру</button>
                </div>
            </div>
            <div class="panel-section">
                <div class="section-header">Кисть текстуры <span class="arrow">▼</span></div>
                <div class="section-body">
                    <div class="form-row">
                        <label>Радиус</label>
                        <input type="range" id="tex-brush-radius" min="5" max="80" value="${this.textureBrushRadius}">
                        <span class="value-display">${this.textureBrushRadius}</span>
                    </div>
                    <div class="form-row">
                        <label>Масштаб</label>
                        <input type="range" id="tex-scale" min="1" max="50" value="${this.textureScale}">
                        <span class="value-display">${this.textureScale}</span>
                    </div>
                    <p style="color:var(--text-dim);font-size:11px;margin:8px 0">
                        Кликните и тяните по ландшафту для нанесения текстуры.
                    </p>
                </div>
            </div>
        `;
    }

    renderObjectPanel() {
        const objectTypes = [
            { key: 'cube', icon: 'CB', name: 'Куб' },
            { key: 'sphere', icon: 'SP', name: 'Сфера' },
            { key: 'cylinder', icon: 'CY', name: 'Цилиндр' },
            { key: 'tree', icon: 'TR', name: 'Дерево' },
            { key: 'building', icon: 'BD', name: 'Здание' },
        ];

        let objList = '';
        for (const ot of objectTypes) {
            objList += `
                <div class="object-item ${this.objectType === ot.key ? 'selected' : ''}" data-obj-type="${ot.key}">
                    <div class="object-icon">${ot.icon}</div>
                    <span>${ot.name}</span>
                </div>
            `;
        }

        let placedList = '';
        for (let i = 0; i < this.placedObjects.length; i++) {
            const obj = this.placedObjects[i];
            const selected = obj === this.selectedObject;
            placedList += `
                <div class="object-item ${selected ? 'selected' : ''}" data-placed-idx="${i}">
                    <div class="object-icon">${(obj.userData.objectType || '?')[0].toUpperCase()}</div>
                    <span>${obj.name}</span>
                </div>
            `;
        }

        return `
            <div class="panel-section">
                <div class="section-header">Тип объекта <span class="arrow">▼</span></div>
                <div class="section-body">${objList}</div>
            </div>
            <div class="panel-section">
                <div class="section-header">Параметры <span class="arrow">▼</span></div>
                <div class="section-body">
                    <div class="form-row">
                        <label>Масштаб</label>
                        <input type="range" id="obj-scale" min="0.1" max="5" step="0.1" value="${this.objectScale}">
                        <span class="value-display">${this.objectScale.toFixed(1)}</span>
                    </div>
                    <div class="form-row">
                        <label>Поворот</label>
                        <input type="range" id="obj-rotation" min="0" max="360" value="${this.objectRotation}">
                        <span class="value-display">${this.objectRotation}°</span>
                    </div>
                    <button class="panel-btn" id="btn-import-model">Загрузить модель (GLTF)</button>
                    <p style="color:var(--text-dim);font-size:11px;margin:8px 0">
                        Кликните по ландшафту для размещения объекта.
                    </p>
                </div>
            </div>
            <div class="panel-section">
                <div class="section-header">Размещённые объекты (${this.placedObjects.length}) <span class="arrow">▼</span></div>
                <div class="section-body">
                    ${placedList || '<p style="color:var(--text-dim);font-size:11px">Нет объектов</p>'}
                    ${this.selectedObject ? '<button class="panel-btn danger" id="btn-delete-obj">Удалить выбранный</button>' : ''}
                </div>
            </div>
        `;
    }

    renderDistrictPanel() {
        let districtList = '';
        for (const d of DISTRICTS) {
            const visible = this.districtVisible[d.id];
            const selected = this.selectedDistrict === d.id;
            districtList += `
                <div class="district-item ${selected ? 'selected' : ''}" data-district="${d.id}">
                    <div class="district-color" style="background:${d.color}"></div>
                    <span class="district-name">${d.nameRu}</span>
                    <button class="district-visibility" data-toggle-district="${d.id}" title="${visible ? 'Скрыть' : 'Показать'}">
                        ${visible ? '👁' : '—'}
                    </button>
                </div>
            `;
        }

        return `
            <div class="panel-section">
                <div class="section-header">Районы города <span class="arrow">▼</span></div>
                <div class="section-body">
                    ${districtList}
                    <div class="separator"></div>
                    <div class="form-row">
                        <label>Высота</label>
                        <input type="range" id="district-height" min="0.1" max="5" step="0.1" value="${this.districtHeight}">
                        <span class="value-display">${this.districtHeight.toFixed(1)}</span>
                    </div>
                    <div class="form-row">
                        <label>Прозрачность</label>
                        <input type="range" id="district-opacity-ctrl" min="0.05" max="1" step="0.05" value="${this.districtOpacity}">
                        <span class="value-display">${(this.districtOpacity * 100)|0}%</span>
                    </div>
                </div>
            </div>
            <div class="panel-section">
                <div class="section-header">Действия <span class="arrow">▼</span></div>
                <div class="section-body">
                    <button class="panel-btn" id="btn-show-all-districts">Показать все</button>
                    <button class="panel-btn" id="btn-hide-all-districts">Скрыть все</button>
                    <button class="panel-btn" id="btn-focus-district">Фокус на выбранном</button>
                </div>
            </div>
        `;
    }

    updateObjectList() {
        if (this.currentTool === 'object') {
            this.updatePanel();
        }
    }

    bindPanelEvents() {
        // Terrain
        this.bindSlider('brush-radius', v => { this.brushRadius = v; });
        this.bindSlider('brush-strength', v => { this.brushStrength = parseFloat(v); });

        document.querySelectorAll('[data-bmode]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.brushMode = btn.dataset.bmode;
                document.querySelectorAll('.subtool-btn').forEach(b => b.classList.remove('active'));
                const sub = document.querySelector(`.subtool-btn[data-brush="${this.brushMode}"]`);
                if (sub) sub.classList.add('active');
                this.updatePanel();
            });
        });

        const resetTerrain = document.getElementById('btn-reset-terrain');
        if (resetTerrain) {
            resetTerrain.addEventListener('click', () => {
                const positions = this.terrain.geometry.attributes.position.array;
                for (let i = 0; i < positions.length; i += 3) positions[i + 1] = 0;
                this.terrain.geometry.attributes.position.needsUpdate = true;
                this.terrain.geometry.computeVertexNormals();
                this.setStatus('Ландшафт сброшен');
            });
        }

        // Road
        this.bindSlider('road-width', v => { this.roadWidth = parseFloat(v); this.rebuildRoad(); });
        const undoRoad = document.getElementById('btn-undo-road');
        if (undoRoad) undoRoad.addEventListener('click', () => {
            this.roadPoints.pop();
            this.rebuildRoad();
            this.updatePanel();
        });
        const clearRoad = document.getElementById('btn-clear-road');
        if (clearRoad) clearRoad.addEventListener('click', () => { this.clearRoad(); this.updatePanel(); });

        // Texture
        this.bindSlider('tex-brush-radius', v => { this.textureBrushRadius = v; });
        this.bindSlider('tex-scale', v => { this.textureScale = v; });
        document.querySelectorAll('[data-tex-idx]').forEach(el => {
            el.addEventListener('click', () => {
                this.currentTextureIndex = parseInt(el.dataset.texIdx);
                this.updatePanel();
            });
        });
        const importTex = document.getElementById('btn-import-texture');
        if (importTex) importTex.addEventListener('click', () => {
            document.getElementById('texture-import').click();
        });

        // Object
        this.bindSlider('obj-scale', v => { this.objectScale = parseFloat(v); });
        this.bindSlider('obj-rotation', v => { this.objectRotation = parseInt(v); });
        document.querySelectorAll('[data-obj-type]').forEach(el => {
            el.addEventListener('click', () => {
                this.objectType = el.dataset.objType;
                this.updatePanel();
            });
        });
        document.querySelectorAll('[data-placed-idx]').forEach(el => {
            el.addEventListener('click', () => {
                const idx = parseInt(el.dataset.placedIdx);
                this.selectedObject = this.placedObjects[idx];
                this.updatePanel();
            });
        });
        const deleteObj = document.getElementById('btn-delete-obj');
        if (deleteObj) deleteObj.addEventListener('click', () => this.deleteSelectedObject());
        const importModel = document.getElementById('btn-import-model');
        if (importModel) importModel.addEventListener('click', () => {
            document.getElementById('model-import').click();
        });

        // Object sub-tools
        document.querySelectorAll('#object-tools .subtool-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('#object-tools .subtool-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.objectType = btn.dataset.obj;
                if (btn.dataset.obj === 'import') {
                    document.getElementById('model-import').click();
                }
                this.updatePanel();
            });
        });

        // Districts
        document.querySelectorAll('[data-district]').forEach(el => {
            el.addEventListener('click', (e) => {
                if (e.target.closest('[data-toggle-district]')) return;
                this.selectedDistrict = el.dataset.district;
                this.updatePanel();
            });
        });
        document.querySelectorAll('[data-toggle-district]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDistrictVisibility(btn.dataset.toggleDistrict);
                this.updatePanel();
            });
        });
        this.bindSlider('district-height', v => {
            this.districtHeight = parseFloat(v);
            for (const dm of this.districtMeshes) {
                dm.mesh.position.y = this.districtHeight;
                dm.label.position.y = this.districtHeight + 8;
            }
        });
        this.bindSlider('district-opacity-ctrl', v => {
            this.districtOpacity = parseFloat(v);
            for (const dm of this.districtMeshes) {
                dm.mesh.material.opacity = this.districtOpacity;
            }
        });
        const showAll = document.getElementById('btn-show-all-districts');
        if (showAll) showAll.addEventListener('click', () => {
            for (const d of DISTRICTS) {
                this.districtVisible[d.id] = true;
                for (const dm of this.districtMeshes) {
                    if (dm.id === d.id) {
                        dm.mesh.visible = true;
                        dm.line.visible = true;
                        dm.label.visible = true;
                    }
                }
            }
            this.updatePanel();
        });
        const hideAll = document.getElementById('btn-hide-all-districts');
        if (hideAll) hideAll.addEventListener('click', () => {
            for (const d of DISTRICTS) {
                this.districtVisible[d.id] = false;
                for (const dm of this.districtMeshes) {
                    if (dm.id === d.id) {
                        dm.mesh.visible = false;
                        dm.line.visible = false;
                        dm.label.visible = false;
                    }
                }
            }
            this.updatePanel();
        });
        const focusDistrict = document.getElementById('btn-focus-district');
        if (focusDistrict) focusDistrict.addEventListener('click', () => {
            if (!this.selectedDistrict) return;
            const dm = this.districtMeshes.find(d => d.id === this.selectedDistrict);
            if (!dm) return;
            const centroid = this.computeCentroid(dm.data.polygon);
            this.controls.target.set(centroid[0], 0, centroid[1]);
            this.camera.position.set(centroid[0], 200, centroid[1] + 200);
        });

        // Scene controls
        const chkGrid = document.getElementById('chk-grid');
        if (chkGrid) chkGrid.addEventListener('change', () => {
            this.showGrid = chkGrid.checked;
            this.gridHelper.visible = this.showGrid;
        });
        const chkDistricts = document.getElementById('chk-districts');
        if (chkDistricts) chkDistricts.addEventListener('change', () => {
            this.showDistricts = chkDistricts.checked;
            this.districtGroup.visible = this.showDistricts;
        });
        this.bindSlider('district-opacity', v => {
            this.districtOpacity = parseFloat(v);
            for (const dm of this.districtMeshes) {
                dm.mesh.material.opacity = this.districtOpacity;
            }
        });
        this.bindSlider('map-opacity', v => { this.setMapOpacity(parseFloat(v)); });

        // Camera buttons
        const camTop = document.getElementById('btn-cam-top');
        if (camTop) camTop.addEventListener('click', () => {
            this.camera.position.set(0, 800, 0.1);
            this.controls.target.set(0, 0, 0);
        });
        const camPersp = document.getElementById('btn-cam-persp');
        if (camPersp) camPersp.addEventListener('click', () => {
            this.camera.position.set(300, 300, 400);
            this.controls.target.set(0, 0, 0);
        });
        const camReset = document.getElementById('btn-cam-reset');
        if (camReset) camReset.addEventListener('click', () => {
            this.camera.position.set(0, 400, 500);
            this.controls.target.set(0, 0, 0);
        });

        // Load map
        const loadMap = document.getElementById('btn-load-map');
        if (loadMap) loadMap.addEventListener('click', () => {
            document.getElementById('map-import').click();
        });

        // Export
        const exportJson = document.getElementById('btn-export-json');
        if (exportJson) exportJson.addEventListener('click', () => this.exportScene());
    }

    bindSlider(id, callback) {
        const el = document.getElementById(id);
        if (!el) return;
        const display = el.parentElement.querySelector('.value-display');
        el.addEventListener('input', () => {
            const val = parseFloat(el.value);
            callback(val);
            if (display) {
                if (id.includes('opacity')) {
                    display.textContent = `${(val * 100)|0}%`;
                } else if (id === 'brush-strength') {
                    display.textContent = val.toFixed(1);
                } else if (id === 'obj-scale') {
                    display.textContent = val.toFixed(1);
                } else if (id === 'obj-rotation') {
                    display.textContent = `${val}°`;
                } else if (id === 'district-height') {
                    display.textContent = val.toFixed(1);
                } else {
                    display.textContent = val;
                }
            }
        });
    }

    setStatus(msg) {
        document.getElementById('status-msg').textContent = msg;
    }

    /* ─── Events ──────────────────────────────────────────────────────── */

    setupEvents() {
        // Window resize
        window.addEventListener('resize', () => this.updateSize());

        // Tool switching
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentTool = btn.dataset.tool;

                // Show/hide sub-tools
                document.getElementById('terrain-tools').style.display =
                    this.currentTool === 'terrain' ? 'flex' : 'none';
                document.getElementById('object-tools').style.display =
                    this.currentTool === 'object' ? 'flex' : 'none';

                this.brushIndicator.visible = false;
                this.updatePanel();
            });
        });

        // Terrain sub-tools
        document.querySelectorAll('#terrain-tools .subtool-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('#terrain-tools .subtool-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.brushMode = btn.dataset.brush;
                this.updatePanel();
            });
        });

        // Mouse events on canvas
        this.canvas.addEventListener('mousedown', e => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', e => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', e => this.onMouseUp(e));
        this.canvas.addEventListener('contextmenu', e => e.preventDefault());

        // Keyboard shortcuts
        window.addEventListener('keydown', e => this.onKeyDown(e));

        // File inputs
        document.getElementById('model-import').addEventListener('change', e => this.onModelImport(e));
        document.getElementById('texture-import').addEventListener('change', e => this.onTextureImport(e));
        document.getElementById('map-import').addEventListener('change', e => this.onMapImport(e));

        // Section headers collapse
        document.addEventListener('click', e => {
            const header = e.target.closest('.section-header');
            if (!header) return;
            header.classList.toggle('collapsed');
            const body = header.nextElementSibling;
            if (body) body.classList.toggle('collapsed');
        });
    }

    getTerrainIntersection(event) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObject(this.terrain);
        return intersects.length > 0 ? intersects[0].point : null;
    }

    onMouseDown(event) {
        if (event.button !== 0) return;

        const point = this.getTerrainIntersection(event);
        if (!point) return;

        this.mouseDown = true;

        switch (this.currentTool) {
            case 'terrain':
                this.sculptTerrain(point);
                break;
            case 'road':
                this.addRoadPoint(point);
                this.updatePanel();
                break;
            case 'texture':
                this.paintTexture(point);
                break;
            case 'object':
                this.placeObject(point);
                break;
        }
    }

    onMouseMove(event) {
        const point = this.getTerrainIntersection(event);
        if (!point) {
            this.brushIndicator.visible = false;
            return;
        }

        // Update coords display
        document.getElementById('info-coords').textContent =
            `X: ${point.x.toFixed(0)} Z: ${point.z.toFixed(0)}`;

        if (this.currentTool === 'terrain' || this.currentTool === 'texture') {
            this.updateBrushIndicator(point);
        } else {
            this.brushIndicator.visible = false;
        }

        if (this.mouseDown) {
            switch (this.currentTool) {
                case 'terrain':
                    this.sculptTerrain(point);
                    break;
                case 'texture':
                    this.paintTexture(point);
                    break;
            }
        }
    }

    onMouseUp() {
        this.mouseDown = false;
    }

    onKeyDown(event) {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;

        switch (event.key.toLowerCase()) {
            case 'q':
                this.setTool('select');
                break;
            case 't':
                this.setTool('terrain');
                break;
            case 'r':
                this.setTool('road');
                break;
            case 'x':
                this.setTool('texture');
                break;
            case 'o':
                this.setTool('object');
                break;
            case 'd':
                this.setTool('district');
                break;
            case 'delete':
            case 'backspace':
                if (this.selectedObject) this.deleteSelectedObject();
                break;
            case 'g':
                this.showGrid = !this.showGrid;
                this.gridHelper.visible = this.showGrid;
                break;
        }
    }

    setTool(tool) {
        this.currentTool = tool;
        document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
        const btn = document.querySelector(`.tool-btn[data-tool="${tool}"]`);
        if (btn) btn.classList.add('active');

        document.getElementById('terrain-tools').style.display =
            tool === 'terrain' ? 'flex' : 'none';
        document.getElementById('object-tools').style.display =
            tool === 'object' ? 'flex' : 'none';

        this.brushIndicator.visible = false;
        this.updatePanel();
    }

    onModelImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        const loader = new GLTFLoader();
        loader.load(url, (gltf) => {
            const model = gltf.scene;
            model.traverse(child => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            model.userData = { type: 'placed-object', objectType: 'imported' };
            model.name = `imported_${file.name}`;

            // Place at center for now
            model.position.set(0, 0, 0);
            const scale = this.objectScale;
            model.scale.set(scale, scale, scale);

            this.scene.add(model);
            this.placedObjects.push(model);
            this.setStatus(`Модель "${file.name}" загружена`);
            this.updateObjectList();
            URL.revokeObjectURL(url);
        }, undefined, (err) => {
            this.setStatus(`Ошибка загрузки: ${err.message}`);
        });

        event.target.value = '';
    }

    onTextureImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = 64;
                canvas.height = 64;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, 64, 64);

                const key = `custom_${this.textureList.length}`;
                const name = file.name.replace(/\.[^.]+$/, '');
                this.textureList.push({ name, key, color1: [128, 128, 128], color2: [100, 100, 100] });
                this.proceduralTextures[key] = canvas;
                this.updatePanel();
                this.setStatus(`Текстура "${name}" загружена`);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
        event.target.value = '';
    }

    onMapImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        this.loadMapOverlay(url);
        event.target.value = '';
    }

    /* ─── Export ───────────────────────────────────────────────────────── */

    exportScene() {
        const data = {
            terrain: {
                resolution: this.terrainResolution,
                size: this.terrainSize,
                heights: Array.from(this.terrainHeights)
            },
            districts: DISTRICTS.map(d => ({
                id: d.id,
                name: d.nameRu,
                color: d.color,
                polygon: d.polygon,
                visible: this.districtVisible[d.id]
            })),
            roads: this.roadPoints.map(p => ({ x: p.x, y: p.y, z: p.z })),
            roadWidth: this.roadWidth,
            objects: this.placedObjects.map(obj => ({
                name: obj.name,
                type: obj.userData.objectType,
                position: { x: obj.position.x, y: obj.position.y, z: obj.position.z },
                rotation: { y: obj.rotation.y },
                scale: obj.scale.x
            }))
        };

        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'triozengine-scene.json';
        a.click();
        URL.revokeObjectURL(url);
        this.setStatus('Сцена экспортирована');
    }

    /* ─── Animation Loop ──────────────────────────────────────────────── */

    animate() {
        requestAnimationFrame(() => this.animate());

        const delta = this.clock.getDelta();
        this.controls.update();

        // FPS
        const fps = Math.round(1 / Math.max(delta, 0.001));
        document.getElementById('info-fps').textContent = `${fps} FPS`;

        this.renderer.render(this.scene, this.camera);
    }
}

// Start the editor
window.addEventListener('DOMContentLoaded', () => {
    window.editor = new Editor();
});
