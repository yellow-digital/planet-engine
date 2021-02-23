export default [
  {
    name: 'single color (shadertoy)',
    uniforms: {
      colorA: { type: 'vec3', value: [0, 255, 0] },
      colorB: { type: 'vec3', value: [0, 255, 255] }
    },
    plugins: ['shadertoy'],
    fragment: `
uniform vec3 colorA;
uniform vec3 colorB;

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  gl_FragColor = vec4(mix(colorA, colorB, 1.0), 1.0);
}
  `
  },
  {
    name: 'single color',
    uniforms: {
      colorA: { type: 'vec3', value: [0, 255, 0] },
      colorB: { type: 'vec3', value: [0, 255, 255] }
    },
    fragment: `
uniform vec3 colorA;
uniform vec3 colorB;
// varying vec2 vUv;

void main() {
  gl_FragColor = vec4(mix(colorA, colorB, 1.0), 1.0);
}
  `
  },
  {
    name: 'https://www.shadertoy.com/view/4sXSzs',
    plugins: ['shadertoy'],
    fragment: `
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 p = fragCoord.xy / iResolution.xy;
    vec2 q = p - vec2(0.5, 0.5);

    q.x += sin(iTime* 0.6) * 0.2;
    q.y += cos(iTime* 0.4) * 0.3;

    float len = length(q);

    float a = atan(q.y, q.x) + iTime * 0.3;
    float b = atan(q.y, q.x) + iTime * 0.3;
    float r1 = 0.3 / len + iTime * 0.5;
    float r2 = 0.2 / len + iTime * 0.5;

    float m = (1.0 + sin(iTime * 0.5)) / 2.0;
    vec4 tex1 = texture(iChannel0, vec2(a + 0.1 / len, r1 ));
    vec4 tex2 = texture(iChannel1, vec2(b + 0.1 / len, r2 ));
    vec3 col = vec3(mix(tex1, tex2, m));
    fragColor = vec4(col * len * 1.5, 1.0);
}`
  },
  {
    name: 'https://threejsfundamentals.org/threejs/lessons/threejs-shadertoy.html',
    plugins: ['shadertoy'],
    fragment: `
// By Daedelus: https://www.shadertoy.com/user/Daedelus
// license: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
#define TIMESCALE 0.25 
#define TILES 8
#define COLOR 0.7, 1.6, 2.8

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord.xy / iResolution.xy;
    uv.x *= iResolution.x / iResolution.y;
    
    vec4 noise = texture2D(iChannel0, floor(uv * float(TILES)) / float(TILES));
    float p = 1.0 - mod(noise.r + noise.g + noise.b + iTime * float(TIMESCALE), 1.0);
    p = min(max(p * 3.0 - 1.8, 0.1), 2.0);
    
    vec2 r = mod(uv * float(TILES), 1.0);
    r = vec2(pow(r.x - 0.5, 2.0), pow(r.y - 0.5, 2.0));
    p *= 1.0 - pow(min(1.0, 12.0 * dot(r, r)), 2.0);
    
    fragColor = vec4(COLOR, 1.0) * p;
}
      `
  },
  {
    name: 'https://www.shadertoy.com/view/wlVGWd',
    plugins: ['shadertoy'],
    fragment: `
float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p) {
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u*u*(3.0-2.0*u);

    float res = mix(
        mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
        mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
    return res*res;
}

const mat2 m2 = mat2(0.8,-0.6,0.6,0.8);

float fbm( in vec2 p ){
    float f = 0.0;
    f += 0.5000*noise( p ); p = m2*p*2.02;
    f += 0.2500*noise( p ); p = m2*p*2.03;
    f += 0.1250*noise( p ); p = m2*p*2.01;
    f += 0.0625*noise( p );

    return f/0.769;
}

float pattern( in vec2 p ) {
    vec2 q = vec2(fbm(p + vec2(0.0,0.0)));
    vec2 r = vec2( fbm( p + 4.0*q + vec2(1.7,9.2)));
    r+= iTime * 0.15;
    return fbm( p + 1.760*r );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
        vec2 uv = fragCoord/iResolution.xy;
    
    uv *= 4.5; // Scale UV to make it nicer in that big screen !
        float displacement = pattern(uv);
        vec4 color = vec4(displacement * 1.2, 0.2, displacement * 5., 1.);
    
    color.a = min(color.r * 0.25, 1.); // Depth for CineShader
    fragColor = color;
}`
  }
]
