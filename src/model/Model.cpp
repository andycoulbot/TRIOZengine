#include "model/Model.h"
#include "lighting/Light.h"

#include <assimp/Importer.hpp>
#include <assimp/scene.h>
#include <assimp/postprocess.h>
#include <iostream>

namespace trioz {

Model::Model(const std::string& path) {
    m_shader = Shader("assets/shaders/terrain/terrain.vert", "assets/shaders/terrain/terrain.frag");
    loadModel(path);
}

void Model::loadModel(const std::string& path) {
    Assimp::Importer importer;
    const aiScene* scene = importer.ReadFile(path,
        aiProcess_Triangulate | aiProcess_GenSmoothNormals |
        aiProcess_FlipUVs | aiProcess_CalcTangentSpace);

    if (!scene || scene->mFlags & AI_SCENE_FLAGS_INCOMPLETE || !scene->mRootNode) {
        std::cerr << "Assimp error: " << importer.GetErrorString() << std::endl;
        return;
    }

    m_directory = path.substr(0, path.find_last_of('/'));
    processNode(scene->mRootNode, scene);
    m_loaded = true;
}

void Model::processNode(aiNode* node, const aiScene* scene) {
    for (unsigned int i = 0; i < node->mNumMeshes; i++) {
        aiMesh* mesh = scene->mMeshes[node->mMeshes[i]];
        m_meshes.push_back(processMesh(mesh, scene));
    }
    for (unsigned int i = 0; i < node->mNumChildren; i++) {
        processNode(node->mChildren[i], scene);
    }
}

ModelMesh Model::processMesh(aiMesh* mesh, const aiScene* scene) {
    std::vector<Vertex> vertices;
    std::vector<unsigned int> indices;
    std::vector<Texture> textures;

    for (unsigned int i = 0; i < mesh->mNumVertices; i++) {
        Vertex vertex{};
        vertex.position = glm::vec3(mesh->mVertices[i].x, mesh->mVertices[i].y, mesh->mVertices[i].z);

        if (mesh->HasNormals()) {
            vertex.normal = glm::vec3(mesh->mNormals[i].x, mesh->mNormals[i].y, mesh->mNormals[i].z);
        }

        if (mesh->mTextureCoords[0]) {
            vertex.texCoords = glm::vec2(mesh->mTextureCoords[0][i].x, mesh->mTextureCoords[0][i].y);
        }

        if (mesh->HasTangentsAndBitangents()) {
            vertex.tangent = glm::vec3(mesh->mTangents[i].x, mesh->mTangents[i].y, mesh->mTangents[i].z);
        }

        vertices.push_back(vertex);
    }

    for (unsigned int i = 0; i < mesh->mNumFaces; i++) {
        aiFace face = mesh->mFaces[i];
        for (unsigned int j = 0; j < face.mNumIndices; j++) {
            indices.push_back(face.mIndices[j]);
        }
    }

    if (mesh->mMaterialIndex >= 0) {
        aiMaterial* material = scene->mMaterials[mesh->mMaterialIndex];
        aiString texPath;
        if (material->GetTexture(aiTextureType_DIFFUSE, 0, &texPath) == AI_SUCCESS) {
            std::string fullPath = m_directory + "/" + texPath.C_Str();
            textures.emplace_back(fullPath, true);
        }
    }

    ModelMesh result;
    result.mesh = Mesh(vertices, indices);
    result.textures = std::move(textures);
    return result;
}

void Model::render(const glm::mat4& projection, const glm::mat4& view,
                   const glm::mat4& modelMat, const Light& light, const glm::vec3& viewPos) const {
    m_shader.use();
    m_shader.setMat4("projection", projection);
    m_shader.setMat4("view", view);
    m_shader.setMat4("model", modelMat);
    m_shader.setVec3("viewPos", viewPos);
    m_shader.setVec3("light.direction", light.direction);
    m_shader.setVec3("light.ambient", light.ambient);
    m_shader.setVec3("light.diffuse", light.diffuse);
    m_shader.setVec3("light.specular", light.specular);

    for (const auto& m : m_meshes) {
        if (!m.textures.empty()) {
            m.textures[0].bind(0);
            m_shader.setInt("grassTex", 0);
        }
        m.mesh.draw();
    }
}

void Model::renderShadow(const Shader& shader, const glm::mat4& lightSpaceMatrix,
                          const glm::mat4& modelMatrix) const {
    shader.use();
    shader.setMat4("lightSpaceMatrix", lightSpaceMatrix);
    shader.setMat4("model", modelMatrix);
    for (const auto& m : m_meshes) {
        m.mesh.draw();
    }
}

} // namespace trioz
