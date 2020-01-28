/**
 * DiscoverSearchResults
 * @author Daniel Krivokuca
 * @props
 * * searchData - The data retrieved from the search
 */

import React, { Component } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Paper from "@material-ui/core/Paper";

class DiscoverSearchResults extends Component {
  constructor() {
    super();
    this.state = {};
  }

  // detects a click on the ItemList and does
  detectTrigger = triggerObject => {
    if (this.props.stateLimiter !== 0) {
      this.props.stateLimiter(triggerObject);
    }
  };
  render() {
    return <div></div>;
  }
}

export default DiscoverSearchResults;
