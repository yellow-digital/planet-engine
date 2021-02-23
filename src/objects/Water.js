// example https://github.com/mrdoob/three.js/blob/master/examples/webgl_shaders_ocean.html
import { Water as WaterShader } from 'https://unpkg.com/three@0.125.0/examples/jsm/objects/Water.js'
import * as THREE from '../three.js'

export default class Water {
  constructor (settings = {}) {
    const geometry = settings.geometry || new THREE.PlaneBufferGeometry(10000, 10000)

    const waterNormals = new THREE.TextureLoader().load('https://threejs.org/examples/textures/waternormals.jpg', function (texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    })

    const water = new WaterShader(
      geometry,
      {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals,
        alpha: 1.0,
        sunDirection: new THREE.Vector3(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 3.7
        // fog: scene.fog !== undefined
      }
    )
    water.rotation.x = -Math.PI / 2

    water.name = 'Water'
    this.mesh = water
  }

  render () {
    const { mesh } = this

    mesh.material.uniforms['time'].value += 1.0 / 60.0
  }
}
