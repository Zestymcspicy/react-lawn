import React, { Component } from 'react';
import { DestinationContext } from './Context.js';
import { setSavedDirections } from './Map.js';


class SavedListBox extends Component{

  render(props){
    const styles = {
      list: {
        paddingLeft: 0,
        listStyle: "none"
      },
      listItem: {
        display: "flex",
        flexFlow: "row"
      },
      locationName: {
        width: "50%"
      },
      buttonContainer: {
        width: "50%"
      },
      button: {
        width: "100%",
        border: "none",
        backgroundColor: "transparent"
      },
      closeButton: {
        border:"none",
        backgroundColor:"inherit"
      }
    }
    return(
    <div>
    <button
      style={styles.closeButton}
      onClick={this.props.toggleSavedList}>
      X
    </button>
    {(this.context.user===null||this.context.user.savedLocations==0)?
    <p>You haven't saved any destinations yet or aren't signed in</p>
  :
    <ol style={styles.list}>
    {this.context.user.savedLocations.map( x =>
    <li style={styles.listItem} key={x.coords}>
      <p style={styles.locationName}>{x.nickname}</p>
      <div style={styles.buttonContainer}>
        <button
        onClick={() => setSavedDirections(x)}
        style={styles.button}>
        Set Destination
        </button>
        <button
        onClick={() => this.context.deleteDestination(x)}
        style={styles.button}>
        Delete
        </button>
      </div>
    </li>
  )}
    </ol>
    }

    </div>
  )
  }
}

SavedListBox.contextType = DestinationContext
export default SavedListBox;
