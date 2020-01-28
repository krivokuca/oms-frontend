/**
 * @component HomeContainer
 * @description Recommended shows/movies
 * @author Daniel Krivokuca
 * @props
 * * stageData - The current data of the stage
 * * clickHandler - Invoked when a video object is clicked
 */

import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import SingleLineGridList from "./SingleLineGridList";
import Typography from "@material-ui/core/Typography";
class HomeContainer extends Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    if (this.props.stageData.length === 0) {
      return (
        <div style={{ marginTop: 15 }}>
          <Typography variant="h4">Your Library</Typography>
          <Typography variant="body1">
            You have no content in your library. Please click the blue circular
            upload button to start searching for some.
          </Typography>
        </div>
      );
    }
  }
}

export default HomeContainer;
