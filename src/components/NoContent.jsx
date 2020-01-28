/**
 * @component NoContent
 * @description A static page that is displayed when the user has no content uploaded to their server
 * @author Daniel Krivokuca
 * @version 1.0.0
 */
import React, { Component } from "react";
import ErrorIcon from "@material-ui/icons/ErrorOutline";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

class NoContent extends Component {
  constructor() {
    super();
    this.state = {
      title: "No Content Found.",
      subtext:
        "Your library is empty. To upload some content, press the blue 'Upload' button on the right corner"
    };
  }
  render() {
    return (
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: "70vh" }}
      >
        <Card>
          <CardHeader
            avatar={
              <Avatar>
                <ErrorIcon />
              </Avatar>
            }
            title={this.state.title}
          ></CardHeader>
          <CardContent>
            <Typography variant="body2" color="textSecondary">
              {this.state.subtext}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    );
  }
}

export default NoContent;
