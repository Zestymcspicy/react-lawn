import React from 'react';


export default function OriginLocationBox(props) {
  const styles={
    box: {
      backgroundColor: "#FFFFFF",
      fontSize: "12px",
      position: "absolute",
      maxWidth: "175px",
      width: "45%",
      right: 10,
      top: 85,
    }
  }
    return(
      <div id="originLocationBox" style={styles.box}>
      <span>Your Origin: {props.originText}</span>
      </div>
    )

  }
