// https://github.com/tracks-earth/cesium/blob/master/Source/Core/ArcGISTiledElevationTerrainProvider.js
// https://www.npmjs.com/package/lerc
// https://sandcastle.cesium.com/?src=ArcGIS%20Tiled%20Elevation%20Terrain.html

import { LercDecode } from './LercDecode.js'

export class ArcGISTiledElevationTerrainProvider {
  constructor (settings = {}) {
    this.url = settings.url || 'https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer'

    // https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer/?f=pjson

    // Test
    // this.getTile(1, 1)
  }

  /**
   * https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer/tile/0/0/0
   * https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer/tile/0/1/0
   * https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer/tile/1/0/0
   * https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer/tile/1/2/1
   * @param {*} x
   * @param {*} y
   * @param {*} level 0 .. 16
   */
  getTile (x = 0, y = 0, level = 0) {
    return fetch(`${this.url}/tile/${level}/${y}/${x}`)
      .then(response => response.arrayBuffer())
      .then(body => {
        const image = LercDecode.decode(body)
        // console.log(image) // 257
        return image
      })
  }
}
