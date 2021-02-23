
// https://threejsfundamentals.org/threejs/lessons/threejs-shadertoy.html
export const shaderToyToThreeShader = (v) => `
// #include <common>

uniform vec3 iResolution;
uniform float iTime;
uniform float iTimeDelta;
uniform int iFrame;
uniform float iFrameRate;
uniform vec4 iMouse;
// Sampler for input textures i
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform sampler2D iChannel2;
uniform sampler2D iChannel3;
uniform sampler2D iChannel4;
uniform sampler2D iChannel5;
uniform sampler2D iChannel6;

uniform vec4 iDate; // Year, month, day, time in seconds in .xyzw
uniform float iSampleRate; // The sound sample rate (typically 44100)

${v}

varying vec2 vUv;
void main() {
    mainImage(gl_FragColor, vUv * iResolution.xy);
}
`

export default shaderToyToThreeShader

export const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`
