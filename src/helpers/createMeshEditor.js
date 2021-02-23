/*
import { createMeshEditor } from './createMeshEditor.js'
  // scene.add(createMeshEditor(geometry, viewer))
*/

// https://stackoverflow.com/questions/49318245/threejs-drag-points
import { THREE } from '../../src/index.js'

export const createMeshEditor = (geometry, { scene, camera, el = window } = {}) => {
  console.log('createMeshEditor', camera, el)

  const size = 1000
  var points = new THREE.Points(geometry, new THREE.PointsMaterial({
    size,
    color: 'yellow'
  }))
  //   scene.add(points)

  var raycaster = new THREE.Raycaster()
  raycaster.params.Points.threshold = size
  // var intersects = null

  // Create draging plane
  var plane = new THREE.Plane()
  var planeNormal = new THREE.Vector3()
  var currentIndex = null
  var planePoint = new THREE.Vector3()
  var dragging = false

  el.addEventListener('pointerdown', mouseDown, false)
  el.addEventListener('pointermove', mouseMove, false)
  el.addEventListener('pointerup', mouseUp, false)

  function mouseDown (event) {
    setRaycaster(event)
    getIndex()
    dragging = true
  }

  function mouseMove (event) {
    // console.log('mouseMove')
    setRaycaster(event)
    const intersects = raycaster.intersectObject(points)
    // console.log(intersects)
    if (intersects.length) {
      el.style.cursor = 'pointer'
    } else {
      el.style.cursor = 'inherit'
    }

    if (dragging && currentIndex !== null) {
      console.log(currentIndex)

      setRaycaster(event)
      raycaster.ray.intersectPlane(plane, planePoint)
      geometry.attributes.position.setXYZ(currentIndex, planePoint.x, planePoint.y, planePoint.z)
      geometry.attributes.position.needsUpdate = true
    }
  }

  function mouseUp (event) {
    dragging = false
    currentIndex = null
  }

  function getIndex () {
    const intersects = raycaster.intersectObject(points)
    // console.log(intersects)
    if (intersects.length === 0) {
      currentIndex = null
      return
    }
    currentIndex = intersects[0].index
    setPlane(intersects[0].point)
  }

  function setPlane (point) {
    planeNormal.subVectors(camera.position, point).normalize()
    plane.setFromNormalAndCoplanarPoint(planeNormal, point)
  }

  function setRaycaster (event) {
    const mouse = getMouse(event)
    // update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera)
  }

  // const rect = el.getBoundingClientRect()
  // console.log(rect)

  /**
   * Convert mouse to THREE.Vector2
   * @param {*} e
   */
  function getMouse (e) {
    // const rect = el.getBoundingClientRect()
    // console.log(rect)

    const vect2 = {
      x: (event.clientX / window.innerWidth) * 2 - 1,
      y: -(event.clientY / window.innerHeight) * 2 + 1
      // x: ((event.offsetX) / (rect.width)) * 2 - 1,
      // y: -((event.offsetY) / (rect.height)) * 2 + 1
    }
    // console.log(event.offsetX, event.offsetY)
    // console.log(rect)
    // console.log(vect2)
    return vect2
  }

  // function getMouse (event) {
  //   event.preventDefault()
  //   var mouse = new THREE.Vector2()

  //   var rect = el.getBoundingClientRect()
  //   // mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
  //   // mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
  //   mouse.x = ((event.offsetX - rect.left) / rect.width) * 2 - 1
  //   mouse.y = -((event.offsetY) / rect.height) * 2 + 1

  //   // console.log(rect)
  //   console.log(mouse)
  //   console.log(event)
  //   return mouse
  // }

  return points
}

// export const randomGeo = (geometry) => {
//   const positions = geometry.attributes.position.array
//   const MAX_POINTS = geometry.attributes.position.count
//   console.log(geometry.attributes.position)

//   let x, y, z, index
//   x = y = z = index = 0

//   for (let i = 0, l = MAX_POINTS; i < l; i++) {
//     positions[index++] = x
//     positions[index++] = y
//     positions[index++] = z

//     x += (Math.random() - 0.5) * 30
//     y += (Math.random() - 0.5) * 30
//     z += (Math.random() - 0.5) * 30
//   }
// }
