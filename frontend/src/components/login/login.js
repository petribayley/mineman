import React from 'react';
import './login.css'

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export default class Login extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      username: '',
      password: '',
      submitLoading: false
    }

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit( e ) {
    this.setState({submitLoading: true})
    fetch('http://localhost/api/v1/account/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(
        {
          username: this.state.username,
          password: this.state.password
        }
        )
    })
    .then(res => res.json())
    .then(json => {
      var jsonParsed = JSON.parse(json)
      this.setState({submitLoading: false})
      if(jsonParsed.success === true) {
        setCookie('cookieUUID', JSON.stringify({cookie:jsonParsed.data.cookieUUID, username: this.state.username}), 365)
        this.props.handler()
      }
    })
  }

  render() {

    return (
      <div className='login-box'>
        <h1> Minecraft Manager Login </h1>
        <div className='input-div'>
          <label for='username'>Username</label>
          <input type='text' id='username' onChange={e => this.setState({username: e.target.value})} />
        </div>
        <div className='input-div'>
          <label for='password'>Password</label>
          <input type='password' id='password' onChange={e => this.setState({password: e.target.value})} />
        </div>
        {!this.state.submitLoading ? (
          <button type='button' onClick={this.handleSubmit}>Login</button>
          ) : (
          <>
            <div className="spinner-container">
              <div className="loading-spinner">
              </div>
            </div>
          </>
          )
        }
      </div>
    )
  }
}