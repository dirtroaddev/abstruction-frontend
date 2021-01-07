import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import MenuIcon from 'material-ui-icons/Menu';
import AccountCircle from 'material-ui-icons/AccountCircle';
import Switch from 'material-ui/Switch';
import { FormControlLabel, FormGroup } from 'material-ui/Form';
import Menu, { MenuItem } from 'material-ui/Menu';
import Input, { InputAdornment, InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
import Visibility from 'material-ui-icons/Visibility';
import VisibilityOff from 'material-ui-icons/VisibilityOff';
import Save from 'material-ui-icons/Save';
import Done from 'material-ui-icons/Done';
import Drawer from 'material-ui/Drawer';
import List from 'material-ui/List';
import Divider from 'material-ui/Divider';

const styles = theme => {
  return {
    root: { width: '100%' },
    flex: {},
    menuButton: { marginLeft: -12, marginRight: 20 },
    darkColor: { color: theme.palette.shades.light.text.primary },
    darkText: { flex: 1, color: theme.palette.shades.light.text.primary },
    darkInk: {
      color: theme.palette.shades.light.text.primary,
      '&:before': { backgroundColor: theme.palette.shades.light.text.primary },
      '&:after': { backgroundColor: theme.palette.shades.light.text.primary }
    }
  };
  // backgroundColor: theme.palette.shades.light.text.primary
};

class NavBarPresentation extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    auth: true,
    showPassphrase: false,
    editPassphrase: false,
    passphrase: '',
    anchorEl: null,
    menuOpen: false
  };
  componentWillReceiveProps(next) {
    if (
      (!!!this.state.passphrase && !!next.passphrase) ||
      this.props.passphrase !== next.passphrase
    ) {
      this.setState({
        passphrase: next.passphrase
      });
    }
  }
  componentDidMount() {
    if (!!this.props.passphrase) {
      this.setState({ passphrase: this.props.passphrase });
    }
  }
  handleChange = (event, checked) => {
    this.setState({ auth: checked });
  };

  handleOpen = event => {
    this.setState({ anchorEl: event.currentTarget, menuOpen: true });
  };

  handleClose = () => {
    this.setState({ anchorEl: null, menuOpen: false });
  };

  showPassPhraseHandler = () => {
    this.setState(() => ({ showPassphrase: !this.state.showPassphrase }));
  };

  editPassPhraseHandler = () => {
    this.setState(() => ({ editPassphrase: true, showPassphrase: true }));
  };
  doneEditPassphraseHandler = () => {
    this.setState(() => ({ editPassphrase: false, showPassphrase: false }));
  };
  changePassPhrase = event => {
    const val = event.target.value;
    this.setState(() => ({ passphrase: val }));
  };
  setPassPhrase = () => {
    this.setState(() => ({ editPassphrase: false }));
    this.props.setPassPhrase(this.state.passphrase);
  };
  clearPassphrase = () => {
    this.props.clearPassphrase();
  };
  render() {
    const { classes, user, passphrase, clearPassphrase } = this.props;
    const { auth, anchorEl, menuOpen } = this.state;
    return (
      <div className={classes.root}>
        <AppBar position="static" color="accent">
          <Toolbar>
            <Typography
              type={!!user && !!user.username ? 'title' : 'display4'}
              className={classes.darkText}
            >
              Abstruse
            </Typography>
            {!!user &&
              !!user.username && (
                <div>
                  <IconButton
                    aria-owns={menuOpen ? 'menu-appbar' : null}
                    aria-haspopup="true"
                    onClick={this.handleOpen}
                    color="contrast"
                  >
                    <AccountCircle />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={menuOpen}
                    onClose={this.handleClose}
                  >
                    <MenuItem onClick={this.editPassPhraseHandler}>
                      Set Passphrase
                    </MenuItem>
                    <MenuItem onClick={this.clearPassphrase}>
                      Clear Passhrase
                    </MenuItem>
                    <MenuItem onClick={this.props.logout}>Logout</MenuItem>
                  </Menu>
                </div>
              )}
          </Toolbar>
        </AppBar>
        <Drawer
          anchor="top"
          open={!!this.state.editPassphrase}
          onClose={this.doneEditPassphraseHandler}
        >
          <FormControl style={{ margin: 75 }}>
            <InputLabel htmlFor="passphrase" className={classes.darkColor}>
              Passphrase
            </InputLabel>
            <Input
              classes={{ inkbar: classes.darkInk }}
              className={classes.darkColor}
              disabled={!this.state.editPassphrase}
              type={this.state.showPassphrase ? 'text' : 'password'}
              value={this.state.passphrase}
              onChange={this.changePassPhrase}
              endAdornment={
                <InputAdornment position="end">
                  {this.state.editPassphrase ? (
                    <div>
                      {this.state.passphrase !== this.props.passphrase ? (
                        <IconButton
                          color="contrast"
                          onClick={this.setPassPhrase}
                        >
                          <Save />
                        </IconButton>
                      ) : (
                        <IconButton
                          color="contrast"
                          onClick={this.doneEditPassphraseHandler}
                        >
                          <Done />
                        </IconButton>
                      )}
                    </div>
                  ) : (
                    <IconButton
                      onClick={this.showPassPhraseHandler}
                      color="contrast"
                    >
                      {this.state.showPassphrase ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  )}
                </InputAdornment>
              }
            />
          </FormControl>
        </Drawer>
      </div>
    );
  }
}

NavBarPresentation.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NavBarPresentation);
