import {
  Viewer,
  THREE,
  Constants,
  createEarthScene,
  FlyControls,
  getPosition
} from '../../src/index.js'

// Control helpers
const createFlyControls = (viewer, settings = {}) => {
  const { camera, renderer } = viewer

  const controls = new FlyControls(camera, renderer.domElement)
  controls.movementSpeed = 50000
  controls.domElement = renderer.domElement
  controls.rollSpeed = Math.PI / 12
  controls.autoForward = false
  controls.dragToLook = true

  return controls
}

function mounted () {
  const viewer = new Viewer({
    el: 'webgl',
    defaultLight: false
  })

  const { scene } = viewer

  // Helper
  scene.add(new THREE.AxesHelper(Constants.EARTH_RADIUS * 1.2))

  // Create default earth with moon and Starfield
  const earth = createEarthScene(viewer)
  // console.log(earth)

  // Change controller
  viewer.controller = createFlyControls(viewer)

  viewer.zoomTo(earth)

  // =================
  // Objects
  // =================
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
  locationGroup.name = 'Locations'
  earth.add(locationGroup)
  LOCATIONS.forEach(location => {
    var sprite = createLocation(location)
    locationGroup.add(sprite)
  })

  // =================
  // UI
  // =================
  const resolveObject = {
    earth: earth.children[0],
    moon: earth.children[2],
    object: locationGroup.children[0]
  }

  window.goto = (what = 'earth') => {
    viewer.zoomTo(resolveObject[what])
  }

  window.lookAt = (what = 'earth') => {
    viewer.lookAt(resolveObject[what], { time: 500 })
  }

  window.flyTo = (what = 'earth') => {
    viewer.flyTo(resolveObject[what])
  }

  window.setTrackedEntity = (what = null) => {
    viewer.setTrackedEntity(resolveObject[what] || null)
  }

  window.setFlyControls = () => {
    viewer.controller = createFlyControls(viewer)
  }
}

mounted()
