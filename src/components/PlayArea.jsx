/**
 * @component PlayArea
 * @description Renders the player and episode/recommended sidebar on the stage (as well as other cosmetic changes)
 * @author Daniel Krivokuca
 * @props
 * * vid - The videoID of the current media being played
 * * name - Name of the media
 * * showid - Null if it's a movie or the showid of the show
 * * description - Description of the media being played
 * * show - If it's a show this is the showname, else it's false
 * * season - The season (if true)
 *
 */
import React, { Component } from "react";
import AJAXHandler from "../js/ajaxHandler";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
class PlayArea extends Component {
  constructor() {
    super();
    this.ajax = new AJAXHandler();
    this.state = {
      isShow: false,
      episodeData: false,
      streamToken: false
    };
  }

  generatePlayer() {
    this.ajax.getTime(this.props.vid, getTime => {
      // eslint-disable-next-line
      let player = new Clappr.Player({
        source: this.ajax.createStreamURL(
          this.props.vid,
          this.state.streamToken
        ),
        parentId: "#oms-player",
        // eslint-disable-next-line
        plugins: [ClapprStats],
        height: 473,
        width: 840,
        clapprStats: {
          runEach: 8000,
          onReport: metrics => {
            let currentTime = metrics["extra"]["currentTime"];
            this.ajax.setTime(this.props.vid, currentTime, () => {});
          }
        }
      });
      if (getTime) {
        player.seek(getTime / 1000);
      }
    });
  }
  componentDidMount() {
    this.ajax.assignAPIToken().then(() => {
      this.ajax.getStreamToken(this.props.vid, token => {
        if (!token) {
          this.ajax
            .generateNewToken("stream", { vid: this.props.vid })
            .then(token => {
              this.setState(
                {
                  streamToken: token.stream,
                  isShow: this.props.showid
                },
                () => {
                  // generate player
                  this.generatePlayer();
                }
              );
            });
        } else {
          this.setState(
            { streamToken: token.stream, isShow: this.props.showid },
            () => {
              this.generatePlayer();
            }
          );
        }
      });
    });
  }

  render() {
    return (
      <Container maxWidth="md">
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
        >
          <Grid item xs>
            <div id="oms-player" style={{}} />
            <Divider />
          </Grid>
        </Grid>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          style={{ marginTop: 3 }}
        >
          <Grid item md>
            <Card
              style={{
                minWidth: 745
              }}
            >
              <CardContent>
                <Typography variant="h5" component="h5" gutterBottom>
                  {this.props.show ? this.props.show : this.props.name}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {this.props.show ? this.props.show : ""}
                </Typography>
                <Typography variant="body2">
                  {this.props.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export default PlayArea;
