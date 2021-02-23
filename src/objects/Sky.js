import { Sky as SkyShader } from 'https://unpkg.com/three@0.125.0/examples/jsm/objects/Sky.js'
import * as THREE from '../three.js'

export default class Sky {
  constructor ({ renderer, scene } = {}) {
    const sun = new THREE.Vector3()

    const sky = new SkyShader()
    sky.scale.setScalar(10000)

    const skyUniforms = sky.material.uniforms

    skyUniforms['turbidity'].value = 10
    skyUniforms['rayleigh'].value = 2
    skyUniforms['mieCoefficient'].value = 0.005
    skyUniforms['mieDirectionalG'].value = 0.8

    const parameters = {
      inclination: 0.49,
      azimuth: 0.205
    }

    const pmremGenerator = new THREE.PMREMGenerator(renderer)

    function updateSun () {
      const theta = Math.PI * (parameters.inclination - 0.5)
      const phi = 2 * Math.PI * (parameters.azimuth - 0.5)

      sun.x = Math.cos(phi)
      sun.y = Math.sin(phi) * Math.sin(theta)
      sun.z = Math.sin(phi) * Math.cos(theta)

      sky.material.uniforms['sunPosition'].value.copy(sun)
      //   water.material.uniforms['sunDirection'].value.copy(sun).normalize()

      scene.environment = pmremGenerator.fromScene(sky).texture
    }

    updateSun()

    sky.name = 'Sky'
    this.mesh = sky
  }
}
