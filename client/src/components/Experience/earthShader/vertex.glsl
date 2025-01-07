varying vec3 vPosition;
void main() {
    vPosition = normalize(position); // Normalize position for spherical mapping
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}