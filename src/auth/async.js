import axios from 'axios';
import { API_HOST } from '../appConfig';
import { push } from 'react-router-redux';

export const REGISTER = 'REGISTER';
export const REGISTER_SENT = 'REGISTER_SENT';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_ERROR = 'REGISTER_ERROR';
export const register = form => ({ type: REGISTER, payload: form });

export const LOGIN = 'LOGIN';
export const LOGIN_SENT = 'LOGIN_SENT';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';
export const login = form => ({ type: LOGIN, payload: form });

export const LOGOUT = 'LOGOUT';
export const LOGOUT_SENT = 'LOGOUT_SENT';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_ERROR = 'LOGOUT_ERROR';
export const logout = () => ({ type: LOGOUT });

export default store => next => async action => {
  next(action);
  const state = store.getState();
  const authHeader = { headers: { Authorization: state.authStore.token } };
  switch (action.type) {
    case REGISTER:
      try {
        next({ type: REGISTER_SENT });
        const response = await axios.post(
          `${API_HOST}/auth/register`,
          action.payload
        );
        next({ type: REGISTER_SUCCESS, payload: response });
        store.dispatch(push('/'));
      } catch (error) {
        next({ type: REGISTER_ERROR, payload: error });
      }
      break;
    case LOGIN:
      try {
        next({ type: LOGIN_SENT });
        const response = await axios.post(
          `${API_HOST}/auth/login`,
          action.payload
        );
        next({ type: LOGIN_SUCCESS, payload: response });
        store.dispatch(push('/'));
      } catch (error) {
        next({ type: LOGIN_ERROR, payload: error });
      }
      break;
    case LOGOUT:
      try {
        next({ type: LOGOUT_SENT });
        const response = await axios.get(`${API_HOST}/auth/logout`, authHeader);
        next({ type: LOGOUT_SUCCESS, payload: response });
        store.dispatch(push('/login'));
      } catch (error) {
        next({ type: LOGOUT_ERROR, payload: error });
      }
      break;
    default:
      break;
  }
};
