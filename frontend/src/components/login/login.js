import React from 'react';
import './login.css'

export default class Login extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      username: '',
      password: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit( e ) {
    console.log(this.state)
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
        <button type='button' onClick={this.handleSubmit}>Login</button>
      </div>
    )
  }
}