#pragma once

namespace trioz {

class Timer {
public:
    Timer();

    void update();

    float getDeltaTime() const { return m_deltaTime; }
    float getTotalTime() const { return m_totalTime; }
    float getFPS() const { return m_fps; }
    int getFrameCount() const { return m_frameCount; }

private:
    float m_deltaTime = 0.0f;
    float m_totalTime = 0.0f;
    float m_lastFrame = 0.0f;
    float m_fps = 0.0f;

    int m_frameCount = 0;
    float m_fpsTimer = 0.0f;
    int m_fpsFrames = 0;
};

} // namespace trioz
