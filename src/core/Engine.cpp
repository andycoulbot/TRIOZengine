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

void Engine::mainLoop() {
    Renderer renderer;
    Camera camera(glm::vec3(0.0f, 50.0f, 0.0f));
    Skybox skybox;
    Terrain terrain(256, 10.0f, 80.0f);
    Water water(256.0f * 10.0f * 0.5f, 15.0f, 256.0f * 10.0f);
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
    int cameraMode = 0; // 0 = free, 1 = FPS

    while (m_running && !m_window->shouldClose()) {
        m_timer->update();
        float dt = m_timer->getDeltaTime();
        m_input->update();

        if (m_input->isKeyPressed(GLFW_KEY_ESCAPE))
            stop();
        if (m_input->isKeyJustPressed(GLFW_KEY_F1))
            wireframe = !wireframe;
        if (m_input->isKeyJustPressed(GLFW_KEY_TAB))
            cameraMode = (cameraMode + 1) % 2;
        if (m_input->isKeyJustPressed(GLFW_KEY_F2))
            showEditor = !showEditor;

        if (cameraMode == 0) {
            camera.updateFreeCamera(*m_input, dt);
        } else {
            camera.updateFPSCamera(*m_input, dt, terrain);
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
        water.endReflection();

        // Water refraction pass
        water.beginRefraction(camera);
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
        terrain.render(projection, view, sunLight, shadow, camera.getPosition());
        water.endRefraction();

        // Main render pass
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
        skybox.render(view, projection);
        terrain.render(projection, view, sunLight, shadow, camera.getPosition());
        rootNode.render(projection, view, sunLight, camera.getPosition());
        water.render(projection, view, camera.getPosition(), sunLight, dt);
        smokeSystem.render(projection, view);
        weather.render(projection, view);

        // Editor UI
        if (showEditor) {
            editorUI.beginFrame();
            editorUI.renderScenePanel(rootNode, camera, terrain, water, sunLight, weather);
            editorUI.renderInfoPanel(camera, *m_timer, cameraMode, wireframe);
            editorUI.renderObjectPanel(placer);
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
