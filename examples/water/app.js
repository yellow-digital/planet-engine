import { Viewer, Water, SceneManager, Sky, THREE } from '../../src/index.js'

function mounted () {
  const viewer = new Viewer({ el: 'webgl' })

  const { scene } = viewer

  const manager = new SceneManager(viewer)

  const axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)

  const planet = new Sky(viewer)
  manager.push(planet)
  manager.push(new Water())

  viewer.zoomTo(planet.mesh)
}

mounted()
