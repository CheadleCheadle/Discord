import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import session from "./session";
import serverReducer from "./servers";
import channelsReducer from "./channels";
import memberReducer from "./members";
import messageReducer from "./directmessages";
import channelMessageReducer from "./channelmessages";
const rootReducer = combineReducers({
 session,
 servers: serverReducer,
 channels: channelsReducer,
 members: memberReducer,
 messages: messageReducer,
 channelMessages: channelMessageReducer,
});

let enhancer;

if (process.env.NODE_ENV === "production") {
 enhancer = applyMiddleware(thunk);
} else {
 const logger = require("redux-logger").default;
 const composeEnhancers =
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
 enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
 return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
