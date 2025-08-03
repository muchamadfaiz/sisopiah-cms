import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import URLS from "redux/urls";
import request from "redux/utils/request";

export const fetchAllDapurs = createAsyncThunk("Dapur/fetchAllDapurs", async (params, { rejectWithValue }) => {
 try {
  const response = await request("get", URLS.DAPUR, params);
  return response;
 } catch (error) {
  return rejectWithValue(error);
 }
});

export const fetchDapurSummary = createAsyncThunk("Dapur/fetchDapurSummary", async (params, { rejectWithValue }) => {
 try {
  const response = await request("get", `${URLS.DAPUR}/summary`, params);
  return response;
 } catch (error) {
  return rejectWithValue(error);
 }
});

export const fetchRankingCompany = createAsyncThunk(
 "Dapur/fetchRankingCompany",
 async (params, { rejectWithValue }) => {
  try {
   const response = await request("get", `${URLS.DAPUR}/get-ranking-companies`, params);
   return response;
  } catch (error) {
   return rejectWithValue(error);
  }
 }
);

export const addDapur = createAsyncThunk("Dapur/addDapur", async (payload, { rejectWithValue }) => {
 try {
  const response = await request("post", URLS.DAPUR, payload);
  return response;
 } catch (error) {
  return rejectWithValue(error);
 }
});

export const updateDapur = createAsyncThunk("Dapur/updateDapur", async (payload, { rejectWithValue }) => {
 try {
  const response = await request("patch", `${URLS.DAPUR}/${payload.id}`, payload);
  return response;
 } catch (error) {
  return rejectWithValue(error);
 }
});
export const fetchOneDapur = createAsyncThunk("Dapur/fetchOneDapur", async (id, { rejectWithValue }) => {
 try {
  const response = await request("get", `${URLS.DAPUR}/${id}`);
  return response;
 } catch (error) {
  return rejectWithValue(error);
 }
});

export const deleteDapur = createAsyncThunk("Dapur/deleteDapur", async (id, { rejectWithValue }) => {
 try {
  const response = await request("delete", `${URLS.DAPUR}/${id}`);
  return response;
 } catch (error) {
  return rejectWithValue(error);
 }
});

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

export const DapurSlice = createSlice({
 name: "Dapur",
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
   .addCase(fetchAllDapurs.pending, startLoadingQuery)
   .addCase(fetchAllDapurs.fulfilled, (state, action) => {
    state.list = action.payload;
    state.loading.query = false;
   })
   .addCase(fetchDapurSummary.rejected, stopLoadingQuery);
  builder
   .addCase(fetchDapurSummary.pending, startLoadingQuery)
   .addCase(fetchDapurSummary.fulfilled, (state, action) => {
    state.list = action.payload;
    state.loading.query = false;
   })
   .addCase(fetchAllDapurs.rejected, stopLoadingQuery);
  builder
   .addCase(fetchRankingCompany.pending, startLoadingQuery)
   .addCase(fetchRankingCompany.fulfilled, (state, action) => {
    state.list = action.payload;
    state.loading.query = false;
   })
   .addCase(fetchRankingCompany.rejected, stopLoadingQuery);
  builder
   .addCase(fetchOneDapur.pending, startLoadingQuery)
   .addCase(fetchOneDapur.rejected, stopLoadingQuery)
   .addCase(fetchOneDapur.fulfilled, (state, action) => {
    state.loading.query = false;
    state.selected = action.payload;
   });
  builder
   .addCase(updateDapur.pending, startLoadingQuery)
   .addCase(updateDapur.rejected, stopLoadingQuery)
   .addCase(updateDapur.fulfilled, (state, action) => {
    state.loading.query = false;
    state.selected = action.payload;
   });
  builder
   .addCase(deleteDapur.pending, startLoadingMutation)
   .addCase(deleteDapur.fulfilled, stopLoadingMutation)
   .addCase(deleteDapur.rejected, stopLoadingMutation);
 },
});

export const { setSelectedRows, setAppliedSearchText } = DapurSlice.actions;

export default DapurSlice.reducer;
