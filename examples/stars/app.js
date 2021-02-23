import {
  Viewer,
  THREE,
  Constants,
  Planets
} from '../../src/index.js'

function mounted () {
  const viewer = new Viewer({
    el: 'webgl',
    defaultLight: false
  })

  const { scene } = viewer

  // Helper
  scene.add(new THREE.AxesHelper(Constants.EARTH_RADIUS))

  // Stars
  var starSphere = Planets.createStarfield({ radius: Constants.EARTH_RADIUS * 100000 })
  scene.add(starSphere)
}

mounted()
