# TRIOZengine

3D Map Engine built with C++17 and OpenGL 4.5.

## Features

- **Terrain System**: Procedurally generated heightmap with multi-texture blending (grass, rock, sand, snow) based on height and slope
- **3D Model Import**: Load OBJ, FBX, glTF and 40+ formats via Assimp with instanced rendering support
- **Water System**: Planar reflections, refractions, Fresnel effect, animated waves via vertex displacement
- **Particle System**: GPU-accelerated particles for smoke, rain, snow effects
- **Weather System**: Rain, snow, fog with adjustable intensity
- **Lighting**: Directional light with shadow mapping (PCF soft shadows)
- **Day/Night Cycle**: Automatic sun movement with sky color transitions
- **Procedural Skybox**: Gradient sky with sun disc and glow
- **Camera System**: Free-fly camera and FPS ground-locked camera (Tab to switch)
- **Editor UI**: Dear ImGui panels for scene settings, object placement, weather control
- **Scene Graph**: Hierarchical node system for organizing objects

## Requirements

- CMake 3.16+
- C++17 compatible compiler
- OpenGL 4.5 capable GPU
- Visual Studio 2022 (Windows) or GCC/Clang (Linux)

## Building

### Windows (Visual Studio)

```bash
mkdir build && cd build
cmake .. -G "Visual Studio 17 2022"
```

Open `TRIOZengine.sln` in Visual Studio, then Build → Run.

### Linux

```bash
mkdir build && cd build
cmake ..
make -j$(nproc)
./TRIOZengine
```

## Controls

| Key | Action |
|-----|--------|
| WASD | Move |
| Mouse | Look around |
| Shift | Sprint |
| Scroll | Adjust speed |
| Space / Ctrl | Up / Down (free camera) |
| Tab | Switch camera mode |
| F1 | Toggle wireframe |
| F2 | Toggle editor UI |
| Escape | Quit |

## Architecture

```
src/
├── core/        # Engine loop, window, input, timer
├── renderer/    # Shader, texture, mesh, framebuffer
├── scene/       # Camera, scene graph, skybox
├── terrain/     # Heightmap terrain with multi-texturing
├── model/       # Assimp model loader, instanced rendering
├── water/       # Water plane with reflections/refractions
├── particles/   # Particle emitter, smoke, weather
├── lighting/    # Directional light, shadow mapping
└── editor/      # ImGui editor panels, object placer
```

## Dependencies (auto-fetched via CMake FetchContent)

- [GLFW 3.3.8](https://github.com/glfw/glfw) — Window & input
- [GLM 0.9.9.8](https://github.com/g-truc/glm) — Math library
- [Assimp 5.3.1](https://github.com/assimp/assimp) — 3D model import
- [Dear ImGui 1.89.9](https://github.com/ocornut/imgui) — Editor UI
- [GLAD](https://github.com/Dav1dde/glad) — OpenGL loader
- [stb_image](https://github.com/nothings/stb) — Image loading
- [nlohmann/json](https://github.com/nlohmann/json) — JSON serialization
