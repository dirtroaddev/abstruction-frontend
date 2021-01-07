import React, { Component } from 'react';
import { connect } from 'react-redux';

import { friendRequestInit, friendRequestSend } from '../async';
import { friendRequestClear } from '../store';
import { addFriend, addFriendRequest } from '../../auth';

import FriendPanelPresentation from './presentation';
class FriendPanel extends Component {
  componentDidMount() {
    if (this.props.friendRequests && this.props.friendRequests.length > 0) {
      this.handleNewFriendRequests(this.props.friendRequests);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.friendRequests && nextProps.friendRequests.length > 0) {
      this.handleNewFriendRequests(nextProps.friendRequests);
    }
    if (nextProps.friendRequestSuccess) {
      this.props.friendRequestClear();
    }
  }
  handleNewFriendRequests = friendRequests => {
    this.props.addFriendRequest(friendRequests);
    this.props.apiPostFriendRequestRecieved(this.props.token, friendRequests);
    this.props.encodeUserData(this.props.passphrase, this.props.decodedUser);
  };
  handleFriendRequestInit = username => {
    this.props.friendRequestInit(username);
  };
  handleFriendRequestSend = (username, passphrase, alias) => {
    this.props.friendRequestSend(username, passphrase, alias);
  };
  render() {
    return (
      <FriendPanelPresentation
        handleFriendRequestInit={this.handleFriendRequestInit}
        handleFriendRequestSend={this.handleFriendRequestSend}
        validRequest={this.props.validRequest}
        friendRequestSuccess={this.props.friendRequestSuccess}
      />
    );
  }
}

const mapStateToProps = state => ({
  token: state.authStore.token,
  passphrase: state.authStore.passphrase,
  validRequest: state.friendStore.validRequest,
  friendRequestSuccess: state.friendStore.friendRequestSuccess,
  encryptedServerKeyPair: state.friendStore.encryptedServerKeyPair,
  friendRequests: state.authStore.user.friendRequests
});

export default connect(mapStateToProps, {
  // apiPostFriendRequestInit
  friendRequestInit,
  friendRequestSend,
  addFriend,
  addFriendRequest,
  friendRequestClear
})(FriendPanel);
