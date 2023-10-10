import {
  ADD_BLOG_DATA,
  ADD_BLOG_DRAFT_DATA,
  ADD_BLOG_HTML_DATA,
  ADD_GROUP,
  SET_GROUPS,
} from "../actions/types";

const initialState = {
  blogData: {},
  blogHtmlData: "",
  draft: {},
};

const blogReducers = (state = initialState, action) => {
  switch (action.type) {
    case ADD_BLOG_DATA: {
      return { ...state, blogData: action.data };
    }

    case ADD_BLOG_HTML_DATA: {
      return { ...state, blogHtmlData: action.data };
    }
    case ADD_BLOG_DRAFT_DATA: {
      return { ...state, draft: action.data };
    }
    default:
      return state;
  }
};

export default blogReducers;
