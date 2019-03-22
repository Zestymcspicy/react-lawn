import React, { Component } from 'react';
import { DestinationContext } from './Context.js'

class SaveDestinationBox extends Component {
  constructor(props){
    super(props)
    this.state = {
      nickname: ""
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({nickname: event.target.value});
  }

  handleSubmit(event){
    event.preventDefault()
    const nickname = this.state.nickname;
    this.context.saveDestination(nickname);
    this.props.toggleSaveBox();
  }


  render(){
    const styles = {
      closeButton: {
        border:"none",
        backgroundColor:"inherit"
      },
      saveBox: {
        // width: "50%"
      },
      placeName: {
        maxWidth: "100%"
      }
    }
    return(
        <div style={styles.saveBox}>
          <button
            style={styles.closeButton}
            onClick={this.props.toggleSaveBox}>
            X
          </button>
          {this.context.destination.coords.length===0?
          <p>You haven't selected a destination</p>
          :
          <div>
            <p>{this.context.destination.place_name}</p>
            <form onSubmit={this.handleSubmit}>
              <input
                onChange={this.handleChange}
                placeholder="Location Nickname"
                value={this.state.nickname}
                type="text"/>
              <input
                style={styles.closeButton}
                type="submit"
                value="Save"/>
            </form>
          </div>}
      </div>
    )
  }
}

SaveDestinationBox.contextType = DestinationContext;
export default SaveDestinationBox;
