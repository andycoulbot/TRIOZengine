#include "editor/EditorUI.h"
#include "scene/SceneNode.h"
#include "scene/Camera.h"
#include "terrain/Terrain.h"
#include "water/Water.h"
#include "lighting/Light.h"
#include "particles/Weather.h"
#include "core/Timer.h"
#include "editor/ObjectPlacer.h"

#include "imgui.h"
#include "imgui_impl_glfw.h"
#include "imgui_impl_opengl3.h"
#include <GLFW/glfw3.h>

namespace trioz {

EditorUI::EditorUI(GLFWwindow* window) {
    IMGUI_CHECKVERSION();
    ImGui::CreateContext();
    ImGuiIO& io = ImGui::GetIO();
    io.ConfigFlags |= ImGuiConfigFlags_NavEnableKeyboard;

    ImGui::StyleColorsDark();
    ImGuiStyle& style = ImGui::GetStyle();
    style.WindowRounding = 5.0f;
    style.FrameRounding = 3.0f;
    style.Alpha = 0.9f;

    ImGui_ImplGlfw_InitForOpenGL(window, true);
    ImGui_ImplOpenGL3_Init("#version 450");
    m_initialized = true;
}

EditorUI::~EditorUI() {
    if (m_initialized) {
        ImGui_ImplOpenGL3_Shutdown();
        ImGui_ImplGlfw_Shutdown();
        ImGui::DestroyContext();
    }
}

void EditorUI::beginFrame() {
    ImGui_ImplOpenGL3_NewFrame();
    ImGui_ImplGlfw_NewFrame();
    ImGui::NewFrame();
}

void EditorUI::endFrame() {
    ImGui::Render();
    ImGui_ImplOpenGL3_RenderDrawData(ImGui::GetDrawData());
}

void EditorUI::renderScenePanel(SceneNode& root, Camera& camera, Terrain& terrain,
                                 Water& water, Light& light, Weather& weather) {
    ImGui::SetNextWindowPos(ImVec2(10, 10), ImGuiCond_FirstUseEver);
    ImGui::SetNextWindowSize(ImVec2(300, 500), ImGuiCond_FirstUseEver);

    ImGui::Begin("Scene Settings");

    if (ImGui::CollapsingHeader("Lighting", ImGuiTreeNodeFlags_DefaultOpen)) {
        ImGui::Checkbox("Auto Day/Night", &light.autoDay);
        ImGui::SliderFloat("Time of Day", &light.dayTime, 0.0f, 1.0f);
        ImGui::SliderFloat("Day Speed", &light.daySpeed, 0.001f, 0.1f);
        ImGui::ColorEdit3("Ambient", &light.ambient[0]);
        ImGui::ColorEdit3("Diffuse", &light.diffuse[0]);
    }

    if (ImGui::CollapsingHeader("Water")) {
        float waterHeight = water.getHeight();
        if (ImGui::SliderFloat("Water Level", &waterHeight, 0.0f, 80.0f)) {
            water.setHeight(waterHeight);
        }
    }

    if (ImGui::CollapsingHeader("Weather")) {
        int weatherType = static_cast<int>(weather.getWeatherType());
        const char* weatherNames[] = {"None", "Rain", "Snow", "Fog"};
        if (ImGui::Combo("Type", &weatherType, weatherNames, 4)) {
            weather.setWeatherType(static_cast<WeatherType>(weatherType));
        }
        float intensity = weather.getIntensity();
        if (ImGui::SliderFloat("Intensity", &intensity, 0.0f, 1.0f)) {
            weather.setIntensity(intensity);
        }
        if (weather.getWeatherType() == WeatherType::Fog) {
            float fogDensity = weather.getFogDensity();
            if (ImGui::SliderFloat("Fog Density", &fogDensity, 0.0f, 0.05f)) {
                weather.setFogDensity(fogDensity);
            }
        }
    }

    if (ImGui::CollapsingHeader("Scene Objects")) {
        ImGui::Text("Objects: %zu", root.getChildren().size());
        auto& children = root.getChildren();
        for (size_t i = 0; i < children.size(); i++) {
            ImGui::PushID(static_cast<int>(i));
            auto& child = children[i];
            if (ImGui::TreeNode(child->getName().c_str())) {
                glm::vec3 pos = child->getPosition();
                glm::vec3 rot = child->getRotation();
                glm::vec3 scale = child->getScale();

                if (ImGui::DragFloat3("Position", &pos[0], 0.5f))
                    child->setPosition(pos);
                if (ImGui::DragFloat3("Rotation", &rot[0], 1.0f))
                    child->setRotation(rot);
                if (ImGui::DragFloat3("Scale", &scale[0], 0.1f, 0.01f, 100.0f))
                    child->setScale(scale);

                if (ImGui::Button("Remove")) {
                    root.removeChild(i);
                    ImGui::TreePop();
                    ImGui::PopID();
                    break;
                }
                ImGui::TreePop();
            }
            ImGui::PopID();
        }
    }

    ImGui::End();
}

void EditorUI::renderInfoPanel(const Camera& camera, const Timer& timer,
                                int cameraMode, bool wireframe) {
    ImGui::SetNextWindowPos(ImVec2(10, 520), ImGuiCond_FirstUseEver);
    ImGui::SetNextWindowSize(ImVec2(300, 180), ImGuiCond_FirstUseEver);

    ImGui::Begin("Info");

    ImGui::Text("FPS: %.1f", timer.getFPS());
    ImGui::Text("Frame: %d", timer.getFrameCount());
    ImGui::Separator();

    glm::vec3 pos = camera.getPosition();
    ImGui::Text("Camera: (%.1f, %.1f, %.1f)", pos.x, pos.y, pos.z);
    ImGui::Text("Mode: %s", cameraMode == 0 ? "Free Camera" : "FPS Camera");
    ImGui::Text("Wireframe: %s", wireframe ? "ON" : "OFF");

    ImGui::Separator();
    ImGui::TextColored(ImVec4(0.5f, 0.5f, 0.5f, 1.0f), "WASD - Move | Mouse - Look");
    ImGui::TextColored(ImVec4(0.5f, 0.5f, 0.5f, 1.0f), "TAB - Switch camera");
    ImGui::TextColored(ImVec4(0.5f, 0.5f, 0.5f, 1.0f), "F1 - Wireframe | F2 - Editor");
    ImGui::TextColored(ImVec4(0.5f, 0.5f, 0.5f, 1.0f), "Shift - Sprint | Scroll - Speed");

    ImGui::End();
}

void EditorUI::renderObjectPanel(ObjectPlacer& placer) {
    ImGui::SetNextWindowPos(ImVec2(10, 710), ImGuiCond_FirstUseEver);
    ImGui::SetNextWindowSize(ImVec2(300, 150), ImGuiCond_FirstUseEver);

    ImGui::Begin("Object Placer");

    if (ImGui::Button("Load Model...")) {
        placer.openFileDialog();
    }

    ImGui::SameLine();
    ImGui::Text("Models: %zu", placer.getLoadedModelCount());

    float placeScale = placer.getPlaceScale();
    if (ImGui::SliderFloat("Scale", &placeScale, 0.1f, 50.0f)) {
        placer.setPlaceScale(placeScale);
    }

    float placeRotation = placer.getPlaceRotation();
    if (ImGui::SliderFloat("Rotation", &placeRotation, 0.0f, 360.0f)) {
        placer.setPlaceRotation(placeRotation);
    }

    ImGui::End();
}

} // namespace trioz
