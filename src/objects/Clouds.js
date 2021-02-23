
export default class Clouds {
  constructor ({ radius = 1, segments = 32, THREE } = {}) {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(radius + 0.008, segments, segments),
      new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('/images/fair_clouds_4k.png'),
        transparent: true
      })
    )
    mesh.name = 'clouds'
    this.mesh = mesh
  }

  render () {
    const { mesh, settings } = this
    mesh.rotation.x += settings.rotation.x
    mesh.rotation.y += settings.rotation.y
  }
}

// var clouds = createClouds(radius + settings.clouds.height / 10000, segments)
// clouds.rotation.y = rotation
// scene.add(clouds)
