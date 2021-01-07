import { combineReducers, createStore, applyMiddleware } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import reduxPromise from 'redux-promise';
import { persistStore } from 'redux-persist';
import reduxAPI from './reduxAPI';
import reduxUserEncryption from './reduxUserEncryption';
//

// Import component reducers
import login from '../auth/login';
import authStore from '../auth/store';
import authAsync from '../auth/async';
import homeStore from '../home/store';
import homeAsync from '../home/async';
import friendAsync from '../friend/async';
import friendStore from '../friend/store';

// Combine component reducers (states)
const combinedReducers = combineReducers({
  login,
  authStore,
  homeStore,
  friendStore,
  routerReducer
});

export default history => {
  const routerHistory = routerMiddleware(history);
  const createStoreWithMiddleware = applyMiddleware(
    routerHistory,
    reduxPromise,
    reduxAPI,
    authAsync,
    friendAsync,
    homeAsync,
    reduxUserEncryption
  )(createStore);
  const store = createStoreWithMiddleware(
    combinedReducers,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
  const persistor = persistStore(store);
  return { persistor, store };
};
