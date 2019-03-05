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


    myApp.directions = new Directions({
      accessToken: mapboxgl.accessToken,
      profile: 'mapbox/driving',
      steps: true,
      geocoder: {proximity: loc, reverseGeocode: true, },
      controls: {profileSwitcher: false},
      bannerInstructions: true
    });
    myApp.map.addControl(myApp.directions, 'top-left');
    myApp.setState({userLngLat: loc})
    myApp.directions.on('origin', function(ev) {
      let origin = ev.feature.geometry.coordinates;
      myApp.directions.options.geocoder.proximity = origin;
      myApp.setState({userLngLat: origin})
    })
    myApp.directions.on('destination', function(ev) {
      // ev.preventDefault();
      myApp.getDirections(ev.feature.geometry.coordinates)
      // console.log(ev.feature.geometry.coordinates)
    })
    myApp.directions.setOrigin(loc)
    myApp.setMapCenter(loc);
    myApp.setUserLocation(loc);

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
      let route=response.body.routes[0]
      this.drawRoute(route);
      // let nearEndWaypoint = route.geometry.coordinates[route.geometry.coorsinates.length - 2]
      // this.map.addWaypoint(1, nearEndWaypoint)
  })
}

drawRoute(altRoute) {
  this.map.addLayer({
    "id": "route",
    "type": "line",
    "source": {
      "type": "geojson",
      "data": {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "LineString",
          "coordinates": altRoute.geometry.coordinates
        }
      }
    },
    "layout": {
      "line-join": "round",
      "line-cap": "round"
    },
    "paint": {
      "line-color": "#f114d8",
      "line-width": 8
    }
  })
  console.log(this.map)
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
