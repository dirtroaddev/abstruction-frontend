import React from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';

const ConversationListPanel = props => {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          style={{
            marginLeft: -12,
            marginRight: 20
          }}
          color="contrast"
          aria-label="Menu"
        >
          <MenuIcon />
        </IconButton>
        <Typography type="title" color="inherit" style={{ flex: 1 }}>
          Conversations
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default ConversationListPanel;
