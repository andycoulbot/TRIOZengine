#pragma once

#include <vector>
#include <memory>
#include <string>
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>

namespace trioz {

class Model;
class Shader;
class Light;

class SceneNode {
public:
    SceneNode();
    ~SceneNode() = default;

    void addChild(std::shared_ptr<SceneNode> child);
    void removeChild(size_t index);

    void setModel(std::shared_ptr<Model> model);
    void setPosition(const glm::vec3& pos);
    void setRotation(const glm::vec3& rot);
    void setScale(const glm::vec3& scale);
    void setName(const std::string& name) { m_name = name; }

    glm::vec3 getPosition() const { return m_position; }
    glm::vec3 getRotation() const { return m_rotation; }
    glm::vec3 getScale() const { return m_scale; }
    std::string getName() const { return m_name; }
    glm::mat4 getTransformMatrix() const;

    const std::vector<std::shared_ptr<SceneNode>>& getChildren() const { return m_children; }
    std::vector<std::shared_ptr<SceneNode>>& getChildren() { return m_children; }

    void render(const glm::mat4& projection, const glm::mat4& view,
                const Light& light, const glm::vec3& viewPos) const;
    void renderShadow(const Shader& shader, const glm::mat4& lightSpaceMatrix) const;

private:
    std::vector<std::shared_ptr<SceneNode>> m_children;
    std::shared_ptr<Model> m_model;

    glm::vec3 m_position = glm::vec3(0.0f);
    glm::vec3 m_rotation = glm::vec3(0.0f);
    glm::vec3 m_scale = glm::vec3(1.0f);
    std::string m_name = "Node";
};

} // namespace trioz
