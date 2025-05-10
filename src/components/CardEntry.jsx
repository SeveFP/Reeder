import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import { red } from "@material-ui/core/colors";
import ShareIcon from "@material-ui/icons/Share";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { Fab, Link } from "@material-ui/core";
import ContactList from "./ContactList";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "100%",
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

export default function CardEntry(props) {
  const classes = useStyles();
  const [isContactListOpen, setIsContactListOpen] = React.useState(false);
  const { entry } = props;

  const dateOptions = { year: "numeric", month: "numeric", day: "numeric" };

  function parseHTML(htmlString) {
    const doc = new DOMParser().parseFromString(htmlString, 'text/html');
    const links = doc.querySelectorAll('a');
    links.forEach(link => {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    });
    return { __html: doc.body.innerHTML };
  }

  function _renderContent() {
    if (entry.summary) {
      return (
        <div dangerouslySetInnerHTML={parseHTML(entry.summary.text)}></div>
      );
    } else if (entry.content) {
      return (
        <div dangerouslySetInnerHTML={parseHTML(entry.content.text)}></div>
      );
    } else {
      return <div></div>;
    }
  }
  return (
    <Card className={classes.root}>
      <IconButton
        color="primary"
        className={classes.closeButton}
        onClick={props.onClose}
      >
        <ArrowBackIcon />
      </IconButton>
      <Link href={entry.links[0].href} target="_blank" rel="noreferrer">
        <CardHeader
          title={entry.title.text}
          subheader={
            entry.updated
              ? entry.updated.toLocaleString(undefined, dateOptions)
              : entry.published
                ? entry.published.toLocaleString(undefined, dateOptions)
                : "Unknown date"
          }
        />
      </Link>
      <CardContent>{_renderContent()}</CardContent>
      <Fab
        color="primary"
        aria-label="Share"
        className={classes.fab}
        onClick={() => setIsContactListOpen(true)}
      >
        <ShareIcon />
      </Fab>
      <br />
      <br />
      <br />
      <ContactList
        open={isContactListOpen}
        onClose={() => setIsContactListOpen(false)}
        entry={entry}
      />
    </Card>
  );
}
