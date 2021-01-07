import { decode } from '../encryption';

const DECODE_USER = 'DECODE_USER';
export const DECODE_USER_START = 'DECODE_USER_START';
export const DECODE_USER_SUCCESS = 'DECODE_USER_SUCCESS';
export const DECODE_USER_ERROR = 'DECODE_USER_ERROR';
export const decodeUser = () => ({
  type: DECODE_USER
});

const homeAsync = store => next => async action => {
  next(action);
  const state = store.getState();
  const authToken = state.authStore.token;
  switch (action.type) {
    case DECODE_USER:
      try {
        next({ type: DECODE_USER_START });
        const decodedData = await decode(
          state.authStore.passphrase,
          state.authStore.user.data
        );
        next({ type: DECODE_USER_SUCCESS, payload: decodedData });
      } catch (error) {
        next({ type: DECODE_USER_ERROR, payload: error });
      }
    default:
      break;
  }
};

export default homeAsync;
