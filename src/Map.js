import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';
const MapboxGeocoder = require('@mapbox/mapbox-gl-geocoder')
const client = require('@mapbox/mapbox-sdk')
const mbxDirections = require('@mapbox/mapbox-sdk/services/directions')


class Map extends Component {
  constructor(props){
    super(props)
    this.state = {
      userLngLat: [],
      destination: []
    }
    this.mbxToken = 'pk.eyJ1IjoiemVzdHltY3NwaWN5IiwiYSI6ImNqc281djVneTA5MzAzeXJ2ZWVoMjhmdzMifQ.uT5Hz9PEBvuLwVrZkrkp8A'
    this.baseClient = client({ accessToken: this.mbxToken});
    this.directionsService = mbxDirections(this.baseClient);
  }



componentDidMount (){
  const myApp = this;
  navigator.geolocation.getCurrentPosition(function (pos) {
    let loc = [pos.coords.longitude, pos.coords.latitude];
    mapboxgl.accessToken = myApp.mbxToken;
    myApp.map = new mapboxgl.Map({
      container: myApp.myMap,
      style: 'mapbox://styles/mapbox/navigation-guidance-day-v2',
      zoom: 14,
      boxZoom: true,
      pitch: 60
    });
    myApp.userLocationMarker= new mapboxgl.Marker()
    myApp.destinationGeocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      proximity: loc,
    })
    myApp.destinationGeocoder.on('result', function(ev) {
      myApp.parseResult(ev)
      });
    myApp.map.addControl(myApp.destinationGeocoder, 'top-left')

    // myApp.directions = new Directions({
    //   accessToken: mapboxgl.accessToken,
    //   profile: 'mapbox/driving',
    //   steps: true,
    //   approaches: ';curb',
    //   geocoder: {proximity: loc, reverseGeocode: true, },
    //   controls: {profileSwitcher: false},
    //   bannerInstructions: true
    // });
    // myApp.map.addControl(myApp.directions, 'top-left');
    myApp.setState({userLngLat: loc})

    myApp.setMapCenter(loc);
    myApp.setUserLocation(loc);
  })
}

parseResult(obj) {
  let loc = obj.result.geometry.coordinates;
  this.setState({destination: loc}, this.setDirections)
}

setMapCenter(location)  {
    this.map.setCenter(location);
}

setUserLocation(location) {
    this.userLocationMarker.setLngLat(location);
    this.userLocationMarker.addTo(this.map);
}

setDestination(location){
  this.destinationLocationMarker = new mapboxgl.Marker();
  this.destinationLocationMarker.setLngLat(location);
  this.destinationLocationMarker.addTo(this.map);
}

setDirections() {
  this.setDestination(this.state.destination);

  this.directionsService.getDirections({
    profile: 'driving',
    waypoints: [
      {
        coordinates: this.state.userLngLat
      },
      {
        coordinates: this.state.destination,
        approach: 'curb'
      }
  ]
  })
  .send()
  .then(response => {
      console.log(response.body)
  })
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
