import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { setPassphrase, clearPassphrase } from '../auth/store';
import { logout } from '../auth/async';
import NavBarPresentation from './presentation';

class NavBar extends Component {
  setPassphrase = passphrase => {
    this.props.setPassphrase(passphrase);
  };
  logoutHandler = () => {
    this.props.logout();
  };
  render() {
    return (
      <NavBarPresentation
        user={this.props.auth.user}
        passphrase={this.props.auth.passphrase}
        setPassPhrase={this.setPassphrase}
        clearPassphrase={this.props.clearPassphrase}
        logout={this.logoutHandler}
      />
    );
  }
}

const mapStateToProps = state => ({
  auth: state.authStore
});

export default connect(mapStateToProps, {
  push,
  setPassphrase,
  clearPassphrase,
  logout
})(NavBar);
