#pragma once

#include "model/Model.h"
#include <memory>
#include <vector>
#include <glm/glm.hpp>

namespace trioz {

struct InstanceData {
    glm::vec3 position;
    float rotation;
    float scale;
};

class ModelInstance {
public:
    ModelInstance() = default;
    explicit ModelInstance(std::shared_ptr<Model> model);

    void addInstance(const glm::vec3& position, float rotation = 0.0f, float scale = 1.0f);
    void clearInstances();
    void updateBuffer();

    void render(const glm::mat4& projection, const glm::mat4& view,
                const Light& light, const glm::vec3& viewPos) const;

    size_t getInstanceCount() const { return m_instances.size(); }

private:
    std::shared_ptr<Model> m_model;
    std::vector<InstanceData> m_instances;
    unsigned int m_instanceVBO = 0;
};

} // namespace trioz
