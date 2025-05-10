import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import { doLogin } from "../actions";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatarIcon: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  button: {
    margin: theme.spacing(3, 0, 2),
  },
  content: {
    padding: theme.spacing(1),
  },
}));

function Login(props) {
  const classes = useStyles();
  const [state, setState] = useState({});

  const handleOnChangeInput = (event) => {
    const { value, name } = event.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLogin = (event) => {
    props.dispatch(
      doLogin({
        jid: state.jid,
        password: state.password,
      })
    );
  };
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Paper className={classes.paper}>
        <Avatar className={classes.avatarIcon}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Log in
        </Typography>
        <form>
          <Grid container spacing={2} className={classes.content}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="jid"
                label="XMPP Address"
                name="jid"
                autoComplete="email"
                onChange={handleOnChangeInput}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={handleOnChangeInput}
                onKeyDown={(event => {
                  if (event.key === 'Enter') {
                    handleLogin();
                  }
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={handleLogin}
              >
                Log in
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}

function mapStateToProps(state) {
  return { ...state };
}

export default connect(mapStateToProps)(Login);
