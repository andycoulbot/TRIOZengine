#include "renderer/Shader.h"
#include <glad/gl.h>
#include <fstream>
#include <sstream>
#include <iostream>

namespace trioz {

Shader::Shader(const std::string& vertexPath, const std::string& fragmentPath) {
    std::string vCode = readFile(vertexPath);
    std::string fCode = readFile(fragmentPath);

    unsigned int vShader = compileShader(vCode, GL_VERTEX_SHADER);
    unsigned int fShader = compileShader(fCode, GL_FRAGMENT_SHADER);

    m_id = glCreateProgram();
    glAttachShader(m_id, vShader);
    glAttachShader(m_id, fShader);
    glLinkProgram(m_id);

    int success;
    glGetProgramiv(m_id, GL_LINK_STATUS, &success);
    if (!success) {
        char log[1024];
        glGetProgramInfoLog(m_id, 1024, nullptr, log);
        std::cerr << "Shader link error: " << log << std::endl;
    }

    glDeleteShader(vShader);
    glDeleteShader(fShader);
}

Shader::Shader(const std::string& vertexPath, const std::string& geometryPath,
               const std::string& fragmentPath) {
    std::string vCode = readFile(vertexPath);
    std::string gCode = readFile(geometryPath);
    std::string fCode = readFile(fragmentPath);

    unsigned int vShader = compileShader(vCode, GL_VERTEX_SHADER);
    unsigned int gShader = compileShader(gCode, GL_GEOMETRY_SHADER);
    unsigned int fShader = compileShader(fCode, GL_FRAGMENT_SHADER);

    m_id = glCreateProgram();
    glAttachShader(m_id, vShader);
    glAttachShader(m_id, gShader);
    glAttachShader(m_id, fShader);
    glLinkProgram(m_id);

    int success;
    glGetProgramiv(m_id, GL_LINK_STATUS, &success);
    if (!success) {
        char log[1024];
        glGetProgramInfoLog(m_id, 1024, nullptr, log);
        std::cerr << "Shader link error: " << log << std::endl;
    }

    glDeleteShader(vShader);
    glDeleteShader(gShader);
    glDeleteShader(fShader);
}

void Shader::use() const {
    glUseProgram(m_id);
}

std::string Shader::readFile(const std::string& path) const {
    std::ifstream file(path);
    if (!file.is_open()) {
        std::cerr << "Failed to open shader file: " << path << std::endl;
        return "";
    }
    std::stringstream ss;
    ss << file.rdbuf();
    return ss.str();
}

unsigned int Shader::compileShader(const std::string& source, unsigned int type) const {
    unsigned int shader = glCreateShader(type);
    const char* src = source.c_str();
    glShaderSource(shader, 1, &src, nullptr);
    glCompileShader(shader);

    int success;
    glGetShaderiv(shader, GL_COMPILE_STATUS, &success);
    if (!success) {
        char log[1024];
        glGetShaderInfoLog(shader, 1024, nullptr, log);
        const char* typeName = (type == GL_VERTEX_SHADER) ? "VERTEX" :
                               (type == GL_FRAGMENT_SHADER) ? "FRAGMENT" : "GEOMETRY";
        std::cerr << typeName << " shader compile error: " << log << std::endl;
    }
    return shader;
}

void Shader::setBool(const std::string& name, bool value) const {
    glUniform1i(glGetUniformLocation(m_id, name.c_str()), static_cast<int>(value));
}

void Shader::setInt(const std::string& name, int value) const {
    glUniform1i(glGetUniformLocation(m_id, name.c_str()), value);
}

void Shader::setFloat(const std::string& name, float value) const {
    glUniform1f(glGetUniformLocation(m_id, name.c_str()), value);
}

void Shader::setVec2(const std::string& name, const glm::vec2& v) const {
    glUniform2fv(glGetUniformLocation(m_id, name.c_str()), 1, &v[0]);
}

void Shader::setVec3(const std::string& name, const glm::vec3& v) const {
    glUniform3fv(glGetUniformLocation(m_id, name.c_str()), 1, &v[0]);
}

void Shader::setVec4(const std::string& name, const glm::vec4& v) const {
    glUniform4fv(glGetUniformLocation(m_id, name.c_str()), 1, &v[0]);
}

void Shader::setMat4(const std::string& name, const glm::mat4& m) const {
    glUniformMatrix4fv(glGetUniformLocation(m_id, name.c_str()), 1, GL_FALSE, &m[0][0]);
}

void Shader::linkProgram(unsigned int vertex, unsigned int fragment, unsigned int geometry) const {
    (void)vertex; (void)fragment; (void)geometry;
}

} // namespace trioz
