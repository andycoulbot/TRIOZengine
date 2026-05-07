#pragma once

#include <string>
#include <vector>

namespace trioz {

class Texture {
public:
    Texture() = default;
    explicit Texture(const std::string& path, bool srgb = false);

    void bind(unsigned int unit = 0) const;
    unsigned int getID() const { return m_id; }
    int getWidth() const { return m_width; }
    int getHeight() const { return m_height; }

    static unsigned int loadCubemap(const std::vector<std::string>& faces);

private:
    unsigned int m_id = 0;
    int m_width = 0;
    int m_height = 0;
};

} // namespace trioz
