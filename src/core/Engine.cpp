#include "core/Engine.h"
#include "core/Window.h"
#include "core/InputManager.h"
#include "core/Timer.h"
#include "renderer/Renderer.h"
#include "scene/Camera.h"
#include "scene/Skybox.h"
#include "scene/SceneNode.h"
#include "terrain/Terrain.h"
#include "model/Model.h"
#include "model/ModelInstance.h"
#include "water/Water.h"
#include "particles/ParticleSystem.h"
#include "particles/Weather.h"
#include "lighting/Light.h"
#include "lighting/Shadow.h"
#include "editor/EditorUI.h"
#include "editor/ObjectPlacer.h"

#include <glad/gl.h>
#include <GLFW/glfw3.h>
#include <iostream>

namespace trioz {

Engine* Engine::s_instance = nullptr;

Engine::Engine(int width, int height, const std::string& title) {
    s_instance = this;
    m_window = std::make_unique<Window>(width, height, title);
    m_input = std::make_unique<InputManager>(m_window->getHandle());
    m_timer = std::make_unique<Timer>();
}

Engine::~Engine() {
    cleanup();
    s_instance = nullptr;
}

Engine& Engine::instance() {
    return *s_instance;
}

void Engine::init() {
    glEnable(GL_DEPTH_TEST);
    glEnable(GL_CULL_FACE);
    glCullFace(GL_BACK);
    glEnable(GL_BLEND);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
    glClearColor(0.53f, 0.81f, 0.92f, 1.0f);
}

void Engine::run() {
    init();
    m_running = true;
    mainLoop();
}

void Engine::stop() {
    m_running = false;
}

static glm::vec3 screenToWorldRay(const glm::vec2& mousePos, int winW, int winH,
                                   const glm::mat4& projection, const glm::mat4& view) {
    float x = (2.0f * mousePos.x) / winW - 1.0f;
    float y = 1.0f - (2.0f * mousePos.y) / winH;
    glm::vec4 clipCoords(x, y, -1.0f, 1.0f);
    glm::vec4 eyeCoords = glm::inverse(projection) * clipCoords;
    eyeCoords = glm::vec4(eyeCoords.x, eyeCoords.y, -1.0f, 0.0f);
    glm::vec3 worldRay = glm::vec3(glm::inverse(view) * eyeCoords);
    return glm::normalize(worldRay);
}

void Engine::mainLoop() {
    Renderer renderer;

    // Top-down camera looking at island center
    float terrainWorldSize = 256.0f * 10.0f;
    float terrainCenter = terrainWorldSize * 0.5f;
    Camera camera(glm::vec3(terrainCenter, 600.0f, terrainCenter + 10.0f));
    camera.setYaw(-90.0f);
    camera.setPitch(-85.0f);

    Skybox skybox;
    Terrain terrain(256, 10.0f, 80.0f);
    Water water(terrainCenter, 15.0f, terrainWorldSize);
    Light sunLight;
    sunLight.direction = glm::normalize(glm::vec3(-0.5f, -0.8f, -0.3f));
    sunLight.ambient = glm::vec3(0.3f);
    sunLight.diffuse = glm::vec3(0.8f);
    sunLight.specular = glm::vec3(0.5f);
    Shadow shadow(2048);

    ParticleSystem smokeSystem(1000);
    Weather weather;

    SceneNode rootNode;
    EditorUI editorUI(m_window->getHandle());
    ObjectPlacer placer(terrain);

    bool wireframe = false;
    bool showEditor = true;
    int cameraMode = 0;
    bool isDragging = false;

    while (m_running && !m_window->shouldClose()) {
        m_timer->update();
        float dt = m_timer->getDeltaTime();
        m_input->update();

        bool uiMouse = editorUI.wantCaptureMouse();
        bool uiKb = editorUI.wantCaptureKeyboard();

        if (!uiKb) {
            if (m_input->isKeyPressed(GLFW_KEY_ESCAPE))
                stop();
            if (m_input->isKeyJustPressed(GLFW_KEY_F1))
                wireframe = !wireframe;
            if (m_input->isKeyJustPressed(GLFW_KEY_TAB))
                cameraMode = (cameraMode + 1) % 2;
            if (m_input->isKeyJustPressed(GLFW_KEY_F2))
                showEditor = !showEditor;
        }

        // Camera rotation with RMB drag
        if (!uiMouse && m_input->isMouseButtonPressed(GLFW_MOUSE_BUTTON_RIGHT)) {
            m_input->setCursorLocked(true);
            if (cameraMode == 0) {
                camera.updateFreeCamera(*m_input, dt);
            } else {
                camera.updateFPSCamera(*m_input, dt, terrain);
            }
        } else {
            if (m_input->isCursorLocked()) {
                m_input->setCursorLocked(false);
            }
            if (!uiKb) {
                camera.updateMovementOnly(*m_input, dt);
            }
        }

        // Scroll zoom
        float scroll = m_input->getScrollDelta();
        if (!uiMouse && scroll != 0.0f) {
            glm::vec3 pos = camera.getPosition();
            glm::vec3 front = camera.getFront();
            pos += front * scroll * 20.0f;
            if (pos.y < 5.0f) pos.y = 5.0f;
            camera.setPosition(pos);
        }

        // Terrain interaction
        if (!uiMouse) {
            glm::mat4 projection = camera.getProjectionMatrix(
                static_cast<float>(m_window->getWidth()) / m_window->getHeight());
            glm::mat4 view = camera.getViewMatrix();
            glm::vec3 ray = screenToWorldRay(m_input->getMousePosition(),
                m_window->getWidth(), m_window->getHeight(), projection, view);
            glm::vec3 hitPoint;

            if (terrain.raycast(camera.getPosition(), ray, hitPoint)) {
                if (editorUI.isSculptMode()) {
                    editorUI.setBrushHitPoint(hitPoint);

                    if (m_input->isMouseButtonPressed(GLFW_MOUSE_BUTTON_LEFT)) {
                        terrain.sculpt(hitPoint, editorUI.getBrushRadius(),
                                       editorUI.getBrushStrength() * dt,
                                       editorUI.getBrushMode());
                    }
                } else {
                    // Selection mode
                    if (m_input->isMouseButtonJustPressed(GLFW_MOUSE_BUTTON_LEFT)) {
                        editorUI.setSelectionStart(hitPoint);
                        isDragging = true;
                    }
                    if (isDragging && m_input->isMouseButtonPressed(GLFW_MOUSE_BUTTON_LEFT)) {
                        editorUI.setSelectionEnd(hitPoint);
                    }
                    if (isDragging && !m_input->isMouseButtonPressed(GLFW_MOUSE_BUTTON_LEFT)) {
                        isDragging = false;
                    }
                }
            } else {
                editorUI.clearBrushHit();
            }
        }

        water.update(dt);
        smokeSystem.update(dt, camera.getPosition());
        weather.update(dt, camera.getPosition());
        sunLight.updateDayNight(dt);

        glm::mat4 projection = camera.getProjectionMatrix(
            static_cast<float>(m_window->getWidth()) / m_window->getHeight());
        glm::mat4 view = camera.getViewMatrix();

        if (wireframe)
            glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);
        else
            glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);

        // Shadow pass
        shadow.beginShadowPass(sunLight);
        terrain.renderShadow(shadow.getShader(), shadow.getLightSpaceMatrix());
        rootNode.renderShadow(shadow.getShader(), shadow.getLightSpaceMatrix());
        shadow.endShadowPass(m_window->getWidth(), m_window->getHeight());

        // Water reflection pass
        water.beginReflection(camera);
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
        skybox.render(view, projection);
        terrain.render(projection, view, sunLight, shadow, camera.getPosition());
        rootNode.render(projection, view, sunLight, camera.getPosition());
        water.endReflection(camera);

        // Water refraction pass
        water.beginRefraction(camera);
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
        terrain.render(projection, view, sunLight, shadow, camera.getPosition());
        water.endRefraction();

        // Main render pass
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
        skybox.render(view, projection);

        // Set brush uniform data before terrain render
        terrain.setBrushUniforms(editorUI.hasBrushHit(), editorUI.getBrushHitPoint(),
                                 editorUI.getBrushRadius());
        terrain.render(projection, view, sunLight, shadow, camera.getPosition());

        rootNode.render(projection, view, sunLight, camera.getPosition());
        water.render(projection, view, camera.getPosition(), sunLight, dt);
        smokeSystem.render(projection, view);
        weather.render(projection, view);

        // Editor UI
        if (showEditor) {
            editorUI.beginFrame();
            editorUI.renderToolbar();
            editorUI.renderPropertiesPanel(rootNode, camera, terrain, water, sunLight, weather);
            editorUI.renderInfoBar(camera, *m_timer, cameraMode, wireframe);
            editorUI.endFrame();
        }

        m_window->swapBuffers();
        m_window->pollEvents();
    }
}

void Engine::cleanup() {
    glfwTerminate();
}

Window& Engine::getWindow() { return *m_window; }
InputManager& Engine::getInput() { return *m_input; }
Timer& Engine::getTimer() { return *m_timer; }

} // namespace trioz
