import { EARTH_RADIUS } from './constants.js'
import { THREE } from './index.js'
import { Box3, Vector3 } from './three.js'
import * as TWEEN from './tween.esm.js'

// Setup the animation loop.
function animate (time) {
  requestAnimationFrame(animate)
  TWEEN.update(time)
}
requestAnimationFrame(animate)

const FLY_TO = new THREE.Mesh()

const CAMERA_FLY_SETTINGS = {
  distance: 0,
  time: 1000
}

export const cameraLookAt = (
  object,
  { camera },
  { time = 1000 } = {}
) => {
// backup original rotation
  var startRotation = camera.quaternion.clone()

  // final rotation (with lookAt)
  camera.lookAt(object.position)
  var endRotation = camera.quaternion.clone()

  // revert to original rotation
  camera.quaternion.copy(startRotation)

  // Tween
  return new TWEEN.Tween(camera.quaternion)
    .to(endRotation, time)
    .easing(TWEEN.Easing.Quadratic.InOut) // | TWEEN.Easing.Linear.None
    .start()
}

export const cameraFlyToPosition = (
  { from = new Vector3(), to = new Vector3() },
  { distance = 0, time = 1000 } = CAMERA_FLY_SETTINGS,
  { camera }
) => {
  // console.log(from, to, camera)

  var tween = new TWEEN.Tween(from)
    .to(to, time)
    .easing(TWEEN.Easing.Quadratic.InOut) // | TWEEN.Easing.Linear.None
    .onUpdate(() => {
      const _distance = camera.position.distanceTo(to)
      if (_distance < distance) {
        tween.stop()
      }
    })
    // .onComplete(function () {
    //   // controls.target.set(this.x, this.y, this.z)
    //   console.log('Finished')
    // })
    .start()

  return tween
}

export const cameraFlyTo = (
  object = FLY_TO,
  settings = CAMERA_FLY_SETTINGS,
  { camera }
) => {
  // zoom to twice the radius
  const FACTOR = 4

  const stopWhenInRange = () => {
    // Stop when in range
    const _distance = camera.position.distanceTo(to)
    const upTo = boundingSphere.radius * FACTOR
    if (_distance < upTo) {
      cameraFlyToPositionTween.stop()
    }
  }

  // TWEEN 1 - orientation
  const cameraTween =
    cameraLookAt(object, { camera })
      .onComplete(function () {
        // console.log('cameraFlyTo orientation Finished')
      })

  const boundingSphere = object.geometry.boundingSphere
  const to = object.getWorldPosition(new Vector3())

  // TWEEN 2 - position
  const cameraFlyToPositionTween = cameraFlyToPosition({
    from: camera.position,
    to
  }, settings, { camera })
    .onUpdate(stopWhenInRange)
    .onComplete(function () {
      // console.log('cameraFlyTo position Finished')
    })

  return cameraFlyToPositionTween
}

export const ORBIT_SETTINGS = {
  rotateSpeed: 0.5,
  zoomSpeed: 0.5,
  maxDistanceMultiplier: 20,
  maxZoomSpeed: 2
}

// =====================

export const addOrbitDampControlToMesh = (mesh = {}, viewer, {
  rotateSpeed = 0.5,
  zoomSpeed = 0.5,
  maxDistanceMultiplier = 20,
  maxZoomSpeed = 0.5
} = {}) => {
  const { geometry } = mesh
  geometry.computeBoundingSphere()
  const radius = geometry.boundingSphere.radius

  // Fit
  viewer.zoomTo(mesh)

  // Change controls settings
  const { camera, controls } = viewer

  if (!controls) {
    console.warn('No controls')
    return false
  }

  controls.rotateSpeed = rotateSpeed
  controls.zoomSpeed = zoomSpeed
  controls.minDistance = radius
  controls.maxDistance = radius * maxDistanceMultiplier
  controls.enableDamping = true
  // controls.autoRotate = true
  // controls.target = mesh
  // controls.maxZoom = 10000

  const controlHandler = (e) => {
    const distance = camera.position.distanceTo(controls.target)
    const distanceToPlanet = distance - radius

    // Controls - Pan speed depends on zoom
    controls.rotateSpeed = Math.min(distanceToPlanet / radius, maxZoomSpeed)
    controls.zoomSpeed = Math.min(distanceToPlanet / radius, maxZoomSpeed)
  }

  // TODO remove listener handler
  controls.addEventListener('change', controlHandler, false)

  return controls
}

export const addOrbitDampControl = (viewer, {
  radius = EARTH_RADIUS,
  rotateSpeed = 0.5,
  zoomSpeed = 0.5
} = {}) => {
  const { controls, camera } = viewer

  if (!controls) {
    console.warn('No controls')
    return false
  }

  controls.rotateSpeed = rotateSpeed
  controls.zoomSpeed = zoomSpeed
  controls.minDistance = radius
  controls.maxDistance = radius * 4
  controls.enableDamping = true
  controls.maxZoom = 10000

  controls.addEventListener('change', (e) => {
    const distance = camera.position.distanceTo(controls.target)
    const distanceToPlanet = distance - radius

    // Controls - Pan speed depends on zoom
    controls.rotateSpeed = Math.min(distanceToPlanet / radius, 3)
    controls.zoomSpeed = Math.min(distanceToPlanet / radius, 3)
  }, false)
}

export const fitCameraToObject = function (object = {}, viewer, { offset = 1.5 } = {}) {
  const { camera, controls } = viewer

  // get bounding box of object - this will be used to setup controls and camera
  const boundingBox = new Box3()
  boundingBox.setFromObject(object)

  const center = boundingBox.getCenter(new Vector3())
  const size = boundingBox.getSize(new Vector3())

  // get the max side of the bounding box (fits to width OR height as needed )
  const maxDim = Math.max(size.x, size.y, size.z)
  //   const fov = camera.fov * (Math.PI / 180)
  let cameraZ = maxDim // Math.abs(maxDim / 4 * Math.tan(fov * 2))

  cameraZ *= offset // zoom out a little so that objects don't fill the screen

  // Iso
  camera.position.x = cameraZ
  camera.position.y = cameraZ
  camera.position.z = cameraZ

  // camera.position.x = center.x
  // camera.position.y = center.y
  // camera.position.z = center.z
  // const minZ = boundingBox.min.z
  // const cameraToFarEdge = (minZ < 0) ? -minZ + cameraZ : cameraZ - minZ
  // camera.far = cameraToFarEdge * 3
  // camera.updateProjectionMatrix()

  if (controls) {
    // set camera to rotate around center of loaded object
    controls.target = center

    // prevent camera from zooming out far enough to create far plane cutoff
    // controls.maxDistance = cameraToFarEdge * 2

    // controls.saveState()
  } else {
    camera.lookAt(center)
  }
}
