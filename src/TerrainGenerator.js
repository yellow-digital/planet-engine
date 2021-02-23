// Based on https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_terrain.html

import * as THREE from './three.js'
import { ImprovedNoise } from 'https://unpkg.com/three@0.125.0/examples/jsm/math/ImprovedNoise.js'

export class TerrainGenerator {
  constructor () {
    const worldWidth = 256
    const worldDepth = 256

    const geometry = new THREE.PlaneGeometry(7500, 7500, worldWidth - 1, worldDepth - 1)
    geometry.rotateX(-Math.PI / 2)

    const vertices = geometry.attributes.position.array

    const data = generateHeight(worldWidth, worldDepth)
    for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
      vertices[j + 1] = data[i] * 10
    }

    const texture = new THREE.CanvasTexture(generateTexture(data, worldWidth, worldDepth))
    texture.wrapS = THREE.ClampToEdgeWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping

    const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ map: texture }))

    // Attach
    mesh.name = 'Terrain'
    this.mesh = mesh
  }

  render () {
  }
}

function generateHeight (width, height) {
  const size = width * height; const data = new Uint8Array(size)
  const perlin = new ImprovedNoise(); const z = Math.random() * 100

  let quality = 1

  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < size; i++) {
      const x = i % width; const y = ~~(i / width)
      data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 1.75)
    }

    quality *= 5
  }

  return data
}

function generateTexture (data, width, height) {
  let context, image, imageData, shade

  const vector3 = new THREE.Vector3(0, 0, 0)

  const sun = new THREE.Vector3(1, 1, 1)
  sun.normalize()

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  context = canvas.getContext('2d')
  context.fillStyle = '#000'
  context.fillRect(0, 0, width, height)

  image = context.getImageData(0, 0, canvas.width, canvas.height)
  imageData = image.data

  for (let i = 0, j = 0, l = imageData.length; i < l; i += 4, j++) {
    vector3.x = data[j - 2] - data[j + 2]
    vector3.y = 2
    vector3.z = data[j - width * 2] - data[j + width * 2]
    vector3.normalize()

    shade = vector3.dot(sun)

    imageData[i] = (96 + shade * 128) * (0.5 + data[j] * 0.007)
    imageData[i + 1] = (32 + shade * 96) * (0.5 + data[j] * 0.007)
    imageData[i + 2] = (shade * 96) * (0.5 + data[j] * 0.007)
  }

  context.putImageData(image, 0, 0)

  // Scaled 4x

  const canvasScaled = document.createElement('canvas')
  canvasScaled.width = width * 4
  canvasScaled.height = height * 4

  context = canvasScaled.getContext('2d')
  context.scale(4, 4)
  context.drawImage(canvas, 0, 0)

  image = context.getImageData(0, 0, canvasScaled.width, canvasScaled.height)
  imageData = image.data

  for (let i = 0, l = imageData.length; i < l; i += 4) {
    const v = ~~(Math.random() * 5)

    imageData[i] += v
    imageData[i + 1] += v
    imageData[i + 2] += v
  }

  context.putImageData(image, 0, 0)

  return canvasScaled
}
