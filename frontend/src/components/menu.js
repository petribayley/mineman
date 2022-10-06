import React from 'react';

import "../styling/menu.css"
import minemon_logo from "../styling/minemon_logo.png"

const menu_select = async (e) => {
  console.log('Menu item selected: ' + e.target.id);
}

function Menu() {
  return (
    <div className="navigation-div">
        <img className="navigation-div-logo" src={minemon_logo} alt="Minemon Logo"/>
        <button className="navigation-div-button" id="dashboard" onClick={menu_select}>Dashboard</button>
        <button className="navigation-div-button" id="create_server" onClick={menu_select}>Create Server</button>
        <button className="navigation-div-button" id="global_config" onClick={menu_select}>Global Config</button>
    </div>
  )
}

export default Menu;
