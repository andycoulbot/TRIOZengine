#version 450 core

in vec3 WorldPos;
out vec4 FragColor;

void main() {
    vec3 dir = normalize(WorldPos);

    // Procedural sky gradient
    float t = dir.y * 0.5 + 0.5; // 0 at bottom, 1 at top

    // Day sky colors
    vec3 horizonColor = vec3(0.8, 0.85, 0.92);
    vec3 zenithColor = vec3(0.25, 0.5, 0.85);
    vec3 groundColor = vec3(0.4, 0.35, 0.3);

    vec3 sky;
    if (t > 0.5) {
        float s = (t - 0.5) * 2.0;
        sky = mix(horizonColor, zenithColor, s);
    } else {
        float s = t * 2.0;
        sky = mix(groundColor, horizonColor, s);
    }

    // Simple sun disc
    vec3 sunDir = normalize(vec3(0.5, 0.6, 0.3));
    float sunDot = max(dot(dir, sunDir), 0.0);
    float sunDisc = smoothstep(0.997, 0.999, sunDot);
    vec3 sunColor = vec3(1.0, 0.95, 0.8);
    sky += sunColor * sunDisc * 3.0;

    // Sun glow
    float sunGlow = pow(sunDot, 32.0);
    sky += vec3(1.0, 0.8, 0.4) * sunGlow * 0.3;

    FragColor = vec4(sky, 1.0);
}
