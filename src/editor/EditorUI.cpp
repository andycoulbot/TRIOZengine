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

static void setupBlenderStyle() {
    ImGuiStyle& style = ImGui::GetStyle();

    style.WindowRounding = 0.0f;
    style.FrameRounding = 2.0f;
    style.ScrollbarRounding = 2.0f;
    style.GrabRounding = 2.0f;
    style.TabRounding = 2.0f;
    style.WindowBorderSize = 1.0f;
    style.FrameBorderSize = 0.0f;
    style.PopupBorderSize = 1.0f;
    style.WindowPadding = ImVec2(8, 8);
    style.FramePadding = ImVec2(4, 3);
    style.ItemSpacing = ImVec2(6, 4);
    style.ItemInnerSpacing = ImVec2(4, 4);

    ImVec4* c = style.Colors;
    c[ImGuiCol_WindowBg]           = ImVec4(0.18f, 0.18f, 0.18f, 1.00f);
    c[ImGuiCol_ChildBg]            = ImVec4(0.18f, 0.18f, 0.18f, 1.00f);
    c[ImGuiCol_PopupBg]            = ImVec4(0.22f, 0.22f, 0.22f, 0.95f);
    c[ImGuiCol_Border]             = ImVec4(0.10f, 0.10f, 0.10f, 1.00f);
    c[ImGuiCol_FrameBg]            = ImVec4(0.25f, 0.25f, 0.25f, 1.00f);
    c[ImGuiCol_FrameBgHovered]     = ImVec4(0.30f, 0.30f, 0.30f, 1.00f);
    c[ImGuiCol_FrameBgActive]      = ImVec4(0.35f, 0.35f, 0.35f, 1.00f);
    c[ImGuiCol_TitleBg]            = ImVec4(0.14f, 0.14f, 0.14f, 1.00f);
    c[ImGuiCol_TitleBgActive]      = ImVec4(0.14f, 0.14f, 0.14f, 1.00f);
    c[ImGuiCol_MenuBarBg]          = ImVec4(0.14f, 0.14f, 0.14f, 1.00f);
    c[ImGuiCol_Header]             = ImVec4(0.28f, 0.42f, 0.62f, 0.80f);
    c[ImGuiCol_HeaderHovered]      = ImVec4(0.32f, 0.48f, 0.70f, 0.80f);
    c[ImGuiCol_HeaderActive]       = ImVec4(0.35f, 0.52f, 0.75f, 0.80f);
    c[ImGuiCol_Button]             = ImVec4(0.30f, 0.30f, 0.30f, 1.00f);
    c[ImGuiCol_ButtonHovered]      = ImVec4(0.35f, 0.50f, 0.70f, 1.00f);
    c[ImGuiCol_ButtonActive]       = ImVec4(0.30f, 0.45f, 0.65f, 1.00f);
    c[ImGuiCol_Tab]                = ImVec4(0.18f, 0.18f, 0.18f, 1.00f);
    c[ImGuiCol_TabHovered]         = ImVec4(0.35f, 0.50f, 0.70f, 0.80f);
    c[ImGuiCol_TabActive]          = ImVec4(0.28f, 0.42f, 0.62f, 1.00f);
    c[ImGuiCol_SliderGrab]         = ImVec4(0.35f, 0.50f, 0.70f, 1.00f);
    c[ImGuiCol_SliderGrabActive]   = ImVec4(0.40f, 0.55f, 0.75f, 1.00f);
    c[ImGuiCol_Separator]          = ImVec4(0.10f, 0.10f, 0.10f, 1.00f);
    c[ImGuiCol_Text]               = ImVec4(0.85f, 0.85f, 0.85f, 1.00f);
    c[ImGuiCol_TextDisabled]       = ImVec4(0.50f, 0.50f, 0.50f, 1.00f);
}

EditorUI::EditorUI(GLFWwindow* window) {
    IMGUI_CHECKVERSION();
    ImGui::CreateContext();
    ImGuiIO& io = ImGui::GetIO();
    io.ConfigFlags |= ImGuiConfigFlags_NavEnableKeyboard;

    setupBlenderStyle();

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
    float toolbarWidth = 60.0f;
    float menuBarHeight = ImGui::GetFrameHeight();

    ImGui::SetNextWindowPos(ImVec2(0, menuBarHeight));
    ImGui::SetNextWindowSize(ImVec2(toolbarWidth, io.DisplaySize.y - menuBarHeight - 28.0f));
    ImGui::Begin("##Toolbar", nullptr,
        ImGuiWindowFlags_NoTitleBar | ImGuiWindowFlags_NoResize |
        ImGuiWindowFlags_NoMove | ImGuiWindowFlags_NoScrollbar |
        ImGuiWindowFlags_NoCollapse);

    ImGui::PushStyleVar(ImGuiStyleVar_FramePadding, ImVec2(8, 8));

    auto toolButton = [&](const char* label, bool active) -> bool {
        if (active) {
            ImGui::PushStyleColor(ImGuiCol_Button, ImVec4(0.28f, 0.42f, 0.62f, 1.0f));
        }
        bool pressed = ImGui::Button(label, ImVec2(44, 36));
        if (active) {
            ImGui::PopStyleColor();
        }
        return pressed;
    };

    if (toolButton("UP", m_sculptMode && m_brushMode == BrushMode::Raise)) {
        m_sculptMode = true;
        m_brushMode = BrushMode::Raise;
    }
    if (ImGui::IsItemHovered()) ImGui::SetTooltip("Podnyat (Raise)");

    if (toolButton("DN", m_sculptMode && m_brushMode == BrushMode::Lower)) {
        m_sculptMode = true;
        m_brushMode = BrushMode::Lower;
    }
    if (ImGui::IsItemHovered()) ImGui::SetTooltip("Opustit (Lower)");

    if (toolButton("SM", m_sculptMode && m_brushMode == BrushMode::Smooth)) {
        m_sculptMode = true;
        m_brushMode = BrushMode::Smooth;
    }
    if (ImGui::IsItemHovered()) ImGui::SetTooltip("Sgladit (Smooth)");

    if (toolButton("FL", m_sculptMode && m_brushMode == BrushMode::Flatten)) {
        m_sculptMode = true;
        m_brushMode = BrushMode::Flatten;
    }
    if (ImGui::IsItemHovered()) ImGui::SetTooltip("Vyrovnyat (Flatten)");

    ImGui::Separator();

    if (toolButton("VW", !m_sculptMode)) {
        m_sculptMode = false;
    }
    if (ImGui::IsItemHovered()) ImGui::SetTooltip("Prosmotr (View)");

    ImGui::PopStyleVar();
    ImGui::End();
}

void EditorUI::renderPropertiesPanel(SceneNode& root, Camera& camera, Terrain& terrain,
                                      Water& water, Light& light, Weather& weather) {
    ImGuiIO& io = ImGui::GetIO();
    float panelWidth = 280.0f;
    float menuBarHeight = ImGui::GetFrameHeight();

    ImGui::SetNextWindowPos(ImVec2(io.DisplaySize.x - panelWidth, menuBarHeight));
    ImGui::SetNextWindowSize(ImVec2(panelWidth, io.DisplaySize.y - menuBarHeight - 28.0f));
    ImGui::Begin("Svoystva", nullptr,
        ImGuiWindowFlags_NoMove | ImGuiWindowFlags_NoResize |
        ImGuiWindowFlags_NoCollapse);

    if (ImGui::CollapsingHeader("Kist (Brush)", ImGuiTreeNodeFlags_DefaultOpen)) {
        ImGui::SliderFloat("Radius", &m_brushRadius, 5.0f, 150.0f, "%.0f");
        ImGui::SliderFloat("Sila", &m_brushStrength, 0.1f, 5.0f, "%.1f");

        const char* modeNames[] = {
            "Podnyat", "Opustit", "Sgladit", "Vyrovnyat"
        };
        int mode = static_cast<int>(m_brushMode);
        if (ImGui::Combo("Rezhim", &mode, modeNames, 4)) {
            m_brushMode = static_cast<BrushMode>(mode);
        }
    }

    if (ImGui::CollapsingHeader("Osveschenie", ImGuiTreeNodeFlags_DefaultOpen)) {
        ImGui::Checkbox("Avto den/noch", &light.autoDay);
        ImGui::SliderFloat("Vremya dnya", &light.dayTime, 0.0f, 1.0f);
        ImGui::SliderFloat("Skorost dnya", &light.daySpeed, 0.001f, 0.1f);
        ImGui::ColorEdit3("Fonoviy svet", &light.ambient[0]);
        ImGui::ColorEdit3("Rasseianniy svet", &light.diffuse[0]);
    }

    if (ImGui::CollapsingHeader("Voda")) {
        float waterHeight = water.getHeight();
        if (ImGui::SliderFloat("Uroven vody", &waterHeight, 0.0f, 80.0f)) {
            water.setHeight(waterHeight);
        }
    }

    if (ImGui::CollapsingHeader("Pogoda")) {
        int weatherType = static_cast<int>(weather.getWeatherType());
        const char* weatherNames[] = {"Net", "Dozhd", "Sneg", "Tuman"};
        if (ImGui::Combo("Tip", &weatherType, weatherNames, 4)) {
            weather.setWeatherType(static_cast<WeatherType>(weatherType));
        }
        float intensity = weather.getIntensity();
        if (ImGui::SliderFloat("Intensivnost", &intensity, 0.0f, 1.0f)) {
            weather.setIntensity(intensity);
        }
        if (weather.getWeatherType() == WeatherType::Fog) {
            float fogDensity = weather.getFogDensity();
            if (ImGui::SliderFloat("Plotnost tumana", &fogDensity, 0.0f, 0.05f)) {
                weather.setFogDensity(fogDensity);
            }
        }
    }

    if (ImGui::CollapsingHeader("Obekty na scene")) {
        ImGui::Text("Ob'ektov: %zu", root.getChildren().size());
        auto& children = root.getChildren();
        for (size_t i = 0; i < children.size(); i++) {
            ImGui::PushID(static_cast<int>(i));
            auto& child = children[i];
            if (ImGui::TreeNode(child->getName().c_str())) {
                glm::vec3 pos = child->getPosition();
                glm::vec3 rot = child->getRotation();
                glm::vec3 scale = child->getScale();

                if (ImGui::DragFloat3("Pozitsiya", &pos[0], 0.5f))
                    child->setPosition(pos);
                if (ImGui::DragFloat3("Vrashchenie", &rot[0], 1.0f))
                    child->setRotation(rot);
                if (ImGui::DragFloat3("Masshtab", &scale[0], 0.1f, 0.01f, 100.0f))
                    child->setScale(scale);

                if (ImGui::Button("Udalit")) {
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
    float barHeight = 28.0f;

    ImGui::SetNextWindowPos(ImVec2(0, io.DisplaySize.y - barHeight));
    ImGui::SetNextWindowSize(ImVec2(io.DisplaySize.x, barHeight));
    ImGui::Begin("##StatusBar", nullptr,
        ImGuiWindowFlags_NoTitleBar | ImGuiWindowFlags_NoResize |
        ImGuiWindowFlags_NoMove | ImGuiWindowFlags_NoScrollbar |
        ImGuiWindowFlags_NoCollapse);

    glm::vec3 pos = camera.getPosition();

    ImGui::Text("FPS: %.0f", timer.getFPS());
    ImGui::SameLine(120);
    ImGui::Text("Kamera: (%.0f, %.0f, %.0f)", pos.x, pos.y, pos.z);
    ImGui::SameLine(340);
    ImGui::Text("Rezhim: %s", cameraMode == 0 ?
        "Svobodnaya kamera" : "Ot 1-go litsa");
    ImGui::SameLine(540);
    ImGui::Text("Karkas: %s", wireframe ? "DA" : "NET");
    ImGui::SameLine(640);
    ImGui::TextColored(ImVec4(0.5f, 0.5f, 0.5f, 1.0f),
        "PKM-kamera | LKM-kist | Tab-rezhim | F1-karkas | F2-redaktor");

    ImGui::End();

    if (ImGui::BeginMainMenuBar()) {
        if (ImGui::BeginMenu("Fayl")) {
            if (ImGui::MenuItem("Noviy proekt")) {}
            if (ImGui::MenuItem("Otkryt...")) {}
            if (ImGui::MenuItem("Sokhranit...")) {}
            ImGui::Separator();
            if (ImGui::MenuItem("Vykhod")) {}
            ImGui::EndMenu();
        }
        if (ImGui::BeginMenu("Redaktirovat")) {
            if (ImGui::MenuItem("Otmena", "Ctrl+Z")) {}
            if (ImGui::MenuItem("Vernut", "Ctrl+Y")) {}
            ImGui::EndMenu();
        }
        if (ImGui::BeginMenu("Vid")) {
            if (ImGui::MenuItem("Karkasniy rezhim", "F1")) {}
            if (ImGui::MenuItem("Skryt redaktor", "F2")) {}
            ImGui::EndMenu();
        }
        if (ImGui::BeginMenu("Pomoshch")) {
            if (ImGui::MenuItem("O programme")) {}
            ImGui::EndMenu();
        }
        ImGui::EndMainMenuBar();
    }
}

void EditorUI::renderTerrainTools(Terrain& terrain) {
    (void)terrain;
}

} // namespace trioz
