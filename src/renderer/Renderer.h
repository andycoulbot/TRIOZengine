#pragma once

namespace trioz {

class Renderer {
public:
    Renderer() = default;

    void clear() const;
    void setClearColor(float r, float g, float b, float a = 1.0f) const;
};

} // namespace trioz
