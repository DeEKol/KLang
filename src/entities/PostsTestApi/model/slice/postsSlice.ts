import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { IPostsSchema } from "entities/PostsTestApi/types/postsSchema";

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async function (_, { rejectWithValue }) {
    try {
      const response = await fetch("https://jsonplaceholder.org/posts");

      if (!response.ok) {
        new Error("Server Error!");
      }

      const data = await response.json();

      return data;
    } catch (e) {
      if (e instanceof Error) {
        return rejectWithValue(e.message);
      } else {
        throw e;
      }
    }
  },
);

const initialState: IPostsSchema = {
  postsArr: [],
  status: null,
  error: null,
};

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.pending, (state, action) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.status = "resolved";
      // console.log(action.payload);
      state.postsArr = action.payload;
    });
    builder.addCase(fetchPosts.rejected, (state, action) => {
      state.status = "rejected";
      state.error = action.payload as string;
    });
  },
});

export const { actions: postsActions, reducer: postsReducer } = postsSlice;
