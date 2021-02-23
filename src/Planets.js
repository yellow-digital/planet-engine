import { THREE } from './index.js'

const BASE_URL = '../../images/planets'
const RADIUS = 0.5
const SEGMENTS = 64

// from http://planetpixelemporium.com/

export const createSun = function ({ baseUrl = BASE_URL } = {}) {
  var geometry = new THREE.SphereGeometry(RADIUS, SEGMENTS, SEGMENTS)
  var texture = new THREE.TextureLoader().load(`${baseUrl}/sunmap.jpg`)
  var material = new THREE.MeshPhongMaterial({
    map: texture,
    bumpMap: texture,
    bumpScale: 0.05
  })
  var mesh = new THREE.Mesh(geometry, material)
  mesh.name = 'Sun'
  return mesh
}

export const createMercury = function ({ baseUrl = BASE_URL } = {}) {
  var geometry = new THREE.SphereGeometry(RADIUS, SEGMENTS, SEGMENTS)
  var material = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load(`${baseUrl}/mercurymap.jpg`),
    bumpMap: new THREE.TextureLoader().load(`${baseUrl}/mercurybump.jpg`),
    bumpScale: 0.005
  })
  var mesh = new THREE.Mesh(geometry, material)
  mesh.name = 'Mercury'
  return mesh
}

export const createVenus = function ({ baseUrl = BASE_URL } = {}) {
  var geometry = new THREE.SphereGeometry(RADIUS, SEGMENTS, SEGMENTS)
  var material = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load(`${baseUrl}/venusmap.jpg`),
    bumpMap: new THREE.TextureLoader().load(`${baseUrl}/venusbump.jpg`),
    bumpScale: 0.005
  })
  var mesh = new THREE.Mesh(geometry, material)
  mesh.name = 'Venus'
  return mesh
}

/**
 * Earth
 * @param {} param0
 */
export const createEarth = function ({ baseUrl = BASE_URL, radius = RADIUS } = {}) {
  var geometry = new THREE.SphereGeometry(radius, SEGMENTS, SEGMENTS)
  var material = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load(`${baseUrl}/earthmap1k.jpg`),
    bumpMap: new THREE.TextureLoader().load(`${baseUrl}/earthbump1k.jpg`),
    bumpScale: 0.05,
    specularMap: new THREE.TextureLoader().load(`${baseUrl}/earthspec1k.jpg`),
    specular: new THREE.Color('grey')
  })
  var mesh = new THREE.Mesh(geometry, material)
  mesh.name = 'Earth'
  return mesh
}

export const createEarthCloud = function ({ baseUrl = BASE_URL, radius = RADIUS, distance = 1.01 } = {}) {
  var geometry = new THREE.SphereGeometry(radius * distance, SEGMENTS, SEGMENTS)
  var material = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load(`${baseUrl}/earthcloudmap1k.png`),
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8
  })
  var mesh = new THREE.Mesh(geometry, material)
  mesh.name = 'Earth/clouds'
  return mesh
}

export const createMoon = function ({ baseUrl = BASE_URL, radius = RADIUS } = {}) {
  var geometry = new THREE.SphereGeometry(radius, SEGMENTS, SEGMENTS)
  var material = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load(`${baseUrl}/moonmap1k.jpg`),
    bumpMap: new THREE.TextureLoader().load(`${baseUrl}/moonbump1k.jpg`),
    bumpScale: 0.002
  })
  var mesh = new THREE.Mesh(geometry, material)
  mesh.name = 'Earth/moon'
  return mesh
}

export const createMars = function ({ baseUrl = BASE_URL, radius = RADIUS } = {}) {
  var geometry = new THREE.SphereGeometry(radius, SEGMENTS, SEGMENTS)
  var material = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load(`${baseUrl}/marsmap1k.jpg`),
    bumpMap: new THREE.TextureLoader().load(`${baseUrl}/marsbump1k.jpg`),
    bumpScale: 0.05
  })
  var mesh = new THREE.Mesh(geometry, material)
  mesh.name = 'Mars'
  return mesh
}

export const createJupiter = function ({ baseUrl = BASE_URL, radius = RADIUS } = {}) {
  var geometry = new THREE.SphereGeometry(radius, SEGMENTS, SEGMENTS)
  var texture = new THREE.TextureLoader().load(`${baseUrl}/jupitermap.jpg`)
  var material = new THREE.MeshPhongMaterial({
    map: texture,
    bumpMap: texture,
    bumpScale: 0.02
  })
  var mesh = new THREE.Mesh(geometry, material)
  mesh.name = 'Jupiter'
  return mesh
}

export const createNeptune = function ({ baseUrl = BASE_URL, radius = RADIUS } = {}) {
  var geometry = new THREE.SphereGeometry(radius, SEGMENTS, SEGMENTS)
  var texture = new THREE.TextureLoader().load(`${baseUrl}/neptunemap.jpg`)
  var material = new THREE.MeshPhongMaterial({
    map: texture,
    bumpMap: texture,
    bumpScale: 0.05
  })
  var mesh = new THREE.Mesh(geometry, material)
  return mesh
}

export const createPluto = function ({ baseUrl = BASE_URL, radius = RADIUS } = {}) {
  var geometry = new THREE.SphereGeometry(radius, SEGMENTS, SEGMENTS)
  var material = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load(`${baseUrl}/plutomap1k.jpg`),
    bumpMap: new THREE.TextureLoader().load(`${baseUrl}/plutobump1k.jpg`),
    bumpScale: 0.005
  })
  var mesh = new THREE.Mesh(geometry, material)
  mesh.name = 'Pluto'
  return mesh
}

export const createStarfield = function ({
  baseUrl = BASE_URL,
  segments = 32,
  radius = RADIUS * 2
} = {}) {
  var texture = new THREE.TextureLoader().load(`${baseUrl}/galaxy_starfield.png`)
  var material = new THREE.MeshBasicMaterial({
    map: texture,
    // side: THREE.BackSide
    side: THREE.DoubleSide
  })
  // material.depthTest = false
  var geometry = new THREE.SphereGeometry(radius, segments, segments)
  var mesh = new THREE.Mesh(geometry, material)
  mesh.name = 'Starfield'
  return mesh
}

// export const createSaturn = function ({ baseUrl = BASE_URL } = {}) {
//   var geometry = new THREE.SphereGeometry(RADIUS, SEGMENTS, SEGMENTS)
//   var texture = new THREE.TextureLoader().load(`${baseUrl}/saturnmap.jpg`)
//   var material = new THREE.MeshPhongMaterial({
//     map: texture,
//     bumpMap: texture,
//     bumpScale: 0.05
//   })
//   var mesh = new THREE.Mesh(geometry, material)
//   return mesh
// }

// export const createSaturnRing = function ({ baseUrl = BASE_URL } = {}) {
//   // create destination canvas
//   var canvasResult = document.createElement('canvas')
//   canvasResult.width = 915
//   canvasResult.height = 64
//   var contextResult = canvasResult.getContext('2d')

//   // load earthcloudmap
//   var imageMap = new Image()
//   imageMap.addEventListener('load', function () {
//     // create dataMap ImageData for earthcloudmap
//     var canvasMap = document.createElement('canvas')
//     canvasMap.width = imageMap.width
//     canvasMap.height = imageMap.height
//     var contextMap = canvasMap.getContext('2d')
//     contextMap.drawImage(imageMap, 0, 0)
//     var dataMap = contextMap.getImageData(0, 0, canvasMap.width, canvasMap.height)

//     // load earthcloudmaptrans
//     var imageTrans = new Image()
//     imageTrans.addEventListener('load', function () {
//       // create dataTrans ImageData for earthcloudmaptrans
//       var canvasTrans = document.createElement('canvas')
//       canvasTrans.width = imageTrans.width
//       canvasTrans.height = imageTrans.height
//       var contextTrans = canvasTrans.getContext('2d')
//       contextTrans.drawImage(imageTrans, 0, 0)
//       var dataTrans = contextTrans.getImageData(0, 0, canvasTrans.width, canvasTrans.height)
//       // merge dataMap + dataTrans into dataResult
//       var dataResult = contextMap.createImageData(canvasResult.width, canvasResult.height)
//       for (var y = 0, offset = 0; y < imageMap.height; y++) {
//         for (var x = 0; x < imageMap.width; x++, offset += 4) {
//           dataResult.data[offset + 0] = dataMap.data[offset + 0]
//           dataResult.data[offset + 1] = dataMap.data[offset + 1]
//           dataResult.data[offset + 2] = dataMap.data[offset + 2]
//           dataResult.data[offset + 3] = 255 - dataTrans.data[offset + 0] / 4
//         }
//       }
//       // update texture with result
//       contextResult.putImageData(dataResult, 0, 0)
//       material.map.needsUpdate = true
//     })
//     imageTrans.src = `${baseUrl}/saturnringpattern.gif`
//   }, false)
//   imageMap.src = `${baseUrl}/saturnringcolor.jpg`

//   var geometry = new RingGeometry(0.55, 0.75, 64)
//   var material = new THREE.MeshPhongMaterial({
//     map: new THREE.Texture(canvasResult),
//     // map  : new THREE.TextureLoader().load(THREEx.Planets.baseURL+'images/ash_uvgrid01.jpg'),
//     side: THREE.DoubleSide,
//     transparent: true,
//     opacity: 0.8
//   })
//   var mesh = new THREE.Mesh(geometry, material)
//   mesh.lookAt(new THREE.Vector3(RADIUS, -4, 1))
//   return mesh
// }

// export const createUranus = function ({ baseUrl = BASE_URL } = {}) {
//   var geometry = new THREE.SphereGeometry(RADIUS, SEGMENTS, SEGMENTS)
//   var texture = new THREE.TextureLoader().load(`${baseUrl}/uranusmap.jpg`)
//   var material = new THREE.MeshPhongMaterial({
//     map: texture,
//     bumpMap: texture,
//     bumpScale: 0.05
//   })
//   var mesh = new THREE.Mesh(geometry, material)
//   return mesh
// }

// export const createUranusRing = function ({ baseUrl = BASE_URL } = {}) {
//   // create destination canvas
//   var canvasResult = document.createElement('canvas')
//   canvasResult.width = 1024
//   canvasResult.height = 72
//   var contextResult = canvasResult.getContext('2d')

//   // load earthcloudmap
//   var imageMap = new Image()
//   imageMap.addEventListener('load', function () {
//     // create dataMap ImageData for earthcloudmap
//     var canvasMap = document.createElement('canvas')
//     canvasMap.width = imageMap.width
//     canvasMap.height = imageMap.height
//     var contextMap = canvasMap.getContext('2d')
//     contextMap.drawImage(imageMap, 0, 0)
//     var dataMap = contextMap.getImageData(0, 0, canvasMap.width, canvasMap.height)

//     // load earthcloudmaptrans
//     var imageTrans = new Image()
//     imageTrans.addEventListener('load', function () {
//       // create dataTrans ImageData for earthcloudmaptrans
//       var canvasTrans = document.createElement('canvas')
//       canvasTrans.width = imageTrans.width
//       canvasTrans.height = imageTrans.height
//       var contextTrans = canvasTrans.getContext('2d')
//       contextTrans.drawImage(imageTrans, 0, 0)
//       var dataTrans = contextTrans.getImageData(0, 0, canvasTrans.width, canvasTrans.height)
//       // merge dataMap + dataTrans into dataResult
//       var dataResult = contextMap.createImageData(canvasResult.width, canvasResult.height)
//       for (var y = 0, offset = 0; y < imageMap.height; y++) {
//         for (var x = 0; x < imageMap.width; x++, offset += 4) {
//           dataResult.data[offset + 0] = dataMap.data[offset + 0]
//           dataResult.data[offset + 1] = dataMap.data[offset + 1]
//           dataResult.data[offset + 2] = dataMap.data[offset + 2]
//           dataResult.data[offset + 3] = 255 - dataTrans.data[offset + 0] / 2
//         }
//       }
//       // update texture with result
//       contextResult.putImageData(dataResult, 0, 0)
//       material.map.needsUpdate = true
//     })
//     imageTrans.src = `${baseUrl}/uranusringtrans.gif`
//   }, false)
//   imageMap.src = `${baseUrl}/uranusringcolour.jpg`

//   var geometry = new RingGeometry(0.55, 0.75, 64)
//   var material = new THREE.MeshPhongMaterial({
//     map: new THREE.Texture(canvasResult),
//     // map  : new THREE.TextureLoader().load(THREEx.Planets.baseURL+'images/ash_uvgrid01.jpg'),
//     side: THREE.DoubleSide,
//     transparent: true,
//     opacity: 0.8
//   })
//   var mesh = new THREE.Mesh(geometry, material)
//   mesh.lookAt(new THREE.Vector3(RADIUS, -4, 1))
//   return mesh
// }

// /**
//  * change the original from three.js because i needed different UV
//  *
//  * @author Kaleb Murphy
//  * @author jerome etienne
//  */
// export const RingGeometry = function (innerRadius, outerRadius, thetaSegments) {
//   THREE.Geometry.call(this)

//   innerRadius = innerRadius || 0
//   outerRadius = outerRadius || 50
//   thetaSegments = thetaSegments || 8

//   var normal = new THREE.Vector3(0, 0, 1)

//   for (var i = 0; i < thetaSegments; i++) {
//     var angleLo = (i / thetaSegments) * Math.PI * 2
//     var angleHi = ((i + 1) / thetaSegments) * Math.PI * 2

//     var vertex1 = new THREE.Vector3(innerRadius * Math.cos(angleLo), innerRadius * Math.sin(angleLo), 0)
//     var vertex2 = new THREE.Vector3(outerRadius * Math.cos(angleLo), outerRadius * Math.sin(angleLo), 0)
//     var vertex3 = new THREE.Vector3(innerRadius * Math.cos(angleHi), innerRadius * Math.sin(angleHi), 0)
//     var vertex4 = new THREE.Vector3(outerRadius * Math.cos(angleHi), outerRadius * Math.sin(angleHi), 0)

//     this.vertices.push(vertex1)
//     this.vertices.push(vertex2)
//     this.vertices.push(vertex3)
//     this.vertices.push(vertex4)

//     var vertexIdx = i * 4

//     // Create the first triangle
//     let face = new THREE.Face3(vertexIdx + 0, vertexIdx + 1, vertexIdx + 2, normal)
//     let uvs = []

//     uvs.push(new THREE.Vector2(0, 0))
//     uvs.push(new THREE.Vector2(1, 0))
//     uvs.push(new THREE.Vector2(0, 1))

//     this.faces.push(face)
//     this.faceVertexUvs[0].push(uvs)

//     // Create the second triangle
//     face = new THREE.Face3(vertexIdx + 2, vertexIdx + 1, vertexIdx + 3, normal)
//     uvs = []

//     uvs.push(new THREE.Vector2(0, 1))
//     uvs.push(new THREE.Vector2(1, 0))
//     uvs.push(new THREE.Vector2(1, 1))

//     this.faces.push(face)
//     this.faceVertexUvs[0].push(uvs)
//   }

//   this.computeCentroids()
//   this.computeFaceNormals()

//   this.boundingSphere = new THREE.Sphere(new THREE.Vector3(), outerRadius)
// }
// // RingGeometry.prototype = Object.create(THREE.Geometry.prototype)
