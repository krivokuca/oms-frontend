/**
 * @component ErrorAlert
 * @description Dispays an alert error
 * @author Daniel Krivokuca
 * @props
 * * message - the Message to display in the error alert
 */
import React, { Component } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import ErrorIcon from "@material-ui/icons/Error";
import red from "@material-ui/core/colors/red";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import Icon from "@material-ui/core/Icon";
class ErrorAlert extends Component {
  constructor() {
    super();
    this.state = {
      errorBackground: red[500],
      open: false
    };
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    return (
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={this.props.open}
        onClose={this.handleClose.bind(this)}
        autoHideDuration={6000}
      >
        <SnackbarContent
          style={{ backgroundColor: this.state.errorBackground }}
          message={
            <span
              id="error-message"
              style={{ display: "flex", alignItems: "center" }}
            >
              <Icon>
                <ErrorIcon></ErrorIcon>
              </Icon>
              {this.props.message}
            </span>
          }
        ></SnackbarContent>
      </Snackbar>
    );
  }
}
export default ErrorAlert;
