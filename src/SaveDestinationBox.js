import React, { Component } from 'react';
import { DestinationContext } from './Context.js'

class SaveDestinationBox extends Component {
  constructor(props){
    super(props)
    this.state = {
      nickname: ""
    }
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    event.preventDefault()
    this.setState({nickname: event.target.value});
  }

  render(){
    const nickname = this.state.nickname;
    return(
        <div>
          {this.context.destination.coords.length===0?
          <p>You haven't selected a destination</p>
          :
          <div>
            <p>{this.context.destination.place_name}</p>
            <form onSubmit={() => this.context.saveDestination(nickname)}>
              <input
                onChange={this.handleChange}
                placeholder="Location Nickname"
                value={this.state.nickname}
                type="text"/>
              <input type="submit" value="Save"/>
            </form>
          </div>}
      </div>
    )
  }
}

SaveDestinationBox.contextType = DestinationContext;
export default SaveDestinationBox;
