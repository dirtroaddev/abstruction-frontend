import React from 'react';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';

import ConversationListPanel from './panel';
import ConversationListItem from './item';

const user = {
  emai: 'ryan.phytertek@gmail.com',
  firstName: 'Ryan',
  lastName: 'Lowe',
  privateKey: '13140912u309qwupqiefijpqed',
  publicKey: '3jfj-932r-1-r013r-31ur-93',
  friends: [],
  friendRequests: [],
  conversations: [
    {
      senderKey: 'b1234',
      participants: ['ryan.phytertek@gmail.com', 'b@b.bb', 'c@c.cc'],
      message: 'I am encrypted as fuck yall'
    },
    {
      senderKey: 'c1234',
      participants: ['ryan.phytertek@gmail.com', 'a@a.aa', 'c@c.cc'],
      message: 'I too am encrypted as fuck yall'
    }
  ]
};
const style = {
  paper: {
    padding: 16,
    textAlign: 'center'
  }
};
const ConversationList = props => {
  const thisUser = props.user ? props.user : user;
  const conversations =
    props.data &&
    props.data.conversations &&
    props.data.conversations.length > 0
      ? props.data.conversations
      : user.conversations;
  return (
    <div>
      <Grid
        container
        spacing={0}
        justify="center"
        alignContent="center"
        alignItems="center"
      >
        {conversations.map((item, index) => (
          <Grid item xs={12} sm={6} key={index} style={{ padding: 20 }}>
            <ConversationListItem item={item} filter={thisUser.email} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default ConversationList;
