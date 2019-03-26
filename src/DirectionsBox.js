import React, { useContext } from 'react'
// React Hooks and Context!!!
import { DestinationContext } from './Context.js'



function DirectionsBox() {
  const directionsContext = useContext(DestinationContext)
  const baseClass = 'directions-icon directions-icon-'
  const overallDistance = directionsContext.directions.overall.distance
  const overallDuration = directionsContext.directions.overall.duration
  const styles= {
    list: {
      listStyle: "none",
      width: "40%",
      background: "rgba(0, 0, 0, 0.75)",
      position: "absolute",
      right: "1%",
      top: "21%",
      paddingLeft: 0,
    },
    listItem: {
      color: "#d4d2d1",
    },
    button: {
      width: "10%",
      color: "#d4d2d1",
      backgroundColor: 'transparent',
      border: 'none',
      fontFamily: `"-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Oxygen",
      "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
      "sans-serif"`
    },
    topItem: {
      color: "#d4d2d1",
      display: "flex"
    },
    topSpan: {
      width: "90%",

    }
  }
  if(directionsContext.directionsVisible===true) {
  return(
    <div>
      <ol style={styles.list}>
        <li style={styles.topItem}>
        <button onClick={()=>directionsContext.closeDirections()} style={styles.button}>Hide</button>
        <span style={styles.topSpan}>
          {overallDistance}mi.  {overallDuration} min.
        </span>
        </li>
        {directionsContext.directions.directionSteps.map((x, index) => {
        return(
        <li
          key={index}
          style={styles.listItem}>
        <span className={baseClass+x.modifier}></span>
        <span>{x.instruction}</span>
        {x.distance!=0?
        <span> {x.distance}</span>
        :null
      }
        </li>
      )
      })}
      </ol>
    </div>
    )
  } else {
    return null
  }
}

export default DirectionsBox;
