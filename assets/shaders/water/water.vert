#version 450 core

layout (location = 0) in vec3 aPos;

out vec3 FragPos;
out vec2 TexCoords;
out vec4 ClipSpaceCoords;

uniform mat4 model;
uniform mat4 view;
uniform mat4 projection;
uniform float time;
uniform float waterHeight;

void main() {
    vec3 pos = aPos;

    // Vertex displacement for waves
    float wave1 = sin(pos.x * 0.1 + time * 2.0) * 0.3;
    float wave2 = sin(pos.z * 0.15 + time * 1.5) * 0.2;
    float wave3 = sin((pos.x + pos.z) * 0.08 + time * 2.5) * 0.15;
    pos.y = waterHeight + wave1 + wave2 + wave3;

    vec4 worldPos = model * vec4(pos, 1.0);
    FragPos = worldPos.xyz;
    TexCoords = vec2(pos.x / 100.0, pos.z / 100.0);
    ClipSpaceCoords = projection * view * worldPos;
    gl_Position = ClipSpaceCoords;
}
