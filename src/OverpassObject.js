var BoundingBox = require('boundingbox')
var OverpassFrontend = require('./defines')

function OverpassObject () {
  this.data = {}
  this.properties = 0
}

OverpassObject.prototype.member_ids = function () {
  return []
}

OverpassObject.prototype.updateData = function (data, request) {
  if (typeof this.id === 'undefined') {
    this.id = data.type.substr(0, 1) + data.id
    this.type = data.type
    this.osm_id = data.id
  }

  for (var k in data) {
    this.data[k] = data[k]
  }

  if (data.bounds) {
    this.bounds = new BoundingBox(data.bounds)
    this.center = this.bounds.getCenter()
  } else if (data.center) {
    this.bounds = new BoundingBox(data.center)
    this.center = this.bounds.getCenter()
  }

  if (request.options.bbox) {
    if (!this.bounds || request.options.bbox.intersects(this.bounds)) {
      this.properties = this.properties | request.options.properties
    } else {
      this.properties = this.properties | OverpassFrontend.BBOX | OverpassFrontend.CENTER
    }
  } else {
    this.properties = this.properties | request.options.properties
  }

  if (request.options.properties & OverpassFrontend.TAGS) {
    if (typeof data.tags === 'undefined') {
      this.tags = {}
    } else {
      this.tags = data.tags
    }
  }
  this.errors = []

  if (data.timestamp) {
    this.meta = {
      timestamp: data.timestamp,
      version: data.version,
      changeset: data.changeset,
      user: data.user,
      uid: data.uid
    }
  }

  if (data.tags) {
    this.tags = data.tags
  }
}

OverpassObject.prototype.title = function () {
  if (!this.tags) {
    return this.id
  }

  return this.tags.name || this.tags.operator || this.tags.ref
}

OverpassObject.prototype.GeoJSON = function () {
  return {
    type: 'Feature',
    id: this.type + '/' + this.osm_id,
    geometry: null,
    properties: this.GeoJSONProperties()
  }
}

OverpassObject.prototype.GeoJSONProperties = function () {
  var ret = {}
  var k

  ret['@id'] = this.type + '/' + this.osm_id

  if (this.tags) {
    for (k in this.tags) {
      ret[k] = this.tags[k]
    }
  }

  if (this.meta) {
    for (k in this.meta) {
      ret['@' + k] = this.meta[k]
    }
  }

  return ret
}

OverpassObject.prototype.intersects = function (bbox) {
  if (!this.bounds) {
    return 1
  }

  return bbox.intersects(this.bounds) ? 1 : 0
}

OverpassObject.prototype.leafletFeature = function (options) {
  return null
}

module.exports = OverpassObject
