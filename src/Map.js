import React, { Component } from 'react';
import { TurnByTurn } from './TurnByTurn.js';
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
      showStartButton: false,
      userLngLat: [],
    }
    this.geoLocateOptions={enableHighAccuracy: true};
    this.mbxToken = 'pk.eyJ1IjoiemVzdHltY3NwaWN5IiwiYSI6ImNqc281djVneTA5MzAzeXJ2ZWVoMjhmdzMifQ.uT5Hz9PEBvuLwVrZkrkp8A'
    this.baseClient = client({ accessToken: this.mbxToken});
    this.directionsService = mbxDirections(this.baseClient);
    this.geolocationService = mbxGeocoder(this.baseClient);
    this.applyDirections = this.applyDirections.bind(this);
    this.beginNavigation = this.beginNavigation.bind(this);
    this.test = this.test.bind(this)
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
  this.addDirections(loc)
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
      // const destination = {
      //   place_name: null,
      //   coords: [event.lngLat.lng, event.lngLat.lat]
      // }
      // myApp.getDirections(destination);
    })
    this.userLocationMarker= new mapboxgl.Marker()
    this.destinationMarker = new mapboxgl.Marker()
  }

addDirections(loc) {
    this.directions = new Directions({
      accessToken: mapboxgl.accessToken,
      profile: 'mapbox/driving',
      steps: true,
      interactive: false,
      geocoder: {proximity: loc, reverseGeocode: true},
      bannerInstructions: true,
      controls: {
        inputs: false,
        profileSwitcher: false,
        instructions: true
      }
    });
    this._map.addControl(this.directions);
    this.setState({userLngLat: loc})
    this.directions.setOrigin(loc)
    const myApp = this;
    myApp._map.on('click', function(event) {
      event.preventDefault()
    })
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
}

getDirections(destination) {
  this.destinationMarker.remove();
  this.destinationMarker.setLngLat(destination.coords);
  this.destinationMarker.addTo(this._map);
  this.boundsObject = [this.state.userLngLat, destination.coords]
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
      TurnByTurn.map = this._map
      TurnByTurn.directions = response.body.routes[0];
      let steps = response.body.routes[0].legs.map(x => x.steps)
      console.log(steps)
      let directions = steps[0].map(x => {
        const modifier = (x.maneuver.modifier)?
        x.maneuver.modifier.replace(' ', '-'):
        undefined
        const direction = {
          instruction: x.maneuver.instruction,
          distance: (x.distance/1609.344).toFixed(2),
          modifier: modifier 
        }
        return direction
      })
      this.props.setDirections(directions)
      TurnByTurn.readDirections();
      TurnByTurn.addLine();
      let coordinates = response.body.routes[0].geometry.coordinates
      let bounds = coordinates.reduce(function(bounds, coord) {
        return bounds.extend(coord);
      }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]))
      this._map.fitBounds(bounds, {padding: 20})
      this.toggleStartButton()
      this.applyDirections(destination.coords);
  })
}

addGeolocator() {
  this.activeLocator = new mapboxgl.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true,
    showUserLocation: true
  })
  this._map.addControl(this.activeLocator)
}

beginNavigation() {
  const myMap =this;
  this.activeLocator.trigger()
  this.activeLocator.fitBounds = this.boundsObject
  this.test(TurnByTurn.route)
  this.activeLocator.on("geolocate", function(event){
    myMap.follow(event.coords)
  })
}

test(route) {
  route=TurnByTurn.route
  const myMap=this;
  route.forEach(function(coords) {
    window.setTimeout(myMap.follow(coords), 3000)
  })
}

follow(coords){
  this._map.panTo([coords.longitude, coords.latitude])
  this._map.setBearing(coords.heading)
}

applyDirections(destination){
  this.directions.setOrigin(this.state.userLngLat);
  this.directions.setDestination(destination);
}

toggleStartButton() {
  this.state.showStartButton?
  this.setState({showStartButton: false}):
  this.setState({showStartButton: true});
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
      {this.state.showStartButton?
          <button onClick={this.test}>Start</button>
          :null
          }
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
    // myMap.props.toggleOriginBox();
    myMap.destinationBox.setProximity(loc);
    myMap.setUserLocation(loc)
    myMap.props.toggleMenu()
    // myMap._map.removeControl(changeOriginBox)
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
