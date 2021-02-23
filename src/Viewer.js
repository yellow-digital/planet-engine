import * as THREE from './three.js'
import {
  fitCameraToObject,
  cameraFlyTo,
  cameraLookAt,
  cameraFlyToPosition
} from './camera.js'
import { SceneManager, OrbitControls } from './index.js'

const SETTINGS = {
  el: 'webgl',
  sphereRotation: 0.0002,
  camera: {
    near: 1,
    far: 100000000,
    fov: 45
  },
  defaultLight: true,
  clouds: {
    rotation: {
      x: 0.001,
      y: 0.0005
    },
    height: 1000
  },
  debug: false
}

export class Viewer {
  constructor (_settings = SETTINGS) {
    // Merge settings
    const settings = {
      ...SETTINGS,
      ..._settings
    }

    const { el, debug } = settings

    var container = document.getElementById(el)

    // Create scene
    var scene = new THREE.Scene()

    // Group to put all elements except skyboxes, ..
    // const content = new THREE.Group()
    // content.name = 'Entities'
    // scene.add(content)

    // Camera
    // TODO use elements AR
    var width = window.innerWidth
    var height = window.innerHeight
    const aspectRatio = width / height
    const { near, far, fov } = settings.camera
    var camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far)
    camera.position.x = 1.5
    camera.position.y = 1.5
    camera.position.z = 1.5

    // Create renderer
    var renderer = new THREE.WebGLRenderer({
      antialias: true
      // logarithmicDepthBuffer: true
    })
    renderer.setSize(width, height)

    // Lighs
    if (settings.defaultLight) {
      console.log('[default lights]')
      scene.add(new THREE.AmbientLight(0x333333))
      var light = new THREE.DirectionalLight(0xffffff, 1)
      light.position.set(5, 3, 5)
      scene.add(light)
    }

    // https://stackoverflow.com/questions/18813481/three-js-mousedown-not-working-when-trackball-controls-enabled
    // make sure that your container.append(renderer.domElement); is executed before initializing THREE.TrackballControls( camera, renderer.domElement );
    container.appendChild(renderer.domElement)

    // Handle resize
    function onWindowResize () {
      var width = container.offsetWidth
      var height = container.offsetHeight || window.innerHeight
      if (debug) {
        console.log(`[resize] ${width} x ${height}`)
      }

      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener('resize', onWindowResize, false)

    // Create a scene manager to control the rendering of elements
    const manager = new SceneManager({ scene, renderer }, () => {
      renderer.render(scene, camera)
    })

    // Default to OrbitControls
    var controls = new OrbitControls(camera, container)
    this.controls = controls

    // Handle controls update
    manager.push((delta) => {
      const { controls } = this

      if (controls) {
        // TrackedEntity ?
        if (this._trackedEntity) {
          controls.target =
          // object.position
          this._trackedEntity.getWorldPosition(new THREE.Vector3())
        }

        controls.update(delta / 1000)
      }
    })

    Object.assign(this, {
      el: container,
      container,
      scene,
      manager,
      // controls,
      renderer,
      camera,
      settings
    })
  }

  get controller () { }

  set controller (c) {
    console.log('[controls] set to', c)

    // Dispose previous
    if (this.controls) {
      this.controls.dispose()
    }

    // Set new
    this.controls = c
  }

  // =========
  // trackedEntity
  // =========
  get trackedEntity () { return this._trackedEntity }

  set trackedEntity (object = null) {
    if (!object) {
      console.log(`[setTrackedEntity]: stopped`)
      this._trackedEntity = null
      return
    }

    console.log(`[setTrackedEntity]: ${object.name || '?'}`)
    this._trackedEntity = object

    this.controller = new OrbitControls(this.camera, this.container)

    // Set target
    // controls.update() must be called after any manual changes to the camera's transform
    // const { controls } = this
    // camera.position.set(0, 20, 100)
    // camera.target = object
    // camera.lookAt(object.getWorldPosition())
    // Updated in controls renderer
    // controls.target =
    //   // object.position
    //   object.getWorldPosition(new THREE.Vector3())
    // controls.update()

    // this.camera.target = object
    // this.controls.target = object
  }

  // TODO
  // setTrackedEntityFlyTo (object = {}) {
  //   console.log('setTrackedEntity', object)

  //   this._trackedEntity = object

  //   const tween = cameraFlyTo(object, {}, this)
  //   console.log(tween)

  //   tween.onComplete(function () {
  //     // controls.target.set(this.x, this.y, this.z)
  //     console.log('Finished')

  //     // Change controls to OrbitControl
  //     // this.controller = new OrbitControls(this.camera, this.container)
  //     // // Set target
  //     // this.camera.target = object
  //   })
  // }

  // Alias
  setTrackedEntity (object = {}) {
    this.trackedEntity = object
  }

  // =========
  // Camera control
  // =========
  lookAt (object = {}, settings = {}) {
    return cameraLookAt(object, this, settings)
    // Direct
    // this.camera.lookAt(mesh.getWorldPosition(), settings)
  }

  flyToPosition (to = new THREE.Vector3()) {
    return cameraFlyToPosition({ from: this.camera.position, to, distance: 10000 }, this)
  }

  flyTo (mesh = new THREE.Mesh(), settings = {}) {
    // Disable trackedEntity
    this.trackedEntity = null
    // Disable controls
    this.controller = null

    return cameraFlyTo(mesh, settings, this)
  }

  zoomAll () {
    return fitCameraToObject(this.scene.content, this)
  }

  zoomTo (what = {}) {
    return fitCameraToObject(what, this)
  }

  add (what = {}) {
    // Proxy to SceneManager
    this.manager.add(what)
  }
}
