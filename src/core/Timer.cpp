#include "core/Timer.h"
#include <GLFW/glfw3.h>

namespace trioz {

Timer::Timer() {
    m_lastFrame = static_cast<float>(glfwGetTime());
}

void Timer::update() {
    float currentFrame = static_cast<float>(glfwGetTime());
    m_deltaTime = currentFrame - m_lastFrame;
    m_lastFrame = currentFrame;
    m_totalTime += m_deltaTime;
    m_frameCount++;

    m_fpsTimer += m_deltaTime;
    m_fpsFrames++;
    if (m_fpsTimer >= 1.0f) {
        m_fps = static_cast<float>(m_fpsFrames) / m_fpsTimer;
        m_fpsFrames = 0;
        m_fpsTimer = 0.0f;
    }
}

} // namespace trioz
