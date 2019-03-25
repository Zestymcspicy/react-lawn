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
      paddingLeft: 0
    },
    listItem: {
      color: "#d4d2d1",
    }

  }
  if(directionsContext.directions.directionSteps.length>0) {
  return(
    <div>
      <ol style={styles.list}>
        <span style={styles.listItem}>
          {overallDistance}mi.  {overallDuration} min.
        </span>
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
