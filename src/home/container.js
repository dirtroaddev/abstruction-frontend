import React, { Component } from 'react';
import { connect } from 'react-redux';

import { decodeUser } from './async';

import ConversationList from '../conversation/list/presentation';
import FriendPanel from '../friend/panel/container';

class Home extends Component {
  state = {
    decryptedData: null
  };
  componentWillReceiveProps(nextProps) {
    if (
      this.props.user.data !== nextProps.user.data ||
      this.props.passphrase !== nextProps.passphrase
    ) {
      this.props.decodeUser(nextProps.passphrase);
    }
  }
  componentDidMount() {
    if (!!!this.state.decryptedData && !!this.props.passphrase) {
      this.props.decodeUser();
    }
  }
  render() {
    return (
      <div>
        <ConversationList
          filter={this.props.user.username}
          data={this.state.decryptedData}
        />
        <FriendPanel />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.authStore.user,
    passphrase: state.authStore.passphrase
  };
};

export default connect(mapStateToProps, { decodeUser })(Home);
