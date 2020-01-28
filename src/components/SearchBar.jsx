/**
 * @component SearchBar
 * @description Displays a searchbar for searching the library
 * @author Daniel Krivokuca
 * @props
 * * handleKeyPress - Function to handle the enter key press
 * * type - Either Torrents or library
 */
import React, { Component } from "react";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/SearchOutlined";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";

class SearchBar extends Component {
  render() {
    return (
      <Paper
        style={{
          padding: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: 400
        }}
      >
        <IconButton style={{ padding: 10 }} aria-label="Search">
          <SearchIcon />
        </IconButton>
        <InputBase
          style={{ marginLeft: 8, flex: 1 }}
          placeholder={
            this.props.type === "library" ? "Search Library" : "Search Torrents"
          }
          id={this.props.type === "library" ? "searchLib" : "searchDiscover"}
          onKeyPress={this.props.handleKeyPress}
          autoComplete="off"
        />
      </Paper>
    );
  }
}
export default SearchBar;
