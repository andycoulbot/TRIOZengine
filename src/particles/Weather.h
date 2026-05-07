#pragma once

#include "particles/ParticleSystem.h"
#include "renderer/Shader.h"
#include <glm/glm.hpp>

namespace trioz {

enum class WeatherType {
    None,
    Rain,
    Snow,
    Fog
};

class Weather {
public:
    Weather();

    void update(float dt, const glm::vec3& cameraPos);
    void render(const glm::mat4& projection, const glm::mat4& view) const;

    void setWeatherType(WeatherType type) { m_type = type; }
    WeatherType getWeatherType() const { return m_type; }

    void setIntensity(float intensity) { m_intensity = intensity; }
    float getIntensity() const { return m_intensity; }

    void setFogDensity(float density) { m_fogDensity = density; }
    float getFogDensity() const { return m_fogDensity; }
    glm::vec3 getFogColor() const { return m_fogColor; }

private:
    WeatherType m_type = WeatherType::None;
    float m_intensity = 0.5f;
    float m_fogDensity = 0.005f;
    glm::vec3 m_fogColor = glm::vec3(0.7f, 0.7f, 0.8f);

    ParticleSystem m_rainSystem;
    ParticleSystem m_snowSystem;

    float m_emitAccum = 0.0f;
};

} // namespace trioz
