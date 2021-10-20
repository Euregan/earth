uniform vec3 viewVector;

varying float colorIntensity;
varying float alphaIntensity;

void main() {
  vec3 normalVector = normalize(normalMatrix * normal);
  vec3 viewVector = normalize(normalMatrix * viewVector);

  colorIntensity = pow(0.71 - dot(normalVector, viewVector), 14.0);
  alphaIntensity = pow(0.6 - dot(normalVector, viewVector), 19.0);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
