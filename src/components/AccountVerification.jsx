/**
 * @component AccountVerification
 * @description Offers users the option to create or to login to their oms account
 * @author Daniel Krivokuca
 * @props
 */
import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

import AJAXHandler from "../js/ajaxHandler";

let handleRegistration = setVerification => {
  if (
    !document.getElementById("username").value ||
    !document.getElementById("password").value ||
    !document.getElementById("phone").value ||
    !document.getElementById("betacode").value
  ) {
    return false;
  } else {
    let ajax = new AJAXHandler();
    // create the user
    ajax
      .registerAccount(
        document.getElementById("username").value,
        document.getElementById("password").value,
        document.getElementById("betacode").value,
        document.getElementById("phone").value
      )
      .then(userResults => {
        if (userResults[0] === 1) {
          // beta code activation prompt is necessry
          setVerification(userResults[1]);
        }
      })
      .catch(error => {
        alert(error["error"]);
      });
  }
};
let handleLogin = () => {
  if (
    !document.getElementById("username").value ||
    !document.getElementById("password").value
  ) {
    return false;
  } else {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let ajax = new AJAXHandler();
    ajax.tryLogin(username, password, login => {
      if (Object.keys(login).includes("error")) {
        // TODO set this to a snackbar instead of a basic javascript alert
        alert(login["error"]);
      } else {
        // login verification token created, create the User token
        ajax
          .generateNewToken("user", {
            vtoken: login["verification"],
            uid: login["uid"]
          })
          .then(userToken => {
            // hope to god the user token has been generated
            if (Object.keys(userToken).includes("validated")) {
              window.location.reload();
            } else {
              alert("Error, something went wrong");
            }
          });
      }
    });
  }
};

function handleKeyPress() {
  let e = arguments[1];
  let uid = arguments[0];
  if (e.which === 13) {
    // verify the sms code
    let ajax = new AJAXHandler();
    if (document.getElementById("smsverification").value.length > 0) {
      ajax.validateSMSCode(
        document.getElementById("smsverification").value,
        uid,
        results => {
          if (!results) {
            alert("Error registering your account. Try again later.");
          } else {
            // set the prompt to the login prompt and set verification back to false
            alert("Great, now log in.");
            window.location.reload();
          }
        }
      );
    }
  }
}
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="http://voku.xyz">
        voku
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

function userRegistration(classes, setVersion, setVerification) {
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Register an Account
        </Typography>
        <Typography variant="subtitle2">
          OMS is a cloud-based, social streaming solution
        </Typography>
        <div className={classes.form} id="registrationform">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="username"
                variant="outlined"
                required
                fullWidth
                id="username"
                label="Username"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="password"
                type="password"
                label="Password"
                name="password"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="phone"
                type="text"
                label="Phone Number"
                placeholder="12265555555"
                name="phone"
              >
                {" "}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                id="betacode"
                type="text"
                label="Beta Activation Code"
                name="betacode"
                required
              ></TextField>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox value="phoneconsent" color="primary" required />
                }
                label="An SMS message will be sent to you. Click this if you consent."
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={() => handleRegistration(setVerification)}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link
                href="#"
                variant="body2"
                color="textSecondary"
                onClick={() => setVersion(1)}
              >
                Already have an account? Sign in.
              </Link>
            </Grid>
          </Grid>
        </div>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}

function userLogin(classes, setVersion) {
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Login to OMS
        </Typography>
        <Typography variant="subtitle2">
          OMS is a cloud-based, social streaming solution
        </Typography>
        <div className={classes.form}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <TextField
                name="username"
                variant="outlined"
                required
                fullWidth
                id="username"
                label="Username"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="password"
                type="password"
                label="Password"
                name="password"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleLogin.bind(this)}
          >
            Login
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link
                href="#"
                variant="body2"
                color="textSecondary"
                onClick={() => setVersion(0)}
              >
                Have a beta code? Register an account.
              </Link>
            </Grid>
          </Grid>
        </div>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}

/**
 * Displays the user verification prompt to the user
 */
function smsVerificationPrompt(classes, uid) {
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Verify your Registration
        </Typography>
        <Typography variant="subtitle2">
          Enter your SMS code below (case-sensitive)
        </Typography>
        <div className={classes.form}>
          <center>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextField
                  name="smsverification"
                  id="smsverification"
                  variant="outlined"
                  placeholder="SMS Code"
                  onKeyPress={handleKeyPress.bind(this, uid)}
                ></TextField>
              </Grid>
            </Grid>
          </center>
        </div>
        <Typography variant="subtitle2" style={{ marginTop: 2 }}>
          It might take up to a few minutes to generate your SMS.
        </Typography>
      </div>
    </Container>
  );
}

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

export default function AccountVerification() {
  const classes = useStyles();
  const [version, setVersion] = useState(0);
  const [smsVerification, setVerification] = useState(false); // uid if the SMS verification terminal is open
  if (version === 0 && !smsVerification) {
    return userRegistration(classes, setVersion, setVerification);
  }
  if (version === 1 && !smsVerification) {
    return userLogin(classes, setVersion);
  }
  if (smsVerification) {
    return smsVerificationPrompt(classes, smsVerification);
  }
}
