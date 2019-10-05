// import {lineString} from "url:https://unpkg.com/@turf/helpers?module"
// import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
const turf = window.turf

const TurnByTurn = {
  directions: {},
  map: {},
  routeLayer: {},
  presentLayerId: "",
  layersArray: [],
  currentStep: 0,
  upcomingStep: 1,
  activeLocator: {},
  geometryArray: [],
  navCallback: "",
  currentLocation: {},
  distanceToNextManeuver: 0,
  geoOptions:{
    enableHighAccuracy: true
  },


  addLine: function(directions) {
    this.directions = directions;
    this.geometryArray = directions.geometry;
    TurnByTurn.routeLayer = this.map.getLayer(this.presentLayerId);
    if(TurnByTurn.routeLayer!==undefined){
      this.map.removeLayer(this.presentLayerId);
    }
    this.presentLayerId = `route${Date.now()}`
    this.map.addLayer({
      "id": this.presentLayerId,
      "type": "line",
      "source": {
        "type": "geojson",
        "data": {
          "type": "Feature",
          "properties": {},
          "geometry": this.geometryArray
        }
      },
      "layout": {
        "line-join": "round",
        "line-cap": "round"
      },
      "paint": {
        "line-color": "#3615E4",
        "line-width": 8
      }
    })
  },


  startNav: function(bearing) {
    locArrow.onAdd();
    locArrow.render();
    this.useWatchPosition();
    window.mapbox = this.map;
    let directions=this.directions;
    (async function(){
      window.mapbox.fitBounds([directions.geometry.coordinates[0], directions.geometry.coordinates[1]])
    })().then(() => {
      let coords;
      if(this.currentLocation.lngLat){
        coords=this.currentLocation.lngLat
          console.log(`locator ${coords}`)
      } else {
        coords = this.geometryArray.coordinates[0];
      };
      console.log(coords);
      setTimeout(()=>{
        this.map.setCenter(coords)
        this.map.setZoom(18);
        this.map.setBearing(bearing);
      },500);
      console.log(this.directions)
    });
  },

  useWatchPosition: function() {
    this.navCallback = navigator.geolocation.watchPosition(this.onLocationChange, this.errorFunction, this.geoOptions);
  },

  errorFunc: function(error) {
    console.log(error)
  },

  onLocationChange: function(x){
    TurnByTurn.currentLocation = {
      lngLat: [x.coords.longitude, x.coords.latitude],
      // bearing: x.heading,
      bearing: 120,
      speed: x.speed
    }
    console.log(TurnByTurn.geometryArray);
    if(TurnByTurn.map.hasImage('loc-Arrow')){
      locArrow.updatePosition();
    } else {
      locArrow.addArrowToMap();
    }
    TurnByTurn.getDistanceToNextManeuver(TurnByTurn.currentLocation.lngLat, TurnByTurn.geometryArray.coordinates[1])
  },

  getDistanceToNextManeuver: function(currentLocation, nextManeuverLocation){
    var distanceLine = {
      "type": "FeatureCollection",
      "features": [{
        "type": "Feature",
        "geometry": {
          "type": "LineString",
          "coordinates": [
            currentLocation,
            nextManeuverLocation
          ]
        }
      }]
    };
    window.distanceLine = distanceLine;
    let distance = turf.length(distanceLine, {units: 'miles'});
    console.log(distance)
    TurnByTurn.distanceToNextManeuver = distance;
  },
}
var size=100;
var locArrow = {
  width: size,
  height: size,
  data: new Uint8Array(size * size * 4),
  point: {},

  onAdd: function() {
    var canvas = document.createElement('canvas');
    canvas.width = this.width;
    canvas.height = this.height;
    this.context = canvas.getContext('2d');
  },

  render: function() {
    var duration = 1000;
    var t = (performance.now() % duration) / duration;

    // var radius = size / 2 * 0.3;
    // var outerRadius = size / 2 * 0.7 * t + radius;
    var context = this.context;

    // draw outer circle
    context.clearRect(0, 0, this.width, this.height);
    context.beginPath();
    // context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
    context.moveTo(100,100);
    context.lineTo(50,0);
    context.lineTo(0, 100);
    context.lineTo(50, 75);
    context.lineTo(100, 100);
    context.fillStyle = '#0e58aa';
    context.fill();
    context.stroke();

    // draw inner circle
    context.beginPath();
    // context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
    context.fillStyle = '#0e58aa';
    context.strokeStyle = 'white';
    context.lineWidth = 2 + 4 * (1 - t);
    context.fill();
    context.stroke();

    // update this image's data with data from the canvas
    this.data = context.getImageData(0, 0, this.width, this.height).data;

    // keep the map repainting
    TurnByTurn.map.triggerRepaint();

    // return `true` to let the map know that the image was updated
    return true;
  },

  addArrowToMap: function(){
    if(TurnByTurn.map.getLayer('point')){
      TurnByTurn.map.removeLayer('point')
    }
    if(!TurnByTurn.map.hasImage('loc-Arrow')){
      TurnByTurn.map.addImage('loc-Arrow', locArrow, { pixelRatio: 2 });
    }

    locArrow.point = {
      "type": "FeatureCollection",
      "features": [{
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Point",
          "coordinates": TurnByTurn.currentLocation.lngLat
        }
      }]
    };

    TurnByTurn.map.addSource('point', {
      "type": "geojson",
      "data": locArrow.point
    })
    TurnByTurn.map.addLayer({
      "id": "point",
      "type": "symbol",
      "source": "point",
      "layout": {
        "icon-image": "loc-Arrow",
        "icon-rotate": ["get", "bearing"],
        "icon-rotation-alignment": "map",
        "icon-allow-overlap": true,
        "icon-ignore-placement": true
      }
    });
  },

  updatePosition: function() {
    locArrow.point.features[0].geometry.coordinates=TurnByTurn.currentLocation.lngLat;
    locArrow.point.features[0].properties.bearing=TurnByTurn.currentLocation.bearing;
    TurnByTurn.map.getSource('point').setData(locArrow.point)
  }


};
window.locArrow=locArrow
window.TurnByTurn=TurnByTurn


export { TurnByTurn }
