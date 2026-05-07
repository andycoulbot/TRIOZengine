#include "scene/Camera.h"
#include "core/InputManager.h"
#include "terrain/Terrain.h"
#include <GLFW/glfw3.h>
#include <algorithm>

namespace trioz {

Camera::Camera(const glm::vec3& position) : m_position(position) {
    updateVectors();
}

void Camera::updateFreeCamera(const InputManager& input, float dt) {
    glm::vec2 delta = input.getMouseDelta();
    m_yaw += delta.x * m_sensitivity;
    m_pitch -= delta.y * m_sensitivity;
    m_pitch = std::clamp(m_pitch, -89.0f, 89.0f);
    updateVectors();

    float speed = m_speed;
    if (input.isKeyPressed(GLFW_KEY_LEFT_SHIFT))
        speed *= 3.0f;

    float scrollDelta = input.getScrollDelta();
    m_speed = std::clamp(m_speed + scrollDelta * 5.0f, 5.0f, 500.0f);

    if (input.isKeyPressed(GLFW_KEY_W)) m_position += m_front * speed * dt;
    if (input.isKeyPressed(GLFW_KEY_S)) m_position -= m_front * speed * dt;
    if (input.isKeyPressed(GLFW_KEY_A)) m_position -= m_right * speed * dt;
    if (input.isKeyPressed(GLFW_KEY_D)) m_position += m_right * speed * dt;
    if (input.isKeyPressed(GLFW_KEY_SPACE)) m_position += m_worldUp * speed * dt;
    if (input.isKeyPressed(GLFW_KEY_LEFT_CONTROL)) m_position -= m_worldUp * speed * dt;
}

void Camera::updateFPSCamera(const InputManager& input, float dt, const Terrain& terrain) {
    glm::vec2 delta = input.getMouseDelta();
    m_yaw += delta.x * m_sensitivity;
    m_pitch -= delta.y * m_sensitivity;
    m_pitch = std::clamp(m_pitch, -89.0f, 89.0f);
    updateVectors();

    float speed = m_speed;
    if (input.isKeyPressed(GLFW_KEY_LEFT_SHIFT))
        speed *= 2.0f;

    glm::vec3 flatFront = glm::normalize(glm::vec3(m_front.x, 0.0f, m_front.z));
    glm::vec3 flatRight = glm::normalize(glm::cross(flatFront, m_worldUp));

    if (input.isKeyPressed(GLFW_KEY_W)) m_position += flatFront * speed * dt;
    if (input.isKeyPressed(GLFW_KEY_S)) m_position -= flatFront * speed * dt;
    if (input.isKeyPressed(GLFW_KEY_A)) m_position -= flatRight * speed * dt;
    if (input.isKeyPressed(GLFW_KEY_D)) m_position += flatRight * speed * dt;

    float terrainHeight = terrain.getHeightAt(m_position.x, m_position.z);
    m_position.y = terrainHeight + m_playerHeight;
}

glm::mat4 Camera::getViewMatrix() const {
    return glm::lookAt(m_position, m_position + m_front, m_up);
}

glm::mat4 Camera::getProjectionMatrix(float aspect) const {
    return glm::perspective(glm::radians(m_fov), aspect, m_near, m_far);
}

void Camera::updateMovementOnly(const InputManager& input, float dt) {
    float speed = m_speed;
    if (input.isKeyPressed(GLFW_KEY_LEFT_SHIFT))
        speed *= 3.0f;

    if (input.isKeyPressed(GLFW_KEY_W)) m_position += m_front * speed * dt;
    if (input.isKeyPressed(GLFW_KEY_S)) m_position -= m_front * speed * dt;
    if (input.isKeyPressed(GLFW_KEY_A)) m_position -= m_right * speed * dt;
    if (input.isKeyPressed(GLFW_KEY_D)) m_position += m_right * speed * dt;
    if (input.isKeyPressed(GLFW_KEY_SPACE)) m_position += m_worldUp * speed * dt;
    if (input.isKeyPressed(GLFW_KEY_LEFT_CONTROL)) m_position -= m_worldUp * speed * dt;
}

void Camera::invertPitch() {
    m_pitch = -m_pitch;
    updateVectors();
}

void Camera::updateVectors() {
    glm::vec3 front;
    front.x = cos(glm::radians(m_yaw)) * cos(glm::radians(m_pitch));
    front.y = sin(glm::radians(m_pitch));
    front.z = sin(glm::radians(m_yaw)) * cos(glm::radians(m_pitch));
    m_front = glm::normalize(front);
    m_right = glm::normalize(glm::cross(m_front, m_worldUp));
    m_up = glm::normalize(glm::cross(m_right, m_front));
}

} // namespace trioz
