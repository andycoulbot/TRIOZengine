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
#include <cstdio>

namespace trioz {

EditorUI::EditorUI(GLFWwindow* window) {
    IMGUI_CHECKVERSION();
    ImGui::CreateContext();
    ImGuiIO& io = ImGui::GetIO();
    io.ConfigFlags |= ImGuiConfigFlags_NavEnableKeyboard;

    const char* fontPath = "assets/fonts/DejaVuSans.ttf";
    FILE* f = fopen(fontPath, "rb");
    if (f) {
        fclose(f);
        io.Fonts->AddFontFromFileTTF(fontPath, 16.0f, nullptr, io.Fonts->GetGlyphRangesCyrillic());
    } else {
        io.Fonts->AddFontDefault();
    }

    ImGui::StyleColorsDark();
    ImGuiStyle& style = ImGui::GetStyle();
    style.WindowRounding = 4.0f;
    style.FrameRounding = 3.0f;
    style.GrabRounding = 2.0f;
    style.ScrollbarRounding = 3.0f;
    style.Alpha = 0.95f;
    style.WindowPadding = ImVec2(8, 8);
    style.FramePadding = ImVec2(5, 4);
    style.ItemSpacing = ImVec2(8, 5);

    style.Colors[ImGuiCol_WindowBg] = ImVec4(0.18f, 0.18f, 0.18f, 0.95f);
    style.Colors[ImGuiCol_Header] = ImVec4(0.25f, 0.25f, 0.25f, 1.0f);
    style.Colors[ImGuiCol_HeaderHovered] = ImVec4(0.35f, 0.35f, 0.35f, 1.0f);
    style.Colors[ImGuiCol_HeaderActive] = ImVec4(0.30f, 0.50f, 0.70f, 1.0f);
    style.Colors[ImGuiCol_Button] = ImVec4(0.30f, 0.30f, 0.30f, 1.0f);
    style.Colors[ImGuiCol_ButtonHovered] = ImVec4(0.40f, 0.40f, 0.40f, 1.0f);
    style.Colors[ImGuiCol_ButtonActive] = ImVec4(0.25f, 0.50f, 0.75f, 1.0f);
    style.Colors[ImGuiCol_FrameBg] = ImVec4(0.15f, 0.15f, 0.15f, 1.0f);
    style.Colors[ImGuiCol_FrameBgHovered] = ImVec4(0.22f, 0.22f, 0.22f, 1.0f);
    style.Colors[ImGuiCol_FrameBgActive] = ImVec4(0.25f, 0.45f, 0.65f, 1.0f);
    style.Colors[ImGuiCol_TitleBg] = ImVec4(0.12f, 0.12f, 0.12f, 1.0f);
    style.Colors[ImGuiCol_TitleBgActive] = ImVec4(0.18f, 0.18f, 0.18f, 1.0f);
    style.Colors[ImGuiCol_Tab] = ImVec4(0.20f, 0.20f, 0.20f, 1.0f);
    style.Colors[ImGuiCol_TabHovered] = ImVec4(0.35f, 0.35f, 0.35f, 1.0f);
    style.Colors[ImGuiCol_SliderGrab] = ImVec4(0.40f, 0.60f, 0.80f, 1.0f);
    style.Colors[ImGuiCol_SliderGrabActive] = ImVec4(0.50f, 0.70f, 0.90f, 1.0f);
    style.Colors[ImGuiCol_Separator] = ImVec4(0.30f, 0.30f, 0.30f, 1.0f);

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

bool EditorUI::wantCaptureMouse() const {
    return ImGui::GetIO().WantCaptureMouse;
}

bool EditorUI::wantCaptureKeyboard() const {
    return ImGui::GetIO().WantCaptureKeyboard;
}

void EditorUI::renderToolbar() {
    ImGuiIO& io = ImGui::GetIO();
    float toolbarWidth = 220.0f;
    float toolbarHeight = io.DisplaySize.y - 30.0f;

    ImGui::SetNextWindowPos(ImVec2(0, 0), ImGuiCond_Always);
    ImGui::SetNextWindowSize(ImVec2(toolbarWidth, toolbarHeight), ImGuiCond_Always);
    ImGui::Begin(u8"##\u041f\u0430\u043d\u0435\u043b\u044c", nullptr,
                 ImGuiWindowFlags_NoResize | ImGuiWindowFlags_NoMove |
                 ImGuiWindowFlags_NoCollapse | ImGuiWindowFlags_NoTitleBar);

    ImGui::TextColored(ImVec4(0.7f, 0.85f, 1.0f, 1.0f), u8"TRIOZengine");
    ImGui::Separator();
    ImGui::Spacing();

    ImGui::Text(u8"\u0420\u0435\u0436\u0438\u043c:");
    ImGui::Spacing();

    bool isEdit = (m_editorMode == EditorMode::Edit);
    bool isSelect = (m_editorMode == EditorMode::Select);

    if (isEdit) {
        ImGui::PushStyleColor(ImGuiCol_Button, ImVec4(0.25f, 0.50f, 0.75f, 1.0f));
    }
    if (ImGui::Button(u8"\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435", ImVec2(200, 30))) {
        m_editorMode = EditorMode::Edit;
    }
    if (isEdit) {
        ImGui::PopStyleColor();
    }

    if (isSelect) {
        ImGui::PushStyleColor(ImGuiCol_Button, ImVec4(0.25f, 0.50f, 0.75f, 1.0f));
    }
    if (ImGui::Button(u8"\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435 \u043e\u0431\u043b\u0430\u0441\u0442\u0438", ImVec2(200, 30))) {
        m_editorMode = EditorMode::Select;
    }
    if (isSelect) {
        ImGui::PopStyleColor();
    }

    ImGui::Spacing();
    ImGui::Separator();
    ImGui::Spacing();

    if (m_editorMode == EditorMode::Edit) {
        ImGui::Text(u8"\u041a\u0438\u0441\u0442\u044c:");
        ImGui::Spacing();

        auto brushBtn = [&](const char* label, BrushMode mode) {
            bool active = (m_brushMode == mode);
            if (active) {
                ImGui::PushStyleColor(ImGuiCol_Button, ImVec4(0.25f, 0.50f, 0.75f, 1.0f));
            }
            if (ImGui::Button(label, ImVec2(200, 26))) {
                m_brushMode = mode;
            }
            if (active) {
                ImGui::PopStyleColor();
            }
        };

        brushBtn(u8"\u041f\u043e\u0434\u043d\u044f\u0442\u044c", BrushMode::Raise);
        brushBtn(u8"\u041e\u043f\u0443\u0441\u0442\u0438\u0442\u044c", BrushMode::Lower);
        brushBtn(u8"\u0421\u0433\u043b\u0430\u0434\u0438\u0442\u044c", BrushMode::Smooth);
        brushBtn(u8"\u0412\u044b\u0440\u043e\u0432\u043d\u044f\u0442\u044c", BrushMode::Flatten);

        ImGui::Spacing();
        ImGui::Separator();
        ImGui::Spacing();

        ImGui::Text(u8"\u041d\u0430\u0441\u0442\u0440\u043e\u0439\u043a\u0438 \u043a\u0438\u0441\u0442\u0438:");
        ImGui::SliderFloat(u8"\u0420\u0430\u0434\u0438\u0443\u0441", &m_brushRadius, 5.0f, 100.0f);
        ImGui::SliderFloat(u8"\u0421\u0438\u043b\u0430", &m_brushStrength, 0.1f, 5.0f);

        if (m_brushHitValid) {
            ImGui::Spacing();
            ImGui::TextColored(ImVec4(0.6f, 0.8f, 0.6f, 1.0f),
                u8"\u041a\u0438\u0441\u0442\u044c: (%.1f, %.1f, %.1f)",
                m_brushHitPoint.x, m_brushHitPoint.y, m_brushHitPoint.z);
        }
    }

    if (m_editorMode == EditorMode::Select) {
        ImGui::Text(u8"\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435:");
        ImGui::Spacing();
        ImGui::TextWrapped(u8"\u041b\u041a\u041c \u2014 \u043d\u0430\u0447\u0430\u043b\u043e \u043e\u0431\u043b\u0430\u0441\u0442\u0438");
        ImGui::TextWrapped(u8"\u041f\u0435\u0440\u0435\u0442\u0430\u0449\u0438\u0442\u0435 \u0434\u043b\u044f \u0432\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u044f");

        if (m_hasSelection) {
            ImGui::Spacing();
            ImGui::TextColored(ImVec4(0.8f, 0.8f, 0.4f, 1.0f),
                u8"\u041e\u0442: (%.1f, %.1f)", m_selectionStart.x, m_selectionStart.z);
            ImGui::TextColored(ImVec4(0.8f, 0.8f, 0.4f, 1.0f),
                u8"\u0414\u043e: (%.1f, %.1f)", m_selectionEnd.x, m_selectionEnd.z);
        }

        ImGui::Spacing();
        if (ImGui::Button(u8"\u0421\u0431\u0440\u043e\u0441\u0438\u0442\u044c \u0432\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435", ImVec2(200, 26))) {
            clearSelection();
        }
    }

    ImGui::End();
}

void EditorUI::renderPropertiesPanel(SceneNode& root, Camera& camera, Terrain& terrain,
                                      Water& water, Light& light, Weather& weather) {
    ImGuiIO& io = ImGui::GetIO();
    float panelWidth = 280.0f;
    float panelHeight = io.DisplaySize.y - 30.0f;

    ImGui::SetNextWindowPos(ImVec2(io.DisplaySize.x - panelWidth, 0), ImGuiCond_Always);
    ImGui::SetNextWindowSize(ImVec2(panelWidth, panelHeight), ImGuiCond_Always);
    ImGui::Begin(u8"\u0421\u0432\u043e\u0439\u0441\u0442\u0432\u0430", nullptr,
                 ImGuiWindowFlags_NoResize | ImGuiWindowFlags_NoMove |
                 ImGuiWindowFlags_NoCollapse);

    if (ImGui::CollapsingHeader(u8"\u041e\u0441\u0432\u0435\u0449\u0435\u043d\u0438\u0435", ImGuiTreeNodeFlags_DefaultOpen)) {
        ImGui::Checkbox(u8"\u0410\u0432\u0442\u043e \u0441\u043c\u0435\u043d\u0430 \u0434\u043d\u044f/\u043d\u043e\u0447\u0438", &light.autoDay);
        ImGui::SliderFloat(u8"\u0412\u0440\u0435\u043c\u044f \u0441\u0443\u0442\u043e\u043a", &light.dayTime, 0.0f, 1.0f);
        ImGui::SliderFloat(u8"\u0421\u043a\u043e\u0440\u043e\u0441\u0442\u044c \u0434\u043d\u044f", &light.daySpeed, 0.001f, 0.1f);
        ImGui::ColorEdit3(u8"\u0424\u043e\u043d\u043e\u0432\u044b\u0439 \u0441\u0432\u0435\u0442", &light.ambient[0]);
        ImGui::ColorEdit3(u8"\u041d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u043d\u044b\u0439 \u0441\u0432\u0435\u0442", &light.diffuse[0]);
    }

    if (ImGui::CollapsingHeader(u8"\u0412\u043e\u0434\u0430")) {
        float waterHeight = water.getHeight();
        if (ImGui::SliderFloat(u8"\u0423\u0440\u043e\u0432\u0435\u043d\u044c \u0432\u043e\u0434\u044b", &waterHeight, 0.0f, 80.0f)) {
            water.setHeight(waterHeight);
        }
    }

    if (ImGui::CollapsingHeader(u8"\u041f\u043e\u0433\u043e\u0434\u0430")) {
        int weatherType = static_cast<int>(weather.getWeatherType());
        const char* weatherNames[] = {
            u8"\u041d\u0435\u0442",
            u8"\u0414\u043e\u0436\u0434\u044c",
            u8"\u0421\u043d\u0435\u0433",
            u8"\u0422\u0443\u043c\u0430\u043d"
        };
        if (ImGui::Combo(u8"\u0422\u0438\u043f", &weatherType, weatherNames, 4)) {
            weather.setWeatherType(static_cast<WeatherType>(weatherType));
        }
        float intensity = weather.getIntensity();
        if (ImGui::SliderFloat(u8"\u0418\u043d\u0442\u0435\u043d\u0441\u0438\u0432\u043d\u043e\u0441\u0442\u044c", &intensity, 0.0f, 1.0f)) {
            weather.setIntensity(intensity);
        }
        if (weather.getWeatherType() == WeatherType::Fog) {
            float fogDensity = weather.getFogDensity();
            if (ImGui::SliderFloat(u8"\u041f\u043b\u043e\u0442\u043d\u043e\u0441\u0442\u044c \u0442\u0443\u043c\u0430\u043d\u0430", &fogDensity, 0.0f, 0.05f)) {
                weather.setFogDensity(fogDensity);
            }
        }
    }

    if (ImGui::CollapsingHeader(u8"\u041e\u0431\u044a\u0435\u043a\u0442\u044b \u0441\u0446\u0435\u043d\u044b")) {
        ImGui::Text(u8"\u041e\u0431\u044a\u0435\u043a\u0442\u043e\u0432: %zu", root.getChildren().size());
        auto& children = root.getChildren();
        for (size_t i = 0; i < children.size(); i++) {
            ImGui::PushID(static_cast<int>(i));
            auto& child = children[i];
            if (ImGui::TreeNode(child->getName().c_str())) {
                glm::vec3 pos = child->getPosition();
                glm::vec3 rot = child->getRotation();
                glm::vec3 scale = child->getScale();

                if (ImGui::DragFloat3(u8"\u041f\u043e\u0437\u0438\u0446\u0438\u044f", &pos[0], 0.5f))
                    child->setPosition(pos);
                if (ImGui::DragFloat3(u8"\u0412\u0440\u0430\u0449\u0435\u043d\u0438\u0435", &rot[0], 1.0f))
                    child->setRotation(rot);
                if (ImGui::DragFloat3(u8"\u041c\u0430\u0441\u0448\u0442\u0430\u0431", &scale[0], 0.1f, 0.01f, 100.0f))
                    child->setScale(scale);

                if (ImGui::Button(u8"\u0423\u0434\u0430\u043b\u0438\u0442\u044c")) {
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

void EditorUI::renderInfoBar(const Camera& camera, const Timer& timer,
                              int cameraMode, bool wireframe) {
    ImGuiIO& io = ImGui::GetIO();
    float barHeight = 30.0f;

    ImGui::SetNextWindowPos(ImVec2(0, io.DisplaySize.y - barHeight), ImGuiCond_Always);
    ImGui::SetNextWindowSize(ImVec2(io.DisplaySize.x, barHeight), ImGuiCond_Always);
    ImGui::Begin(u8"##\u0421\u0442\u0430\u0442\u0443\u0441", nullptr,
                 ImGuiWindowFlags_NoResize | ImGuiWindowFlags_NoMove |
                 ImGuiWindowFlags_NoCollapse | ImGuiWindowFlags_NoTitleBar |
                 ImGuiWindowFlags_NoScrollbar);

    glm::vec3 pos = camera.getPosition();
    const char* modeStr = (m_editorMode == EditorMode::Edit)
        ? u8"\u0420\u0435\u0434\u0430\u043a\u0442\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435"
        : u8"\u0412\u044b\u0434\u0435\u043b\u0435\u043d\u0438\u0435";
    const char* camStr = (cameraMode == 0)
        ? u8"\u0421\u0432\u043e\u0431\u043e\u0434\u043d\u0430\u044f"
        : u8"\u041e\u0442 1-\u0433\u043e \u043b\u0438\u0446\u0430";

    ImGui::Text(u8"FPS: %.0f | \u0420\u0435\u0436\u0438\u043c: %s | \u041a\u0430\u043c\u0435\u0440\u0430: %s (%.0f, %.0f, %.0f) | %s",
        timer.getFPS(), modeStr, camStr, pos.x, pos.y, pos.z,
        wireframe ? u8"\u041a\u0430\u0440\u043a\u0430\u0441" : u8"\u0417\u0430\u043b\u0438\u0432\u043a\u0430");

    ImGui::End();
}

} // namespace trioz
