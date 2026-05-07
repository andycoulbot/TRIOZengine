#include "editor/ObjectPlacer.h"
#include "terrain/Terrain.h"
#include "model/Model.h"
#include "scene/SceneNode.h"
#include <iostream>
#include <filesystem>

namespace trioz {

ObjectPlacer::ObjectPlacer(const Terrain& terrain) : m_terrain(terrain) {
}

void ObjectPlacer::openFileDialog() {
    std::cout << "[ObjectPlacer] File dialog requested. Use loadModel(path) to load a model." << std::endl;
}

void ObjectPlacer::loadModel(const std::string& path) {
    auto model = std::make_shared<Model>(path);
    if (model->isLoaded()) {
        m_loadedModels.push_back(model);
        std::filesystem::path p(path);
        m_modelNames.push_back(p.filename().string());
        m_selectedModel = static_cast<int>(m_loadedModels.size()) - 1;
        std::cout << "[ObjectPlacer] Loaded model: " << path << std::endl;
    } else {
        std::cerr << "[ObjectPlacer] Failed to load model: " << path << std::endl;
    }
}

} // namespace trioz
