/**
 * @component LoginTesting
 * @description Tests that the login and register functions work well
 * @author Daniel Krivokuca
 */

import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import AJAXHandler from "../js/ajaxHandler";

class LoginTesting extends Component {
  constructor() {
    super();
    this.state = {
      version: 1
    };
    this.ajax = new AJAXHandler();
  }

  setLogin = () => {
    this.setState({ version: 1 });
  };

  setRegister = () => {
    this.setState({ version: 0 });
  };

  handleLogin = () => {
    // get the username and the password values
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    this.ajax.tryLogin(username, password, success => {
      alert(JSON.stringify(success));
    });
  };

  handleRegister = () => {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    this.ajax
      .registerAccount(username, password)
      .then(val => {
        console.log(val);
      })
      .catch(error => {
        // either the password or the username are unvalidated or the database is fucked up
        if (
          Object.keys(error).includes("error") &&
          error["error"].includes("username")
        ) {
          // username is not validated
        }
      });
  };

  renderLoginForm() {
    return (
      <form id="testingform">
        <input
          type="text"
          id="username"
          name="username"
          placeholder="username"
        ></input>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="password"
        ></input>
        <Button variant="outlined" onClick={this.handleLogin.bind(this)}>
          login
        </Button>
      </form>
    );
  }

  renderRegisterForm() {
    return (
      <form id="registerform">
        <input
          type="text"
          id="username"
          name="username"
          placeholder="username"
        ></input>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="password"
        ></input>
        <Button variant="outlined" onClick={this.handleRegister.bind(this)}>
          register account
        </Button>
      </form>
    );
  }

  render() {
    if (this.state.version === 0) {
      return this.renderLoginForm();
    }
    if (this.state.version === 1) {
      return this.renderRegisterForm();
    }
  }
}

export default LoginTesting;
