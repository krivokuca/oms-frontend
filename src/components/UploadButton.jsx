/**
 * @component UploadButton
 * @description The upload button that launches the `UploadModal`
 * @props
 * * clickHandler - Function called when the button is clicked
 */
import React, { Component } from "react";
import UploadIcon from "@material-ui/icons/ArrowUpwardOutlined";
import Fab from "@material-ui/core/Fab";

class UploadButton extends Component {
  handleClick() {
    this.props.clickHandler();
  }
  render() {
    return (
      <Fab
        color="secondary"
        onClick={this.handleClick.bind(this)}
        aria-label="Upload"
        style={{
          margin: 0,
          top: "auto",
          right: 20,
          bottom: 20,
          left: "auto",
          position: "fixed"
        }}
      >
        <UploadIcon />
      </Fab>
    );
  }
}
export default UploadButton;
