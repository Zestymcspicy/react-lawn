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
    window.mapbox = this.map;
    let directions=this.directions;
    (async function(){
      window.mapbox.fitBounds([directions.geometry.coordinates[0], directions.geometry.coordinates[1]])
    })().then(() => {
      // this.map.zoomTo(18);
      console.log(this.activeLocator);
      let coords;
      if(this.activeLocator._lastKnownPosition){
        coords=this.activeLocator._lastKnownPosition.coords;
      } else {
        coords = this.geometryArray.coordinates[0];
      };
      console.log(coords);
      setTimeout(()=>{
        this.map.setCenter(coords)
        this.map.setZoom(18);
        this.map.setBearing(bearing);
        this.useWatchPosition();
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
      bearing: x.heading,
      speed: x.speed
    }
    console.log(TurnByTurn.geometryArray);
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

export { TurnByTurn }
