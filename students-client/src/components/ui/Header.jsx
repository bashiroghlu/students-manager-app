import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  loginButton: {
    display: "block",
    marginLeft: "auto",
  },
}));

export default function ButtonAppBar() {
  const classes = useStyles();

  return (
    <AppBar position="static">
      <Toolbar>
        <Button className={classes.title}>
          <img src={logo} alt="company logo" />
        </Button>
        <Button
          color="inherit"
          className={classes.loginButton}
          component={Link}
          to="/login"
        >
          Login
        </Button>
      </Toolbar>
    </AppBar>
  );
}
