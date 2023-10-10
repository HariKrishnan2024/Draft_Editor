import {
  ADD_BLOG_DATA,
  ADD_BLOG_DRAFT_DATA,
  ADD_BLOG_HTML_DATA,
} from "./types";

export const setBlogData = (data) => ({
  type: ADD_BLOG_DATA,
  data: data,
});

export const addHtmlData = (data) => ({
  type: ADD_BLOG_HTML_DATA,
  data: data,
});

export const addDraftData = (data) => ({
  type: ADD_BLOG_DRAFT_DATA,
  data: data,
});
