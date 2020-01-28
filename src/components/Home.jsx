/**
 * @component Home
 * @description The landing page of the OMS app
 * @author Daniel Krivokuca
 * @props
 * ***** REFACTORING NEEDED ******
 * * stageData - The current data of the stage
 * * commonData - Data common between all users
 * * onPlay - Function that handles video playing
 */
import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Container from "@material-ui/core/Container";
import CardContent from "@material-ui/core/CardContent";
import Spinner from "./Spinner";
import LibrarySearchResults from "./LibrarySearchResults";
import DiscoverSearchResults from "./DiscoverSearchResults";
import SearchBar from "./SearchBar";
import SingleLineGridList from "./SingleLineGridList";
import HomeContainer from "./HomeContainer";
import AJAXHandler from "../js/ajaxHandler";

class Home extends Component {
  constructor() {
    super();
    this.state = {
      searchTerm: false,
      searchData: [],
      discoverTerm: false,
      discoverData: [],
      discoverStarted: false,
      ajaxLoaded: false,
      searchStarted: false
    };
    this.ajax = new AJAXHandler();
  }
  componentDidMount() {
    if (!this.state.ajaxLoaded) {
      let userid = this.ajax.isUserLoggedIn();
      this.ajax.assignAPIToken(userid).then(val => {
        if (!val) {
          this.ajax._generateError("UserID Not Found");
        } else {
          this.ajax._generateStatus("Home Content Loaded");
          this.setState({ ajaxLoaded: true });
        }
      });
    }
  }

  handleLibrarySearchKeyPress = event => {
    if (event.key === "Enter") {
      let searchTerm = document.getElementById("searchLib").value;

      this.setState({ searchStarted: true }, () => {
        this.ajax.generateSearchResults(searchTerm, 0).then(results => {
          this.setState({ searchData: results });
        });
      });
    }
  };

  handleDiscoverSearchKeyPress = event => {
    if (event.key === "Enter") {
      let searchTerm = document.getElementById("searchDiscover");
      this.setState({ discoverStarted: true });
      this.ajax.generateDiscovery(searchTerm, true).then(results => {
        console.log(results);
        this.setState({ discoverData: results });
      });
    }
  };

  handleSingleLineClick() {
    let vid = arguments[0];
    // get the last watched data for the vid
    this.props.stageData.map((val, i) => {
      if (vid === val["vid"]) {
        // check to see if its a movie or a show
        if (val["showid"]) {
          // show, get the latest-watched episode
          this.ajax.generateLastWatched(val["showid"]).then(results => {
            console.log(results);
          });
        } else {
          let movieData = {
            vid: vid,
            showid: val.showid,
            name: val.name,
            description: val.summary
          };

          // recreate the movie object here, we do this more redundancy purposes
          this.props.redundancyPlay.update(updateableObject => () => {});
          this.props.onPlay(movieData);
        }
      }
    });
  }

  handleCommonClick() {
    let vid = arguments[0];
    // get the last watched data for the vid
    this.props.commonData.map((val, i) => {
      if (vid === val["vid"]) {
        // check to see if its a movie or a show
        if (val["showid"]) {
          // show, get the latest-watched episode
          this.ajax.generateLastWatched(val["showid"]).then(results => {
            console.log(results);
          });
        } else {
          // launch the movie
          let movieData = {
            vid: vid,
            showid: val.showid,
            name: val.name,
            description: val.summary
          };
          this.props.onPlay(movieData);
        }
      }
    });
  }

  renderSharedLibrary() {
    if (this.props.commonData.length !== 0) {
      return (
        <div style={{ marginTop: 10 }}>
          <Typography variant="h4">Global Library</Typography>
          <Typography variant="body1" gutterBottom>
            Library common across all users.
          </Typography>
          <SingleLineGridList
            stageData={this.props.commonData}
            clickHandler={this.handleCommonClick.bind(this)}
          />
          <Divider />
        </div>
      );
    } else {
      return <></>;
    }
  }

  renderPreviouslyWatched() {
    return (
      <>
        <Typography variant="h4" gutterBottom>
          Previously Watched
        </Typography>
        <SingleLineGridList
          stageData={this.props.stageData}
          clickHandler={this.handleSingleLineClick.bind(this)}
        />
        <Divider />
      </>
    );
  }

  render() {
    // urgent refactoring needed on this
    if (
      this.props.stageData.length !== 0 &&
      this.props.commonData.length !== 0
    ) {
      return (
        <Container maxWidth="md">
          {this.renderPreviouslyWatched()}
          {this.renderSharedLibrary()}
          {<HomeContainer stageData={[]}></HomeContainer>}
        </Container>
      );
    }
    if (
      this.props.stageData.length !== 0 &&
      this.props.commonData.length === 0
    ) {
      return (
        <Container maxWidth="md">
          {this.renderPreviouslyWatched()}
          {<HomeContainer stageData={[]}></HomeContainer>}
        </Container>
      );
    }
    if (
      this.props.stageData.length === 0 &&
      this.props.commonData.length !== 0
    ) {
      return (
        <Container maxWidth="md">
          {this.renderSharedLibrary()}
          {<HomeContainer stageData={[]}></HomeContainer>}
        </Container>
      );
    }
    if (
      this.props.stageData.length === 0 &&
      this.props.commonData.length === 0
    ) {
      return <HomeContainer stageData={[]}></HomeContainer>;
    }
  }
}
export default Home;
