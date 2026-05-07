#include "core/Window.h"
#include <glad/gl.h>
#include <GLFW/glfw3.h>
#include <stdexcept>

namespace trioz {

Window::Window(int width, int height, const std::string& title)
    : m_width(width), m_height(height) {
    if (!glfwInit())
        throw std::runtime_error("Failed to initialize GLFW");

    glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 4);
    glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 5);
    glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
    glfwWindowHint(GLFW_SAMPLES, 4);

    m_handle = glfwCreateWindow(width, height, title.c_str(), nullptr, nullptr);
    if (!m_handle) {
        glfwTerminate();
        throw std::runtime_error("Failed to create GLFW window");
    }

    glfwMakeContextCurrent(m_handle);
    glfwSetWindowUserPointer(m_handle, this);
    glfwSetFramebufferSizeCallback(m_handle, framebufferSizeCallback);
    glfwSwapInterval(1);

    int version = gladLoadGL(glfwGetProcAddress);
    if (!version)
        throw std::runtime_error("Failed to initialize GLAD");

    glEnable(GL_MULTISAMPLE);
    glViewport(0, 0, width, height);
}

Window::~Window() {
    if (m_handle)
        glfwDestroyWindow(m_handle);
}

bool Window::shouldClose() const {
    return glfwWindowShouldClose(m_handle);
}

void Window::swapBuffers() {
    glfwSwapBuffers(m_handle);
}

void Window::pollEvents() {
    glfwPollEvents();
}

void Window::framebufferSizeCallback(GLFWwindow* window, int width, int height) {
    auto* win = static_cast<Window*>(glfwGetWindowUserPointer(window));
    win->m_width = width;
    win->m_height = height;
    glViewport(0, 0, width, height);
}

} // namespace trioz
