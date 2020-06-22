import React, { useEffect } from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { connect } from "react-redux";
import {
  makeStyles,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  ListItemAvatar,
  Avatar,
  IconButton,
} from "@material-ui/core";
import { doUpdateSubscriptions } from "../actions";
import { useHistory } from "react-router";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
  listSubheader: {
    display: "flex",
  },
  listSubheaderText: {
    color: theme.palette.primary.main,
  },
  closeButton: {
    marginLeft: "auto",
    marginRight: "37px",
    color: theme.palette.primary.main,
  },
  enabledAvatar: {
    color: theme.palette.getContrastText(theme.palette.primary.main),
    backgroundColor: theme.palette.primary.main,
  },
}));

function listToObject(list) {
  const newObject = {};
  list.forEach((element) => (newObject[element.node] = element));
  return newObject;
}

function Subscriptions(props) {
  const history = useHistory();
  const { nodes } = props.feeds;
  const { subscriptions } = props.subscriptions;
  let initialState = {
    nodes: [],
    subscriptions: [],
  };
  if (nodes.length > 0) {
    initialState["nodes"] = listToObject(nodes);
    if (subscriptions.length > 0) {
      initialState["subscriptions"] = listToObject(subscriptions);
    }
  }
  const [state, setState] = React.useState(initialState);

  const handleChange = (event) => {
    let subscriptions = { ...state.subscriptions };
    let subscribe = false;
    if (event.target.checked) {
      subscriptions[event.target.name] = event.target.name;
      subscribe = true;
    } else {
      delete subscriptions[event.target.name];
    }
    setState({ ...state, subscriptions });
    props.dispatch(doUpdateSubscriptions(event.target.name, subscribe));
  };

  useEffect(
    () =>
      history.listen(() => {
        if (history.action === "POP") {
          props.handleDisplaySubscriptionView();
        }
      }),
    [history, props]
  );
  const classes = useStyles();
  //   Explore using a Transfer list instead
  //   https://material-ui.com/components/transfer-list/
  return (
    <div>
      <List
        subheader={
          <div className={classes.listSubheader}>
            <ListSubheader color="primary">Subscriptions</ListSubheader>{" "}
            <IconButton
              color="secondary"
              className={classes.closeButton}
              onClick={props.handleDisplaySubscriptionView}
            >
              <CloseIcon />
            </IconButton>
          </div>
        }
        className={classes.root}
      >
        {Object.keys(state.nodes).map((node) => (
          <div key={node}>
            <ListItem>
              <ListItemAvatar>
                <Avatar
                  className={
                    node in state.subscriptions ? classes.enabledAvatar : ""
                  }
                  aria-label=""
                >
                  {node[0].toUpperCase()}
                </Avatar>
              </ListItemAvatar>
              <ListItemText id="switch-list-label-wifi" primary={node} />
              <ListItemSecondaryAction>
                <FormControlLabel
                  control={
                    <Switch
                      checked={node in state.subscriptions}
                      onChange={handleChange}
                      name={node}
                      color="primary"
                    />
                  }
                />
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
    </div>
  );
}

function mapStateToProps(state) {
  return { ...state };
}

export default connect(mapStateToProps)(Subscriptions);
