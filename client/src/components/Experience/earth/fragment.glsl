uniform sampler2D uDayTexture;
uniform float uDotSize;
uniform vec3 uDotColor;
uniform vec3 uBackgroundColor;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main()
{
    // Sample texture at actual UV position (rotates with earth)
    vec3 texColor = texture(uDayTexture, vUv).rgb;
    
    // Convert to grayscale (luminance)
    float gray = dot(texColor, vec3(0.299, 0.587, 0.114));
    
    // Screen-space halftone grid using fragment coordinates
    // This keeps dots fixed on screen while earth rotates underneath
    vec2 screenPos = gl_FragCoord.xy;
    float cellSize = uDotSize;
    vec2 gridPos = screenPos / cellSize;
    
    // Distance from current pixel to nearest cell center
    vec2 cellCenter = floor(gridPos) + 0.5;
    float dist = distance(gridPos, cellCenter);
    
    // Calculate dot radius based on luminance
    // Brighter areas = larger dots (white), darker = smaller/no dots
    float radius = gray * 0.5;
    
    // Create dot with smooth edge
    float dotMask = 1.0 - smoothstep(radius - 0.05, radius + 0.05, dist);
    
    // Light grey dots on black background
    // vec3 color = vec3(dotMask * 0.4);
    vec3 color = mix(uBackgroundColor, uDotColor, dotMask);

    // Final color
    gl_FragColor = vec4(color, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}