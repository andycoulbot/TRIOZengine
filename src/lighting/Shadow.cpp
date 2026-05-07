#include "lighting/Shadow.h"
#include "lighting/Light.h"
#include <glad/gl.h>
#include <glm/gtc/matrix_transform.hpp>

namespace trioz {

Shadow::Shadow(int resolution)
    : m_fbo(resolution, resolution, true), m_resolution(resolution) {
    m_shader = Shader("assets/shaders/shadow/shadow.vert", "assets/shaders/shadow/shadow.frag");
}

void Shadow::beginShadowPass(const Light& light) {
    float orthoSize = 500.0f;
    glm::mat4 lightProjection = glm::ortho(-orthoSize, orthoSize, -orthoSize, orthoSize, 1.0f, 1500.0f);
    glm::mat4 lightView = glm::lookAt(
        -light.direction * 500.0f,
        glm::vec3(0.0f),
        glm::vec3(0.0f, 1.0f, 0.0f)
    );
    m_lightSpaceMatrix = lightProjection * lightView;

    m_fbo.bind();
    glClear(GL_DEPTH_BUFFER_BIT);
    glCullFace(GL_FRONT);
}

void Shadow::endShadowPass(int windowWidth, int windowHeight) {
    glCullFace(GL_BACK);
    m_fbo.unbind(windowWidth, windowHeight);
}

} // namespace trioz
