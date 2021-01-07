import { DECODE_USER_SUCCESS } from './async';

const initState = {
  decodedUser: {}
};

const homeStore = (state = initState, { type, payload }) => {
  switch (type) {
    case DECODE_USER_SUCCESS:
      return { ...state, decodedUser: payload ? JSON.parse(payload) : {} };
    default:
      return state;
  }
};

export default homeStore;
