// import {
//   API_POST_AUTH_LOGIN_SENT,
//   API_POST_AUTH_LOGIN_ERROR,
//   API_POST_AUTH_LOGIN_SUCCESS
// } from '../../redux/reduxAPI';
import { LOGIN_SUCCESS, LOGIN_ERROR } from '../async';
const LOGIN_FORM_INPUT = 'LOGIN_FORM_INPUT';
export const loginFormInput = validatedField => ({
  type: LOGIN_FORM_INPUT,
  payload: validatedField
});

const LOGIN_FORM_ERRORS = 'LOGIN_FORM_ERRORS';
export const loginFormErrors = form => ({
  type: LOGIN_FORM_ERRORS,
  payload: form
});

const initState = {
  username: {},
  password: {}
};
export default (state = initState, { type, payload }) => {
  switch (type) {
    case LOGIN_FORM_ERRORS:
      return Object.assign({}, state, payload);
    case LOGIN_FORM_INPUT:
      return Object.assign({}, state, payload);
    case LOGIN_SUCCESS:
      return Object.assign({}, state, initState);
    default:
      return state;
  }
};

// a@a.aa -- Hank cancelled the tear but not a street
// b@b.bb -- when does your sarcastic one fizzle
