#pragma once

#include <string>
#include <memory>

namespace trioz {

class Window;
class InputManager;
class Timer;

class Engine {
public:
    Engine(int width, int height, const std::string& title);
    ~Engine();

    void run();
    void stop();

    Window& getWindow();
    InputManager& getInput();
    Timer& getTimer();

    static Engine& instance();

private:
    void init();
    void mainLoop();
    void cleanup();

    std::unique_ptr<Window> m_window;
    std::unique_ptr<InputManager> m_input;
    std::unique_ptr<Timer> m_timer;

    bool m_running = false;

    static Engine* s_instance;
};

} // namespace trioz
