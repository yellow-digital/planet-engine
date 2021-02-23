/*
SceneManager for ThreeJs

# Usage
const manager = new SceneManager({renderer, scene, camera})

manager.push({ mesh: {}, render() { } })
manager.push({ mesh: {}, render() { } })
*/

export class SceneEntity {
  // constructor () { }

  render () {}
}

//  //////////////////////////////////////////////////////////////////////////////////
//  //  render the scene      //
//  //////////////////////////////////////////////////////////////////////////////////
//  updateFcts.push(function(){
//   renderer.render( scene, camera );
//  })

//  //////////////////////////////////////////////////////////////////////////////////
//  //  loop runner       //
//  //////////////////////////////////////////////////////////////////////////////////
//  var lastTimeMsec= null
//  requestAnimationFrame(function animate(nowMsec){
//   // keep looping
//   requestAnimationFrame( animate );
//   // measure time
//   lastTimeMsec = lastTimeMsec || nowMsec-1000/60
//   var deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
//   lastTimeMsec = nowMsec
//   // call each update function
//   updateFcts.forEach(function(updateFn){
//    updateFn(deltaMsec/1000, nowMsec/1000)
//   })
//  })
export default class SceneManager {
  constructor (viewer = {}, cb = () => {}) {
    const { scene } = viewer

    this.renderers = []
    this.scene = scene

    var lastTime = null
    const render = (now) => {
      //   // measure time
      lastTime = lastTime || now - 1000 / 60
      var delta = now - lastTime // Math.min(200, now - lastTime)
      lastTime = now
      // console.log(delta)

      // Stop fn
      const stop = (index) => {
        this.renderers.splice(index, 1)
      }

      // Call each renderer
      this.renderers.forEach((mixed, index) => {
        // Object with render method ?
        if (mixed.render) {
          return mixed.render(delta, {
            stop () { stop(index) },
            ...mixed
          })
        }

        // Function
        return mixed(delta, {
          stop () { stop(index) }
        })
      })

      // Emit render done
      cb()

      // Keep running
      requestAnimationFrame(render)
    }

    // Start render
    render()
  }

  // alias
  add (item = new SceneEntity()) {
    this.push(item)
  }

  removeByIndex (index = 0) {
    this.renderers.splice(index, 1)
  }

  push (item = new SceneEntity()) {
    if (item.mesh) {
      this.scene.add(item.mesh)
    }

    return this.renderers.push(item)
  }
}
