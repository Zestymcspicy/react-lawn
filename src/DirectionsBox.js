import React, { useContext } from 'react'
// React Hooks and Context!!!
import { DestinationContext } from './Context.js'



function DirectionsBox() {
  const directionsContext = useContext(DestinationContext)
  const baseClass = 'directions-icon directions-icon-'
  const styles= {
    list: {
      listStyle: "none",
      width: "50%",
      background: "rgba(0, 0, 0, 0.75)",
      margin: "0 auto"
    },
    listItem: {
      color: "#d4d2d1",
    }

  }
  if(directionsContext.directions.length>0) {
  return(
    <div>
      <ol style={styles.list}>{directionsContext.directions.map((x, index) => {
        return(
        <li
          key={index}
          style={styles.listItem}>
        <span className={baseClass+x.modifier}></span>
        <span>{x.instruction}</span>
        {x.distance>0?
        x.distance<1?
        <span> {x.distance.toString().slice(1)} mi.</span>
        :<span> {x.distance}</span>
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
