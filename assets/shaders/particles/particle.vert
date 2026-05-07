#version 450 core

layout (location = 0) in vec2 aPos;
layout (location = 1) in vec2 aTexCoords;

out vec2 TexCoords;
out vec4 ParticleColor;

uniform mat4 projection;
uniform mat4 view;
uniform vec3 particlePos;
uniform vec4 particleColor;
uniform float particleSize;
uniform vec3 cameraRight;
uniform vec3 cameraUp;

void main() {
    TexCoords = aTexCoords;
    ParticleColor = particleColor;

    vec3 worldPos = particlePos
        + cameraRight * aPos.x * particleSize
        + cameraUp * aPos.y * particleSize;

    gl_Position = projection * view * vec4(worldPos, 1.0);
}
