import React, { Component } from 'react';
import hamburger from './hamburger.svg'
import OriginLocationBox from './OriginLocationBox.js'
import Menu from './Menu.js'
import DirectionsBox from './DirectionsBox.js'

export default class Header extends Component{
  constructor(props){
    super(props)
      this.state = {
        currentStep: {}
      }
}

componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

setWrapperRef = node =>{
  this.wrapperRef = node;
}

handleClickOutside = event => {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      if(this.props.menuOpen){
        this.props.toggleMenu();
      }
    }
  }

render(){
  const styles = {
    header: {
      backgroundColor: '#139f25',
      height: 65,
      textAlign: 'center',
      top: 0,
    },
    title: {
      paddingTop: 10,
      margin: "0 auto",
      width: "50%",

    },
    burger: {
      border: 'none',
      backgroundColor: 'transparent',
      left: 5,
      position: 'absolute',
      top: 10,
    },

  }
  return(
    <div style={styles.header}>
      <div ref={this.setWrapperRef}>
        <Menu
          saveDestination={this.saveDestination}
          menuOpen={this.props.menuOpen}/>
      <button
        onClick={()=>this.props.toggleMenu()}
        style={styles.burger}>
        <img src={hamburger} alt="hamburger"/>
      </button>
    </div>
      <h2 style={styles.title}>Where you mowing?</h2>
      {this.props.showOriginBox?
      <OriginLocationBox
        originText={this.props.originText}/>
      :null
    }
    <DirectionsBox/>
    </div>
    )
  }
}
