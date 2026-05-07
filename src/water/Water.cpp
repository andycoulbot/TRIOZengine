#include "water/Water.h"
#include "scene/Camera.h"
#include "lighting/Light.h"
#include <glad/gl.h>
#include <cmath>
#include <vector>

namespace trioz {

Water::Water(float centerX, float height, float size)
    : m_height(height), m_size(size), m_centerX(centerX),
      m_reflectionFBO(1280, 720), m_refractionFBO(1280, 720) {
    m_shader = Shader("assets/shaders/water/water.vert", "assets/shaders/water/water.frag");
    createWaterMesh();
}

Water::~Water() {
    if (m_vao) glDeleteVertexArrays(1, &m_vao);
    if (m_vbo) glDeleteBuffers(1, &m_vbo);
}

void Water::createWaterMesh() {
    int gridSize = 64;
    float step = m_size / gridSize;
    float halfSize = m_size * 0.5f;

    std::vector<float> vertices;

    for (int z = 0; z < gridSize; z++) {
        for (int x = 0; x < gridSize; x++) {
            float x0 = x * step - halfSize;
            float z0 = z * step - halfSize;
            float x1 = (x + 1) * step - halfSize;
            float z1 = (z + 1) * step - halfSize;

            // Triangle 1
            vertices.insert(vertices.end(), {x0, m_height, z0});
            vertices.insert(vertices.end(), {x0, m_height, z1});
            vertices.insert(vertices.end(), {x1, m_height, z0});
            // Triangle 2
            vertices.insert(vertices.end(), {x1, m_height, z0});
            vertices.insert(vertices.end(), {x0, m_height, z1});
            vertices.insert(vertices.end(), {x1, m_height, z1});
        }
    }

    m_vertexCount = static_cast<int>(vertices.size()) / 3;

    glGenVertexArrays(1, &m_vao);
    glGenBuffers(1, &m_vbo);
    glBindVertexArray(m_vao);
    glBindBuffer(GL_ARRAY_BUFFER, m_vbo);
    glBufferData(GL_ARRAY_BUFFER, vertices.size() * sizeof(float), vertices.data(), GL_STATIC_DRAW);
    glEnableVertexAttribArray(0);
    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 3 * sizeof(float), nullptr);
    glBindVertexArray(0);
}

void Water::update(float dt) {
    m_time += dt * m_waveSpeed;
}

void Water::beginReflection(Camera& camera) {
    m_reflectionFBO.bind();
    m_savedY = camera.getPosition().y;
    m_savedPitch = camera.getPitch();

    float distance = 2.0f * (camera.getPosition().y - m_height);
    glm::vec3 pos = camera.getPosition();
    pos.y -= distance;
    camera.setPosition(pos);
    camera.invertPitch();

    glEnable(GL_CLIP_DISTANCE0);
}

void Water::endReflection() {
    m_reflectionFBO.unbind(1280, 720);
    glDisable(GL_CLIP_DISTANCE0);
}

void Water::beginRefraction(Camera& camera) {
    m_refractionFBO.bind();
    glEnable(GL_CLIP_DISTANCE0);
}

void Water::endRefraction() {
    m_refractionFBO.unbind(1280, 720);
    glDisable(GL_CLIP_DISTANCE0);
}

void Water::render(const glm::mat4& projection, const glm::mat4& view,
                   const glm::vec3& viewPos, const Light& light, float time) const {
    glEnable(GL_BLEND);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);

    m_shader.use();
    m_shader.setMat4("projection", projection);
    m_shader.setMat4("view", view);
    m_shader.setMat4("model", glm::mat4(1.0f));
    m_shader.setVec3("viewPos", viewPos);
    m_shader.setFloat("time", m_time);
    m_shader.setFloat("waterHeight", m_height);

    m_shader.setVec3("light.direction", light.direction);
    m_shader.setVec3("light.ambient", light.ambient);
    m_shader.setVec3("light.diffuse", light.diffuse);

    m_shader.setInt("reflectionTex", 0);
    m_shader.setInt("refractionTex", 1);

    glActiveTexture(GL_TEXTURE0);
    glBindTexture(GL_TEXTURE_2D, m_reflectionFBO.getColorTexture());
    glActiveTexture(GL_TEXTURE1);
    glBindTexture(GL_TEXTURE_2D, m_refractionFBO.getColorTexture());

    glBindVertexArray(m_vao);
    glDrawArrays(GL_TRIANGLES, 0, m_vertexCount);
    glBindVertexArray(0);
}

} // namespace trioz
