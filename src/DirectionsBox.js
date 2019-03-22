import React, { useContext } from 'react'
import { DestinationContext } from './Context.js'



function DirectionsBox() {
  const directionsContext = useContext(DestinationContext)
  console.log(directionsContext)
  const styles= {
    list: {
      listStyle: "none",
      // opacity: .3,
      background: "rgba(0, 0, 0, 0.75)"
    },
    listItem: {
      color: "#d4d2d1",
    }

  }
  if(directionsContext.directions.length>0) {
  return(
    <div>
      <ol style={styles.list}>{directionsContext.directions.map(x => {
        return(
        <li style={styles.listItem}>{x.instruction}</li>
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
