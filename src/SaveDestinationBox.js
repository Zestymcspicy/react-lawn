import React, { Component } from 'react';
import { DestinationContext } from './Context.js'

class SaveDestinationBox extends Component {


  render(){

    return(
        <div>
          {this.context.destination.coords.length===0?
          <p>You haven't selected a destination</p>
          :
            <div>
            <p>{this.context.destination.place_name}</p>
            <input
              placeholder="Location Nickname"
              type="text"/>
            <button onClick={this.context.saveDestination}>Save</button>
            </div>}
      </div>
    )
  }
}

SaveDestinationBox.contextType = DestinationContext;
export default SaveDestinationBox;
