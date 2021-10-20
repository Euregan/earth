uniform vec3 haloColor;
varying float colorIntensity;
varying float alphaIntensity;

void main() {
  gl_FragColor = vec4(haloColor * colorIntensity, 1.0 * alphaIntensity);
}
