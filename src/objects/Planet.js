// example https://github.com/mrdoob/three.js/blob/master/examples/webgl_shaders_ocean.html
import { EARTH_RADIUS } from '../constants.js'
import * as THREE from '../three.js'

const DEFAULT = {

}

export const createEarthMaterial4K = () => {
  return new THREE.MeshPhongMaterial({
    // 4k
    map: new THREE.TextureLoader().load('/images/4k/map.jpg'),
    bumpMap: new THREE.TextureLoader().load('/images/4k/bump.jpg'),
    bumpScale: 0.005,
    specularMap: new THREE.TextureLoader().load('/images/4k/water.png'),
    specular: new THREE.Color('grey')
  })
}

export const createEarthMaterial10K = () => {
  return new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load('/images/10k/map.jpg'),
    // map: new THREE.TextureLoader().load('/images/earthlights10k.jpg'),
    bumpMap: new THREE.TextureLoader().load('/images/10k/bump.jpg'),
    bumpScale: 0.005,
    specularMap: new THREE.TextureLoader().load('/images/10k/water.jpg'),
    specular: new THREE.Color('grey')
  })
}

export const createEarthMaterial = ({ quality = '4k' } = {}) => {
  return quality === '4k' ? createEarthMaterial4K() : createEarthMaterial10K()
}

export function createSphereMesh ({
  radius = EARTH_RADIUS,
  segments = 256
} = {}) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(radius, segments, segments),
    new THREE.MeshPhongMaterial()
  )
  mesh.name = 'sphere'
  return mesh
}

const RADIUS = 6000

const applyTerrainToSphere = (geometry = {}, data = [], scale = 0.1) => {
  // const geometry = this.mesh.geometry
  const vertices = geometry.attributes.position.array

  for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
    var vector = new THREE.Vector3()
    vector.set(vertices[j + 0], vertices[j + 1], vertices[j + 2])
    vector.setLength(data[i] * scale + RADIUS)
    // console.log(data[i])
    vertices[j] = vector.x
    vertices[j + 1] = vector.y
    vertices[j + 2] = vector.z
  }
  geometry.attributes.position.needsUpdate = true
}

export const applyTerrainToPlane = (geometry = {}, data = [], scale = 0.1) => {
  // const geometry = mesh.geometry
  const vertices = geometry.attributes.position.array
  for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
    vertices[j + 1] = data[i] * scale
  }
  geometry.attributes.position.needsUpdate = true
}

export class Planet {
  constructor (settings = DEFAULT) {
    // const worldWidth = 20
    // const worldDepth = 20
    const worldWidth = 256
    const worldDepth = 256

    const geometry =
      new THREE.SphereGeometry(RADIUS, worldWidth, worldDepth)
      // new THREE.PlaneGeometry(7500 * 2, 7500, worldWidth - 1, worldDepth - 1)
      // geometry.rotateX(-Math.PI / 2)

    geometry.rotateY(-Math.PI / 2)

    const material = new THREE.MeshStandardMaterial({
      // wireframe: true,
      color: 'green',
      // vertexColors: THREE.VertexColors,
      flatShading: true,
      side: THREE.DoubleSide
    })

    const mesh = new THREE.Mesh(
      geometry,
      material
    )

    mesh.name = 'planet'
    this.mesh = mesh

    // Upgrade material
    // return new Promise((resolve) => {
    //   mesh.material = createEarthMaterial()
    // })
    // const earthMaterial = createEarthMaterial()
    // mesh.material = earthMaterial
  }

  get terrainProvider () { return this._terrainProvider }

  set terrainProvider (value) {
    this._terrainProvider = value
    this.update()
  }

  async update () {
    const bumpScale = 0.10

    this.terrainProvider.getTile(0, 0, 0).then(elem => {
      // console.log(elem)
      // Apply height to mesh
      applyTerrainToSphere(this.mesh.geometry, elem.pixelData, bumpScale)
    })
    // this.terrainProvider.getTile(1, 0, 0).then(elem => {
    //   console.log(elem)
    //   // Apply height to mesh
    //   applyTerrain(elem.pixelData)
    // })
  }

  render () {
    // const { mesh } = this
    // mesh.material.uniforms['time'].value += 1.0 / 60.0
  }
}
