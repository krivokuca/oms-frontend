/**
 * @component StageMedia
 * @description Renders the tv/movie portion of the stage
 * @props
 * * stage - Which stage to generate
 * * stageData - the stage data
 * * handleMediaCardClick - Function to handle when the media cards are clicked
 * * episodeData - False if not displaying the episodes, EpisodeObject for the episode to display otherwise
 * * episodeCard - False if not displaying the episodes, the ShowID of the object displaying the episodes otherwise
 */
import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import MediaCard from "./MediaCard";
import Button from "@material-ui/core/Button";

class StageMedia extends Component {
  render() {
    return (
      <Container maxWidth="md">
        <Typography variant="h3" gutterBottom>
          {this.props.stage === "tv"
            ? "TV Shows"
            : this.props.stage.charAt(0).toUpperCase() +
              this.props.stage.slice(1)}
        </Typography>
        <Grid container spacing={2}>
          {this.props.stageData.map(element => {
            return (
              <Grid item xs={6} key={element["vid"]}>
                <MediaCard
                  vid={element["vid"]}
                  name={element["showid"] ? element["show"] : element["name"]}
                  summary={element["summary"]}
                  rating={element["rating"]}
                  poster={element["poster"]}
                  show={element["showid"]}
                  handleClick={this.props.handleMediaCardClick}
                  showEpisodes={this.props.episodeCard === element["showid"]}
                  episodeData={this.props.episodeData}
                />
              </Grid>
            );
          })}
        </Grid>
      </Container>
    );
  }
}
export default StageMedia;
