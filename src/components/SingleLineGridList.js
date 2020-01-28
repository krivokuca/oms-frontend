import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import PlayIcon from "@material-ui/icons/PlayArrow";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    backgroundColor: theme.palette.background.paper
  },
  gridList: {
    flexWrap: "nowrap",
    transform: "translateZ(0)"
  },
  title: {
    color: "#fff"
  },
  titleBar: {
    background:
      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)"
  }
}));

export default function SingleLineGridList(props) {
  const classes = useStyles();
  const handleClick = vid => {
    props.clickHandler(vid);
  };
  return (
    <div className={classes.root}>
      <GridList
        className={classes.gridList}
        style={{ overflowX: "hidden" }}
        cols={4}
      >
        {props.stageData.map(tile => (
          <GridListTile key={tile.poster}>
            <img src={tile.poster} alt={tile.showid ? tile.show : tile.name} />
            <GridListTileBar
              title={tile.showid ? tile.show : tile.name}
              classes={{
                root: classes.titleBar,
                title: classes.title
              }}
              actionIcon={
                <IconButton
                  aria-label={`${tile.showid ? tile.show : tile.name}`}
                  onClick={handleClick.bind(this, tile.vid)}
                >
                  <PlayIcon className={classes.title} />
                </IconButton>
              }
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}
