import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import AddCirleOutline from 'material-ui-icons/AddCircleOutline';
import Autorenew from 'material-ui-icons/Autorenew';
import TextField from 'material-ui/TextField';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog';

const styles = {
  root: {
    // width: '100%'
    // minWidth: '700px'
  },
  flex: {
    flex: 1
  }
};

class FriendPanelPresentation extends Component {
  state = {
    newFormOpen: false,
    username: '',
    passphrase: '',
    alias: ''
  };
  componentDidMount() {
    this.refreshPassphraseHandler();
  }
  componentWillReceiveProps(nextProps) {
    console.log();
    if (nextProps.friendRequestSuccess) {
      this.setState(() => ({
        newFormeOpen: false,
        username: '',
        passphrase: '',
        alias: ''
      }));
    }
  }
  refreshPassphraseHandler = async () => {
    try {
      const res = await axios.get(
        'https://makemeapassword.org/api/v1/readablepassphrase/json?pc=1&wc=5&sp=y&minCh=32&maxCh=55&s=RandomMedium'
      );
      const phrase = res.data.pws[0];
      this.setState({ passphrase: phrase });
    } catch (error) {
      console.log(error);
    }
  };

  openNewForm = () => this.setState(() => ({ newFormOpen: true }));
  closeNewForm = () => this.setState(() => ({ newFormOpen: false }));
  handleChange = e => {
    const { name, value } = e.target;
    this.setState(() => ({ [name]: value }));
  };
  friendRequestInit = () => {
    this.props.handleFriendRequestInit(this.state.username);
  };
  friendRequestSend = () => {
    this.props.handleFriendRequestSend(
      this.state.username,
      this.state.passphrase,
      this.state.alias
    );
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography type="title" color="inherit" className={classes.flex}>
              Friends
            </Typography>
            <IconButton color="contrast" onClick={this.openNewForm}>
              <AddCirleOutline />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Dialog
          open={this.state.newFormOpen}
          onClose={this.closeNewForm}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            {this.props.validRequest ? this.state.username : 'Friend Finder'}
          </DialogTitle>
          <DialogContent>
            {!this.props.validRequest ? (
              <div>
                <DialogContentText>
                  Type in the username alias of another user you know
                </DialogContentText>
                <TextField
                  autoFocus
                  name="username"
                  id="name"
                  label="Username"
                  type="username"
                  onChange={this.handleChange}
                  value={this.state.username}
                  style={{ marginTop: 25 }}
                  fullWidth
                />
              </div>
            ) : (
              <div>
                <Typography type="headline">
                  WRITE DOWN YOUR PASSPHRASE!
                </Typography>
                <DialogContentText>
                  Enter an alias the other user will know you by and a
                  passphrase to share with the other user -- or use the one
                  provided --
                </DialogContentText>
                <TextField
                  autoFocus
                  name="alias"
                  id="alias"
                  label="Alias"
                  type="text"
                  onChange={this.handleChange}
                  value={this.state.alias}
                  style={{ marginTop: 25 }}
                  fullWidth
                />

                <FormControl style={{ width: '100%', marginTop: 25 }}>
                  <InputLabel htmlFor="passphrase">Passphrase</InputLabel>
                  <Input
                    autoFocus
                    name="passphrase"
                    id="passphrase"
                    value={this.state.passphrase}
                    onChange={this.handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={this.refreshPassphraseHandler}
                          color="accent"
                        >
                          <Autorenew />
                        </IconButton>
                      </InputAdornment>
                    }
                    fullWidth
                  />
                </FormControl>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            {!this.props.validRequest ? (
              <Button onClick={this.friendRequestInit} color="primary">
                Find
              </Button>
            ) : (
              <Button onClick={this.friendRequestSend} color="primary">
                Send
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

FriendPanelPresentation.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FriendPanelPresentation);
