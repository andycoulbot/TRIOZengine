#version 450 core

in vec3 FragPos;
in vec2 TexCoords;
in vec4 ClipSpaceCoords;

out vec4 FragColor;

struct DirLight {
    vec3 direction;
    vec3 ambient;
    vec3 diffuse;
};

uniform DirLight light;
uniform vec3 viewPos;
uniform float time;
uniform sampler2D reflectionTex;
uniform sampler2D refractionTex;

void main() {
    vec2 ndc = (ClipSpaceCoords.xy / ClipSpaceCoords.w) * 0.5 + 0.5;

    // DuDv-style distortion
    float distortion = 0.02;
    vec2 distortedCoords = ndc;
    distortedCoords.x += sin(TexCoords.y * 40.0 + time * 3.0) * distortion;
    distortedCoords.y += cos(TexCoords.x * 40.0 + time * 2.5) * distortion;
    distortedCoords = clamp(distortedCoords, 0.001, 0.999);

    vec3 reflectColor = texture(reflectionTex, vec2(distortedCoords.x, 1.0 - distortedCoords.y)).rgb;
    vec3 refractColor = texture(refractionTex, distortedCoords).rgb;

    // Fresnel effect
    vec3 viewDir = normalize(viewPos - FragPos);
    vec3 normal = vec3(0.0, 1.0, 0.0);
    float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0);
    fresnel = clamp(fresnel, 0.0, 1.0);

    vec3 waterColor = mix(refractColor, reflectColor, fresnel);

    // Tint water slightly blue-green
    waterColor = mix(waterColor, vec3(0.0, 0.3, 0.5), 0.15);

    // Specular highlights
    vec3 lightDir = normalize(-light.direction);
    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(normal, halfDir), 0.0), 128.0);
    vec3 specular = light.diffuse * spec * 0.8;

    waterColor += specular;

    // Distance fog
    float dist = length(viewPos - FragPos);
    float fogFactor = clamp(exp(-dist * 0.002), 0.0, 1.0);
    vec3 fogColor = vec3(0.7, 0.75, 0.85);
    waterColor = mix(fogColor, waterColor, fogFactor);

    FragColor = vec4(waterColor, 0.85);
}
