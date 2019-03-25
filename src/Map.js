import React, { Component } from 'react';
import { TurnByTurn } from './TurnByTurn.js';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
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
      showStartButton: false,
      userLngLat: [],
      customOrigin: false
    }
    this.geoLocateOptions={enableHighAccuracy: true};
    this.mbxToken = 'pk.eyJ1IjoiemVzdHltY3NwaWN5IiwiYSI6ImNqc281djVneTA5MzAzeXJ2ZWVoMjhmdzMifQ.uT5Hz9PEBvuLwVrZkrkp8A'
    this.baseClient = client({ accessToken: this.mbxToken});
    this.directionsService = mbxDirections(this.baseClient);
    this.geolocationService = mbxGeocoder(this.baseClient);
    this.beginNavigation = this.beginNavigation.bind(this);
    openChangeOriginBox = openChangeOriginBox.bind(this);
    setSavedDirections = setSavedDirections.bind(this);
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

async initAll(loc) {
  await this.addMap();
  this.setState({userLngLat: loc})
  this.setMapCenter(loc);
  this.setUserLocation(loc);
  this.addDestinationBox(loc);
  this.addGeolocator();
};

addMap() {
  const myApp =this;
    mapboxgl.accessToken = myApp.mbxToken;
    myApp._map = new mapboxgl.Map({
      container: myApp.myMap,
      style: 'mapbox://styles/mapbox/navigation-guidance-day-v2',
      zoom: 14,
      boxZoom: true,
      pitch: 60
    });
    myApp._map.on('click', function(event) {
      event.preventDefault()
    })
    this.navControl = new mapboxgl.NavigationControl()
    this._map.addControl(this.navControl, 'bottom-right')
    this.userLocationMarker = new mapboxgl.Marker()
    this.destinationMarker = new mapboxgl.Marker()
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
  this.destinationBox = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    placeholder: "Where to?",
    proximity: loc
  })
  this._map.addControl(this.destinationBox, 'top-left');
  const myApp = this;
  this.destinationBox.on("result", function(ev) {
    let userDestination = {
      place_name: ev.result.place_name,
      coords: ev.result.geometry.coordinates
    };
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
    this.originPopUp = new mapboxgl.Popup().addTo(this._map)
    this.originPopUp.setText("Origin")
    this.userLocationMarker.setPopup(this.originPopUp)

}

getDirections(destination) {
  this.destinationMarker.remove();
  this.destinationMarker.setLngLat(destination.coords);
  this.destinationMarker.addTo(this._map);
  this.destinationPopUp = new mapboxgl.Popup().addTo(this._map)
  this.destinationPopUp.setText("Destination")
  this.destinationMarker.setPopup(this.destinationPopUp)
  this.props.setDestination(destination);
  this.directionsService.getDirections({
    profile: 'driving',
    geometries: 'geojson',
    steps: true,
    bannerInstructions: true,
    voiceInstructions: true,
    waypoints: [
      {
        coordinates: this.state.userLngLat
      },
      {
        coordinates: destination.coords,
        approach: 'curb'
      }
  ]
  })
  .send()
  .then(response => {
    if(!this.state.customOrigin){
      // this.activeLocator.trigger()
      this.showStartButton()
    }
    this.buildDirectionsBoxDirections(response)
    TurnByTurn.map = this._map
    TurnByTurn.directions = response.body.routes[0];
    TurnByTurn.addLine();
    let coordinates = response.body.routes[0].geometry.coordinates
    let bounds = coordinates.reduce(function(bounds, coord) {
      return bounds.extend(coord);
    }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]))
    this._map.fitBounds(bounds, {padding: 20})
  })
}

buildDirectionsBoxDirections(data){
  let directions = {
    directionSteps : [],
    overall: {}
  };
  directions.overall.duration = Math.round(data.body.routes[0].duration/60);
  directions.overall.distance = (data.body.routes[0].distance/1609.344).toFixed(2);
  let steps = data.body.routes[0].legs.map(x => x.steps)
  console.log(steps)
  directions.directionSteps = steps[0].map(x => {
    let modifier;
    if(x.maneuver.type!=="arrive"){
      modifier = (x.maneuver.modifier)?
      x.maneuver.modifier.replace(' ', '-'):
      undefined
    }
    let distance = (x.distance/1609.344).toFixed(2)
    if(distance < .1 && distance > 0){
      distance = `${(distance*5280).toFixed(0)} ft`
    }
    if(distance > 0 && distance < 1){
      distance = `${distance.toString().slice(1)} mi`
    }
    if(distance === "0.00") {
      distance = 0;
    }
    if(distance > 1) {
      distance = `${distance} mi`
    }

    const directionStep = {
      instruction: x.maneuver.instruction,
      distance: distance,
      modifier: modifier
    }
    return directionStep
  })
  this.props.setDirections(directions)
}

addGeolocator() {
  this.activeLocator = new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserLocation: true
  })
  this._map.addControl(this.activeLocator);
}

beginNavigation() {
  this.activeLocator.on("geolocate", function(event){
    TurnByTurn.follow(event)
    event.target._updateCamera(event)
  })
  this.activeLocator.trigger()
}


showStartButton() {
  this.setState({showStartButton: true});
}

hideStartButton() {
  this.setState({showStartButton: false})
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
  const footerStyle = {
    position: 'absolute',
    bottom: "0%",
    fontSize: 12
  }

  return(
    <div>
      <div ref={el => this.myMap = el} style={mapStyle}/>
        <footer style={footerStyle}>
        Hamburger By Google Inc., <a href="https://creativecommons.org/licenses/by/4.0" title="Creative Commons Attribution 4.0">CC BY 4.0</a>, <a href="https://commons.wikimedia.org/w/index.php?curid=36335118">Link</a>
        </footer>
    </div>
  )
  }
}


let changeOriginBox;
export function openChangeOriginBox() {
  if(this.props.showOriginBox===true){
    changeOriginBox = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      placeholder: "New origin?",
      className: "mapboxgl-ctrl",
      countries: "US"
    });
  this._map.addControl(changeOriginBox);
  const myMap = this;
  changeOriginBox.on("result", function(pos) {
    const loc = pos.result.geometry.coordinates
    myMap.addOriginLocationText(loc);
    myMap.setUserLocation(loc)
    myMap.destinationBox.setProximity(loc);
    myMap.setState({customOrigin: true})
    myMap.setState({userLngLat: loc})
  })
    this.props.toggleOriginBox();
  } else {
    this._map.removeControl(changeOriginBox);
    changeOriginBox = {};
    this.props.toggleOriginBox();
  }
}

export function setSavedDirections(destination) {
  this.getDirections(destination);
}

export default Map
