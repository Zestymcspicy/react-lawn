// import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';

const TurnByTurn = {
  directions: {},
  map: {},
  routeLayer: {},
  presentLayerId: "",
  layersArray: [],





  addLine: function() {
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
          "geometry": this.directions.geometry
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

}

export { TurnByTurn }
