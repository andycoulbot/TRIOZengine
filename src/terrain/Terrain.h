#pragma once

#include "renderer/Shader.h"
#include "renderer/Mesh.h"
#include <glm/glm.hpp>
#include <vector>

namespace trioz {

class Light;
class Shadow;

enum class BrushMode {
    Raise,
    Lower,
    Smooth,
    Flatten
};

class Terrain {
public:
    Terrain(int gridSize, float cellSize, float maxHeight);

    void render(const glm::mat4& projection, const glm::mat4& view,
                const Light& light, const Shadow& shadow, const glm::vec3& viewPos) const;
    void renderWithBrush(const glm::mat4& projection, const glm::mat4& view,
                         const Light& light, const Shadow& shadow, const glm::vec3& viewPos,
                         const glm::vec3& brushPos, float brushRadius) const;
    void renderShadow(const Shader& shader, const glm::mat4& lightSpaceMatrix) const;

    float getHeightAt(float x, float z) const;
    glm::vec3 getNormalAt(float x, float z) const;

    void sculpt(const glm::vec3& center, float radius, float strength, BrushMode mode);
    void rebuildMesh();

    void setHeightAt(int x, int z, float height);
    float getHeightAtGrid(int x, int z) const;

    int getGridSize() const { return m_gridSize; }
    float getCellSize() const { return m_cellSize; }
    float getMaxHeight() const { return m_maxHeight; }
    void setMaxHeight(float h) { m_maxHeight = h; }
    float getTotalSize() const { return m_gridSize * m_cellSize; }

    bool raycast(const glm::vec3& origin, const glm::vec3& direction, glm::vec3& hitPoint) const;

    std::vector<std::vector<float>>& getHeights() { return m_heights; }

private:
    void generateIslandHeightmap();
    void buildMesh();

    float perlinNoise(float x, float z) const;
    float interpolatedNoise(float x, float z) const;
    float smoothNoise(int x, int z) const;
    float noise2D(int x, int z) const;

    int m_gridSize;
    float m_cellSize;
    float m_maxHeight;

    std::vector<std::vector<float>> m_heights;
    Mesh m_mesh;
    Shader m_shader;
};

} // namespace trioz
