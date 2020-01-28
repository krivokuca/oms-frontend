/**
 * @component Stage
 * @description The Stage component displays information pertaining to the current menuLink item selected
 * @author Daniel Krivokuca
 * @version 1.0.0
 * @props
 *  * stage - Which stage is currently active
 *  * loggedInHandler - A function reciever which is true if the user is logged in and false if not
 */
import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Snackbar from "@material-ui/core/Snackbar";
import Typography from "@material-ui/core/Typography";
import MediaCard from "./MediaCard";
import MediaDialog from "./MediaDialog";
import PlayArea from "./PlayArea";
import Spinner from "./Spinner";
import Home from "./Home";
import UploadButton from "./UploadButton";
import UploadForm from "./UploadForm";
import AJAXHandler from "../js/ajaxHandler";
import StageMedia from "./StageMedia";
import AccountVerification from "./AccountVerification";
import NoContent from "./NoContent";
import LoginTesting from "./LoginTesting";

class Stage extends Component {
  constructor() {
    super();
    this.state = {
      page: 0,
      hasNextPage: false,
      apiToken: false,
      currentStage: false,
      stageData: [],
      commonData: [],
      searchData: [],
      searchTerm: false,
      mediaCardActionPanel: {},
      uploadDialogVisible: false,
      finishedInitialLoad: false,
      isLoggedIn: true,
      playAreaData: {},
      showSnackbar: false,
      episodeCard: false,
      episodeData: {}
    };

    this.AJAXHandler = new AJAXHandler();
    mixpanel.track("page-load"); // eslint-disable-line
    this.AJAXHandler._generateStatus("Loaded Resources");
  }

  componentDidMount() {
    // check if the user is logged in first
    let userToken = this.AJAXHandler.isUserLoggedIn();
    if (!userToken) {
      this.setState({ isLoggedIn: false }, () => {
        this.toggleLogin(this.state.isLoggedIn);
      });
    } else {
      // user is logged in, generate stage data
      this.AJAXHandler.getStageData(this.props.stage, this.state.page).then(
        stageData => {
          this.setState(
            {
              hasNextPage: stageData["hasNextPage"],
              stageData: stageData["data"],
              commonData: stageData["common"],
              apiToken: this.AJAXHandler.getToken(),
              currentStage: this.props.stage,
              finishedInitialLoad: true
            },
            () => {
              this.toggleLogin(this.state.isLoggedIn);
              mixpanel.track("user-login"); // eslint-disable-line
            }
          );
        }
      );
    }
  }

  toggleLogin(value) {
    this.props.loggedInHandler(value);
  }

  componentDidUpdate() {
    if (this.props.stage !== this.state.currentStage) {
      if (this.state.isLoggedIn) {
        this.AJAXHandler.getStageData(this.props.stage, this.state.page).then(
          stageData => {
            this.setState(
              {
                currentStage: this.props.stage,
                hasNextPage: stageData["hasNextPage"],
                page: stageData["page"],
                stageData: stageData["data"]
              },
              () => {
                mixpanel.track(this.props.stage); // eslint-disable-line
              }
            );
          }
        );
      }
    }
  }

  launchPlayArea() {
    let videoObject = arguments[0];
    this.setState({
      playAreaData: videoObject
    });
  }

  snackbarHandler() {
    this.setState({ showSnackbar: true });
  }
  handleMediaCardClick() {
    let request = arguments[0];
    let vid = request.vid;
    let position = this.state.stageData
      .map(element => {
        return element.vid;
      })
      .indexOf(vid);
    if (request.ActionPanel) {
      if (request.isShow) {
        this.AJAXHandler.listEpisodes(request.isShow).then(episodeData => {
          this.setState({
            episodeData: episodeData.data,
            episodeCard: request.isShow
          });
        });
      } else {
        // if it's just a movie we have all the data we need in the ContextPanel. Render play area.
        let data = {
          vid: vid,
          showid: this.state.stageData[position].showid,
          name: this.state.stageData[position].name,
          description: this.state.stageData[position].summary
        };
        this.launchPlayArea(data);
      }
    } else {
      // check to see if an episode was instantiated
      if (request.autoPlay) {
        // render the play area for the episode here
        this.launchPlayArea(request);
      }
    }
  }

  handleUploadButtonClick() {
    this.setState({ uploadDialogVisible: true });
  }

  handleUploadFormClose = () => {
    this.setState({ uploadDialogVisible: false });
  };

  render() {
    if (Object.keys(this.state.playAreaData).length !== 0)
      return (
        <PlayArea
          vid={this.state.playAreaData.vid}
          name={this.state.playAreaData.name}
          showid={this.state.playAreaData.showid}
          description={this.state.playAreaData.description}
        />
      );

    if (
      this.state.stageData.length !== 0 ||
      this.state.commonData.length !== 0
    ) {
      if (this.state.currentStage === "home") {
        return (
          <>
            <Home
              stageData={this.state.stageData}
              commonData={this.state.commonData}
              onPlay={this.launchPlayArea.bind(this)}
            />{" "}
            <UploadButton
              clickHandler={this.handleUploadButtonClick.bind(this)}
            />
            <UploadForm
              isOpen={this.state.uploadDialogVisible}
              onClose={this.handleUploadFormClose.bind(this)}
            ></UploadForm>
          </>
        );
      } else {
        return (
          <>
            <StageMedia
              stage={this.state.currentStage}
              stageData={this.state.stageData}
              handleMediaCardClick={this.handleMediaCardClick.bind(this)}
              episodeCard={this.state.episodeCard}
              episodeData={this.state.episodeData}
            />
            <UploadButton
              clickHandler={this.handleUploadButtonClick.bind(this)}
            />
            <UploadForm
              isOpen={this.state.uploadDialogVisible}
              onClose={this.handleUploadFormClose.bind(this)}
            ></UploadForm>
          </>
        );
      }
    }
    if (
      this.state.stageData.length === 0 &&
      !this.state.finishedInitialLoad &&
      this.state.isLoggedIn
    ) {
      return <Spinner />;
    }
    if (
      this.state.stageData.length === 0 &&
      this.state.finishedInitialLoad &&
      this.state.commonData.length === 0 &&
      this.state.isLoggedIn
    ) {
      return <NoContent></NoContent>;
    }

    if (!this.state.isLoggedIn) {
      return (
        <>
          <AccountVerification />{" "}
        </>
      );
    }
  }
}

export default Stage;
