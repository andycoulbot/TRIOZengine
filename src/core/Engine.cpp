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
#include <glm/glm.hpp>
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

static glm::vec3 screenToWorldRay(float mouseX, float mouseY,
                                   int screenW, int screenH,
                                   const glm::mat4& projection,
                                   const glm::mat4& view) {
    float x = (2.0f * mouseX) / screenW - 1.0f;
    float y = 1.0f - (2.0f * mouseY) / screenH;
    glm::vec4 rayClip(x, y, -1.0f, 1.0f);
    glm::vec4 rayEye = glm::inverse(projection) * rayClip;
    rayEye = glm::vec4(rayEye.x, rayEye.y, -1.0f, 0.0f);
    glm::vec3 rayWorld = glm::vec3(glm::inverse(view) * rayEye);
    return glm::normalize(rayWorld);
}

void Engine::mainLoop() {
    Renderer renderer;

    float terrainSize = 256.0f * 10.0f;
    float terrainCenter = terrainSize * 0.5f;
    Camera camera(glm::vec3(terrainCenter, 120.0f, terrainCenter + 300.0f));

    Skybox skybox;
    Terrain terrain(256, 10.0f, 80.0f);
    Water water(terrainCenter, 8.0f, terrainSize);
    Light sunLight;
    sunLight.direction = glm::normalize(glm::vec3(-0.5f, -0.8f, -0.3f));
    sunLight.ambient = glm::vec3(0.35f);
    sunLight.diffuse = glm::vec3(0.85f);
    sunLight.specular = glm::vec3(0.5f);
    sunLight.autoDay = false;
    Shadow shadow(2048);

    ParticleSystem smokeSystem(1000);
    Weather weather;

    SceneNode rootNode;
    EditorUI editorUI(m_window->getHandle());
    ObjectPlacer placer(terrain);

    bool wireframe = false;
    bool showEditor = true;
    int cameraMode = 0;
    bool rightMouseDown = false;

    std::cout << "=== TRIOZengine ===" << std::endl;
    std::cout << "Upravlenie:" << std::endl;
    std::cout << "  PKM + mysh - vrashchenie kamery" << std::endl;
    std::cout << "  WASD       - peremeshchenie" << std::endl;
    std::cout << "  LKM        - skulpting terreyna" << std::endl;
    std::cout << "  Tab        - rezhim kamery" << std::endl;
    std::cout << "  F1         - karkasniy rezhim" << std::endl;
    std::cout << "  F2         - skryt/pokazat redaktor" << std::endl;
    std::cout << "  Esc        - vykhod" << std::endl;

    while (m_running && !m_window->shouldClose()) {
        m_timer->update();
        float dt = m_timer->getDeltaTime();
        m_input->update();

        bool uiCaptureMouse = editorUI.wantCaptureMouse();
        bool uiCaptureKeyboard = editorUI.wantCaptureKeyboard();

        if (!uiCaptureKeyboard) {
            if (m_input->isKeyPressed(GLFW_KEY_ESCAPE))
                stop();
            if (m_input->isKeyJustPressed(GLFW_KEY_F1))
                wireframe = !wireframe;
            if (m_input->isKeyJustPressed(GLFW_KEY_TAB))
                cameraMode = (cameraMode + 1) % 2;
            if (m_input->isKeyJustPressed(GLFW_KEY_F2))
                showEditor = !showEditor;
        }

        bool wasRightDown = rightMouseDown;
        rightMouseDown = m_input->isMouseButtonPressed(GLFW_MOUSE_BUTTON_RIGHT);

        if (rightMouseDown && !wasRightDown && !uiCaptureMouse) {
            m_input->setCursorLocked(true);
        }
        if (!rightMouseDown && wasRightDown) {
            m_input->setCursorLocked(false);
        }

        if (rightMouseDown && !uiCaptureMouse) {
            if (cameraMode == 0) {
                camera.updateFreeCamera(*m_input, dt);
            } else {
                camera.updateFPSCamera(*m_input, dt, terrain);
            }
        } else if (!uiCaptureKeyboard) {
            float speed = 50.0f;
            if (m_input->isKeyPressed(GLFW_KEY_LEFT_SHIFT)) speed *= 3.0f;
            glm::vec3 pos = camera.getPosition();
            glm::vec3 front = camera.getFront();
            glm::vec3 flatFront = glm::normalize(glm::vec3(front.x, 0.0f, front.z));
            glm::vec3 right = glm::normalize(glm::cross(flatFront, glm::vec3(0, 1, 0)));

            if (m_input->isKeyPressed(GLFW_KEY_W)) pos += flatFront * speed * dt;
            if (m_input->isKeyPressed(GLFW_KEY_S)) pos -= flatFront * speed * dt;
            if (m_input->isKeyPressed(GLFW_KEY_A)) pos -= right * speed * dt;
            if (m_input->isKeyPressed(GLFW_KEY_D)) pos += right * speed * dt;
            if (m_input->isKeyPressed(GLFW_KEY_SPACE)) pos.y += speed * dt;
            if (m_input->isKeyPressed(GLFW_KEY_LEFT_CONTROL)) pos.y -= speed * dt;

            float scrollDelta = m_input->getScrollDelta();
            if (scrollDelta != 0.0f && !uiCaptureMouse) {
                pos += camera.getFront() * scrollDelta * 20.0f;
            }

            camera.setPosition(pos);
        }

        glm::mat4 projection = camera.getProjectionMatrix(
            static_cast<float>(m_window->getWidth()) / m_window->getHeight());
        glm::mat4 view = camera.getViewMatrix();

        if (!uiCaptureMouse) {
            glm::vec2 mousePos = m_input->getMousePosition();
            glm::vec3 rayDir = screenToWorldRay(mousePos.x, mousePos.y,
                m_window->getWidth(), m_window->getHeight(), projection, view);

            glm::vec3 hitPoint;
            if (terrain.raycast(camera.getPosition(), rayDir, hitPoint)) {
                editorUI.setBrushHitPoint(hitPoint);

                if (m_input->isMouseButtonPressed(GLFW_MOUSE_BUTTON_LEFT) &&
                    editorUI.isSculptMode() && showEditor) {
                    terrain.sculpt(hitPoint, editorUI.getBrushRadius(),
                                   editorUI.getBrushStrength() * dt,
                                   editorUI.getBrushMode());
                }
            } else {
                editorUI.clearBrushHit();
            }
        } else {
            editorUI.clearBrushHit();
        }

        water.update(dt);
        smokeSystem.update(dt, camera.getPosition());
        weather.update(dt, camera.getPosition());
        sunLight.updateDayNight(dt);

        if (wireframe)
            glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);
        else
            glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);

        shadow.beginShadowPass(sunLight);
        terrain.renderShadow(shadow.getShader(), shadow.getLightSpaceMatrix());
        rootNode.renderShadow(shadow.getShader(), shadow.getLightSpaceMatrix());
        shadow.endShadowPass(m_window->getWidth(), m_window->getHeight());

        water.beginReflection(camera);
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
        skybox.render(view, projection);
        terrain.render(projection, view, sunLight, shadow, camera.getPosition());
        rootNode.render(projection, view, sunLight, camera.getPosition());
        water.endReflection();

        water.beginRefraction(camera);
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
        terrain.render(projection, view, sunLight, shadow, camera.getPosition());
        water.endRefraction();

        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
        skybox.render(view, projection);

        if (editorUI.hasBrushHit() && editorUI.isSculptMode() && showEditor) {
            terrain.renderWithBrush(projection, view, sunLight, shadow,
                                     camera.getPosition(),
                                     editorUI.getBrushHitPoint(),
                                     editorUI.getBrushRadius());
        } else {
            terrain.render(projection, view, sunLight, shadow, camera.getPosition());
        }

        rootNode.render(projection, view, sunLight, camera.getPosition());
        water.render(projection, view, camera.getPosition(), sunLight, dt);
        smokeSystem.render(projection, view);
        weather.render(projection, view);

        if (showEditor) {
            editorUI.beginFrame();
            editorUI.renderInfoBar(camera, *m_timer, cameraMode, wireframe);
            editorUI.renderToolbar();
            editorUI.renderPropertiesPanel(rootNode, camera, terrain, water, sunLight, weather);
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
