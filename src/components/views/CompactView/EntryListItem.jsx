import React from "react";
import {
  ListItem,
  ListItemText,
  Typography,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  leftTypography: {
    ...theme.typography.subtitle2,
    color: theme.palette.text.secondary,
    marginRight: "auto",
  },
  rightTypography: {
    ...theme.typography.subtitle2,
    color: theme.palette.text.secondary,
    marginLeft: "auto",
  },
  secondaryTextContainer: {
    display: "flex",
  },
}));

export default function EntryListItem(props) {
  const classes = useStyles();
  const { entry } = props;
  const dateOptions = { year: "numeric", month: "numeric", day: "numeric" };
  const title = <Typography variant="h6">{entry.title.text}</Typography>;
  const subtitle = (
    <span className={classes.secondaryTextContainer}>
      <Typography className={classes.leftTypography}>
        {entry.updated
          ? entry.updated.toLocaleString(undefined, dateOptions)
          : entry.published
          ? entry.published.toLocaleString(undefined, dateOptions)
          : "Unknown date"}
      </Typography>
      <Typography className={classes.rightTypography}>{entry.node}</Typography>
    </span>
  );
  return (
    <ListItem
      button
      key={entry.id + "text"}
      onClick={() => {
        props.handleOpenEntryView(entry.id);
      }}
    >
      <ListItemText disableTypography primary={title} secondary={subtitle} />
    </ListItem>
  );
}
