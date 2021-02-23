import { Viewer, THREE } from '../../src/index.js'
import '../assets/vue-ace-edit.js'
import examples from './examples.js'
import shaderToyToThreeShader, { vertexShader } from './shadertoy-tree/index.js'

// const fragmentShader = shaderToyToThreeShader(examples[0].fragment)

const loadTexture = (url = '') => {
  const loader = new THREE.TextureLoader()
  const texture = loader.load(url)
  texture.minFilter = THREE.NearestFilter
  texture.magFilter = THREE.NearestFilter
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  return texture
}

const createShaderMaterial = (shader = {
  fragment: '',
  uniforms: ''
}) => {
  const { fragment } = shader

  // https://dev.to/maniflames/creating-a-custom-shader-in-threejs-3bhi
  const uniforms = {
    // Custom example uniforms
    ...shader.uniforms,

    // default Shadertoy uniforms
    iTime: { value: 0 },
    iFrame: { type: 'int', value: 0 },
    iResolution: { value: new THREE.Vector3(1, 1, 1) },
    iChannel0: { type: 'sampler2D', value: loadTexture('assets/0.jpg') },
    iChannel1: { type: 'sampler2D', value: loadTexture('assets/1.jpg') }
    // ...iChannelX: { type: 'sampler2D', value: loadTexture('assets/1.jpg') }
  }

  const fragmentShader = shader.plugins && shader.plugins[0] === 'shadertoy' ? shaderToyToThreeShader(fragment) : fragment

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide
  })
  // console.log(material)

  return material
}

window.vue = new window.Vue({
  el: '#app',

  data: vm => ({
    items: examples,
    example: examples[0],
    form: {
      uniforms: {},
      fragment: ``,
      ...examples[0]
    }
  }),

  mounted () {
    const viewer = new Viewer({
      el: 'webgl',
      cameraDistance: 10
    })
    const { scene } = viewer

    scene.add(new THREE.AxesHelper(1000))

    // Test plane
    const material = createShaderMaterial(this.example)
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), material)
    scene.add(mesh)

    // TODO Other geo..?

    // Update uniforms
    const uniforms = material.uniforms
    this.form.uniforms = uniforms
    function render (time = 0) {
      time *= 0.001 // convert to seconds
      uniforms.iTime.value = time
      // uniforms.iFrame.value = uniforms.iFrame.value + 1
      requestAnimationFrame(render)
    }
    requestAnimationFrame(render)

    // Vue bindings
    this.form.uniforms = uniforms

    this.$watch('form.uniforms', v => {
      // material.uniforms = v
      // material.uniforms.colorA.value = new THREE.Color('blue')
      console.log('[new uniforms]', mesh)
    })

    this.$watch('form.fragment', (fragment = '') => {
      console.log('[shader change]')

      // mesh.material = createShaderMaterial()
      //   new THREE.ShaderMaterial({
      //   uniforms,
      //   vertexShader,
      //   fragmentShader: shaderToyToThreeShader(fragment),
      //   side: THREE.DoubleSide
      // })
    })

    this.$watch('form.example', (value) => {
      console.log('[new shader]')

      const material = createShaderMaterial(value)
      mesh.material = material

      this.form.fragment = material.fragmentShader
      //   new THREE.ShaderMaterial({
      //   uniforms,
      //   vertexShader,
      //   fragmentShader: shaderToyToThreeShader(fragment),
      //   side: THREE.DoubleSide
      // })
    })
  },

  vuetify: new window.Vuetify()
})
