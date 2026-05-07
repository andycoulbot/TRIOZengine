#include "particles/Weather.h"
#include <cstdlib>

namespace trioz {

Weather::Weather()
    : m_rainSystem(5000), m_snowSystem(3000) {
}

void Weather::update(float dt, const glm::vec3& cameraPos) {
    m_emitAccum += dt;

    float emitRate = m_intensity * 500.0f;
    float emitInterval = 1.0f / emitRate;

    if (m_type == WeatherType::Rain) {
        while (m_emitAccum >= emitInterval) {
            m_emitAccum -= emitInterval;
            float rx = cameraPos.x + (rand() / static_cast<float>(RAND_MAX) - 0.5f) * 100.0f;
            float rz = cameraPos.z + (rand() / static_cast<float>(RAND_MAX) - 0.5f) * 100.0f;
            float ry = cameraPos.y + 50.0f + (rand() / static_cast<float>(RAND_MAX)) * 30.0f;

            m_rainSystem.emit(
                glm::vec3(rx, ry, rz),
                glm::vec3(0.0f, -30.0f, 0.0f),
                glm::vec4(0.6f, 0.7f, 0.9f, 0.6f),
                3.0f, 0.1f
            );
        }
    } else if (m_type == WeatherType::Snow) {
        while (m_emitAccum >= emitInterval * 2.0f) {
            m_emitAccum -= emitInterval * 2.0f;
            float rx = cameraPos.x + (rand() / static_cast<float>(RAND_MAX) - 0.5f) * 80.0f;
            float rz = cameraPos.z + (rand() / static_cast<float>(RAND_MAX) - 0.5f) * 80.0f;
            float ry = cameraPos.y + 40.0f + (rand() / static_cast<float>(RAND_MAX)) * 20.0f;

            float windX = (rand() / static_cast<float>(RAND_MAX) - 0.5f) * 3.0f;
            float windZ = (rand() / static_cast<float>(RAND_MAX) - 0.5f) * 3.0f;

            m_snowSystem.emit(
                glm::vec3(rx, ry, rz),
                glm::vec3(windX, -3.0f, windZ),
                glm::vec4(1.0f, 1.0f, 1.0f, 0.8f),
                8.0f, 0.3f
            );
        }
    }

    m_rainSystem.update(dt, cameraPos);
    m_snowSystem.update(dt, cameraPos);
}

void Weather::render(const glm::mat4& projection, const glm::mat4& view) const {
    if (m_type == WeatherType::Rain) {
        m_rainSystem.render(projection, view);
    } else if (m_type == WeatherType::Snow) {
        m_snowSystem.render(projection, view);
    }
}

} // namespace trioz
