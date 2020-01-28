/**
 * @component SearchResults
 * @description The element that displays the results from a
 * @author Daniel Krivokuca
 * @version 1.0.0
 * @props
 * * searchTerm - The search term
 * * searchData - An object of search Data generated
 * * type - Which search results to discover ()
 */
import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

class SearchResults extends Component {
  render() {
    if (this.props.type === "discover") {
      // render DiscoverSearchResults
    }
    return (
      <>
        <Typography variant="body2">{this.props.searchTerm}</Typography>
        <Divider />
        <List>
          {this.props.searchData.length === 0 ? (
            <Typography variant="body1">Nothing found</Typography>
          ) : (
            this.props.searchData.map(item => {
              return (
                <ListItem key={item.vid} button>
                  <ListItemText
                    primary={item.type === "tv" ? item.show : item.name}
                    secondary={item.summary}
                  />
                </ListItem>
              );
            })
          )}
        </List>
      </>
    );
  }
}

export default SearchResults;
