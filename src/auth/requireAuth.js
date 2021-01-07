import React, { Component } from 'react';
import axios from 'axios';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { API_HOST } from '../appConfig';
import { clearAuth } from '../auth/store';

export default ComposedComponent => {
  class RequireAuthentication extends Component {
    // Here, we want to check to see if `this.props.token` exists
    // If it doesn't, then redirect the user back to the /signin page
    componentWillMount() {
      if (!this.props.authStore.isAuth) {
        this.props.clearAuth();
        this.props.push('/login');
      }
    }
    // Here, we want to check to see if `this.props.token` is valid
    // If it isn't, then redirect the user back to the /signin page
    componentDidMount() {
      axios
        .get(`${API_HOST}/auth/confirm`, {
          headers: { Authorization: this.props.authStore.token }
        })
        .then(res => {
          if (!res.data.tokenConfirmed) {
            this.props.clearAuth();
            this.props.push('/login');
          }
        })
        .catch(err => {
          console.log(err);
          this.props.clearAuth();
          this.props.push('/login');
        });
    }
    render() {
      return <ComposedComponent />;
    }
  }

  const mapStateToProps = state => {
    return { authStore: state.authStore };
  };

  return connect(mapStateToProps, { push, clearAuth })(RequireAuthentication);
};
