#pragma once

#include "renderer/Shader.h"
#include "renderer/Framebuffer.h"
#include <glm/glm.hpp>

namespace trioz {

class Camera;
class Light;

class Water {
public:
    Water(float centerX, float height, float size);
    ~Water();

    void update(float dt);

    void beginReflection(Camera& camera);
    void endReflection(Camera& camera);
    void beginRefraction(Camera& camera);
    void endRefraction();

    void render(const glm::mat4& projection, const glm::mat4& view,
                const glm::vec3& viewPos, const Light& light, float time) const;

    float getHeight() const { return m_height; }
    void setHeight(float h) { m_height = h; }

private:
    void createWaterMesh();

    float m_height;
    float m_size;
    float m_centerX;
    float m_time = 0.0f;
    float m_waveSpeed = 0.03f;

    unsigned int m_vao = 0;
    unsigned int m_vbo = 0;
    int m_vertexCount = 0;

    Shader m_shader;
    Framebuffer m_reflectionFBO;
    Framebuffer m_refractionFBO;

    float m_savedPitch = 0.0f;
    float m_savedY = 0.0f;
};

} // namespace trioz
