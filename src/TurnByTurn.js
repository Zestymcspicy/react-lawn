import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';

const TurnByTurn = {
  directions: {},
  map: {},
  routeLayer: {},
  presentLayerId: "",
  layersArray: [],


  route: [
    {
      longitude:-95.238279,
      latitude:38.96607,
      heading: 90
      },
    {
      longitude:-95.236688,
      latitude:38.973047,
      heading:270
    },
    {
      longitude:-95.2355,
      latitude:38.976597,
      heading:180
    },
    {
      longitude:-95.231233,
      latitude:38.976365,
      heading:0
    }
  ],
//maneuver.instructions
  readDirections: function() {

    let legs = this.directions.legs
    let steps = legs.map(x => x.steps)
    let instructions = steps[0].map(x=> x.maneuver.instruction)
    // console.log(legs)
    // console.log(steps)
    // console.log(instructions)
  },

  follow: function(event) {
    console.log(event)
    this.map.easeTo({
      center:[event.coords.longitude, event.coords.latitude],
      bearing: event.coords.heading,
    })
  },

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
