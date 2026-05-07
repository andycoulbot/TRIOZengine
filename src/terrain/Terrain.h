#pragma once

#include "renderer/Shader.h"
#include "renderer/Mesh.h"
#include "renderer/Texture.h"
#include <glm/glm.hpp>
#include <vector>

namespace trioz {

class Light;
class Shadow;

class Terrain {
public:
    Terrain(int gridSize, float cellSize, float maxHeight);

    void render(const glm::mat4& projection, const glm::mat4& view,
                const Light& light, const Shadow& shadow, const glm::vec3& viewPos) const;
    void renderShadow(const Shader& shader, const glm::mat4& lightSpaceMatrix) const;

    float getHeightAt(float x, float z) const;
    glm::vec3 getNormalAt(float x, float z) const;

    int getGridSize() const { return m_gridSize; }
    float getCellSize() const { return m_cellSize; }
    float getMaxHeight() const { return m_maxHeight; }
    float getTotalSize() const { return m_gridSize * m_cellSize; }

private:
    void generateHeightmap();
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
    Texture m_grassTexture;
    Texture m_rockTexture;
    Texture m_sandTexture;
    Texture m_snowTexture;
};

} // namespace trioz
