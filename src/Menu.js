import React, {Component} from 'react'

class Menu extends Component{
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
        top: 80
      },
      listItem: {
        padding: '10% 2%',
      },
      button: {
        backgroundColor: 'transparent',
        border: 'none',
        fontFamily: `"-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Oxygen",
        "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
        "sans-serif"`
      }
    }
    return(
      <div style={styles.menu}>
        <ol style={styles.list}>
          <li style={styles.listItem}>
            <button style={styles.button}>
            Change Origin
            </button>
          </li>
          <li style={styles.listItem}>
            <button style={styles.button}>
            Save Destination
            </button>
          </li>
          <li style={styles.listItem}>
            <button style={styles.button}>
            Load Your Destinations
            </button>
          </li>
        </ol>
      </div>
    )
  }
}

export default Menu;
