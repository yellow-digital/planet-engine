import { Viewer, THREE, Planet, addOrbitDampControl, ArcGISTiledElevationTerrainProvider, Constants } from '../../src/index.js'

function mounted () {
  const viewer = new Viewer({ el: 'webgl' })

  const { scene } = viewer

  // Helper
  scene.add(new THREE.AxesHelper(Constants.EARTH_RADIUS))

  // Planet
  const planet = new Planet()
  planet.terrainProvider = new ArcGISTiledElevationTerrainProvider()
  viewer.add(planet)
  viewer.zoomTo(planet.mesh)

  addOrbitDampControl(viewer)

  const axesHelper = new THREE.AxesHelper(5)
  scene.add(axesHelper)

  // Expose
  window.scene = scene
  window.THREE = THREE
}

mounted()
