/**
 * @component UploadForm
 * @description Displays the upload form imploring the user to upload and add new media to their library
 * @author Daniel Krivokuca
 * @props
 * * isOpen - Boolean, true if it's open, false if it's not
 * * onClose - Handler for what happens when the dialog is closed
 * * onDiscoverUpdate - Updates when a user inputs something to do Discover search box
 *
 */
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
});

const handleClose = props => {
  // handles the close logic
  // we just defer it to the parent though through it's props
  props.onClose();
};

const DialogTitle = withStyles(styles)(props => {
  const { classes, onClose } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root}>
      <Typography variant="h6">Upload Media</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={handleClose.bind(this, props)}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1)
  }
}))(MuiDialogActions);

export default function UploadForm(props) {
  const handleClose = () => {
    props.onClose();
  };

  const handleDialogEnter = event => {
    if (event.key === "Enter") {
      let searchTerm = document.getElementById("searchLib").value;
      if (searchTerm) {
        this.setState({ searchStarted: true }, () => {
          this.ajax.generateSearchResults(searchTerm, 0).then(results => {
            this.setState({ searchData: results });
          });
        });
      }
    }
  };

  return (
    <div>
      <Dialog
        onClose={handleClose.bind(this)}
        aria-labelledby="customized-dialog-title"
        open={props.isOpen}
        maxWidth="xl"
        fullWidth="true"
      >
        <DialogTitle
          id="customized-dialog-title"
          onClose={handleClose.bind(this)}
        ></DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1" gutterBottom>
            OMS Allows you to search for and download media all in the cloud.
            Enter a descriptive keyword search of what you want to watch, choose
            the appropriate torrent file and we'll add it to your library.
          </Typography>
          <div style={{ marginTop: 10 }}></div>
          <center>
            
          </center>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose.bind(this)}
            color="primary"
            disabled={true}
          >
            upload
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
