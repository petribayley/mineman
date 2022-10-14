import React from 'react'
import * as HTCF from 'hex-to-css-filter'
import Cookies from 'js-cookie';
import Menu from './menu/menu.js'
import Dashboard from './dashboard/dashboard.js'
import Login from './login/login.js'
import palettes from './colourPalettes.js'
import './app.css'

export default class App extends React.Component {
  checkApiState() {
    fetch('http://localhost:3001/api/v1/isalive', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({})
        })
        .then(res => res.json())
        .then(data => this.setState({isApiAlive: true}))
        .catch(err => this.setState({isApiAlive: false}))
  }

  constructor(props) {
    super(props)
    this.state = {
      isApiAlive: false,
      apiVersion: '0',
      sessionValid: false,
      selectedPage: 'dashboard'
    }
    this.checkApiState()
    this.checkSession()
  }

  componentWillUnmount(){
  }

  checkSession() {
    if(Cookies.get('cookieUUID') === '') {
      console.log('(SessionTracker) No session cookie found.')
      return false
    }
    var session = JSON.parse(Cookies.get('cookieUUID'))
    fetch('http://localhost:3001/api/v1/account/session', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({cookieUUID: session.cookie})
    })
    .then(res => res.json())
    .then(jsonRaw => {
      const json = JSON.parse(jsonRaw)
      if(json.success && json.data.valid)
        this.setState({sessionValid: true})
      else
        this.setState({sessionValid: false})
    })
    .catch(err => console.log(err))
  }

  setPage( pageString ) {
    this.setState({selectedPage: pageString})
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
        {this.state.isApiAlive ? (this.state.sessionValid ? (<Menu handler = {this.setPage.bind(this)} />) : (<Login handler = {this.checkSession.bind(this)} />)) : (<>No Connection</>)}
      </div>
    )
  }
}