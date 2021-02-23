import { EARTH_RADIUS } from './constants.js'

export const deg2rad = (degrees) => degrees * (Math.PI / 180)
export const rad2deg = (angle) => angle * 57.29577951308232 // angle / Math.PI * 180

// Longitude and latitude conversion function, longitude for longitude, latitude for uniqueness, radius for sphere radius
export var getPosition = function (longitude = 0, latitude = 0, radius = EARTH_RADIUS) {
  // Convert longitude and latitude to rad coordinates
  var lg = deg2rad(longitude)
  var lt = deg2rad(latitude)
  var temp = radius * Math.cos(lt)
  // Get x, y, Z coordinates
  var x = temp * Math.sin(lg)
  var y = radius * Math.sin(lt)
  var z = temp * Math.cos(lg)

  return [x, y, z]
}
