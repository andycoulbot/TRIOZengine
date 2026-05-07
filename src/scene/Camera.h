#pragma once

#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>

namespace trioz {

class InputManager;
class Terrain;

class Camera {
public:
    explicit Camera(const glm::vec3& position = glm::vec3(0.0f, 50.0f, 0.0f));

    void updateFreeCamera(const InputManager& input, float dt);
    void updateFPSCamera(const InputManager& input, float dt, const Terrain& terrain);

    glm::mat4 getViewMatrix() const;
    glm::mat4 getProjectionMatrix(float aspect) const;

    glm::vec3 getPosition() const { return m_position; }
    void setPosition(const glm::vec3& pos) { m_position = pos; }
    glm::vec3 getFront() const { return m_front; }
    glm::vec3 getUp() const { return m_up; }
    float getYaw() const { return m_yaw; }
    float getPitch() const { return m_pitch; }
    float getNearPlane() const { return m_near; }
    float getFarPlane() const { return m_far; }
    float getFOV() const { return m_fov; }

    void invertPitch();

private:
    void updateVectors();

    glm::vec3 m_position;
    glm::vec3 m_front = glm::vec3(0.0f, 0.0f, -1.0f);
    glm::vec3 m_up = glm::vec3(0.0f, 1.0f, 0.0f);
    glm::vec3 m_right = glm::vec3(1.0f, 0.0f, 0.0f);
    glm::vec3 m_worldUp = glm::vec3(0.0f, 1.0f, 0.0f);

    float m_yaw = -90.0f;
    float m_pitch = 0.0f;
    float m_speed = 50.0f;
    float m_sensitivity = 0.1f;
    float m_fov = 60.0f;
    float m_near = 0.1f;
    float m_far = 2000.0f;
    float m_playerHeight = 5.0f;
};

} // namespace trioz
