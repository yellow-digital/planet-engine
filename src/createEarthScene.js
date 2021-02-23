import * as Planets from './Planets.js'

import {
  THREE,
  addOrbitDampControlToMesh,
  ArcGISTiledElevationTerrainProvider,
  Constants,
  createAtmosphereMaterial,
  SceneManager
} from './index.js'

const SETTINGS = {
  realistic: false
}

export const createEarthScene = (viewer, settings = SETTINGS) => {
  const { scene } = viewer

  const onRenderFcts = new SceneManager()

  // Lights
  let light = new THREE.AmbientLight(0x888888)
  scene.add(light)
  light = new THREE.DirectionalLight('white', 1)
  light.position.set(5, 5, 5)
  light.target.position.set(0, 0, 0)
  scene.add(light)
  // var light = new THREE.DirectionalLight(0xcccccc, 1)
  // light.position.set(5, 5, 5)
  // scene.add(light)

  // Stars
  var starSphere = Planets.createStarfield({ radius: Constants.FAR_AWAY })
  scene.add(starSphere)

  // Container
  var containerEarth = new THREE.Object3D()
  containerEarth.name = 'Container'
  // containerEarth.rotateZ(-23.4 * Math.PI / 180)
  // containerEarth.position.z = 0
  scene.add(containerEarth)
  onRenderFcts.push(function (delta, now) {
    containerEarth.rotation.y += 1 / 8 * (delta / 1000)
  })

  // Earth
  var earthMesh = Planets.createEarth({ radius: Constants.EARTH_RADIUS })
  earthMesh.receiveShadow = true
  earthMesh.castShadow = true
  // earthMesh.position.set(1000, 0, 0)
  // earthMesh.scale.multiplyScalar(Constants.EARTH_RADIUS)
  containerEarth.add(earthMesh)
  // onRenderFcts.push(function (delta, now) {
  //   earthMesh.rotation.y += 1 / 32 * (delta / 1000)
  // })
  // Attach camera control to mesh
  // addOrbitDampControslToMesh(earthMesh, viewer)
  // addOrbitDampControlToMesh(moonMesh, viewer)

  // Atmosphere
  var geometry = new THREE.SphereGeometry(Constants.EARTH_RADIUS, 32, 32)
  var material = createAtmosphereMaterial()
  material.side = THREE.BackSide
  material.uniforms.glowColor.value.set(0x00b3ff)
  material.uniforms.coeficient.value = 0.5
  material.uniforms.power.value = 4.0
  var mesh = new THREE.Mesh(geometry, material)
  mesh.name = 'Atmosphere'
  mesh.scale.multiplyScalar(1.15)
  containerEarth.add(mesh)

  // Moon
  var moonMesh = Planets.createMoon({ radius: Constants.EARTH_MOON_RADIOUS })
  const moonDistance =
  settings.realistic ? Constants.EARTH_MOON_DISTANCE
    : Constants.EARTH_MOON_RADIOUS * 10
  moonMesh.position.set(moonDistance, 0, 0)
  // moonMesh.scale.multiplyScalar(1 / 5)
  // moonMesh.scale.multiplyScalar(Constants.EARTH_MOON_RADIOUS)
  moonMesh.receiveShadow = true
  moonMesh.castShadow = true
  moonMesh.geometry.computeBoundingBox()
  moonMesh.geometry.computeBoundingSphere()
  containerEarth.add(moonMesh)

  // Clouds
  var earthCloud = Planets.createEarthCloud({ radius: Constants.EARTH_RADIUS })
  earthCloud.receiveShadow = true
  earthCloud.castShadow = true
  // earthCloud.scale.multiplyScalar(Constants.EARTH_RADIUS * 1.1)
  containerEarth.add(earthCloud)
  onRenderFcts.push(function (delta, now) {
    earthCloud.rotation.y += 1 / 8 * (delta / 1000)
  })

  // // Planet
  // const planet = new Planet()
  // planet.terrainProvider = new ArcGISTiledElevationTerrainProvider()
  // viewer.add(planet)
  // viewer.zoomTo(planet.mesh)

  return containerEarth
  // return {
  //   mesh: containerEarth,
  //   render () {

  //   }
  // }
}
