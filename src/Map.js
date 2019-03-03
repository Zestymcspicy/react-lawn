import React, { Component } from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';


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
    boxZoom: true
  });
  new mapboxgl.GeolocateControl({
    positonOptions: {
      enableHighAccuracy: true
    },
    trackUserLocation: true
  });
  navigator.geolocation.getCurrentPosition(function (pos) {
    myApp.setMapCenter([pos.coords.longitude, pos.coords.latitude]);
  })
}

setMapCenter(location)  {
    this.map.setCenter(location)
}


render(){
  const mapStyle = {top: "0", left:"0", right:"0", bottom: "0", position:"absolute", width: "100%"}
  return(
    <div ref={el => this.myMap = el} style={mapStyle}> </div>
  )
  }

}

export default Map;
