#pragma once

#include <vector>
#include <glm/glm.hpp>

namespace trioz {

struct Vertex {
    glm::vec3 position;
    glm::vec3 normal;
    glm::vec2 texCoords;
    glm::vec3 tangent;
};

class Mesh {
public:
    Mesh() = default;
    Mesh(const std::vector<Vertex>& vertices, const std::vector<unsigned int>& indices);
    ~Mesh();

    Mesh(Mesh&& other) noexcept;
    Mesh& operator=(Mesh&& other) noexcept;
    Mesh(const Mesh&) = delete;
    Mesh& operator=(const Mesh&) = delete;

    void draw() const;
    void drawInstanced(int count) const;

    unsigned int getVAO() const { return m_vao; }
    size_t getIndexCount() const { return m_indexCount; }

private:
    unsigned int m_vao = 0;
    unsigned int m_vbo = 0;
    unsigned int m_ebo = 0;
    size_t m_indexCount = 0;

    void setup(const std::vector<Vertex>& vertices, const std::vector<unsigned int>& indices);
};

} // namespace trioz
