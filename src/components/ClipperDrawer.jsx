import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import MoreVert from "@material-ui/icons/MoreVert";
import { connect } from "react-redux";
import EntryListItem from "./views/CompactView/EntryListItem";
import CardEntry from "./CardEntry";
import {
  Hidden,
  IconButton,
  Menu,
  MenuItem,
  LinearProgress,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";

const drawerWidth = "60%";
const drawerWidthFull = "100%";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerFull: {
    width: drawerWidthFull,
    flexShrink: 0,
  },
  drawerPaperFull: {
    width: drawerWidthFull,
  },
  drawerContainer: {
    overflow: "auto",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  settingsMenu: {
    marginLeft: "auto",
  },
}));

function ClippedDrawer(props) {
  const classes = useStyles();
  const history = useHistory();

  const [state, setState] = useState({
    isDrawerOpen: false,
    entryOnDisplay: undefined,
  });

  useEffect(
    () =>
      history.listen(() => {
        if (history.action === "POP") {
          setState({ isDrawerOpen: false });
        }
      }),
    [history]
  );

  useEffect(() => {
    async function requestNotificationsPermission() {
      await Notification.requestPermission();
    }
    requestNotificationsPermission();
  }, []);

  let { entries } = props.entries;
  const { isFetchingEntries } = props.entries;

  function sortByDateDescending(entries) {
    return entries
      .map((entry) => {
        const { updated, published } = entry;
        if (updated) {
          entry.updated = new Date(updated);
        }
        if (published) {
          entry.published = new Date(published);
        }
        return entry;
      })
      .sort((a, b) =>
        a.updated && b.updated
          ? b.updated.getTime() - a.updated.getTime()
          : a.published && b.published
          ? b.published.getTime() - a.published.getTime()
          : 0
      );
  }

  function handleDrawerToggle(entryId) {
    const { entryOnDisplay } = state;
    const isDrawerOpen = !state.isDrawerOpen;
    const newEntryOnDisplay = props.entries.entries[entryId];
    if (isDrawerOpen) {
      history.push("/", { isDrawerOpen });
    }
    setState({
      isDrawerOpen,
      entryOnDisplay: newEntryOnDisplay ? newEntryOnDisplay : entryOnDisplay,
    });
  }

  const handleOpenSettingsMenu = (event) => {
    setState({ ...state, anchorEl: event.currentTarget });
  };

  const handleCloseSettingsMenu = (event) => {
    setState({ ...state, anchorEl: null });
  };

  function _renderCard() {
    if (state.entryOnDisplay) {
      return (
        <CardEntry entry={state.entryOnDisplay} onClose={handleDrawerToggle} />
      );
    } else {
      return <div />;
    }
  }
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Reeder
          </Typography>
          <div className={classes.settingsMenu}>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenSettingsMenu}
              color="inherit"
            >
              <MoreVert />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={state.anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(state.anchorEl)}
              onClose={handleCloseSettingsMenu}
            >
              <MenuItem onClick={props.handleDisplaySubscriptionView}>
                Subscriptions
              </MenuItem>
              <MenuItem onClick={handleCloseSettingsMenu}>
                <s>My account</s>
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <Toolbar />
        {isFetchingEntries && <LinearProgress />}

        <List>
          {entries &&
            !isFetchingEntries &&
            Object.keys(entries).length > 0 &&
            sortByDateDescending(Object.values(entries)).map((entry, index) => {
              return (
                <div key={entry.id}>
                  <EntryListItem
                    key={entry.id}
                    entry={entry}
                    handleOpenEntryView={handleDrawerToggle}
                  />
                  <Divider />
                </div>
              );
            })}
        </List>
      </main>
      {/* Desktop drawer */}
      <Hidden smDown>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
          anchor="right"
          open
        >
          <Toolbar />
          <div className={classes.drawerContainer}>
            <Divider />
            {_renderCard()}
          </div>
        </Drawer>
      </Hidden>
      {/* Mobile drawer */}
      <Hidden mdUp>
        <Drawer
          className={classes.drawerFull}
          variant="temporary"
          classes={{
            paper: classes.drawerPaperFull,
          }}
          anchor="right"
          open={state.isDrawerOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {/* <Toolbar /> */}
          <div className={classes.drawerContainer}>
            <Divider />
            {_renderCard()}
          </div>
        </Drawer>
      </Hidden>
    </div>
  );
}

function mapStateToProps(state) {
  return { ...state };
}

export default connect(mapStateToProps)(ClippedDrawer);
