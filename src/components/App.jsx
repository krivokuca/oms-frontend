/**
 * @component App
 * @description App displays the Menu, Header and instantiates the Stage component to be called
 * @author Daniel Krivokuca
 * @version 1.0.0
 */
import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import Header from "./Header";
import Stage from "./Stage";
class App extends Component {
  constructor() {
    super();
    this.state = {
      appTitleName: "Orange Media Server",
      activeStage: "home",
      loggedIn: false
    };
    // Global OMS theme
    this.theme = createMuiTheme({
      palette: {
        primary: {
          main: "#ff3d00",
          light: "#ff7539"
        },
        secondary: {
          main: "#304fff",
          light: "#7b7cff"
        }
      }
    });
  }

  handleMenuClick(stage) {
    this.setState({
      activeStage: stage
    });
  }

  handleLoginToggle() {
    this.setState({ loggedIn: arguments[0] });
  }

  render() {
    return (
      <MuiThemeProvider theme={this.theme}>
        <Header
          appTitleName={this.state.appTitleName}
          activeStage={this.state.activeStage}
          clickHandler={this.handleMenuClick.bind(this)}
          showNavigation={this.state.loggedIn} // here
        />
        <Stage
          stage={this.state.activeStage}
          loggedInHandler={this.handleLoginToggle.bind(this)}
        />
      </MuiThemeProvider>
    );
  }
}
export default App;
