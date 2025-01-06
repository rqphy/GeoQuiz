varying vec3 vNormal;
varying vec2 vUv;

void main() {
    // Simple noise-like function for land/ocean division
    float threshold = 0.5 + 0.2 * sin(vUv.x * 20.0) * cos(vUv.y * 20.0);

    // Choose colors
    vec3 oceanColor = vec3(0.0, 0.3, 0.8);  // Deep blue for ocean
    vec3 landColor = vec3(0.2, 0.8, 0.3);   // Green for land

    // Mix colors based on the threshold
    float isLand = step(threshold, vUv.y);
    vec3 color = mix(oceanColor, landColor, isLand);

    gl_FragColor = vec4(color, 1.0);
}