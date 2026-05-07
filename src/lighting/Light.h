#pragma once

#include <glm/glm.hpp>

namespace trioz {

class Light {
public:
    glm::vec3 direction = glm::normalize(glm::vec3(-0.5f, -0.8f, -0.3f));
    glm::vec3 ambient = glm::vec3(0.3f);
    glm::vec3 diffuse = glm::vec3(0.8f);
    glm::vec3 specular = glm::vec3(0.5f);

    float dayTime = 0.3f;
    float daySpeed = 0.01f;
    bool autoDay = true;

    void updateDayNight(float dt);
    glm::vec3 getSkyColor() const;
};

} // namespace trioz
