/**
 * @component MediaCard
 * @description The mediacard provides a way to display Movie and TV Show data to the user
 * @author Daniel Krivokuca
 * @version 1.0.0
 * @props
 *  * vid - The VideoID/ShowID of the MediaCard object being shown
 *  * name - The name of the MediaCard Object
 *  * summary - The summary for the MediaCard Object
 *  * rating - The rating of the show / movie for the Object being shown
 *  * poster - A link to the poster of the MediaCard Object
 *  * show - Boolean, if true, displays the show variant of the mediacard
 *  * clickHandler - The function that calls back when the MediaCard is clicked
 *  * showEpisodes - if true, will show the seasons and the episodes expandable card
 *  * episodeData - If showEpisodes is true, this is the episode data
 */

import React, { Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardMedia from "@material-ui/core/CardMedia";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import SendIcon from "@material-ui/icons/PlayArrow";
import Rating from "@material-ui/lab/Rating";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import TVIcon from "@material-ui/icons/Tv";
import LinearProgress from "@material-ui/core/LinearProgress";
import { CardContent } from "@material-ui/core";
import ControlledExpansionPanel from "./ControlledExpansionPanel";
class MediaCard extends Component {
  constructor() {
    super();
    this.state = {
      selectedElement: null
    };
    this.styles = makeStyles({
      card: {
        maxWidth: 345
      },
      media: {
        height: 140
      }
    });
  }

  // transforms an out of 10 rating to an out of 5 rating
  getRating() {
    return (
      <Rating
        name={this.props.vid}
        value={this.props.rating / 2}
        precision={0.5}
        size="small"
        readOnly
      />
    );
  }

  handleClick(response) {
    response = !response ? (response = arguments[0]) : response;
    this.setState({ selectedElement: response.vid }, () => {
      this.props.handleClick(response);
    });
  }

  showCard() {
    return (
      <Card className={this.styles.card}>
        <CardActionArea
          onClick={this.handleClick.bind(this, {
            ActionPanel: true,
            isShow: this.props.show,
            vid: this.props.vid
          })}
        >
          <CardMedia style={{ height: 200 }} image={this.props.poster} />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {this.props.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              {this.props.summary}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          {this.getRating()}
          <Grid container justify="flex-end">
            <Button
              size="small"
              color="secondary"
              variant="text"
              key={this.props.vid}
              onClick={this.handleClick.bind(this, {
                ActionPanel: false,
                isShow: this.props.show,
                vid: this.props.vid
              })}
            >
              <SendIcon /> Watch
            </Button>
          </Grid>
        </CardActions>
      </Card>
    );
  }

  episodeCard() {
    return (
      <Card className={this.styles.card}>
        <CardHeader
          avatar={
            <Avatar style={{ backgroundColor: "#ff3d00" }}>
              <TVIcon></TVIcon>
            </Avatar>
          }
          title={this.props.name}
          subheader={"Recently Added"}
        ></CardHeader>
        <CardContent>
          <Grid container spacing={2}>
            {this.props.episodeData[1][0].keywords
              .split(",")
              .map((keyword, i) => {
                return (
                  <Grid item xs key={i}>
                    <Chip
                      label={keyword}
                      variant="outlined"
                      style={{ marginRight: 3 }}
                    ></Chip>
                  </Grid>
                );
              })}
            <Grid item xs></Grid>
            <Grid item xs={12}>
              <ControlledExpansionPanel
                episodeData={this.props.episodeData}
                episodeHandler={this.handleClick.bind(this)}
              ></ControlledExpansionPanel>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }
  render() {
    if (this.props.showEpisodes) {
      return this.episodeCard();
    } else {
      return this.showCard();
    }
  }
}

export default MediaCard;
