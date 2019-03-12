import React, { Component } from 'react';
import hamburger from './hamburger.svg'
import OriginLocationBox from './OriginLocationBox.js'
import Menu from './Menu.js'





export default class Header extends Component{
  constructor(props){
    super(props)
      this.state = {
        menuOpen: false,
      }
  this.toggleMenu = this.toggleMenu.bind(this)
}

  toggleMenu(){
    this.state.menuOpen?
    this.setState({menuOpen: false}):
    this.setState({menuOpen: true})
  }
render(){
  const styles = {
    header: {
      backgroundColor: '#139f25',
      height: 80,
      textAlign: 'center',
      top: 0,
      fontSize: "100%"
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
    }
  }
  return(
    <div style={styles.header}>
      <Menu        
        toggleMenu={this.toggleMenu}
        menuOpen={this.state.menuOpen}/>
    <button
    onClick={this.toggleMenu}
    style={styles.burger}>
    <img src={hamburger} alt="hamburger"/>
    </button>
      <h2 style={styles.title}>Where you mowing?</h2>
      {this.props.showOriginBox?
      <OriginLocationBox
        originText={this.props.originText}/>
      :null
    }
    </div>
    )
  }
}
