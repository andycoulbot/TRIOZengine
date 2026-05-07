#pragma once

namespace trioz {

class Framebuffer {
public:
    Framebuffer(int width, int height, bool depthOnly = false);
    ~Framebuffer();

    void bind() const;
    void unbind(int windowWidth, int windowHeight) const;

    unsigned int getColorTexture() const { return m_colorTexture; }
    unsigned int getDepthTexture() const { return m_depthTexture; }
    int getWidth() const { return m_width; }
    int getHeight() const { return m_height; }

private:
    unsigned int m_fbo = 0;
    unsigned int m_colorTexture = 0;
    unsigned int m_depthTexture = 0;
    unsigned int m_depthRBO = 0;
    int m_width;
    int m_height;
};

} // namespace trioz
