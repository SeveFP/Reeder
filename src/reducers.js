import { combineReducers } from "redux";
import {
  LOGIN,
  FETCH_FEEDS,
  FETCH_FEED_ENTRIES,
  FETCH_SUBSCRIPTIONS,
  RECEIVE_ENTRIES,
} from "./actions";

function login(state = {}, action) {
  switch (action.type) {
    case LOGIN:
      const { newState, success, error } = action;
      switch (success) {
        case undefined:
          return Object.assign({}, state, {
            isLoggingIn: true,
          });
        case true:
          return Object.assign({}, state, {
            isLoggingIn: false,
            ...newState,
          });
        default:
          return Object.assign({}, state, {
            isLoggingIn: false,
            loginFailure: true,
            loginError: error,
          });
      }
    default:
      return state;
  }
}

function feeds(state = {}, action) {
  switch (action.type) {
    case FETCH_FEEDS:
      const { nodes, success, error } = action;
      switch (success) {
        case undefined:
          return Object.assign({}, state, {
            isFetchingFeeds: true,
          });
        case true:
          return Object.assign({}, state, {
            isFetchingFeeds: false,
            nodes,
          });
        default:
          return Object.assign({}, state, {
            isFetchingFeeds: false,
            feedsFetchFailure: true,
            feedsFetchError: error,
          });
      }
    default:
      return state;
  }
}

function subscriptions(state = {}, action) {
  switch (action.type) {
    case FETCH_SUBSCRIPTIONS:
      const { subscriptions, success, error } = action;
      switch (success) {
        case undefined:
          return Object.assign({}, state, {
            isFetchingSubscriptions: true,
          });
        case true:
          return Object.assign({}, state, {
            isFetchingSubscriptions: false,
            subscriptions: Object.values(subscriptions).map(
              (subscription) => subscription
            ),
          });
        default:
          return Object.assign({}, state, {
            isFetchingSubscriptions: false,
            subscriptionsFetchFailure: true,
            subscriptionsFetchError: error,
          });
      }
    default:
      return state;
  }
}

function entries(state = {}, action) {
  switch (action.type) {
    case FETCH_FEED_ENTRIES:
      const { entries, success, error } = action;
      let newEntries = {};
      switch (success) {
        case undefined:
          return Object.assign({}, state, {
            isFetchingEntries: true,
          });
        case true:
          if (entries && Object.keys(entries).length > 0) {
            for (const node in entries) {
              const entriesArray = entries[node].map((entry) => ({
                ...entry.content,
                node,
              }));
              for (const entry of entriesArray) {
                newEntries[entry.id] = entry;
              }
            }
          }
          return Object.assign({}, state, {
            isFetchingEntries: false,
            entries: { ...newEntries },
          });
        default:
          return Object.assign({}, state, {
            isFetchingEntries: false,
            entriesFetchFailure: true,
            entriesFetchError: error,
          });
      }
    case RECEIVE_ENTRIES:
      const { receivedEntries } = action;
      const newReceivedEntries = {};
      for (const value of Object.values(receivedEntries)) {
        newReceivedEntries[value.content.id] = value.content;
      }

      return Object.assign({}, state, {
        entries: { ...state.entries, ...newReceivedEntries },
      });
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  login,
  feeds,
  subscriptions,
  entries,
});

export default rootReducer;
