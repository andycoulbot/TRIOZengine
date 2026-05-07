#include "renderer/Renderer.h"
#include <glad/gl.h>

namespace trioz {

void Renderer::clear() const {
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
}

void Renderer::setClearColor(float r, float g, float b, float a) const {
    glClearColor(r, g, b, a);
}

} // namespace trioz
