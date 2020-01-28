/**
 * @component Header
 * @description Provides a header and navigation to the App
 * @author Daniel Krivokuca
 * @props
 * * appTitleName - The title of the Application
 * * activeStage - Which stage is active
 * * clickHandler - Stage deferal function
 * * showNavigation - If true the burger-navigator will be accessible
 */
import React, { Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TVIcon from "@material-ui/icons/DesktopWindows";
import RecommendedIcon from "@material-ui/icons/ThumbsUpDown";
import SettingsIcon from "@material-ui/icons/Settings";
import MenuIcon from "@material-ui/icons/Menu";
import HomeIcon from "@material-ui/icons/Home";
import MovieIcon from "@material-ui/icons/Movie";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Drawer from "@material-ui/core/Drawer";

class Header extends Component {
  constructor() {
    super();
    this.state = {
      menuItems: ["Home", "Movies", "TV Shows", "Recommended", "Settings"],
      menuLinks: ["home", "movies", "tv", "recommended", "settings"],
      menuOpen: false
    };

    this.styles = makeStyles(theme => ({
      root: {
        display: "flex"
      },
      drawer: {
        [theme.breakpoints.up("sm")]: {
          width: this.state.drawerWidth,
          flexShrink: 0
        }
      },
      appBar: {
        marginLeft: this.state.drawerWidth,
        [theme.breakpoints.up("sm")]: {
          width: `calc(100% - ${this.state.drawerWidth}px)`
        }
      },
      menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up("sm")]: {
          display: "none"
        }
      },
      toolbar: theme.mixins.toolbar,
      drawerPaper: {
        width: this.state.drawerWidth
      },
      content: {
        flexGrow: 1,
        padding: theme.spacing(3)
      },
      searchMargin: {
        margin: theme.spacing(1)
      }
    }));
  }

  toggleMenu() {
    this.setState({ menuOpen: !this.state.menuOpen });
  }

  // defers the stage that is selected through this.props.clickHandler
  handleMenuClick(i) {
    this.setState(
      {
        menuOpen: !this.state.menuOpen
      },
      () => {
        this.props.clickHandler(this.state.menuLinks[i]);
        document.title = `${this.state.menuItems[i]} - ${this.props.appTitleName}`;
      }
    );
  }

  genMenuIcon(i) {
    switch (i) {
      case 0:
        return <HomeIcon />;

      case 1:
        return <MovieIcon />;

      case 2:
        return <TVIcon />;

      case 3:
        return <RecommendedIcon />;

      case 4:
        return <SettingsIcon />;
      default:
        return false;
    }
  }

  render() {
    return (
      <div className={this.styles.root}>
        <AppBar position="fixed" className={this.styles.appBar}>
          <Toolbar>
            {this.props.showNavigation ? (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="Menu"
                onClick={this.toggleMenu.bind(this)}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              <></>
            )}
            <Typography variant="h6" color="inherit">
              <img
                src="https://cdn.voku.xyz/oms194x25.png"
                alt="Orange Media Server"
                draggable="false"
                style={{ paddingBottom: 4 }}
              ></img>
            </Typography>
            <Typography
              variant="h6"
              color="textSecondary"
              style={{ marginLeft: 2 }}
            >
              |Beta
            </Typography>
          </Toolbar>
        </AppBar>
        <div className={this.styles.drawer}>
          <Drawer
            variant="temporary"
            anchor="top"
            open={this.state.menuOpen}
            onClose={this.toggleMenu.bind(this)}
            modalprops={{ keepMounted: true }}
            classes={{ paper: this.styles.drawerPaper }}
          >
            <div className={this.styles.toolbar} />
            <Divider />
            <List>
              {this.state.menuItems.map((item, i) => {
                return (
                  <ListItem
                    button
                    key={item}
                    selected={
                      this.props.activeStage === this.state.menuLinks[i]
                    }
                    onClick={this.handleMenuClick.bind(this, i)}
                  >
                    <ListItemIcon>{this.genMenuIcon(i)}</ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItem>
                );
              })}
            </List>
            <Divider />
          </Drawer>
        </div>
        <Toolbar />
      </div>
    );
  }
}
export default Header;
