import {
  FRIEND_REQUEST_INIT_SUCCESS,
  FRIEND_REQUEST_INIT_ERROR,
  FRIEND_REQUEST_SEND_SUCCESS,
  FRIEND_REQUEST_SEND_ERROR
} from './async';

export const FRIEND_REQUEST_CLEAR = 'FRIEND_REQUEST_CLEAR';
export const friendRequestClear = () => ({ type: FRIEND_REQUEST_CLEAR });

const initState = {
  validRequest: false,
  encryptedServerKeyPair: {},
  friendRequestSuccess: false
};

const friendStore = (state = initState, { type, payload }) => {
  switch (type) {
    case FRIEND_REQUEST_INIT_SUCCESS:
      return {
        ...state,
        validRequest: true,
        encryptedServerKeyPair: payload.data
      };
    case FRIEND_REQUEST_SEND_SUCCESS:
      return { ...state, friendRequestSuccess: true };
    case FRIEND_REQUEST_CLEAR:
      return initState;
    default:
      return state;
  }
};

export default friendStore;
