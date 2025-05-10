import React from "react";
import { connect } from "react-redux";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Checkbox from "@material-ui/core/Checkbox";
import Avatar from "@material-ui/core/Avatar";
import ShareIcon from "@material-ui/icons/Share";
import CloseIcon from "@material-ui/icons/Close";
import SearchIcon from "@material-ui/icons/Search";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {
  makeStyles,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  DialogContent,
  InputBase,
  alpha,
  ExpansionPanelSummary,
  ExpansionPanel,
  Typography,
  ExpansionPanelDetails,
} from "@material-ui/core";
import { stringToColor } from "../utils";

const useStyles = makeStyles((theme) => ({
  dialog: {
    height: "90%",
    minWidth: "24%",
    minHeight: "90%",
  },
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  searchContainer: {
    backgroundColor: theme.palette.primary.main,
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.6),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.8),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
    expansionPanelDetails: {
      display: "block",
    },
  },
}));
function ContactList(props) {
  const { onClose, open, entry, client, bookmarks, roster } = props;
  const classes = useStyles();
  const [selectedContacts, setSelectedContacts] = React.useState({});
  const [selectedBookmarks, setSelectedBookmarks] = React.useState({});
  const [currentFilter, setCurrentFilter] = React.useState("");

  function getBookmarkByJID(bookmarkJID) {
    return bookmarks.find((bookmark) => bookmark.jid === bookmarkJID);
  }

  const handleToggleContact = (event) => {
    const { name, checked } = event.target;

    if (checked) {
      setSelectedContacts({ ...selectedContacts, [name]: name });
    } else {
      let newSelectedContacts = { ...selectedContacts };
      delete newSelectedContacts[name];
      setSelectedContacts({ ...newSelectedContacts });
    }
  };
  const handleToggleBookmark = (event) => {
    const { name, checked } = event.target;

    if (checked) {
      setSelectedBookmarks({ ...selectedBookmarks, [name]: name });
    } else {
      let newSelectedBookmarks = { ...selectedBookmarks };
      delete newSelectedBookmarks[name];
      setSelectedBookmarks({ ...newSelectedBookmarks });
    }
  };

  const handleCloseContactList = (event) => {
    onClose();
  };

  const handleOnChangeFilter = (event) => {
    setCurrentFilter(event.target.value);
  };

  const handleOnShare = (event) => {
    if (client) {
      Object.keys(selectedContacts).forEach((jid) => sendContact(jid, entry));
      Object.keys(selectedBookmarks).forEach((jid) => sendMUC(jid, entry));
    }
    onClose();
  };

  async function sendContact(jid, entry) {
    client.sendMessage({
      to: jid,
      body: entry.title.text + "\n" + entry.links[0].href,
      type: "chat",
    });
  }
  async function sendMUC(jid, entry) {
    const bookmark = getBookmarkByJID(jid);
    const nick = bookmark.nick;
    const bookmarkJID = bookmark.jid;
    await client.joinRoom(bookmarkJID, nick);
    await client.sendMessage({
      to: bookmarkJID,
      body: entry.title.text + "\n" + entry.links[0].href,
      type: "groupchat",
    });
    await client.leaveRoom(bookmarkJID, nick);
  }

  return (
    <div>
      {" "}
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="xs"
        onEntering={() => "handleEntering"}
        aria-labelledby="confirmation-dialog-title"
        open={open}
        classes={{ paper: classes.dialog }}
      >
        <DialogTitle
          className={classes.searchContainer}
          id="confirmation-dialog-title"
        >
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search contacts"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
              onChange={handleOnChangeFilter}
            />
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Contacts</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <List dense className={classes.root}>
                {roster &&
                  roster
                    .filter((contact) => contact.jid.includes(currentFilter))
                    .map((contact) => {
                      return (
                        <ListItem key={contact.jid} button>
                          <ListItemAvatar>
                            <Avatar
                              alt={"USER AVATAR"}
                              style={{
                                backgroundColor: stringToColor(contact.jid),
                              }}
                            >
                              {contact.jid[0].toUpperCase() + contact.jid[1]}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            id={contact.jid}
                            primary={contact.jid}
                          />
                          <ListItemSecondaryAction>
                            <Checkbox
                              edge="end"
                              name={contact.jid}
                              onChange={handleToggleContact}
                              checked={contact.jid in selectedContacts}
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                      );
                    })}
              </List>
            </ExpansionPanelDetails>
          </ExpansionPanel>

          <ExpansionPanel>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Groups</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <List dense className={classes.root}>
                {bookmarks &&
                  bookmarks
                    .filter((bookmark) => bookmark.jid.includes(currentFilter))
                    .map((bookmark) => {
                      return (
                        <ListItem key={bookmark.jid} button>
                          <ListItemAvatar>
                            <Avatar
                              alt={"USER AVATAR"}
                              style={{
                                backgroundColor: stringToColor(bookmark.jid),
                              }}
                            >
                              {bookmark.jid[0].toUpperCase() + bookmark.jid[1]}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            id={bookmark.jid}
                            primary={bookmark.jid}
                          />
                          <ListItemSecondaryAction>
                            <Checkbox
                              edge="end"
                              name={bookmark.jid}
                              onChange={handleToggleBookmark}
                              checked={bookmark.jid in selectedBookmarks}
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                      );
                    })}
              </List>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={handleCloseContactList}
            color="secondary"
            startIcon={<CloseIcon />}
          >
            Cancel
          </Button>
          <Button
            onClick={handleOnShare}
            color="primary"
            startIcon={<ShareIcon />}
          >
            Share
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    roster: state.login.roster ? [...state.login.roster.items] : [],
    client: state.login.client ? state.login.client : undefined,
    bookmarks: state.login.bookmarks ? state.login.bookmarks : [],
  };
}

export default connect(mapStateToProps)(ContactList);
