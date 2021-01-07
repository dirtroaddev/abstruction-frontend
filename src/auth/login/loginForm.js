import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';

import { loginFormInput, loginFormErrors } from './index';
// import { apiPostAuthLogin } from '../../redux/reduxAPI';
import { login } from '../async';

import { validateForm, validateField } from './validateLogin';

const style = {
  gridItem: { marginTop: 15 }
};

const LoginForm = props => {
  const { form, loginFormInput, loginFormErrors, login } = props;

  const submitHandler = e => {
    e.preventDefault();
    const validatedForm = validateForm(form);
    if (validatedForm.hasErrors) return loginFormErrors(validatedForm.form);
    const postForm = Object.keys(validatedForm.form).reduce(
      (submission, field) => {
        submission[field] = form[field].value;
        return submission;
      },
      {}
    );
    login(postForm);
  };

  const changeHandler = e => {
    const { name, value } = e.target;
    loginFormInput(validateField(name, value));
  };
  const registerHandler = () => {
    props.push('/register');
  };
  return (
    <Paper>
      <form onSubmit={submitHandler}>
        <Grid
          container
          alignItems="center"
          direction="row"
          justify="center"
          spacing={0}
        >
          <Grid item xs={10} sm={8} style={style.gridItem}>
            <Typography type="display1">Login</Typography>
          </Grid>
          <Grid item xs={10} sm={8} style={style.gridItem}>
            <TextField
              error={form.username.error ? true : false}
              helperText={form.username.error || null}
              onChange={changeHandler}
              name="username"
              label="Username"
              fullWidth
            />
          </Grid>
          <Grid item xs={10} sm={8} style={style.gridItem}>
            <TextField
              error={form.password.error ? true : false}
              helperText={form.password.error || null}
              type="password"
              onChange={changeHandler}
              name="password"
              label="Password"
              fullWidth
            />
          </Grid>
          <Grid item xs={10} sm={8} style={style.gridItem}>
            <Button
              type="submit"
              raised={true}
              color="primary"
              onClick={submitHandler}
              style={{ width: '100%' }}
            >
              Login
            </Button>
          </Grid>
          <Grid item xs={10} sm={8} style={style.gridItem}>
            <Button
              type="submit"
              raised={true}
              color="primary"
              onClick={registerHandler}
              style={{ width: '100%' }}
            >
              Register
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

const mapStateToProps = state => ({
  form: state.login
});

export default connect(mapStateToProps, {
  push,
  loginFormInput,
  login,
  loginFormErrors
})(LoginForm);
