import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import Directions from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';
const MapboxGeocoder = require('@mapbox/mapbox-gl-geocoder')
const client = require('@mapbox/mapbox-sdk')
const mbxDirections = require('@mapbox/mapbox-sdk/services/directions')
const mbxGeocoder = require('@mapbox/mapbox-sdk/services/geocoding')

let destinationBox;

class Map extends Component {
  constructor(props){
    super(props)
    this.state = {
      userLngLat: [],
    }
    const myApp = this;
    this.geoLocateOptions={enableHighAccuracy: true};
    this.mbxToken = 'pk.eyJ1IjoiemVzdHltY3NwaWN5IiwiYSI6ImNqc281djVneTA5MzAzeXJ2ZWVoMjhmdzMifQ.uT5Hz9PEBvuLwVrZkrkp8A'
    this.baseClient = client({ accessToken: this.mbxToken});
    this.directionsService = mbxDirections(this.baseClient);
    this.geolocationService = mbxGeocoder(this.baseClient);
    this.applyDirections = this.applyDirections.bind(this);
    openChangeOriginBox = openChangeOriginBox.bind(this)
  }



componentDidMount (){
  const myApp = this;
  if(navigator.geolocation){
  navigator.geolocation.getCurrentPosition(function (pos) {
    let loc = [pos.coords.longitude, pos.coords.latitude];
    myApp.initAll(loc);
    myApp.addOriginLocationText(loc);

  }, this.errorFunction, this.geoLocateOptions)
}else{
  myApp.noGeoStart()
}
}
errorFunction(error, myApp) {
  console.log(error);
  myApp.noGeoStart();
}

noGeoStart(){
  let loc = [-95.2, 38.9];
  this.initAll(loc);
}

initAll(loc) {
  this.addMap()
  this.addDirections(loc)
  this.setMapCenter(loc);
  this.setUserLocation(loc);
  this.addDestinationBox(loc);
}

addMap() {
  const myApp =this;
    mapboxgl.accessToken = myApp.mbxToken;
    myApp._map = new mapboxgl.Map({
      container: myApp.myMap,
      style: 'mapbox://styles/mapbox/navigation-guidance-day-v2',
      zoom: 12,
      boxZoom: true,
      pitch: 60
    });
    myApp._map.on('click', function(event) {
      myApp.getDirections([event.lngLat.lng, event.lngLat.lat]);
    })
    this.userLocationMarker= new mapboxgl.Marker()
  }

addDirections(loc) {
    this.directions = new Directions({
      accessToken: mapboxgl.accessToken,
      profile: 'mapbox/driving',
      steps: true,
      geocoder: {proximity: loc, reverseGeocode: true},
      bannerInstructions: true,
      controls: {
        inputs: false,
        profileSwitcher: false,
        instructions: false
      }
    });
    this._map.addControl(this.directions);
    this.setState({userLngLat: loc})
    this.directions.setOrigin(loc)
    const myApp = this;
    this.directions.on('origin', function(event) {
      let origin = event.feature.geometry.coordinates;
      myApp.directions.options.geocoder.proximity = origin;
    })
  }



addOriginLocationText(loc) {
  if(loc!==null){
  const myApp = this;
  this.geolocationService.reverseGeocode({
    query: loc,
    limit: 2,
    mode: 'mapbox.places',
    types: ['address']
  }).send()
  .then(response => {
    const newOriginText = response.body.features[0].place_name;
    myApp.props.setOriginText(newOriginText);
  })
}
}


addDestinationBox(loc){
  destinationBox = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    placeholder: "Where to?",
    proximity: loc
  })
  this._map.addControl(destinationBox, 'top-left');
  const myApp = this;
  destinationBox.on("result", function(ev) {
    let userDestination = ev.result.geometry.coordinates;
    myApp.getDirections(userDestination);
  })
}

setMapCenter(location)  {
    this._map.setCenter(location);
}

setUserLocation(location) {
    this.userLocationMarker.remove();
    this.userLocationMarker.setLngLat(location);
    this.userLocationMarker.addTo(this._map);
}

getDirections(destination) {
  this.props.setDestination(destination);
  this.directionsService.getDirections({
    profile: 'driving',
    geometries: 'geojson',
    steps: true,
    bannerInstructions: true,
    waypoints: [
      {
        coordinates: this.state.userLngLat
      },
      {
        coordinates: destination,
        approach: 'curb'
      }
  ]
  })
  .send()
  .then(response => {
      let route = response.body.routes[0].geometry.coordinates;
      let nearEndpoint = route.slice(-2,-1)[0];
      this.props.setNearEndpoint(nearEndpoint);
      this.applyDirections(nearEndpoint, destination);
  })
}

applyDirections(nearEndpoint, destination){
  this.directions.setOrigin(this.state.userLngLat);
  this.directions.setWaypoint(1, nearEndpoint);
  this.directions.setDestination(destination);

}


render(){
  const mapStyle = {
    zIndex: -1,
    top: "10%",
    left:"0",
    right:"0",
    bottom: "0",
    position:"absolute",
    width: "100%",
  }
  return(

      <div ref={el => this.myMap = el} style={mapStyle}/>

  )
  }

}

let changeOriginBox;
export function openChangeOriginBox() {
  this.props.toggleOriginBox()
  changeOriginBox = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    placeholder: "New origin?",
    className: "mapboxgl-ctrl"
  })
  const myMap = this;
  this._map.addControl(changeOriginBox);
  changeOriginBox.on("result", function(pos) {
    const loc = pos.result.geometry.coordinates
    myMap._map.removeControl(changeOriginBox)
    myMap.addOriginLocationText(loc);
    myMap.initAll(loc);
    myMap.props.toggleOriginBox();
  })
}
export default Map
