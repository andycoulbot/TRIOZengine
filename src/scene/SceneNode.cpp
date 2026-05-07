#include "scene/SceneNode.h"
#include "model/Model.h"
#include "lighting/Light.h"
#include "renderer/Shader.h"
#include <glm/gtc/matrix_transform.hpp>

namespace trioz {

SceneNode::SceneNode() = default;

void SceneNode::addChild(std::shared_ptr<SceneNode> child) {
    m_children.push_back(std::move(child));
}

void SceneNode::removeChild(size_t index) {
    if (index < m_children.size()) {
        m_children.erase(m_children.begin() + static_cast<long>(index));
    }
}

void SceneNode::setModel(std::shared_ptr<Model> model) {
    m_model = std::move(model);
}

void SceneNode::setPosition(const glm::vec3& pos) { m_position = pos; }
void SceneNode::setRotation(const glm::vec3& rot) { m_rotation = rot; }
void SceneNode::setScale(const glm::vec3& scale) { m_scale = scale; }

glm::mat4 SceneNode::getTransformMatrix() const {
    glm::mat4 model = glm::mat4(1.0f);
    model = glm::translate(model, m_position);
    model = glm::rotate(model, glm::radians(m_rotation.x), glm::vec3(1, 0, 0));
    model = glm::rotate(model, glm::radians(m_rotation.y), glm::vec3(0, 1, 0));
    model = glm::rotate(model, glm::radians(m_rotation.z), glm::vec3(0, 0, 1));
    model = glm::scale(model, m_scale);
    return model;
}

void SceneNode::render(const glm::mat4& projection, const glm::mat4& view,
                       const Light& light, const glm::vec3& viewPos) const {
    if (m_model) {
        m_model->render(projection, view, getTransformMatrix(), light, viewPos);
    }
    for (const auto& child : m_children) {
        child->render(projection, view, light, viewPos);
    }
}

void SceneNode::renderShadow(const Shader& shader, const glm::mat4& lightSpaceMatrix) const {
    if (m_model) {
        m_model->renderShadow(shader, lightSpaceMatrix, getTransformMatrix());
    }
    for (const auto& child : m_children) {
        child->renderShadow(shader, lightSpaceMatrix);
    }
}

} // namespace trioz
