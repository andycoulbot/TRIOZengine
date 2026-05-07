#version 450 core

in vec2 TexCoords;
in vec4 ParticleColor;

out vec4 FragColor;

void main() {
    // Soft circle shape
    float dist = length(TexCoords - vec2(0.5));
    float alpha = 1.0 - smoothstep(0.3, 0.5, dist);

    FragColor = vec4(ParticleColor.rgb, ParticleColor.a * alpha);

    if (FragColor.a < 0.01)
        discard;
}
