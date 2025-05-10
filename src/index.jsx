import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import configureStore from "./configureStore";
import { Router } from "react-router";
import { createBrowserHistory } from "history";
import { saveState, loadState } from "./localStorage";
const history = createBrowserHistory();
const persistedState = loadState();
const store = configureStore(persistedState);
store.subscribe(() => {
  saveState(store.getState());
});

ReactDOM.render(
  // <React.StrictMode>
  <Router path="/" history={history}>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>, // </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
