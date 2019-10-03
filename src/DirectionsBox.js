import React, { useContext } from 'react'
// React Hooks and Context!!!
import { DestinationContext } from './Context.js'



function DirectionsBox() {
  const directionsContext = useContext(DestinationContext);
  const baseClass = 'directions-icon directions-icon-'
  const overallDistance = directionsContext.directions.overall.distance
  const overallDuration = directionsContext.directions.overall.duration
  const styles = {
    list: {
      listStyle: "none",
      width: "40%",
      background: "rgba(0, 0, 0, 0.75)",
      position: "absolute",
      right: "1%",
      top: "21%",
      paddingLeft: 0,
      maxWidth: 400,
      maxHeight: 300,
      overflowY: "scroll"
    },
    listItem: {
      color: "#d4d2d1",
    },
    button: {
      width: "15%",
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
      width: "85%",
    }
  }
  let navigationOnStyle;
  if(directionsContext.navigationOn){
    navigationOnStyle = {
      position: "relative",
      height: "60px",
      zIndex: 34,
      backgroundColor: "#139f25",
      width: "75%",
      fontSize: "24px",
      margin: "0 auto 0 auto",
      top: "-35px",
      display: "flex",
      color: "black",
    }
  } else {
    navigationOnStyle = {}
  }
//   <span className={baseClass+x.modifier}></span>
//   <span>{x.instruction}</span>
//   {x.distance!==0?
//   <span> {x.distance}</span>
//   :null
// }
  if(directionsContext.directionsVisible===true) {
  return(
    <div style={navigationOnStyle}>
      {directionsContext.navigationOn?
        <>
        {buildInstruction(directionsContext.directions.directionSteps[1])}
        </>
        :
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
        {buildInstruction(x)}
        </li>
      )
      })}
      </ol>
    }
    </div>
    )
  } else {
    return null
  }

function buildInstruction(x) {
  // const directionsContext = useContext(DestinationContext);
  const baseClass = 'directions-icon directions-icon-'
  let iconStyle;
  if (directionsContext.navigationOn){
    iconStyle = {
      height:"30px",
      width:"30px",
      backgroundSize:"30px 30px"
    };
  } else {
    iconStyle = null;
  };
  return(
    <>
      <span
        className={baseClass+x.modifier}
        style={iconStyle}></span>
      <span>{x.instruction}</span>
      {x.distance!==0?
      <span> {x.distance}</span>
      :null
      }
    </>
  )
}
}

export default DirectionsBox;
