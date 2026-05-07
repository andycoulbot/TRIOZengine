#pragma once

#include "terrain/Terrain.h"
#include <glm/glm.hpp>
#include <vector>

struct GLFWwindow;

namespace trioz {

class SceneNode;
class Camera;
class Water;
class Light;
class Weather;
class Timer;
class ObjectPlacer;
class InputManager;

class EditorUI {
public:
    explicit EditorUI(GLFWwindow* window);
    ~EditorUI();

    void beginFrame();
    void endFrame();

    void renderToolbar();
    void renderPropertiesPanel(SceneNode& root, Camera& camera, Terrain& terrain,
                               Water& water, Light& light, Weather& weather);
    void renderInfoBar(const Camera& camera, const Timer& timer,
                       int cameraMode, bool wireframe);

    bool wantCaptureMouse() const;
    bool wantCaptureKeyboard() const;

    BrushMode getBrushMode() const { return m_brushMode; }
    float getBrushRadius() const { return m_brushRadius; }
    float getBrushStrength() const { return m_brushStrength; }
    bool isSculptMode() const { return m_editorMode == EditorMode::Edit; }
    EditorMode getEditorMode() const { return m_editorMode; }

    void setBrushHitPoint(const glm::vec3& p) { m_brushHitPoint = p; m_brushHitValid = true; }
    void clearBrushHit() { m_brushHitValid = false; }
    bool hasBrushHit() const { return m_brushHitValid; }
    glm::vec3 getBrushHitPoint() const { return m_brushHitPoint; }

    bool hasSelection() const { return m_hasSelection; }
    glm::vec3 getSelectionStart() const { return m_selectionStart; }
    glm::vec3 getSelectionEnd() const { return m_selectionEnd; }
    void setSelectionStart(const glm::vec3& p) { m_selectionStart = p; m_hasSelection = false; }
    void setSelectionEnd(const glm::vec3& p) { m_selectionEnd = p; m_hasSelection = true; }
    void clearSelection() { m_hasSelection = false; }

private:
    bool m_initialized = false;

    EditorMode m_editorMode = EditorMode::Edit;
    BrushMode m_brushMode = BrushMode::Raise;
    float m_brushRadius = 30.0f;
    float m_brushStrength = 1.0f;

    glm::vec3 m_brushHitPoint = glm::vec3(0.0f);
    bool m_brushHitValid = false;

    glm::vec3 m_selectionStart = glm::vec3(0.0f);
    glm::vec3 m_selectionEnd = glm::vec3(0.0f);
    bool m_hasSelection = false;
};

} // namespace trioz
