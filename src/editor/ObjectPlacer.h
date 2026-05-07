#pragma once

#include <vector>
#include <string>
#include <memory>

namespace trioz {

class Terrain;
class Model;
class SceneNode;

class ObjectPlacer {
public:
    explicit ObjectPlacer(const Terrain& terrain);

    void openFileDialog();
    void loadModel(const std::string& path);

    size_t getLoadedModelCount() const { return m_loadedModels.size(); }
    float getPlaceScale() const { return m_placeScale; }
    void setPlaceScale(float scale) { m_placeScale = scale; }
    float getPlaceRotation() const { return m_placeRotation; }
    void setPlaceRotation(float rotation) { m_placeRotation = rotation; }

    int getSelectedModel() const { return m_selectedModel; }
    void setSelectedModel(int index) { m_selectedModel = index; }

    const std::vector<std::string>& getModelNames() const { return m_modelNames; }

private:
    const Terrain& m_terrain;
    std::vector<std::shared_ptr<Model>> m_loadedModels;
    std::vector<std::string> m_modelNames;

    int m_selectedModel = -1;
    float m_placeScale = 1.0f;
    float m_placeRotation = 0.0f;
};

} // namespace trioz
