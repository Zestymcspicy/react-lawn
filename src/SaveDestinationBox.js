import React, { Component } from 'react';
import { DestinationConsumer } from './Context.js'

export default class SaveDestinationBox extends Component {
  render(){
    return(
        <DestinationConsumer>
        {(destination) => (
          <p>{destination.place_name}</p>
        )
        }
        </DestinationConsumer>
    )
  }
}
