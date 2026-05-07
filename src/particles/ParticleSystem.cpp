#include "particles/ParticleSystem.h"
#include <glad/gl.h>
#include <algorithm>
#include <cstdlib>

namespace trioz {

ParticleSystem::ParticleSystem(int maxParticles) : m_maxParticles(maxParticles) {
    m_particles.resize(maxParticles);
    for (auto& p : m_particles) {
        p.active = false;
        p.life = 0.0f;
    }

    m_shader = Shader("assets/shaders/particles/particle.vert", "assets/shaders/particles/particle.frag");

    float quadVertices[] = {
        -0.5f, -0.5f, 0.0f, 0.0f,
         0.5f, -0.5f, 1.0f, 0.0f,
        -0.5f,  0.5f, 0.0f, 1.0f,
         0.5f,  0.5f, 1.0f, 1.0f,
    };

    glGenVertexArrays(1, &m_vao);
    glGenBuffers(1, &m_vbo);
    glBindVertexArray(m_vao);
    glBindBuffer(GL_ARRAY_BUFFER, m_vbo);
    glBufferData(GL_ARRAY_BUFFER, sizeof(quadVertices), quadVertices, GL_STATIC_DRAW);
    glEnableVertexAttribArray(0);
    glVertexAttribPointer(0, 2, GL_FLOAT, GL_FALSE, 4 * sizeof(float), nullptr);
    glEnableVertexAttribArray(1);
    glVertexAttribPointer(1, 2, GL_FLOAT, GL_FALSE, 4 * sizeof(float), (void*)(2 * sizeof(float)));
    glBindVertexArray(0);
}

ParticleSystem::~ParticleSystem() {
    if (m_vao) glDeleteVertexArrays(1, &m_vao);
    if (m_vbo) glDeleteBuffers(1, &m_vbo);
}

void ParticleSystem::emit(const glm::vec3& position, const glm::vec3& velocity,
                          const glm::vec4& color, float life, float size) {
    int idx = findUnusedParticle();
    if (idx < 0) return;

    auto& p = m_particles[idx];
    p.position = position;
    p.velocity = velocity;
    p.color = color;
    p.life = life;
    p.maxLife = life;
    p.size = size;
    p.active = true;
}

void ParticleSystem::update(float dt, const glm::vec3& cameraPos) {
    for (auto& p : m_particles) {
        if (!p.active) continue;
        p.life -= dt;
        if (p.life <= 0.0f) {
            p.active = false;
            continue;
        }
        p.position += p.velocity * dt;
        float lifeRatio = p.life / p.maxLife;
        p.color.a = lifeRatio;
    }
    sortParticles(cameraPos);
}

void ParticleSystem::render(const glm::mat4& projection, const glm::mat4& view) const {
    glEnable(GL_BLEND);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
    glDepthMask(GL_FALSE);

    m_shader.use();
    m_shader.setMat4("projection", projection);
    m_shader.setMat4("view", view);

    glm::vec3 camRight = glm::vec3(view[0][0], view[1][0], view[2][0]);
    glm::vec3 camUp = glm::vec3(view[0][1], view[1][1], view[2][1]);
    m_shader.setVec3("cameraRight", camRight);
    m_shader.setVec3("cameraUp", camUp);

    glBindVertexArray(m_vao);

    for (const auto& p : m_particles) {
        if (!p.active) continue;
        m_shader.setVec3("particlePos", p.position);
        m_shader.setVec4("particleColor", p.color);
        m_shader.setFloat("particleSize", p.size);
        glDrawArrays(GL_TRIANGLE_STRIP, 0, 4);
    }

    glBindVertexArray(0);
    glDepthMask(GL_TRUE);
}

int ParticleSystem::findUnusedParticle() {
    for (int i = m_lastUsed; i < m_maxParticles; i++) {
        if (!m_particles[i].active) {
            m_lastUsed = i;
            return i;
        }
    }
    for (int i = 0; i < m_lastUsed; i++) {
        if (!m_particles[i].active) {
            m_lastUsed = i;
            return i;
        }
    }
    return -1;
}

void ParticleSystem::sortParticles(const glm::vec3& cameraPos) {
    std::sort(m_particles.begin(), m_particles.end(),
        [&cameraPos](const Particle& a, const Particle& b) {
            if (!a.active && !b.active) return false;
            if (!a.active) return false;
            if (!b.active) return true;
            float distA = glm::length(cameraPos - a.position);
            float distB = glm::length(cameraPos - b.position);
            return distA > distB;
        });
}

int ParticleSystem::getActiveCount() const {
    int count = 0;
    for (const auto& p : m_particles) {
        if (p.active) count++;
    }
    return count;
}

} // namespace trioz
