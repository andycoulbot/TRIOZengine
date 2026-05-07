#pragma once

#include "renderer/Shader.h"
#include <glm/glm.hpp>

namespace trioz {

class Skybox {
public:
    Skybox();
    ~Skybox();

    void render(const glm::mat4& view, const glm::mat4& projection) const;

private:
    unsigned int m_vao = 0;
    unsigned int m_vbo = 0;
    Shader m_shader;

    void generateProceduralSky();
};

} // namespace trioz
