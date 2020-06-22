import * as XMPP from "stanza";

export const LOGIN = "LOGIN";
export const FETCH_FEEDS = "FETCH_FEEDS"; // FETCH_NODES
export const FETCH_FEED_ENTRIES = "FETCH_FEED_ENTRIES"; // FETCH_NODE_ITEMS
export const FETCH_SUBSCRIPTIONS = "FETCH_SUBSCRIPTIONS";
export const RECEIVE_ENTRIES = "RECEIVE_ENTRIES"; //New entry being pushed from the service

export function login(params) {
  return {
    type: LOGIN,
    ...params,
  };
}

export function fetchFeeds(params) {
  return {
    type: FETCH_FEEDS,
    ...params,
  };
}

export function fetchFeedEntries(params) {
  return {
    type: FETCH_FEED_ENTRIES,
    ...params,
  };
}

export function fetchSubscriptions(params) {
  return {
    type: FETCH_SUBSCRIPTIONS,
    ...params,
  };
}

export function receiveEntries(receivedEntries) {
  if (Notification.permission === "granted") {
    new Notification(receivedEntries[0].content.title.text);
  }
  return {
    type: RECEIVE_ENTRIES,
    receivedEntries: { ...receivedEntries },
  };
}

export function doLogin(credentials) {
  return (dispatch, getState) => {
    dispatch(login());
    const xmppServer = credentials.jid.split("@")[1];
    const pubsubService = "pubsub." + xmppServer;
    const { jid, password } = credentials;
    const client = XMPP.createClient({
      jid: credentials.jid,
      password: credentials.password,
      transports: {
        // websocket: "wss://" + xmppServer + ":5281/xmpp-websocket",
        bosh: "https://" + xmppServer + ":5281/http-bind",
      },
    });
    // client.on("*", (name, data) => console.log(name, data));
    client.on("pubsub:published", (msg) => {
      const { published } = msg.pubsub.items;
      const receivedEntries = { ...published };
      dispatch(receiveEntries(receivedEntries));
    });
    client.on("session:started", async () => {
      const roster = await client.getRoster();
      const bookmarks = await client.getBookmarks();
      client.sendPresence();
      const newState = {
        client,
        pubsubService,
        roster,
        bookmarks,
        jid,
        password,
        connected: true,
      };
      const success = true;
      //Application's data initializaiton
      dispatch(login({ newState, success }));
      await doFetchFeeds(pubsubService)(dispatch, getState);
      await doFetchSubscriptions(pubsubService)(dispatch, getState);
      await doFetchFeedEntries()(dispatch, getState);
    });
    client.connect();
    window.klient = client;
  };
}

export function doFetchFeeds(pubsubService) {
  return async (dispatch, getState) => {
    dispatch(fetchFeeds());
    const { client, pubsubService } = getState().login;
    const nodeItems = await client.getDiscoItems(pubsubService);
    const nodes = nodeItems.items;
    dispatch(fetchFeeds({ nodes, success: true }));
  };
}

export function doFetchFeedEntries(node = undefined) {
  return async (dispatch, getState) => {
    dispatch(fetchFeedEntries());
    const { client, pubsubService } = getState().login;
    const { subscriptions } = getState().subscriptions;
    let entries = {};
    for (const subscription of Object.values(subscriptions)) {
      const pubsub_result = await client.getItems(
        pubsubService,
        subscription.node
      );
      entries[pubsub_result.node] = pubsub_result.items;
    }
    dispatch(fetchFeedEntries({ entries, success: true }));
  };
}

export function doFetchSubscriptions(pubsubService) {
  return async (dispatch, getState) => {
    dispatch(fetchSubscriptions());
    const { client, pubsubService } = getState().login;
    let subscriptions = await client.getSubscriptions(pubsubService);
    if (subscriptions && "items" in subscriptions) {
      subscriptions = subscriptions.items.map((subscription) => ({
        ...subscription,
        active: true,
      }));
    } else {
      subscriptions = [];
    }

    dispatch(fetchSubscriptions({ subscriptions, success: true }));
  };
}

export function doUpdateSubscriptions(node, subscribe) {
  return async (dispatch, getState) => {
    const { client, pubsubService } = getState().login;
    if (subscribe) {
      try {
        await client.subscribeToNode(pubsubService, {
          node,
          useBareJID: true,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await client.unsubscribeFromNode(pubsubService, {
          node: node,
          useBareJID: true,
        });
      } catch (error) {
        console.log(error);
      }
    }
    // Might need to be disabled for performance
    await doFetchSubscriptions(pubsubService)(dispatch, getState);
    await doFetchFeedEntries(node)(dispatch, getState);
  };
}
