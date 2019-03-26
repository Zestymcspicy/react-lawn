import React, {Component} from 'react'
import {openChangeOriginBox} from './Map.js'
import SaveDestinationBox from './SaveDestinationBox.js'
import SavedListBox from './SavedListBox.js'
import { DestinationContext } from './Context.js'

class Menu extends Component{
  constructor(props){
  super(props)
this.state ={
  saveBoxOpen: false,
  savedListOpen: false
}
this.toggleSaveBox = this.toggleSaveBox.bind(this);
this.toggleSavedList = this.toggleSavedList.bind(this);
}

originButtonClick()  {
    openChangeOriginBox()
}

toggleSavedList(){
  this.state.savedListOpen?
  this.setState({savedListOpen: false}):
  this.setState({savedListOpen: true})
}

toggleSaveBox(){
  this.state.saveBoxOpen?
  this.setState({saveBoxOpen: false}):
  this.setState({saveBoxOpen: true})
}

  render() {
    const styles = {
      list: {
        listStyle : 'none',
        height: '100%',
        paddingLeft: 0,
        marginTop: 0
      },
      menu: {
        position: 'fixed',
        display: this.props.menuOpen?'block':'none',
        backgroundColor: '#139f25',
        top: 65,
      },
      listItem: {
        padding: '10% 2%',
        maxWidth: 170
      },
      button: {
        backgroundColor: 'transparent',
        border: 'none',
        fontFamily: `"-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Oxygen",
        "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
        "sans-serif"`
      },

    }
    return(
      <div style={styles.menu}>
        <ol style={styles.list}>
          <li style={styles.listItem}>
            <button
              onClick={this.originButtonClick}
              style={styles.button}>
              Change Origin
            </button>
          </li>
          <li style={styles.listItem}>
            <button
              onClick={this.toggleSaveBox}
              style={styles.button}>
              Save Destination
            </button>
            {this.state.saveBoxOpen?
              <SaveDestinationBox
              toggleSaveBox={this.toggleSaveBox}/>
              :null
            }
          </li>
          <li style={styles.listItem}>
            <button style={styles.button}
              onClick={this.toggleSavedList}>
              Load Your Destinations
            </button>
            {this.state.savedListOpen?
            <SavedListBox
              toggleSavedList={this.toggleSavedList}/>
            :null}
          </li>
          {this.context.directions.directionSteps.length>0?
          <li>
            {this.context.directionsVisible?
              <button style={styles.button}
                onClick={()=>this.context.closeDirections()}>
                Hide Directions
              </button>
              :
              <button style={styles.button}
                onClick={()=>this.context.openDirections()}>
                Show Directions
              </button>
            }
          </li>:
          null}
        </ol>
      </div>
    )}
  }

Menu.contextType = DestinationContext
export default Menu;
