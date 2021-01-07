import axios from 'axios';
import { generateKeyPair, encode } from '../encryption';

import { API_HOST } from '../appConfig';
import { friendRequestClear } from './store';

const FRIEND_REQUEST_INIT = 'FRIEND_REQUEST_INIT';
export const FRIEND_REQUEST_INIT_SENT = 'FRIEND_REQUEST_INIT_SENT';
export const FRIEND_REQUEST_INIT_SUCCESS = 'FRIEND_REQUEST_INIT_SUCCESS';
export const FRIEND_REQUEST_INIT_ERROR = 'FRIEND_REQUEST_INIT_ERROR';
export const friendRequestInit = username => ({
  type: FRIEND_REQUEST_INIT,
  payload: username
});

const FRIEND_REQUEST_SEND = 'FRIEND_REQUEST_SEND';
export const FRIEND_REQUEST_SEND_START = 'FRIEND_REQUEST_SEND_START';
export const FRIEND_REQUEST_SEND_SUCCESS = 'FRIEND_REQUEST_SEND_SUCCESS';
export const FRIEND_REQUEST_SEND_ERROR = 'FRIEND_REQUEST_SEND_ERROR';
export const friendRequestSend = (username, passphrase, alias) => ({
  type: FRIEND_REQUEST_SEND,
  payload: { username, passphrase, alias }
});

const FRIEND_REQUESTS_RECIEVED = 'FRIEND_REQUESTS_RECIEVED';
export const FRIEND_REQUESTS_RECIEVED_SENT = 'FRIEND_REQUESTS_RECIEVED_SENT';
export const FRIEND_REQUESTS_RECIEVED_SUCCESS =
  'FRIEND_REQUESTS_RECIEVED_SUCCESS';
export const FRIEND_REQUESTS_RECIEVED_ERROR = 'FRIEND_REQUESTS_RECIEVED_ERROR';
export const friendRequestsRecieved = friendRequests => ({
  type: FRIEND_REQUESTS_RECIEVED,
  payload: friendRequests
});

const friendAsync = store => next => async action => {
  next(action);
  const state = store.getState();
  const authToken = state.authStore.token;
  switch (action.type) {
    case FRIEND_REQUESTS_RECIEVED:
      try {
        next({ type: FRIEND_REQUESTS_RECIEVED_SENT });
        const response = await axios(
          `${API_HOST}/friend-request/recieved`,
          { friendRequests: action.payload },
          { headers: { Authorization: authToken } }
        );
        next({ type: FRIEND_REQUESTS_RECIEVED_SUCCESS, payload: response });
      } catch (error) {
        next({ type: FRIEND_REQUESTS_RECIEVED_ERROR, payload: error });
      }
      break;
    case FRIEND_REQUEST_INIT:
      try {
        next({ type: FRIEND_REQUEST_INIT_SENT });
        const response = await axios.post(
          `${API_HOST}/user/friend-request/init`,
          { username: action.payload },
          { headers: { Authorization: authToken } }
        );
        next({ type: FRIEND_REQUEST_INIT_SUCCESS, payload: response });
      } catch (error) {
        next({ type: FRIEND_REQUEST_INIT_ERROR, payload: error });
      }
      break;
    case FRIEND_REQUEST_SEND:
      try {
        next({ type: FRIEND_REQUEST_SEND_START });
        const pgpKeys = await generateKeyPair(
          action.payload.passphrase,
          action.payload.alias
        );
        const p2Data = JSON.stringify({
          serverKeys: state.friendStore.encryptedServerKeyPair.p2ServerKeys,
          p2PubKey: pgpKeys.publicKey
        });
        const encodedP2Data = await encode(action.payload.passphrase, p2Data);
        const response = await axios.post(
          `${API_HOST}/user/friend-request/send`,
          {
            encodedP2Data,
            username: action.payload.username,
            alias: action.payload.alias
          },
          { headers: { Authorization: authToken } }
        );
        next({ type: FRIEND_REQUEST_SEND_SUCCESS, payload: response });
      } catch (error) {
        next({ type: FRIEND_REQUEST_SEND_ERROR, payload: error });
      }
      break;
    default:
      break;
  }
};

export default friendAsync;
