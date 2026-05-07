#version 450 core

in vec3 FragPos;
in vec3 Normal;
in vec2 TexCoords;
in vec4 FragPosLightSpace;
in float Height;

out vec4 FragColor;

struct DirLight {
    vec3 direction;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};

uniform DirLight light;
uniform vec3 viewPos;
uniform float maxHeight;
uniform sampler2D shadowMap;

uniform bool useBrush;
uniform vec3 brushPos;
uniform float brushRadius;

float calcShadow(vec4 fragPosLightSpace) {
    vec3 projCoords = fragPosLightSpace.xyz / fragPosLightSpace.w;
    projCoords = projCoords * 0.5 + 0.5;

    if (projCoords.z > 1.0)
        return 0.0;

    float currentDepth = projCoords.z;
    float bias = max(0.005 * (1.0 - dot(normalize(Normal), normalize(-light.direction))), 0.001);

    float shadow = 0.0;
    vec2 texelSize = 1.0 / textureSize(shadowMap, 0);
    for (int x = -2; x <= 2; ++x) {
        for (int y = -2; y <= 2; ++y) {
            float pcfDepth = texture(shadowMap, projCoords.xy + vec2(x, y) * texelSize).r;
            shadow += currentDepth - bias > pcfDepth ? 1.0 : 0.0;
        }
    }
    shadow /= 25.0;
    return shadow;
}

void main() {
    float heightNorm = clamp(Height / max(maxHeight, 1.0), -1.0, 1.0);
    float slope = 1.0 - dot(normalize(Normal), vec3(0.0, 1.0, 0.0));

    vec3 sandColor = vec3(0.76, 0.70, 0.50);
    vec3 grassColor = vec3(0.30, 0.55, 0.20);
    vec3 darkGrass = vec3(0.20, 0.40, 0.15);
    vec3 rockColor = vec3(0.45, 0.42, 0.38);
    vec3 snowColor = vec3(0.95, 0.95, 0.97);
    vec3 dirtColor = vec3(0.55, 0.40, 0.25);
    vec3 waterEdge = vec3(0.40, 0.55, 0.45);

    vec3 texColor;
    if (heightNorm < 0.02) {
        texColor = mix(waterEdge, sandColor, smoothstep(-0.02, 0.02, heightNorm));
    } else if (heightNorm < 0.08) {
        texColor = mix(sandColor, grassColor, smoothstep(0.02, 0.08, heightNorm));
    } else if (heightNorm < 0.35) {
        texColor = mix(grassColor, darkGrass, smoothstep(0.08, 0.35, heightNorm));
    } else if (heightNorm < 0.55) {
        texColor = mix(darkGrass, rockColor, smoothstep(0.35, 0.55, heightNorm));
    } else if (heightNorm < 0.75) {
        texColor = mix(rockColor, snowColor, smoothstep(0.55, 0.75, heightNorm));
    } else {
        texColor = snowColor;
    }

    if (slope > 0.35) {
        float slopeFactor = smoothstep(0.35, 0.6, slope);
        texColor = mix(texColor, dirtColor, slopeFactor * 0.7);
    }

    vec3 norm = normalize(Normal);
    vec3 lightDir = normalize(-light.direction);

    vec3 ambient = light.ambient * texColor;

    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = light.diffuse * diff * texColor;

    vec3 viewDir = normalize(viewPos - FragPos);
    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(norm, halfDir), 0.0), 32.0);
    vec3 specular = light.specular * spec * 0.3;

    float shadow = calcShadow(FragPosLightSpace);
    vec3 result = ambient + (1.0 - shadow) * (diffuse + specular);

    float dist = length(viewPos - FragPos);
    float fogFactor = exp(-dist * 0.001);
    fogFactor = clamp(fogFactor, 0.0, 1.0);
    vec3 fogColor = vec3(0.7, 0.75, 0.85);
    result = mix(fogColor, result, fogFactor);

    if (useBrush) {
        float d = distance(FragPos.xz, brushPos.xz);
        if (d < brushRadius) {
            float edge = smoothstep(brushRadius, brushRadius * 0.85, d);
            float ring = smoothstep(brushRadius * 0.95, brushRadius, d);
            result = mix(result, vec3(1.0, 0.8, 0.2), edge * 0.25);
            result = mix(result, vec3(1.0, 1.0, 0.5), ring * 0.6);
        }
    }

    FragColor = vec4(result, 1.0);
}
