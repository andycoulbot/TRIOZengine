#pragma once

#include "renderer/Shader.h"
#include <glm/glm.hpp>
#include <vector>

namespace trioz {

struct Particle {
    glm::vec3 position;
    glm::vec3 velocity;
    glm::vec4 color;
    float life;
    float maxLife;
    float size;
    bool active;
};

class ParticleSystem {
public:
    explicit ParticleSystem(int maxParticles);
    ~ParticleSystem();

    void emit(const glm::vec3& position, const glm::vec3& velocity,
              const glm::vec4& color, float life, float size);
    void update(float dt, const glm::vec3& cameraPos);
    void render(const glm::mat4& projection, const glm::mat4& view) const;

    void setEmitterPosition(const glm::vec3& pos) { m_emitterPos = pos; }
    void setEmitting(bool emitting) { m_emitting = emitting; }
    bool isEmitting() const { return m_emitting; }

    int getActiveCount() const;

private:
    int findUnusedParticle();
    void sortParticles(const glm::vec3& cameraPos);

    std::vector<Particle> m_particles;
    int m_maxParticles;
    int m_lastUsed = 0;
    bool m_emitting = false;
    glm::vec3 m_emitterPos = glm::vec3(0.0f);
    float m_emitTimer = 0.0f;

    unsigned int m_vao = 0;
    unsigned int m_vbo = 0;
    Shader m_shader;
};

} // namespace trioz
