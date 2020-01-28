/**
 * Renders an Epiode data table given episode data
 * @author Daniel Krivokuca
 * @version 1.0.0
 * @props
 * * season - The season number
 * * episodeData - the episode data object
 * * episodeHandler - Function to handle when the episode is played
 */
import React, { Component } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import PlayIcon from "@material-ui/icons/PlayArrowOutlined";
import IconButton from "@material-ui/core/IconButton";
class EpisodeDataTable extends Component {
  constructor() {
    super();
    this.state = {};
  }

  handleClick(episodeData) {
    let requestObject = {
      ActionPanel: false,
      vid: episodeData.vid,
      name: episodeData.name,
      description: episodeData.epsummary,
      episode: episodeData.ep,
      season: episodeData.season,
      showid: episodeData.showid,
      show: episodeData.show,
      autoPlay: true
    };
    this.props.episodeHandler(requestObject);
  }

  componentDidMount() {
    console.log(this.props.episodeData);
  }
  render() {
    return (
      <Table>
        <TableHead>
          <TableRow key="header-row">
            <TableCell>Episode</TableCell>
            <TableCell>Summary</TableCell>
            <TableCell>Play</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.props.episodeData.map(episode => {
            return (
              <TableRow key={episode.vid}>
                <TableCell>{episode.ep}</TableCell>
                <TableCell>{episode.epsummary}</TableCell>
                <TableCell>
                  <IconButton
                    aria-label="Play Media"
                    size="small"
                    color="primary"
                    onClick={this.handleClick.bind(this, episode)}
                  >
                    <PlayIcon></PlayIcon>
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }
}

export default EpisodeDataTable;
