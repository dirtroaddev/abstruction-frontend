import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/es/storage';

import { REGISTER_SUCCESS, LOGIN_SUCCESS, LOGOUT_SUCCESS } from './async';

const localStorageConfig = {
  key: 'auth',
  storage
};

export const CLEAR_AUTH = 'CLEAR_AUTH';
export const clearAuth = () => ({ type: CLEAR_AUTH });

export const SET_PASSPHRASE = 'SET_PASSPHRASE';
export const setPassphrase = passphrase => ({
  type: SET_PASSPHRASE,
  payload: passphrase
});

export const CLEAR_PASSPHRASE = 'CLEAR_PASSPHRASE';
export const clearPassphrase = () => ({ type: CLEAR_PASSPHRASE });

const initState = {
  token: '',
  isAuth: false,
  user: {},
  passphrase: ''
};

const auth = (state = initState, { type, payload }) => {
  switch (type) {
    case CLEAR_AUTH:
      return initState;
    case SET_PASSPHRASE:
      return { ...state, passphrase: payload };
    case CLEAR_PASSPHRASE:
      return { ...state, passphrase: '' };
    case REGISTER_SUCCESS:
      return {
        ...state,
        isAuth: true,
        token: payload.data.token,
        user: payload.data.user
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuth: true,
        token: payload.data.token,
        user: payload.data.user
      };
    case LOGOUT_SUCCESS:
      return initState;
    default:
      return state;
  }
};

const persistentAuth = persistReducer(localStorageConfig, auth);

export default persistentAuth;
