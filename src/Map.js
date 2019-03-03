import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';
import Directions from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css'



class Map extends Component {
  constructor(props){
    super(props)
    this.state = {
      aThing : true
    }
  }



componentDidMount (){
  const myApp = this
  mapboxgl.accessToken = 'pk.eyJ1IjoiemVzdHltY3NwaWN5IiwiYSI6ImNqc281djVneTA5MzAzeXJ2ZWVoMjhmdzMifQ.uT5Hz9PEBvuLwVrZkrkp8A';
  this.map = new mapboxgl.Map({
    container: this.myMap,
    style: 'mapbox://styles/mapbox/navigation-guidance-day-v2',
    zoom: 14,
    boxZoom: true,
    pitch: 60
  });
  this.userLocationMarker= new mapboxgl.Marker()
  this.map.addControl(new mapboxgl.GeolocateControl({
    positonOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true
  }));
  this.directions = new Directions({
    accessToken: mapboxgl.accessToken,
    profile: 'mapbox/driving',
    steps: true,
    approaches: 'curb'
  });
  this.map.addControl(this.directions, 'top-left');

  navigator.geolocation.getCurrentPosition(function (pos) {
    let loc = [pos.coords.longitude, pos.coords.latitude];
    myApp.setMapCenter(loc);
    myApp.setUserLocation(loc);
  })
}

setMapCenter(location)  {
    this.map.setCenter(location);
}

setUserLocation(location) {
    this.userLocationMarker.setLngLat(location);
    this.userLocationMarker.addTo(this.map)
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
