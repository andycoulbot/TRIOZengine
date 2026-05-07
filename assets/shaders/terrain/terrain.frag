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

uniform sampler2D grassTex;
uniform sampler2D rockTex;
uniform sampler2D sandTex;
uniform sampler2D snowTex;
uniform sampler2D shadowMap;

float calcShadow(vec4 fragPosLightSpace) {
    vec3 projCoords = fragPosLightSpace.xyz / fragPosLightSpace.w;
    projCoords = projCoords * 0.5 + 0.5;

    if (projCoords.z > 1.0)
        return 0.0;

    float closestDepth = texture(shadowMap, projCoords.xy).r;
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
    float heightNorm = clamp(Height / maxHeight, 0.0, 1.0);
    float slope = 1.0 - dot(normalize(Normal), vec3(0.0, 1.0, 0.0));

    vec3 sandColor = texture(sandTex, TexCoords).rgb;
    vec3 grassColor = texture(grassTex, TexCoords).rgb;
    vec3 rockColor = texture(rockTex, TexCoords).rgb;
    vec3 snowColor = texture(snowTex, TexCoords).rgb;

    // Blend based on height
    vec3 texColor;
    if (heightNorm < 0.15) {
        texColor = mix(sandColor, grassColor, smoothstep(0.05, 0.15, heightNorm));
    } else if (heightNorm < 0.5) {
        texColor = grassColor;
    } else if (heightNorm < 0.7) {
        texColor = mix(grassColor, rockColor, smoothstep(0.5, 0.7, heightNorm));
    } else if (heightNorm < 0.85) {
        texColor = mix(rockColor, snowColor, smoothstep(0.7, 0.85, heightNorm));
    } else {
        texColor = snowColor;
    }

    // Steep slopes -> rock
    if (slope > 0.4) {
        texColor = mix(texColor, rockColor, smoothstep(0.4, 0.7, slope));
    }

    // Lighting
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

    // Distance fog
    float dist = length(viewPos - FragPos);
    float fogFactor = exp(-dist * 0.002);
    fogFactor = clamp(fogFactor, 0.0, 1.0);
    vec3 fogColor = vec3(0.7, 0.75, 0.85);
    result = mix(fogColor, result, fogFactor);

    FragColor = vec4(result, 1.0);
}
