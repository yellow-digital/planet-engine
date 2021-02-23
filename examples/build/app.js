import {
  Viewer,
  THREE,
  Constants,
  createEarthScene
} from '../../dist/planet-engine.esm.js'

function mounted () {
  const viewer = new Viewer({
    el: 'webgl',
    defaultLight: false
  })

  const { scene } = viewer

  // Helper
  scene.add(new THREE.AxesHelper(Constants.EARTH_RADIUS * 1.2))

  const earth = createEarthScene(viewer)
  // console.log(earth)
  viewer.zoomTo(earth)

  // viewer.add(new Sky(viewer))
  // viewer.add(new Stars())

  // UI
  window.goto = (what = 'earth') => {
    const resolveObject = {
      earth: earth.children[0],
      moon: earth.children[2]
    }

    const resolve = {
      moon () {
        viewer.zoomTo(resolveObject['moon'])
      },
      earth () {
        viewer.zoomTo(resolveObject['earth'])
      }
    }
    console.log('Go to', what)
    resolve[what]()
  }
}

mounted()
