/**
 * Expansion Panel
 * @author Daniel Krivokuca
 * @version 1.0.0
 * @props
 * * numSeasons - The total number of seasons to display
 * * episodeData - The episode info JSON object
 * * episodeHandler - Function used to call the episode
 */

import React, { Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import StarBorderIcon from "@material-ui/icons/StarBorderOutlined";
import EpisodeDataTable from "./EpisodeDataTable";
class ControlledExpansionPanel extends Component {
  constructor() {
    super();
    this.state = {};
  }

  handleEpisode() {
    let request = arguments[0];
    this.props.episodeHandler(request);
  }
  render() {
    return Object.keys(this.props.episodeData).map(season => {
      return (
        <ExpansionPanel
          key={`${this.props.episodeData[season][0].season}-${this.props.episodeData[season][0].ep}`}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon></ExpandMoreIcon>}
            id={`${this.props.episodeData[season][0].season}-${this.props.episodeData[season][0].ep}`}
          >
            <Typography>{`Season ${season}`}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <EpisodeDataTable
              episodeData={this.props.episodeData[season]}
              episodeHandler={this.handleEpisode.bind(this)}
            ></EpisodeDataTable>{" "}
          </ExpansionPanelDetails>
        </ExpansionPanel>
      );
    });
  }
}

export default ControlledExpansionPanel;
