import {
  encode,
  decode,
  generateKeyPair,
  encrypt,
  decrypt
} from '../encryption';

import API_POST_USER_ENCRYPTED from './reduxAPI';

const ENCODE_AND_SEND_FRIEND_REQUEST = 'ENCODE_AND_SEND_FRIEND_REQUEST';
export const ENCODE_AND_SEND_FRIEND_REQUEST_START =
  'ENCODE_AND_SEND_FRIEND_REQUEST_START';
export const ENCODE_AND_SEND_FRIEND_REQUEST_SUCCESS =
  'ENCODE_AND_SEND_FRIEND_REQUEST_SUCCESS';
export const ENCODE_AND_SEND_FRIEND_REQUEST_ERROR =
  'ENCODE_AND_SEND_FRIEND_REQUEST_ERROR';
export const encodeAndSendFriendRequest = (username, passphrase, alias) => ({
  type: ENCODE_AND_SEND_FRIEND_REQUEST,
  payload: { username, passphrase, alias }
});

const ENCODE_USER_DATA = 'ENCODE_USER_DATA';
export const ENCODE_USER_DATA_START = 'ENCODE_USER_DATA_START';
export const ENCODE_USER_DATA_SUCCESS = 'ENCODE_USER_DATA_SUCCESS';
export const ENCODE_USER_DATA_ERROR = 'ENCODE_USER_DATA_ERROR';
export const encodeUserData = (phrase, data) => ({
  type: ENCODE_USER_DATA,
  payload: { phrase, data }
});

const ENCODE_DATA = 'ENCODE_DATA';
export const ENCODE_DATA_START = 'ENCODE_DATA_START';
export const ENCODE_DATA_SUCCESS = 'ENCODE_DATA_SUCCESS';
export const ENCODE_DATA_ERROR = 'ENCODE_DATA_ERROR';
export const encodeData = (phrase, data) => ({
  type: ENCODE_DATA,
  payload: { phrase, data }
});

const DECODE_DATA = 'DECODE_DATA';
export const DECODE_DATA_START = 'DECODE_DATA_START';
export const DECODE_DATA_SUCCESS = 'DECODE_DATA_SUCCESS';
export const DECODE_DATA_ERROR = 'DECODE_DATA_ERROR';
export const decodeData = (phrase, data) => ({
  type: DECODE_DATA,
  payload: { phrase, data }
});

const DECODE_USER_DATA = 'DECODE_USER_DATA';
export const DECODE_USER_DATA_START = 'DECODE_USER_DATA_START';
export const DECODE_USER_DATA_SUCCESS = 'DECODE_USER_DATA_SUCCESS';
export const DECODE_USER_DATA_ERROR = 'DECODE_USER_DATA_ERROR';
export const decodeUserData = (phrase, data) => ({
  type: DECODE_USER_DATA,
  payload: { phrase, data }
});

const GENERATE_KEY_PAIR = 'GENERATE_KEY_PAIR';
export const GENERATE_KEY_PAIR_START = 'GENERATE_KEY_PAIR_START';
export const GENERATE_KEY_PAIR_SUCCESS = 'GENERATE_KEY_PAIR_SUCCESS';
export const GENERATE_KEY_PAIR_ERROR = 'GENERATE_KEY_PAIR_ERROR';
export const generateArmoredKeyPair = (name, phrase) => ({
  type: GENERATE_KEY_PAIR,
  payload: { name, phrase }
});

const ENCRYPT_DATA = 'ENCRYPT_DATA';
export const ENCRYPT_DATA_START = 'ENCRYPT_DATA_START';
export const ENCRYPT_DATA_SUCCESS = 'ENCRYPT_DATA_SUCCESS';
export const ENCRYPT_DATA_ERROR = 'ENCRYPT_DATA_ERROR';
export const encryptData = (pubKey, privKey, phrase, data) => ({
  type: ENCRYPT_DATA,
  payload: { pubKey, privKey, phrase, data }
});

const DECRYPT_DATA = 'DECRYPT_DATA';
export const DECRYPT_DATA_START = 'DECRYPT_DATA_START';
export const DECRYPT_DATA_SUCCESS = 'DECRYPT_DATA_SUCCESS';
export const DECRYPT_DATA_ERROR = 'DECRYPT_DATA_ERROR';
export const decryptData = (pubKey, privKey, phrase, data) => ({
  type: DECRYPT_DATA,
  payload: { pubKey, privKey, phrase, data }
});

const ENCODE_AND_STORE_USER = 'ENCODE_AND_STORE_USER';
export const ENCODE_AND_STORE_USER_START = 'ENCODE_AND_STORE_USER_START';
export const ENCODE_AND_STORE_USER_SUCCESS = 'ENCODE_AND_STORE_USER_SUCCESS';
export const ENCODE_AND_STORE_USER_ERROR = 'ENCODE_AND_STORE_USER_ERROR';
export const encodeAndStoreUser = () => ({
  type: ENCODE_AND_STORE_USER
});

const reduxUserEncryption = store => next => async action => {
  const state = store.getState();
  next(action);
  switch (action.type) {
    case ENCODE_AND_SEND_FRIEND_REQUEST:
      try {
        store.dispatch({ type: ENCODE_AND_SEND_FRIEND_REQUEST_START });
        const JSONData = JSON.stringify();
      } catch (error) {}
      break;
    case ENCODE_AND_STORE_USER:
      try {
        store.dispatch({ type: ENCODE_AND_STORE_USER_START });
        const JSONData = JSON.stringify(state.auth.token.user);
        const encryptedData = await encode(
          JSONData,
          state.auth.token.passphrase
        );
        next({ type: API_POST_USER_ENCRYPTED, payload: encryptedData });
      } catch (error) {
        next({ type: ENCODE_AND_STORE_USER_ERROR, payload: error });
      }
      break;
    case DECRYPT_DATA:
      try {
        store.dispatch({ type: DECRYPT_DATA_START });
        const decryptedData = await decrypt(
          action.payload.pubKey,
          action.payload.privKey,
          action.payload.phrase,
          action.payload.data
        );
        next({ type: DECRYPT_DATA_SUCCESS, payload: decryptedData });
      } catch (error) {
        next({ type: DECRYPT_DATA_ERROR, payload: error });
      }
      break;
    case ENCRYPT_DATA:
      try {
        store.dispatch({ type: ENCRYPT_DATA_START });
        const encryptedData = await encrypt(
          action.payload.pubKey,
          action.payload.privKey,
          action.payload.phrase,
          action.payload.data
        );
        next({ type: ENCRYPT_DATA_SUCCESS, payload: encryptedData });
      } catch (error) {
        next({ type: ENCRYPT_DATA_ERROR, payload: error });
      }
      break;
    case GENERATE_KEY_PAIR:
      try {
        store.dispatch({ type: GENERATE_KEY_PAIR_START });
        const keyPair = await generateKeyPair(
          action.payload.phrase,
          action.payload.name
        );
        next({ type: GENERATE_KEY_PAIR_SUCCESS, payload: keyPair });
      } catch (error) {
        next({ type: GENERATE_KEY_PAIR_ERROR, payload: error });
      }
      break;
    case ENCODE_DATA:
      try {
        store.dispatch({ type: ENCODE_DATA_START });
        const encodedData = await encode(
          action.payload.phrase,
          action.payload.data
        );
        next({ type: ENCODE_DATA_SUCCESS, payload: encodedData });
      } catch (error) {
        next({ type: ENCODE_DATA_ERROR, payload: error });
      }
      break;
    case ENCODE_USER_DATA:
      try {
        store.dispatch({ type: ENCODE_USER_DATA_START });
        const encodedUserData = await encode(
          action.payload.phrase,
          action.payload.data
        );
        next({ type: ENCODE_USER_DATA_SUCCESS, payload: encodedUserData });
      } catch (error) {
        next({ type: ENCODE_USER_DATA_ERROR, payload: error });
      }
      break;
    case DECODE_DATA:
      try {
        store.dispatch({ type: DECODE_DATA_START });
        const decodedData = await decode(
          action.payload.phrase,
          action.payload.data
        );
        next({ type: DECODE_DATA_SUCCESS, payload: decodedData });
      } catch (error) {
        next({ type: DECODE_DATA_ERROR, payload: error });
      }
      break;
    case DECODE_USER_DATA:
      try {
        store.dispatch({ type: DECODE_USER_DATA_START });
        const decodedUserData = await decode(
          action.payload.phrase,
          action.payload.data
        );
        next({ type: DECODE_USER_DATA_SUCCESS, payload: decodedUserData });
      } catch (error) {
        next({ type: DECODE_USER_DATA_ERROR, payload: error });
      }
      break;
    default:
      break;
  }
};

export default reduxUserEncryption;
