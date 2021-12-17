const assert = require('assert').strict
const BoundingBox = require('boundingbox')

const OverpassWay = require('../src/OverpassWay')
const OverpassFrontend = require('..')

const example = {
  "type": "way",
  "id": 299709376,
  "timestamp": "2014-08-23T18:33:19Z",
  "version": 1,
  "changeset": 24962130,
  "user": "Kevin Kofler",
  "uid": 770238,
  "bounds": {
    "minlat": 48.1986493,
    "minlon": 16.3385645,
    "maxlat": 48.1989158,
    "maxlon": 16.3386515
  },
  "nodes": [
    3037431639,
    3037431690,
    3037431691,
    3037431692,
    3037431693,
    3037431694,
    3037431695,
    3037431680
  ],
  "geometry": [
    { "lat": 48.1989158, "lon": 16.3385645 },
    { "lat": 48.1988801, "lon": 16.3385907 },
    { "lat": 48.1988310, "lon": 16.3386213 },
    { "lat": 48.1987690, "lon": 16.3386461 },
    { "lat": 48.1987326, "lon": 16.3386515 },
    { "lat": 48.1987013, "lon": 16.3386488 },
    { "lat": 48.1986768, "lon": 16.3386399 },
    { "lat": 48.1986493, "lon": 16.3386184 }
  ],
  "tags": {
    "highway": "footway",
    "name": "Emil-Maurer-Platz",
    "source": "basemap.at"
  }
}

describe('OverpassWay', function () {
  describe('with geometry', function () {
    const ob = new OverpassWay('w299709376')
    ob.overpass = new OverpassFrontend('')
    ob.updateData(example, { properties: 63 })

    it('intersect() -- with BoundingBox', function (done) {
      let result = ob.intersects(new BoundingBox({minlon: 16, minlat: 48, maxlon: 17, maxlat: 49}))
      assert.equal(result, 2)

      result = ob.intersects(new BoundingBox({minlon: 16, minlat: 48, maxlon: 16.2, maxlat: 49}))
      assert.equal(result, 0)

      result = ob.intersects(new BoundingBox({ minlon: 16.3385746255517, minlat: 48.198845168318556, maxlon: 16.33860144764185, maxlat: 48.19885924739677 }))
      assert.equal(result, 0)

      result = ob.intersects(new BoundingBox({ minlon: 16.338586695492268, minlat: 48.19886528128624, maxlon: 16.338611505925655, maxlat: 48.198870644742975 }))
      assert.equal(result, 2)

      done()
    })
  })

  describe('with bounds only', function () {
    const ob = new OverpassWay('w299709376')
    ob.overpass = new OverpassFrontend('')
    let d = JSON.parse(JSON.stringify(example))
    delete d.geometry
    ob.updateData(d, { properties: 7 })

    it('intersect() -- with BoundingBox', function (done) {
      let result = ob.intersects(new BoundingBox({minlon: 16, minlat: 48, maxlon: 17, maxlat: 49}))
      assert.equal(result, 2)

      result = ob.intersects(new BoundingBox({minlon: 16, minlat: 48, maxlon: 16.2, maxlat: 49}))
      assert.equal(result, 0)

      result = ob.intersects(new BoundingBox({ minlon: 16.3385746255517, minlat: 48.198845168318556, maxlon: 16.33860144764185, maxlat: 48.19885924739677 }))
      assert.equal(result, 1)

      result = ob.intersects(new BoundingBox({ minlon: 16.338586695492268, minlat: 48.19886528128624, maxlon: 16.338611505925655, maxlat: 48.198870644742975 }))
      assert.equal(result, 1)

      done()
    })
  })

  describe('without geometry', function () {
    const ob = new OverpassWay('w299709376')
    ob.overpass = new OverpassFrontend('')
    let d = JSON.parse(JSON.stringify(example))
    delete d.geometry
    delete d.bounds
    ob.updateData(d, { properties: 7 })

    it('intersect() -- with BoundingBox', function (done) {
      let result = ob.intersects(new BoundingBox({minlon: 16, minlat: 48, maxlon: 17, maxlat: 49}))
      assert.equal(result, 0) // WRONG

      result = ob.intersects(new BoundingBox({minlon: 16, minlat: 48, maxlon: 16.2, maxlat: 49}))
      assert.equal(result, 0) // WRONG

      result = ob.intersects(new BoundingBox({ minlon: 16.3385746255517, minlat: 48.198845168318556, maxlon: 16.33860144764185, maxlat: 48.19885924739677 }))
      assert.equal(result, 0) // WRONG

      result = ob.intersects(new BoundingBox({ minlon: 16.338586695492268, minlat: 48.19886528128624, maxlon: 16.338611505925655, maxlat: 48.198870644742975 }))
      assert.equal(result, 0) // WRONG

      done()
    })
  })
})
