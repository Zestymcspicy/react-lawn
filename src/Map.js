import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import Directions from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';
const MapboxGeocoder = require('@mapbox/mapbox-gl-geocoder')
const client = require('@mapbox/mapbox-sdk')
const mbxDirections = require('@mapbox/mapbox-sdk/services/directions')


class Map extends Component {
  constructor(props){
    super(props)
    this.state = {
      userLngLat: [],
      destination: [],
      nearEndpoint: []
    }
    this.geoLocateOptions={enableHighAccuracy: true};
    this.mbxToken = 'pk.eyJ1IjoiemVzdHltY3NwaWN5IiwiYSI6ImNqc281djVneTA5MzAzeXJ2ZWVoMjhmdzMifQ.uT5Hz9PEBvuLwVrZkrkp8A'
    this.baseClient = client({ accessToken: this.mbxToken});
    this.directionsService = mbxDirections(this.baseClient);
    this.applyDirections = this.applyDirections.bind(this);
  }



componentDidMount (){
  const myApp = this;
  navigator.geolocation.getCurrentPosition(function (pos) {
    let loc = [pos.coords.longitude, pos.coords.latitude];
    myApp.initAll(loc);
  }, this.errorFunction, this.geoLocateOptions)
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
    myApp.map = new mapboxgl.Map({
      container: myApp.myMap,
      style: 'mapbox://styles/mapbox/navigation-guidance-day-v2',
      zoom: 14,
      boxZoom: true,
      pitch: 60
    });
    this.userLocationMarker= new mapboxgl.Marker()
  }

addDirections(loc) {
    this.directions = new Directions({
      accessToken: mapboxgl.accessToken,
      profile: 'mapbox/driving',
      steps: true,
      geocoder: {proximity: loc, reverseGeocode: true, },
      bannerInstructions: true,
      controls: {
        inputs: false,
        profileSwitcher: false,
        instructions: false
      }
    });
    this.map.addControl(this.directions);
    this.setState({userLngLat: loc})
    this.directions.setOrigin(loc)
    const myApp = this;
    this.directions.on('origin', function(event) {
      let origin = event.feature.geometry.coordinates;
      myApp.directions.options.geocoder.proximity = origin;
      myApp.setState({userLngLat: origin})
    })
  }
    // let destListener = myApp.directions.on('destination', function(event) {
    //   myApp.getDirections(event.feature.geometry.coordinates)
    // })

errorFunction(error) {
  console.log(error)
}

addDestinationBox(loc){
  this.destinationBox = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    placeholder: "Where to you want to mow?",
    proximity: loc
  })
  this.map.addControl(this.destinationBox, 'top-left');
  const myApp = this;
  this.destinationBox.on("result", function(ev) {
    let userDestination = ev.result.geometry.coordinates;
    myApp.getDirections(userDestination);
  })
}

setMapCenter(location)  {
    this.map.setCenter(location);
}

setUserLocation(location) {
    this.userLocationMarker.remove();
    this.userLocationMarker.setLngLat(location);
    this.userLocationMarker.addTo(this.map);
}

setDestination(location){
  this.setState({destination: location});
}


getDirections(destination) {
  this.setDestination(destination);
  this.directionsService.getDirections({
    profile: 'driving',
    geometries: 'geojson',
    steps: true,
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
      let route=response.body.routes[0].geometry.coordinates;
      let nearEndpoint= route.slice(-2,-1)[0];
      this.setState({nearEndpoint}, this.applyDirections)
  })
}

applyDirections(){
  this.directions.setOrigin(this.state.userLngLat);
  this.directions.setDestination(this.state.destination);
  this.directions.setWaypoint(1, this.state.nearEndpoint);
  // this.map.remove(this.userLocationMarker)
}


render(){
  const mapStyle = {
    top: "10%",
    left:"0",
    right:"0",
    bottom: "0",
    position:"absolute",
    width: "100%"
  }
  return(
    <div ref={el => this.myMap = el} style={mapStyle}> </div>
  )
  }

}

export default Map;
