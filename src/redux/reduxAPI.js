import axios from 'axios';
import { push } from 'react-router-redux';
import { API_HOST } from '../appConfig';

import {
  ENCODE_AND_STORE_USER_SUCCESS,
  ENCODE_AND_STORE_USER_ERROR
} from './reduxUserEncryption';

const API_GET_CONFIRM_TOKEN = 'API_GET_CONFIRM_TOKEN';
export const API_GET_CONFIRM_TOKEN_SENT = 'API_GET_CONFIRM_TOKEN_SENT';
export const API_GET_CONFIRM_TOKEN_SUCCESS = 'API_GET_CONFIRM_TOKEN_SUCCESS';
export const API_GET_CONFIRM_TOKEN_ERROR = 'API_GET_CONFIRM_TOKEN_ERROR';
export const apiGetConfirmToken = token => ({
  type: API_GET_CONFIRM_TOKEN,
  payload: token
});

const API_POST_AUTH_REGISTER = 'API_POST_AUTH_REGISTER';
export const API_POST_AUTH_REGISTER_SENT = 'API_POST_AUTH_REGISTER_SENT';
export const API_POST_AUTH_REGISTER_SUCCESS = 'API_POST_AUTH_REGISTER_SUCCESS';
export const API_POST_AUTH_REGISTER_ERROR = 'API_POST_AUTH_REGISTER_ERROR';
export const apiPostAuthRegister = form => ({
  type: API_POST_AUTH_REGISTER,
  payload: form
});

const API_POST_AUTH_LOGIN = 'API_POST_AUTH_LOGIN';
export const API_POST_AUTH_LOGIN_SENT = 'API_POST_AUTH_LOGIN_SENT';
export const API_POST_AUTH_LOGIN_SUCCESS = 'API_POST_AUTH_LOGIN_SUCCESS';
export const API_POST_AUTH_LOGIN_ERROR = 'API_POST_AUTH_LOGIN_ERROR';
export const apiPostAuthLogin = form => ({
  type: API_POST_AUTH_LOGIN,
  payload: form
});

const API_GET_USER_DATA = 'API_GET_USER_DATA';
export const API_GET_USER_DATA_SENT = 'API_GET_USER_DATA_SENT';
export const API_GET_USER_DATA_SUCCESS = 'API_GET_USER_DATA_SUCCESS';
export const API_GET_USER_DATA_ERROR = 'API_GET_USER_DATA_ERROR';
export const apiGetUserData = token => ({
  type: API_GET_USER_DATA,
  payload: token
});

const API_GET_AUTH_LOGOUT = 'API_GET_AUTH_LOGOUT';
export const API_GET_AUTH_LOGOUT_SENT = 'API_GET_AUTH_LOGOUT_SENT';
export const API_GET_AUTH_LOGOUT_SUCCESS = 'API_GET_AUTH_LOGOUT_SUCCESS';
export const API_GET_AUTH_LOGOUT_ERROR = 'API_GET_AUTH_LOGOUT_ERROR';
export const apiGetAuthLogout = token => ({
  type: API_GET_AUTH_LOGOUT,
  payload: token
});

const API_POST_FRIEND_REQUEST_INIT = 'API_POST_FRIEND_REQUEST_INIT';
export const API_POST_FRIEND_REQUEST_INIT_SENT =
  'API_POST_FRIEND_REQUEST_INIT_SENT';
export const API_POST_FRIEND_REQUEST_INIT_SUCCESS =
  'API_POST_FRIEND_REQUEST_INIT_SUCCESS';
export const API_POST_FRIEND_REQUEST_INIT_ERROR =
  'API_POST_FRIEND_REQUEST_INIT_ERROR';
export const apiPostFriendRequestInit = (token, username) => ({
  type: API_POST_FRIEND_REQUEST_INIT,
  payload: { token, username }
});

const API_POST_FRIEND_REQUEST_SEND = 'API_POST_FRIEND_REQUEST_SEND';
export const API_POST_FRIEND_REQUEST_SEND_SENT =
  'API_POST_FRIEND_REQUEST_SEND_SENT';
export const API_POST_FRIEND_REQUEST_SEND_SUCCESS =
  'API_POST_FRIEND_REQUEST_SEND_SUCCESS';
export const API_POST_FRIEND_REQUEST_SEND_ERROR =
  'API_POST_FRIEND_REQUEST_SEND_ERROR';
export const apiPostFriendRequestSend = (
  token,
  encodedP2Data,
  username,
  alias
) => ({
  type: API_POST_FRIEND_REQUEST_SEND,
  payload: { token, encodedP2Data, username, alias }
});

const API_POST_FRIEND_REQUEST_RECIEVED = 'API_POST_FRIEND_REQUEST_RECIEVED';
export const API_POST_FRIEND_REQUEST_RECIEVED_SUCCESS =
  'API_POST_FRIEND_REQUEST_RECIEVED_SUCCESS';
export const API_POST_FRIEND_REQUEST_RECIEVED_ERROR =
  'API_POST_FRIEND_REQUEST_RECIEVED_ERROR';
export const API_POST_FRIEND_REQUEST_RECIEVED_SENT =
  'API_POST_FRIEND_REQUEST_RECIEVED_SENT';
export const apiPostFriendRequestRecieved = (token, friendRequests) => ({
  type: API_POST_FRIEND_REQUEST_RECIEVED,
  payload: { token, friendRequests }
});

export const API_POST_USER_ENCODED = 'API_POST_USER_ENCODED';
export const API_POST_USER_ENCODED_SENT = 'API_POST_USER_ENCODED_SENT';
// export const ENCRYPT_AND_STORE_USER_SUCCESS = 'ENCRYPT_AND_STORE_USER_SUCCESS';
// export const ENCRYPT_AND_STORE_USER_ERROR = 'ENCRYPT_AND_STORE_USER_ERROR';
export const apiPostUserEncoded = data => ({
  type: API_POST_USER_ENCODED,
  payload: data
});

const reduxAPI = store => next => async action => {
  next(action);
  const state = store.getState();
  switch (action.type) {
    case API_POST_USER_ENCODED:
      try {
        store.dispatch({ type: API_POST_USER_ENCODED_SENT });
        const response = await axios.post(
          `${API_HOST}/user/encoded`,
          { data: action.payload },
          { headers: { Authorization: state.authStore.token } }
        );
        next({ type: ENCODE_AND_STORE_USER_SUCCESS, payload: response });
      } catch (error) {
        next({ type: ENCODE_AND_STORE_USER_ERROR, payload: error });
      }
      break;
    case API_POST_FRIEND_REQUEST_RECIEVED:
      store.dispatch({ type: API_POST_FRIEND_REQUEST_RECIEVED_SENT });
      axios
        .post(
          `${API_HOST}/user/friend-request/recieved`,
          { friendRequests: action.payload.friendRequests },
          { headers: { Authorization: state.authStore.token } }
        )
        .then(response =>
          next({
            type: API_POST_FRIEND_REQUEST_RECIEVED_SUCCESS,
            payload: response
          })
        )
        .catch(error =>
          next({
            type: API_POST_FRIEND_REQUEST_RECIEVED_ERROR,
            payload: error
          })
        );
      break;
    case API_POST_FRIEND_REQUEST_SEND:
      const { encodedP2Data, username, alias } = action.payload;
      store.dispatch({ type: API_POST_FRIEND_REQUEST_SEND_SENT });
      axios
        .post(
          `${API_HOST}/user/friend-request/send`,
          {
            encodedP2Data,
            username,
            alias
          },
          { headers: { Authorization: state.authStore.token } }
        )
        .then(response =>
          next({
            type: API_POST_FRIEND_REQUEST_SEND_SUCCESS,
            payload: response
          })
        )
        .catch(error =>
          next({ type: API_POST_FRIEND_REQUEST_SEND_ERROR, payload: error })
        );
      break;
    case API_POST_FRIEND_REQUEST_INIT:
      console.log(action.payload);
      store.dispatch({ type: API_POST_FRIEND_REQUEST_INIT_SENT });
      axios
        .post(
          `${API_HOST}/user/friend-request/init`,
          { username: action.payload.username },
          {
            headers: { Authorization: state.authStore.token }
          }
        )
        .then(response => {
          next({
            type: API_POST_FRIEND_REQUEST_INIT_SUCCESS,
            payload: response
          });
        })
        .catch(error => {
          next({
            type: API_POST_FRIEND_REQUEST_INIT_ERROR,
            payload: error
          });
        });
      break;
    case API_GET_AUTH_LOGOUT:
      store.dispatch({ type: API_GET_AUTH_LOGOUT_SENT });
      axios
        .get(`${API_HOST}/auth/logout`, {
          headers: { Authorization: state.authStore.token }
        })
        .then(response => {
          store.dispatch(push('/login'));
          next({
            type: API_GET_AUTH_LOGOUT_SUCCESS
          });
        })
        .catch(error => {
          next({ type: API_GET_AUTH_LOGOUT_ERROR });
        });
      break;
    case API_GET_CONFIRM_TOKEN:
      axios
        .get(`${API_HOST}/auth/confirm`, {
          headers: { Authorization: state.authStore.token }
        })
        .then(response =>
          next({
            type: API_GET_CONFIRM_TOKEN_SUCCESS,
            payload: response
          })
        )
        .catch(error =>
          next({
            type: API_GET_CONFIRM_TOKEN_ERROR,
            payload: error
          })
        );
      break;
    case API_GET_USER_DATA:
      axios
        .get(`${API_HOST}/user/current`, {
          headers: { Authorization: state.authStore.token }
        })
        .then(response =>
          next({
            type: API_GET_USER_DATA_SUCCESS,
            payload: response
          })
        )
        .catch(error =>
          next({
            type: API_GET_USER_DATA_ERROR,
            payload: error
          })
        );
      break;
    case API_POST_AUTH_REGISTER:
      axios
        .post(`${API_HOST}/auth/register`, action.payload)
        .then(response => {
          next({
            type: API_POST_AUTH_REGISTER_SUCCESS,
            payload: response
          });
          store.dispatch(push('/'));
        })
        .catch(error => {
          next({ type: API_POST_AUTH_REGISTER_ERROR, payload: error });
        });
      break;
    case API_POST_AUTH_LOGIN:
      try {
        store.dispatch({ type: API_POST_AUTH_LOGIN_SENT });
        const response = await axios.post(
          `${API_HOST}/auth/login`,
          action.payload
        );
        next({ type: API_POST_AUTH_LOGIN_SUCCESS, payload: response });
        store.dispatch(push('/'));
      } catch (error) {
        next({ type: API_POST_AUTH_LOGIN_ERROR, payload: error });
      }
      break;
    default:
      break;
  }
};

export default reduxAPI;
