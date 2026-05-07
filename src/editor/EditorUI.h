#pragma once

struct GLFWwindow;

namespace trioz {

class SceneNode;
class Camera;
class Terrain;
class Water;
class Light;
class Weather;
class Timer;
class ObjectPlacer;

class EditorUI {
public:
    explicit EditorUI(GLFWwindow* window);
    ~EditorUI();

    void beginFrame();
    void endFrame();

    void renderScenePanel(SceneNode& root, Camera& camera, Terrain& terrain,
                          Water& water, Light& light, Weather& weather);
    void renderInfoPanel(const Camera& camera, const Timer& timer,
                         int cameraMode, bool wireframe);
    void renderObjectPanel(ObjectPlacer& placer);

private:
    bool m_initialized = false;
};

} // namespace trioz
