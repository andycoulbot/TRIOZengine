#include "lighting/Light.h"
#include <cmath>
#include <algorithm>

namespace trioz {

void Light::updateDayNight(float dt) {
    if (!autoDay) return;

    dayTime += dt * daySpeed;
    if (dayTime > 1.0f) dayTime -= 1.0f;

    float sunAngle = dayTime * 3.14159f * 2.0f;
    direction = glm::normalize(glm::vec3(
        cos(sunAngle) * 0.5f,
        -sin(sunAngle),
        -0.3f
    ));

    float sunHeight = sin(sunAngle);
    float dayFactor = std::clamp(sunHeight * 2.0f + 0.5f, 0.0f, 1.0f);

    glm::vec3 dayAmbient(0.3f, 0.3f, 0.35f);
    glm::vec3 nightAmbient(0.05f, 0.05f, 0.1f);
    ambient = glm::mix(nightAmbient, dayAmbient, dayFactor);

    glm::vec3 dayDiffuse(0.8f, 0.8f, 0.75f);
    glm::vec3 sunsetDiffuse(0.9f, 0.5f, 0.2f);
    glm::vec3 nightDiffuse(0.05f, 0.05f, 0.15f);

    if (dayFactor > 0.6f) {
        diffuse = glm::mix(sunsetDiffuse, dayDiffuse, (dayFactor - 0.6f) / 0.4f);
    } else if (dayFactor > 0.2f) {
        diffuse = glm::mix(nightDiffuse, sunsetDiffuse, (dayFactor - 0.2f) / 0.4f);
    } else {
        diffuse = nightDiffuse;
    }

    specular = diffuse * 0.5f;
}

glm::vec3 Light::getSkyColor() const {
    float sunAngle = dayTime * 3.14159f * 2.0f;
    float sunHeight = sin(sunAngle);
    float dayFactor = std::clamp(sunHeight * 2.0f + 0.5f, 0.0f, 1.0f);

    glm::vec3 dayColor(0.53f, 0.81f, 0.92f);
    glm::vec3 sunsetColor(0.9f, 0.4f, 0.1f);
    glm::vec3 nightColor(0.02f, 0.02f, 0.05f);

    if (dayFactor > 0.6f) {
        return glm::mix(sunsetColor, dayColor, (dayFactor - 0.6f) / 0.4f);
    } else if (dayFactor > 0.2f) {
        return glm::mix(nightColor, sunsetColor, (dayFactor - 0.2f) / 0.4f);
    }
    return nightColor;
}

} // namespace trioz
