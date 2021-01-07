import React, { Component } from 'react';
import axios from 'axios';
// import SimpleCryptoJS from 'simple-crypto-js';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import { LinearProgress } from 'material-ui/Progress';
import IconButton from 'material-ui/IconButton';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Visibility from 'material-ui-icons/Visibility';
import VisibilityOff from 'material-ui-icons/VisibilityOff';
import Autorenew from 'material-ui-icons/Autorenew';

// import { apiPostAuthRegister } from '../../redux/reduxAPI';
import { register } from '../async';

import { setPassphrase } from '../../auth/store';
import { encode } from '../../encryption';
import { validateForm, validateField } from './validateRegistration';

const openpgp =
  typeof window !== 'undefined' && window.openpgp
    ? window.openpgp
    : require('openpgp');

class RegistrationForm extends Component {
  state = {
    pubkey: '',
    privkey: '',
    passphrase: '',
    running: false,
    username: { value: '' },
    usernameVal: '',
    password: { value: '' },
    passwordVal: '',
    confirmPassword: { value: '' },
    confirmPasswordVal: '',
    passphrase: { value: '' },
    passphraseVal: '',
    showPassword: false
  };

  componentDidMount() {
    this.refreshPassphraseHandler();
  }

  refreshPassphraseHandler = async () => {
    try {
      const res = await axios.get(
        'https://makemeapassword.org/api/v1/readablepassphrase/json?pc=1&wc=5&sp=y&minCh=30&maxCh=40&s=RandomLong'
      );
      const phrase = res.data.pws[0];
      this.setState({ passphrase: { value: phrase }, passphraseVal: phrase });
    } catch (error) {
      console.log(error);
    }
  };

  submitHandler = async e => {
    try {
      e.preventDefault();
      this.setState({ running: true });
      this.props.setPassphrase(this.state.passphraseVal);
      const submissionData = {
        username: this.state.username,
        password: this.state.password,
        confirmPassword: this.state.confirmPassword
      };
      const validatedForm = validateForm(submissionData);
      if (validatedForm.hasErrors) {
        this.setState({ ...validatedForm.form });
        return;
      }

      // Start Encode User Object
      // convert user object to JSON
      const userJSON = JSON.stringify({
        friends: [],
        friendRequests: [],
        messages: []
      });
      // encode userJson with passphrase
      const encodedUser = await encode(this.state.passphraseVal, userJSON);
      // Finish Encode User Object
      this.setState({ running: false });
      const postForm = Object.keys(validatedForm.form).reduce(
        (submission, field) => {
          submission[field] = this.state[field].value;
          return submission;
        },
        {}
      );
      postForm.data = encodedUser;
      this.props.register(postForm);
    } catch (error) {
      console.log(error);
    }
  };

  changeHandler = e => {
    e.preventDefault();
    const { name, value } = e.target;
    this.setState(() => ({
      [`${name}Val`]: value,
      ...validateField(name, value, this.state.password)
    }));
  };
  handleItem(e) {
    this.setState({ newItem: e.target.value });
  }
  showPasswordHandler = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };
  loginHandler = () => this.props.push('/login');
  render() {
    const {
      username,
      usernameVal,
      password,
      passwordVal,
      confirmPassword,
      confirmPasswordVal,
      passphrase,
      passphraseVal,
      showPassword
    } = this.state;
    const {
      submitHandler,
      loginHandler,
      changeHandler,
      showPasswordHandler,
      copyPassphraseHandler,
      refreshPassphraseHandler
    } = this;
    return (
      <Paper>
        <Typography type="display2" color="primary" style={{ margin: 25 }}>
          Warning! WRITE DOWN YOUR PASSPHRASE! The passphrase you choose here
          will be used to encrypt and decrypt all of your messages. If you are
          unable to remember your passphrase, you will NOT be able to recover
          your messages!
        </Typography>
        <form onSubmit={submitHandler}>
          <Grid container alignItems="center" direction="row" justify="center">
            <Grid item xs={10} sm={8}>
              <Typography type="display1" color="accent">
                Register New User
              </Typography>
            </Grid>
            <Grid item xs={10} sm={8}>
              <TextField
                value={usernameVal}
                error={username.error ? true : false}
                helperText={username.error || null}
                onChange={changeHandler}
                name="username"
                label="Username"
                fullWidth
              />
            </Grid>
            <Grid item xs={10} sm={8}>
              <FormControl style={{ width: '100%' }}>
                <InputLabel
                  htmlFor="password"
                  error={password.error ? true : false}
                >
                  Password
                </InputLabel>
                <Input
                  name="password"
                  id="password"
                  type={this.state.showPassword ? 'text' : 'password'}
                  value={passwordVal}
                  error={password.error ? true : false}
                  onChange={changeHandler}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton onClick={showPasswordHandler} color="accent">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  fullWidth
                />

                {password.error ? (
                  <FormHelperText error>{password.error}</FormHelperText>
                ) : null}
              </FormControl>
            </Grid>
            <Grid item xs={10} sm={8}>
              <TextField
                value={confirmPasswordVal}
                error={confirmPassword.error ? true : false}
                helperText={confirmPassword.error || null}
                type={this.state.showPassword ? 'text' : 'password'}
                onChange={changeHandler}
                name="confirmPassword"
                label="Confirm Password"
                fullWidth
              />
            </Grid>
            <Grid item xs={10} sm={8}>
              <FormControl style={{ width: '100%' }}>
                <InputLabel htmlFor="passphrase">Passphrase</InputLabel>
                <Input
                  name="passphrase"
                  id="passphrase"
                  value={passphraseVal}
                  onChange={changeHandler}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={refreshPassphraseHandler}
                        color="accent"
                      >
                        <Autorenew />
                      </IconButton>
                    </InputAdornment>
                  }
                  fullWidth
                />
              </FormControl>
            </Grid>
            <Grid item xs={10} sm={8}>
              <Button
                raised={true}
                color="primary"
                onClick={submitHandler}
                style={{ width: '100%' }}
              >
                Register
              </Button>
            </Grid>
            <Grid item xs={10} sm={8}>
              <Button
                raised={true}
                color="primary"
                onClick={loginHandler}
                style={{ width: '100%' }}
              >
                login
              </Button>
            </Grid>
          </Grid>
        </form>
        {this.state.running ? <LinearProgress color="accent" /> : null}
      </Paper>
    );
  }
}

export default connect(null, { register, push, setPassphrase })(
  RegistrationForm
);
