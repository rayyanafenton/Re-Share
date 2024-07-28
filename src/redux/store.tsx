import { createStore, combineReducers, Store } from "redux";
import userReducer from "./userReducer";

interface InitialState {
  store: any;
}

// Combine multiple reducers into a single root reducer
const rootReducer = combineReducers({
  user: userReducer,
});

// Create the Redux store
const store: Store<InitialState> = createStore(rootReducer);

export default store;
