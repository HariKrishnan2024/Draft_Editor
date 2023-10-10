import { combineReducers } from "redux";
import blogReducers from "./blog";

const rootReducer = combineReducers({
  editor: blogReducers,
});

export default rootReducer;
