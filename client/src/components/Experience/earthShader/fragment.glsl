uniform float uDotSize;
uniform vec3 uColor;
uniform vec3 uOceanColorStart;
uniform vec3 uOceanColorEnd;
uniform sampler2D uLandTexture;
uniform float uTotalDots;
uniform float GLOBE_RADIUS;
varying vec3 vPosition;

void main() {
  // Convert normalized position to spherical coordinates
  float lat = asin(vPosition.y); // Latitude from -π/2 to π/2
  float lon = atan(vPosition.z, vPosition.x); // Longitude from -π to π

  // Total latitude bands based on the square root of uTotalDots
  float totalLatitudeBands = sqrt(uTotalDots);
  float latStep = 3.14159 / totalLatitudeBands; // Latitude step size

  // Calculate the index of the current latitude band
  float latIndex = floor((lat + 3.14159 / 2.0) / latStep);
  float snappedLat = -3.14159 / 2.0 + latStep * (latIndex + 0.5);

  // Calculate the radius and circumference for the snapped latitude
  float latRadius = GLOBE_RADIUS * cos(snappedLat);
  float circumference = latRadius * 2.0 * 3.14159;

  // Calculate the number of dots for this latitude based on the circumference
  float dotsPerLatitude = max(1.0, floor(circumference * uTotalDots / (4.0 * 3.14159 * GLOBE_RADIUS)));

  // Calculate the step size for longitude based on dotsPerLatitude
  float lonStep = (2.0 * 3.14159) / dotsPerLatitude;

  // Snap longitude to the nearest grid position
  float lonIndex = floor((lon + 3.14159) / lonStep);
  float snappedLon = -3.14159 + lonStep * (lonIndex + 0.5);

  // Compute UV coordinates for the snapped dot position
  float u = 1.0 - (snappedLon + 3.14159) / (2.0 * 3.14159); // Flip horizontally
  float v = (snappedLat + 3.14159 / 2.0) / 3.14159;         // Flip vertically

  // Sample the land texture to check if the dot is on land or ocean
  float landMask = texture2D(uLandTexture, vec2(u, v)).r;

  // Calculate distance to the snapped grid center
  float dist = sqrt(pow(lat - snappedLat, 2.0) + pow(lon - snappedLon, 2.0));

  // Render a dot if within uDotSize and not on land
  if (landMask < 0.5 && step(dist, uDotSize) > 0.0) {
    gl_FragColor = vec4(uColor, 1.0);
    return;
  }

  // Compute gradient for the ocean based on latitude
  float gradientFactor = (vPosition.y + 1.0) / 2.0; // Normalize y to [0, 1]
  vec3 oceanColor = mix(uOceanColorStart, uOceanColorEnd, gradientFactor);

  // Render the ocean gradient
  gl_FragColor = vec4(oceanColor, 1.0);
}
