import React from 'react'
import * as HTCF from 'hex-to-css-filter'
import Menu from './menu/menu.js'
import Dashboard from './dashboard/dashboard.js'
import Login from './login/login.js'
import palettes from './colourPalettes.js'
import './app.css'

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isApiAlive: false,
      apiVersion: '0',
      isApiAliveInterval: setInterval(() => {
        fetch('http://localhost:3001/api/isalive', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({})
        })
        .then(res => res.json())
        .then(data => this.setState({isApiAlive: true}))
        .catch(err => this.setState({isApiAlive: false}))
      }, 10000)
    }
  }

  componentWillUnmount(){
    clearInterval(this.state.isApiAliveInterval)
  }

  checkSession() {
    // document.cookie = "username=John Doe; expires=Thu, 18 Dec 2013 12:00:00 UTC";

    var session = getCookie('userSession')
    
    if(session === '') {
      console.log('(SessionTracker) No session cookie found.')
      return false
    }
    return false
  }

  render() {
    var pallet = palettes('lightpurple')

    var paletteVars = {
      '--alpha-color':          pallet.alpha,
      '--alpha-color-filter':   HTCF.hexToCSSFilter(pallet.alpha).filter.replace(";", ""),
      '--beta-color':           pallet.beta,
      '--beta-color-filter':    HTCF.hexToCSSFilter(pallet.beta).filter.replace(";", ""),
      '--charlie-color':        pallet.charlie,
      '--charlie-color-filter': HTCF.hexToCSSFilter(pallet.charlie).filter.replace(";", ""),
      '--delta-color':          pallet.delta,
      '--delta-color-filter':   HTCF.hexToCSSFilter(pallet.delta).filter.replace(";", ""),
    }

    // Set background to alpha colour
    document.body.style.backgroundColor = pallet.alpha

    return (
      <div id='app_root' style={paletteVars}>
        {this.checkSession() ? (
          <Menu />
          ) : (
          <>
            <Login />
          </>
          )
        }
      </div>
    )
  }
}