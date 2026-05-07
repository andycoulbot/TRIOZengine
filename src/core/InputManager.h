#pragma once

#include <glm/glm.hpp>

struct GLFWwindow;

namespace trioz {

class InputManager {
public:
    explicit InputManager(GLFWwindow* window);

    void update();

    bool isKeyPressed(int key) const;
    bool isKeyJustPressed(int key) const;
    bool isMouseButtonPressed(int button) const;
    bool isMouseButtonJustPressed(int button) const;

    glm::vec2 getMousePosition() const;
    glm::vec2 getMouseDelta() const;
    float getScrollDelta() const;

    void setCursorLocked(bool locked);
    bool isCursorLocked() const { return m_cursorLocked; }

private:
    GLFWwindow* m_window;
    bool m_cursorLocked = false;

    bool m_keys[512] = {};
    bool m_prevKeys[512] = {};

    bool m_mouseButtons[8] = {};
    bool m_prevMouseButtons[8] = {};

    glm::vec2 m_mousePos = glm::vec2(0.0f);
    glm::vec2 m_lastMousePos = glm::vec2(0.0f);
    glm::vec2 m_mouseDelta = glm::vec2(0.0f);
    bool m_firstMouse = true;
    float m_scrollDelta = 0.0f;

    static void scrollCallback(GLFWwindow* window, double xoff, double yoff);
};

} // namespace trioz
