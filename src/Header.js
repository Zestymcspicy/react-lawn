import React, { Component } from 'react';
import hamburger from './hamburger.svg'





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
    },
    title: {
      paddingTop: 17,
      margin: 0,
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
    <button
    onClick={this.toggleMenu}
    style={styles.burger}>
    <img src={hamburger} alt="hamburger"/>
    </button>
      <h2 style={styles.title}>Where you mowing?</h2>
    </div>
    )
  }
}
