// Based on https://stemkoski.github.io/Three.js/Shader-Heightmap-Textures.html

import * as THREE from '../three.js'

const types = {
  water: [0.01, 0.25, 0.24, 0.26],
  sandy: [0.24, 0.27, 0.28, 0.31],
  grass: [0.28, 0.32, 0.35, 0.40],
  rocky: [0.30, 0.50, 0.40, 0.70],
  snowy: [0.50, 0.65]
}

const DEFAULTS = {
  map: 'https://stemkoski.github.io/Three.js/images/heightmap.png',
  // magnitude of normal displacement
  bumpScale: 200,
  types
}

export const createTerrainShaders = ({ uniforms, types } = {}) => {
  return new THREE.ShaderMaterial(
    {
      uniforms,
      vertexShader: `
      uniform sampler2D bumpTexture;
      uniform float bumpScale;
      
      varying float vAmount;
      varying vec2 vUV;
      
      void main() 
      { 
        vUV = uv;
        vec4 bumpData = texture2D( bumpTexture, uv );
        
        vAmount = bumpData.r; // assuming map is grayscale it doesn't matter if you use r, g, or b.
        
        // move the position along the normal
          vec3 newPosition = position + normal * bumpScale * vAmount;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
      }`,
      fragmentShader: `
      uniform sampler2D oceanTexture;
      uniform sampler2D sandyTexture;
      uniform sampler2D grassTexture;
      uniform sampler2D rockyTexture;
      uniform sampler2D snowyTexture;
      
      varying vec2 vUV;
      
      varying float vAmount;
      
      void main() 
      {
        vec4 water = (smoothstep(${types.water[0]}, ${types.water[1]}, vAmount) - smoothstep(${types.water[2]}, ${types.water[3]}, vAmount) ) * texture2D( oceanTexture, vUV * 10.0 );
        vec4 sandy = (smoothstep(${types.sandy[0]}, ${types.sandy[1]}, vAmount) - smoothstep(${types.sandy[2]}, ${types.sandy[3]}, vAmount) ) * texture2D( sandyTexture, vUV * 10.0 );
        vec4 grass = (smoothstep(${types.grass[0]}, ${types.grass[1]}, vAmount) - smoothstep(${types.grass[2]}, ${types.grass[3]}, vAmount) ) * texture2D( grassTexture, vUV * 20.0 );
        vec4 rocky = (smoothstep(${types.rocky[0]}, ${types.rocky[1]}, vAmount) - smoothstep(${types.rocky[2]}, ${types.rocky[3]}, vAmount) ) * texture2D( rockyTexture, vUV * 20.0 );
        vec4 snowy = (smoothstep(${types.snowy[0]}, ${types.snowy[1]}, vAmount))                                   * texture2D( snowyTexture, vUV * 10.0 );
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0) + water + sandy + grass + rocky + snowy; //, 1.0);
      }  `,
      side: THREE.DoubleSide
    })
}

const createUniforms = ({ map, bumpScale } = {}) => {
  // texture used to generate "bumpiness"
  var bumpTexture = new THREE.TextureLoader().load(map)
  bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping

  var oceanTexture = new THREE.TextureLoader().load('https://stemkoski.github.io/Three.js/images/dirt-512.jpg')
  oceanTexture.wrapS = oceanTexture.wrapT = THREE.RepeatWrapping

  var sandyTexture = new THREE.TextureLoader().load('https://stemkoski.github.io/Three.js/images/sand-512.jpg')
  sandyTexture.wrapS = sandyTexture.wrapT = THREE.RepeatWrapping

  var grassTexture = new THREE.TextureLoader().load('https://stemkoski.github.io/Three.js/images/grass-512.jpg')
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping

  var rockyTexture = new THREE.TextureLoader().load('https://stemkoski.github.io/Three.js/images/rock-512.jpg')
  rockyTexture.wrapS = rockyTexture.wrapT = THREE.RepeatWrapping

  var snowyTexture = new THREE.TextureLoader().load('https://stemkoski.github.io/Three.js/images/snow-512.jpg')
  snowyTexture.wrapS = snowyTexture.wrapT = THREE.RepeatWrapping

  const customUniforms = {
    bumpTexture: { type: 't', value: bumpTexture },
    bumpScale: { type: 'f', value: bumpScale },
    oceanTexture: { type: 't', value: oceanTexture },
    sandyTexture: { type: 't', value: sandyTexture },
    grassTexture: { type: 't', value: grassTexture },
    rockyTexture: { type: 't', value: rockyTexture },
    snowyTexture: { type: 't', value: snowyTexture }
  }

  return customUniforms
}

export default class Terrain {
  constructor (props = {}) {
    const settings = {
      ...DEFAULTS,
      ...props
    }

    this.settings = settings

    // const scene = new THREE.Group()

    const uniforms = createUniforms(settings)
    // create custom material from the shader code above
    //   that is within specially labelled script tags

    this._types = types

    const material = createTerrainShaders({ uniforms, types })

    var planeGeo = new THREE.PlaneGeometry(1000, 1000, 100, 100)
    var plane = new THREE.Mesh(planeGeo, material)
    plane.rotation.x = -Math.PI / 2
    // plane.position.y = -100
    // scene.add(plane)

    // // const waterGeo = new THREE.PlaneGeometry(1000, 1000, 1, 1)
    // var waterTex = new THREE.TextureLoader().load('https://stemkoski.github.io/Three.js/images/water512.jpg')
    // waterTex.wrapS = waterTex.wrapT = THREE.RepeatWrapping
    // waterTex.repeat.set(5, 5)
    // var waterMat = new THREE.MeshBasicMaterial({ map: waterTex, transparent: true, opacity: 0.40 })
    // var water = new THREE.Mesh(planeGeo, waterMat)
    // water.rotation.x = -Math.PI / 2
    // water.position.y = -50
    // scene.add(water)

    // Attach
    plane.name = 'Terrain'
    this.mesh = plane
  }

  get bumpScale () {
    return this.settings.bumpScale
  }

  set bumpScale (value) {
    this.settings.bumpScale = value

    this.mesh.material.uniforms.bumpScale.value = value
  }

  get types () {
    return this._types
  }

  set types (value) {
    this._types = value

    this.compileShaders()
  }

  compileShaders () {
    // Regenrate shader
    const uniforms = createUniforms(this.settings)
    this.uniforms = uniforms

    const material = createShaders({
      uniforms,
      types: this.types
    })

    const { mesh } = this
    mesh.material = material
  }

  render () {

  }
}
