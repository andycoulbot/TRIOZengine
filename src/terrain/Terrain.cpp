#include "terrain/Terrain.h"
#include "lighting/Light.h"
#include "lighting/Shadow.h"
#include <glad/gl.h>
#include <cmath>
#include <algorithm>

namespace trioz {

Terrain::Terrain(int gridSize, float cellSize, float maxHeight)
    : m_gridSize(gridSize), m_cellSize(cellSize), m_maxHeight(maxHeight) {
    m_shader = Shader("assets/shaders/terrain/terrain.vert", "assets/shaders/terrain/terrain.frag");

    generateHeightmap();
    buildMesh();
}

void Terrain::generateHeightmap() {
    m_heights.resize(m_gridSize + 1, std::vector<float>(m_gridSize + 1, 0.0f));

    for (int z = 0; z <= m_gridSize; z++) {
        for (int x = 0; x <= m_gridSize; x++) {
            float fx = static_cast<float>(x) / m_gridSize;
            float fz = static_cast<float>(z) / m_gridSize;

            float height = 0.0f;
            float amplitude = 1.0f;
            float frequency = 1.0f;

            for (int octave = 0; octave < 6; octave++) {
                height += interpolatedNoise(fx * frequency * 8.0f, fz * frequency * 8.0f) * amplitude;
                amplitude *= 0.5f;
                frequency *= 2.0f;
            }

            m_heights[z][x] = height * m_maxHeight;
        }
    }
}

void Terrain::buildMesh() {
    std::vector<Vertex> vertices;
    std::vector<unsigned int> indices;

    float halfSize = m_gridSize * m_cellSize * 0.5f;

    for (int z = 0; z <= m_gridSize; z++) {
        for (int x = 0; x <= m_gridSize; x++) {
            Vertex v{};
            v.position = glm::vec3(
                x * m_cellSize - halfSize,
                m_heights[z][x],
                z * m_cellSize - halfSize
            );

            float texScale = 16.0f;
            v.texCoords = glm::vec2(
                static_cast<float>(x) / m_gridSize * texScale,
                static_cast<float>(z) / m_gridSize * texScale
            );

            float hL = (x > 0) ? m_heights[z][x - 1] : m_heights[z][x];
            float hR = (x < m_gridSize) ? m_heights[z][x + 1] : m_heights[z][x];
            float hD = (z > 0) ? m_heights[z - 1][x] : m_heights[z][x];
            float hU = (z < m_gridSize) ? m_heights[z + 1][x] : m_heights[z][x];
            v.normal = glm::normalize(glm::vec3(hL - hR, 2.0f * m_cellSize, hD - hU));

            v.tangent = glm::normalize(glm::vec3(1.0f, (hR - hL) / (2.0f * m_cellSize), 0.0f));

            vertices.push_back(v);
        }
    }

    for (int z = 0; z < m_gridSize; z++) {
        for (int x = 0; x < m_gridSize; x++) {
            unsigned int topLeft = z * (m_gridSize + 1) + x;
            unsigned int topRight = topLeft + 1;
            unsigned int bottomLeft = (z + 1) * (m_gridSize + 1) + x;
            unsigned int bottomRight = bottomLeft + 1;

            indices.push_back(topLeft);
            indices.push_back(bottomLeft);
            indices.push_back(topRight);
            indices.push_back(topRight);
            indices.push_back(bottomLeft);
            indices.push_back(bottomRight);
        }
    }

    m_mesh = Mesh(vertices, indices);
}

float Terrain::getHeightAt(float x, float z) const {
    float halfSize = m_gridSize * m_cellSize * 0.5f;
    float gridX = (x + halfSize) / m_cellSize;
    float gridZ = (z + halfSize) / m_cellSize;

    int ix = static_cast<int>(std::floor(gridX));
    int iz = static_cast<int>(std::floor(gridZ));

    if (ix < 0 || ix >= m_gridSize || iz < 0 || iz >= m_gridSize)
        return 0.0f;

    float fracX = gridX - ix;
    float fracZ = gridZ - iz;

    float h00 = m_heights[iz][ix];
    float h10 = m_heights[iz][ix + 1];
    float h01 = m_heights[iz + 1][ix];
    float h11 = m_heights[iz + 1][ix + 1];

    float h0 = h00 * (1.0f - fracX) + h10 * fracX;
    float h1 = h01 * (1.0f - fracX) + h11 * fracX;

    return h0 * (1.0f - fracZ) + h1 * fracZ;
}

glm::vec3 Terrain::getNormalAt(float x, float z) const {
    float delta = m_cellSize;
    float hL = getHeightAt(x - delta, z);
    float hR = getHeightAt(x + delta, z);
    float hD = getHeightAt(x, z - delta);
    float hU = getHeightAt(x, z + delta);
    return glm::normalize(glm::vec3(hL - hR, 2.0f * delta, hD - hU));
}

void Terrain::render(const glm::mat4& projection, const glm::mat4& view,
                     const Light& light, const Shadow& shadow, const glm::vec3& viewPos) const {
    m_shader.use();
    m_shader.setMat4("projection", projection);
    m_shader.setMat4("view", view);
    m_shader.setMat4("model", glm::mat4(1.0f));
    m_shader.setVec3("viewPos", viewPos);

    m_shader.setVec3("light.direction", light.direction);
    m_shader.setVec3("light.ambient", light.ambient);
    m_shader.setVec3("light.diffuse", light.diffuse);
    m_shader.setVec3("light.specular", light.specular);

    m_shader.setMat4("lightSpaceMatrix", shadow.getLightSpaceMatrix());
    m_shader.setFloat("maxHeight", m_maxHeight);

    m_shader.setInt("grassTex", 0);
    m_shader.setInt("rockTex", 1);
    m_shader.setInt("sandTex", 2);
    m_shader.setInt("snowTex", 3);
    m_shader.setInt("shadowMap", 4);

    m_grassTexture.bind(0);
    m_rockTexture.bind(1);
    m_sandTexture.bind(2);
    m_snowTexture.bind(3);

    glActiveTexture(GL_TEXTURE4);
    glBindTexture(GL_TEXTURE_2D, shadow.getDepthTexture());

    m_mesh.draw();
}

void Terrain::renderShadow(const Shader& shader, const glm::mat4& lightSpaceMatrix) const {
    shader.use();
    shader.setMat4("lightSpaceMatrix", lightSpaceMatrix);
    shader.setMat4("model", glm::mat4(1.0f));
    m_mesh.draw();
}

float Terrain::noise2D(int x, int z) const {
    int n = x + z * 57;
    n = (n << 13) ^ n;
    return (1.0f - ((n * (n * n * 15731 + 789221) + 1376312589) & 0x7fffffff) / 1073741824.0f);
}

float Terrain::smoothNoise(int x, int z) const {
    float corners = (noise2D(x - 1, z - 1) + noise2D(x + 1, z - 1) +
                     noise2D(x - 1, z + 1) + noise2D(x + 1, z + 1)) / 16.0f;
    float sides = (noise2D(x - 1, z) + noise2D(x + 1, z) +
                   noise2D(x, z - 1) + noise2D(x, z + 1)) / 8.0f;
    float center = noise2D(x, z) / 4.0f;
    return corners + sides + center;
}

float Terrain::interpolatedNoise(float x, float z) const {
    int ix = static_cast<int>(std::floor(x));
    int iz = static_cast<int>(std::floor(z));
    float fracX = x - ix;
    float fracZ = z - iz;

    float v1 = smoothNoise(ix, iz);
    float v2 = smoothNoise(ix + 1, iz);
    float v3 = smoothNoise(ix, iz + 1);
    float v4 = smoothNoise(ix + 1, iz + 1);

    float i1 = v1 * (1.0f - fracX) + v2 * fracX;
    float i2 = v3 * (1.0f - fracX) + v4 * fracX;

    return i1 * (1.0f - fracZ) + i2 * fracZ;
}

float Terrain::perlinNoise(float x, float z) const {
    return interpolatedNoise(x, z);
}

} // namespace trioz
