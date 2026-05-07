#pragma once

#include "renderer/Shader.h"
#include "renderer/Framebuffer.h"
#include <glm/glm.hpp>

namespace trioz {

class Light;

class Shadow {
public:
    explicit Shadow(int resolution);

    void beginShadowPass(const Light& light);
    void endShadowPass(int windowWidth, int windowHeight);

    const Shader& getShader() const { return m_shader; }
    glm::mat4 getLightSpaceMatrix() const { return m_lightSpaceMatrix; }
    unsigned int getDepthTexture() const { return m_fbo.getDepthTexture(); }

private:
    Framebuffer m_fbo;
    Shader m_shader;
    glm::mat4 m_lightSpaceMatrix = glm::mat4(1.0f);
    int m_resolution;
};

} // namespace trioz
