// import React, {useState} from 'react';
// import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';

const TurnByTurn = {
  directions: {},
  map: {},
  routeLayer: {},
  presentLayerId: "",
  layersArray: [],
  currentStep: {},
  upcomingStep: {},
  activeLocator: {},
  geometryArray: [],
  navCallback: "",


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
        // if(bearing!=null){
          this.map.setCenter(coords)
          this.map.setZoom(18);
          this.map.setBearing(bearing);
        // } else {
          // this.map.setZoom(16);
        // }
      },500);
      console.log(this.directions)
      this.useWatchPosition();
    });
  },

  useWatchPosition: function() {
    this.navCallback = navigator.geolocation.watchPosition(this.onLocationChange);
  },

  onLocationChange: function(x){
    console.log(x);
  }

}

export { TurnByTurn }
