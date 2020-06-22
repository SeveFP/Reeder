import React from "react";
import Login from "./components/Login";
import { connect } from "react-redux";
import { doLogin } from "./actions";
import ClippedDrawer from "./components/ClipperDrawer";
import Subscriptions from "./components/Subscriptions";
import { withRouter } from "react-router";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      connected: false,
      showSubscriptionsView: false,
    };
    const { jid, password } = props.login;
    if (jid && password) {
      props.dispatch(doLogin({ jid, password }));
    }
  }

  mustShowLogin() {
    const { jid, password } = this.props.login;
    const { entries } = this.props.entries;
    if (jid && password) {
      return false;
    }
    if (this.state.connected) {
      return false;
    }
    if (entries && Object.keys(entries) > 0) {
      return false;
    }
    return true;
  }

  handleDisplaySubscriptionView = () => {
    const { showSubscriptionsView } = this.state;
    if (!showSubscriptionsView) {
      this.props.history.push("/");
    }
    this.setState({ showSubscriptionsView: !showSubscriptionsView });
  };
  render() {
    if (!this.mustShowLogin()) {
      if (this.state.showSubscriptionsView) {
        return (
          <Subscriptions
            handleDisplaySubscriptionView={this.handleDisplaySubscriptionView}
          />
        );
      } else {
        return (
          <ClippedDrawer
            handleDisplaySubscriptionView={this.handleDisplaySubscriptionView}
          />
        );
      }
    } else {
      return <Login />;
    }
  }
}

function mapStateToProps(state) {
  return { ...state };
}

export default connect(mapStateToProps)(withRouter(App));
