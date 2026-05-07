#pragma once

#include <string>
#include <glm/glm.hpp>

namespace trioz {

class Shader {
public:
    Shader() = default;
    Shader(const std::string& vertexPath, const std::string& fragmentPath);
    Shader(const std::string& vertexPath, const std::string& geometryPath, const std::string& fragmentPath);

    void use() const;
    unsigned int getID() const { return m_id; }

    void setBool(const std::string& name, bool value) const;
    void setInt(const std::string& name, int value) const;
    void setFloat(const std::string& name, float value) const;
    void setVec2(const std::string& name, const glm::vec2& v) const;
    void setVec3(const std::string& name, const glm::vec3& v) const;
    void setVec4(const std::string& name, const glm::vec4& v) const;
    void setMat4(const std::string& name, const glm::mat4& m) const;

private:
    unsigned int m_id = 0;

    std::string readFile(const std::string& path) const;
    unsigned int compileShader(const std::string& source, unsigned int type) const;
    void linkProgram(unsigned int vertex, unsigned int fragment, unsigned int geometry = 0) const;
};

} // namespace trioz
