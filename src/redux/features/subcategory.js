import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import URLS from "redux/urls";
import request from "redux/utils/request";

export const fetchAllSubcategory = createAsyncThunk(
  "Subcategory/fetchAllSubcategory",
  async (params, { rejectWithValue }) => {
    try {
      const response = await request("get", URLS.SUBCATEGORY, params);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const addSubcategory = createAsyncThunk(
  "Subcategory/addSubcategory",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await request("post", URLS.SUBCATEGORY, payload);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateSubcategory = createAsyncThunk(
  "Subcategory/updateSubcategory",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await request(
        "patch",
        `${URLS.SUBCATEGORY}/${payload.id}`,
        payload
      );
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const fetchOneSubcategory = createAsyncThunk(
  "Subcategory/fetchOneSubcategory",
  async (id, { rejectWithValue }) => {
    try {
      const response = await request("get", `${URLS.SUBCATEGORY}/${id}`);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteSubcategory = createAsyncThunk(
  "Subcategory/deleteSubcategory",
  async (id, { rejectWithValue }) => {
    try {
      const response = await request("delete", `${URLS.SUBCATEGORY}/${id}`);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  loading: {
    query: false,
    mutation: false,
  },
  filter: {
    q: "",
  },
  list: [],
  selected: {},
  selectedRows: [],
};

const loadingReducer = (fieldName, status) => (state) => {
  state.loading[fieldName] = status;
};

const startLoadingQuery = loadingReducer("query", true);
const stopLoadingQuery = loadingReducer("query", false);
const startLoadingMutation = loadingReducer("mutation", true);
const stopLoadingMutation = loadingReducer("mutation", false);

export const SubcategorySlice = createSlice({
  name: "Subcategory",
  initialState,
  reducers: {
    setAppliedSearchText: (state, action) => {
      state.filter.q = action.payload;
    },
    setSelectedRows: (state, action) => {
      state.selectedRows = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSubcategory.pending, startLoadingQuery)
      .addCase(fetchAllSubcategory.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading.query = false;
      })
      .addCase(fetchAllSubcategory.rejected, stopLoadingQuery);
    builder
      .addCase(fetchOneSubcategory.pending, startLoadingQuery)
      .addCase(fetchOneSubcategory.rejected, stopLoadingQuery)
      .addCase(fetchOneSubcategory.fulfilled, (state, action) => {
        state.loading.query = false;
        state.selected = action.payload;
      });
    builder
      .addCase(updateSubcategory.pending, startLoadingQuery)
      .addCase(updateSubcategory.rejected, stopLoadingQuery)
      .addCase(updateSubcategory.fulfilled, (state, action) => {
        state.loading.query = false;
        state.selected = action.payload;
      });
    builder
      .addCase(deleteSubcategory.pending, startLoadingMutation)
      .addCase(deleteSubcategory.fulfilled, stopLoadingMutation)
      .addCase(deleteSubcategory.rejected, stopLoadingMutation);
  },
});

export const { setSelectedRows, setAppliedSearchText } =
  SubcategorySlice.actions;

export default SubcategorySlice.reducer;
