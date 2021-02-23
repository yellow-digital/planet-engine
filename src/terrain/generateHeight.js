import { ImprovedNoise } from 'https://unpkg.com/three@0.125.0/examples/jsm/math/ImprovedNoise.js'

export function generateHeight (width, height) {
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

// return array with height data from img
export function getHeightData (img, scale = 1) {
  var canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  var context = canvas.getContext('2d')

  var size = img.width * img.height
  var data = new Float32Array(size)

  context.drawImage(img, 0, 0)

  for (let i = 0; i < size; i++) {
    data[i] = 0
  }

  var imgd = context.getImageData(0, 0, img.width, img.height)
  var pix = imgd.data

  var j = 0
  for (let i = 0; i < pix.length; i += 4) {
    var all = pix[i] + pix[i + 1] + pix[i + 2]
    data[j++] = all / (12 * scale)
  }

  return data
}
