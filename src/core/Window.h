#pragma once

#include <string>

struct GLFWwindow;

namespace trioz {

class Window {
public:
    Window(int width, int height, const std::string& title);
    ~Window();

    bool shouldClose() const;
    void swapBuffers();
    void pollEvents();

    int getWidth() const { return m_width; }
    int getHeight() const { return m_height; }
    GLFWwindow* getHandle() const { return m_handle; }

private:
    GLFWwindow* m_handle = nullptr;
    int m_width;
    int m_height;

    static void framebufferSizeCallback(GLFWwindow* window, int width, int height);
};

} // namespace trioz
