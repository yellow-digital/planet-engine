// https://www.programmersought.com/article/74734634401/

import {
  addOrbitDampControl,
  Viewer,
  THREE,
  Constants,
  getPosition
} from '../../src/index.js'

const earthShader = {
  vertexShader: `
varying vec4 v_color; // used to store the current vertex color
varying vec2 v_uv; // UV
 uniform float u_height; // generated height
 uniform float u_radius; // radius
       uniform sampler2D u_bump; // height map
       // Interpolation calculation
float lerp(float x, float y, float t) {
  return (1.0 - t) * x + t * y;
  }
       // Get the distance between the current vector and the center point
float glength(vec3 p) {
  return sqrt(p.x * p.x + p.y * p.y + p.z * p.z);
  }
       // Pass in the length of the current vector that needs to be returned
vec3 setLength(vec3 p, float length) {
  vec3 c_position = p;
  float scale = length / glength(c_position);
  c_position.x *= scale;
  c_position.y *= scale;
  c_position.z *= scale;
  return c_position;
}
void main() {
  v_uv = uv; // uv
               v_color = texture2D(u_bump, uv); // Generate current height information
               float c_height = v_color.r * u_height; // Generate current height, current grayscale r value * base height
               vec3 vposition = setLength(position, u_radius + c_height); // Generate a new vector The distance from the center is the current base radius + the generated height
               // Pass position
  vec4 mPosition = modelViewMatrix * vec4(vposition, 1.0); 
  gl_Position = projectionMatrix * mPosition;
}
`,
  fragmentShader: `
 uniform float u_opacity; // transparency
 uniform vec3 u_color; // basic color
varying vec2 v_uv; // UV
 uniform sampler2D u_map; // basic material
void main() {
  gl_FragColor = vec4(u_color, u_opacity) * texture2D(u_map, v_uv);
}
`
}

const LOCATIONS = [
  {
    name: 'namibia',
    coord: [-19.2, 14.11666667]
  }, {
    name: 'mariana',
    coord: [18.25, 142.81666667]
  }, {
    name: 'greenland',
    coord: [72.16666667, -43]
  }, {
    name: 'galapagos',
    coord: [1.33333333, -91.15]
  }, {
    name: 'antarctica',
    coord: [-77.96666667, -155.63333333]
  }
]

// Earth
const OPTIONS = {
  radius: Constants.EARTH_RADIUS, // the radius of the earth
  segments: 640, // The higher the number of segments of the earth, the higher the accuracy of the earth
  map: '../../images/4k/map.jpg', // Earth material
  bump: '../../images/4k/bump.jpg' // Generate high material
}

const createPlanet = (options = OPTIONS) => {
  return new Promise((resolve) => {
    const geometry = new THREE.SphereBufferGeometry(options.radius, options.segments, options.segments)

    const map = new THREE.TextureLoader().load(options.map)
    const bump = new THREE.TextureLoader().load(options.bump)

    // Use custom shader
    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_radius: {
          value: options.radius // radius
        },
        u_height: {
          value: 5 // Generated height
        },
        u_map: {
          value: map // Texture
        },
        u_bump: {
          value: bump // height map
        },
        u_color: {
          value: new THREE.Color('rgb(255, 255, 255)')
        },
        u_opacity: {
          value: 1.0
        }
      },
      transparent: true,
      vertexShader: earthShader.vertexShader, // vertex shader
      fragmentShader: earthShader.fragmentShader // Fragment shader
    })
    const mesh = new THREE.Mesh(geometry, material)
    // ensure the bounding box is computed for its geometry
    // this should be done only once (assuming static geometries)
    mesh.geometry.computeBoundingBox()
    resolve(mesh)
  })
}

async function mounted () {
  const viewer = new Viewer({ el: 'webgl' })
  const { scene } = viewer

  // Helper
  const axis = new THREE.AxesHelper(Constants.EARTH_RADIUS * 1.5)
  scene.add(axis)

  const mesh = await createPlanet()
  scene.add(mesh)

  viewer.zoomTo(mesh)

  // Camera
  addOrbitDampControl(viewer)

  // Vue bindings
  this.$watch('form.bumpScale', (value) => {
    mesh.material.uniforms.u_height.value = value
  })

  // =================
  // Objects
  // =================
  function createLocation (location) {
    const geometry = new THREE.BoxGeometry(1000, 1000, 1000)
    const object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }))
    const xyz = getPosition(location.coord[0], location.coord[1])
    object.position.set(...xyz)
    // https://codepen.io/farisk/pen/zLymrz
    object.lookAt(0, 0, 0)
    return object
  }
  const locationGroup = new THREE.Group()
  scene.add(locationGroup)
  LOCATIONS.forEach(location => {
    var sprite = createLocation(location)
    locationGroup.add(sprite)
  })
}

const vue = new window.Vue({
  el: '#app',
  data: vm => ({
    form: {
      bumpScale: 0,
      types: null
    }
  }),
  mounted,
  methods: {
    apply () { this.apply() },
    log (msg = 'cool') { console.log(msg) }
  },
  vuetify: new window.Vuetify({
    theme: { dark: window.matchMedia('(prefers-color-scheme: dark)').matches }
  })
})
