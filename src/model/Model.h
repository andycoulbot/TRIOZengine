#pragma once

#include "renderer/Mesh.h"
#include "renderer/Shader.h"
#include "renderer/Texture.h"
#include <string>
#include <vector>
#include <glm/glm.hpp>

struct aiNode;
struct aiScene;
struct aiMesh;

namespace trioz {

class Light;

struct ModelMesh {
    Mesh mesh;
    std::vector<Texture> textures;
};

class Model {
public:
    Model() = default;
    explicit Model(const std::string& path);

    void render(const glm::mat4& projection, const glm::mat4& view,
                const glm::mat4& model, const Light& light, const glm::vec3& viewPos) const;
    void renderShadow(const Shader& shader, const glm::mat4& lightSpaceMatrix,
                      const glm::mat4& modelMatrix) const;

    bool isLoaded() const { return m_loaded; }

private:
    void loadModel(const std::string& path);
    void processNode(aiNode* node, const aiScene* scene);
    ModelMesh processMesh(aiMesh* mesh, const aiScene* scene);

    std::vector<ModelMesh> m_meshes;
    Shader m_shader;
    std::string m_directory;
    bool m_loaded = false;
};

} // namespace trioz
