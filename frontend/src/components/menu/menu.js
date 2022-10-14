import React from 'react';
import Cookies from 'js-cookie';
import './menu.css'
import mineman_logo from "./mineman_logo.png"

export default class Menu extends React.Component {

  menu_select = (e) => {
    this.props.handler(e.target.id)
  }

  render() {
    return (
      <div className='navigation-div'>
            <img className='navigation-div-logo' src={mineman_logo} alt="Minemon Logo"/>
            <div>
              <button className='navigation-div-button' id='dashboard' onClick={this.menu_select}>Dashboard</button>
              <button className='navigation-div-button' id='create_server' onClick={this.menu_select}>Create Server</button>
              <button className='navigation-div-button' id='global_config' onClick={this.menu_select}>Global Config</button>
              <div className='navigation-div-welcome-msg'> <h3>Welcome {JSON.parse(Cookies.get('cookieUUID')).username}!</h3> </div>
            </div>
      </div>
    )
  }
}