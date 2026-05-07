#include "model/ModelInstance.h"
#include "lighting/Light.h"
#include <glad/gl.h>
#include <glm/gtc/matrix_transform.hpp>

namespace trioz {

ModelInstance::ModelInstance(std::shared_ptr<Model> model)
    : m_model(std::move(model)) {
}

void ModelInstance::addInstance(const glm::vec3& position, float rotation, float scale) {
    m_instances.push_back({position, rotation, scale});
}

void ModelInstance::clearInstances() {
    m_instances.clear();
}

void ModelInstance::updateBuffer() {
    if (m_instanceVBO) {
        glDeleteBuffers(1, &m_instanceVBO);
    }

    std::vector<glm::mat4> matrices;
    matrices.reserve(m_instances.size());

    for (const auto& inst : m_instances) {
        glm::mat4 model = glm::mat4(1.0f);
        model = glm::translate(model, inst.position);
        model = glm::rotate(model, glm::radians(inst.rotation), glm::vec3(0, 1, 0));
        model = glm::scale(model, glm::vec3(inst.scale));
        matrices.push_back(model);
    }

    glGenBuffers(1, &m_instanceVBO);
    glBindBuffer(GL_ARRAY_BUFFER, m_instanceVBO);
    glBufferData(GL_ARRAY_BUFFER, matrices.size() * sizeof(glm::mat4), matrices.data(), GL_STATIC_DRAW);
}

void ModelInstance::render(const glm::mat4& projection, const glm::mat4& view,
                           const Light& light, const glm::vec3& viewPos) const {
    if (!m_model || m_instances.empty()) return;

    for (const auto& inst : m_instances) {
        glm::mat4 model = glm::mat4(1.0f);
        model = glm::translate(model, inst.position);
        model = glm::rotate(model, glm::radians(inst.rotation), glm::vec3(0, 1, 0));
        model = glm::scale(model, glm::vec3(inst.scale));
        m_model->render(projection, view, model, light, viewPos);
    }
}

} // namespace trioz
