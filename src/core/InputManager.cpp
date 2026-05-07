#include "core/InputManager.h"
#include <GLFW/glfw3.h>
#include <cstring>

namespace trioz {

InputManager::InputManager(GLFWwindow* window) : m_window(window) {
    glfwSetWindowUserPointer(window, this);
    glfwSetScrollCallback(window, scrollCallback);
    glfwSetInputMode(window, GLFW_CURSOR, GLFW_CURSOR_DISABLED);
    std::memset(m_keys, 0, sizeof(m_keys));
    std::memset(m_prevKeys, 0, sizeof(m_prevKeys));
}

void InputManager::update() {
    std::memcpy(m_prevKeys, m_keys, sizeof(m_keys));

    for (int i = 0; i < 512; ++i) {
        m_keys[i] = glfwGetKey(m_window, i) == GLFW_PRESS;
    }

    double mx, my;
    glfwGetCursorPos(m_window, &mx, &my);
    m_mousePos = glm::vec2(static_cast<float>(mx), static_cast<float>(my));

    if (m_firstMouse) {
        m_lastMousePos = m_mousePos;
        m_firstMouse = false;
    }

    m_mouseDelta = m_mousePos - m_lastMousePos;
    m_lastMousePos = m_mousePos;
}

bool InputManager::isKeyPressed(int key) const {
    return key >= 0 && key < 512 && m_keys[key];
}

bool InputManager::isKeyJustPressed(int key) const {
    return key >= 0 && key < 512 && m_keys[key] && !m_prevKeys[key];
}

bool InputManager::isMouseButtonPressed(int button) const {
    return glfwGetMouseButton(m_window, button) == GLFW_PRESS;
}

glm::vec2 InputManager::getMousePosition() const {
    return m_mousePos;
}

glm::vec2 InputManager::getMouseDelta() const {
    return m_mouseDelta;
}

float InputManager::getScrollDelta() const {
    return m_scrollDelta;
}

void InputManager::setCursorLocked(bool locked) {
    m_cursorLocked = locked;
    glfwSetInputMode(m_window, GLFW_CURSOR,
        locked ? GLFW_CURSOR_DISABLED : GLFW_CURSOR_NORMAL);
}

void InputManager::scrollCallback(GLFWwindow* window, double /*xoff*/, double yoff) {
    auto* input = static_cast<InputManager*>(glfwGetWindowUserPointer(window));
    input->m_scrollDelta = static_cast<float>(yoff);
}

} // namespace trioz
