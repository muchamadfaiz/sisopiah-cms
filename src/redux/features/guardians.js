import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import URLS from "redux/urls";
import request from "redux/utils/request";

export const fetchAllGuardians = createAsyncThunk("Guardian/fetchAllGuardians", async (params, { rejectWithValue }) => {
 try {
  const response = await request("get", URLS.GUARDIAN, params);
  return response;
 } catch (error) {
  return rejectWithValue(error);
 }
});

export const fetchGuardiansummary = createAsyncThunk("Guardian/fetchGuardiansummary", async (params, { rejectWithValue }) => {
 try {
  const response = await request("get", `${URLS.GUARDIAN}/summary`, params);
  return response;
 } catch (error) {
  return rejectWithValue(error);
 }
});

export const fetchRankingCompany = createAsyncThunk(
 "Guardian/fetchRankingCompany",
 async (params, { rejectWithValue }) => {
  try {
   const response = await request("get", `${URLS.GUARDIAN}/get-ranking-companies`, params);
   return response;
  } catch (error) {
   return rejectWithValue(error);
  }
 }
);

export const addGuardian = createAsyncThunk("Guardian/addGuardian", async (payload, { rejectWithValue }) => {
 try {
  const response = await request("post", URLS.GUARDIAN, payload);
  return response;
 } catch (error) {
  return rejectWithValue(error);
 }
});

export const updateGuardian = createAsyncThunk("Guardian/updateGuardian", async (payload, { rejectWithValue }) => {
 try {
  const response = await request("patch", `${URLS.GUARDIAN}/${payload.id}`, payload);
  return response;
 } catch (error) {
  return rejectWithValue(error);
 }
});
export const fetchOneGuardian = createAsyncThunk("Guardian/fetchOneGuardian", async (id, { rejectWithValue }) => {
 try {
  const response = await request("get", `${URLS.GUARDIAN}/${id}`);
  return response;
 } catch (error) {
  return rejectWithValue(error);
 }
});

export const deleteGuardian = createAsyncThunk("Guardian/deleteGuardian", async (id, { rejectWithValue }) => {
 try {
  const response = await request("delete", `${URLS.GUARDIAN}/${id}`);
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

export const Guardianslice = createSlice({
 name: "Guardian",
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
   .addCase(fetchAllGuardians.pending, startLoadingQuery)
   .addCase(fetchAllGuardians.fulfilled, (state, action) => {
    state.list = action.payload;
    state.loading.query = false;
   })
   .addCase(fetchGuardiansummary.rejected, stopLoadingQuery);
  builder
   .addCase(fetchGuardiansummary.pending, startLoadingQuery)
   .addCase(fetchGuardiansummary.fulfilled, (state, action) => {
    state.list = action.payload;
    state.loading.query = false;
   })
   .addCase(fetchAllGuardians.rejected, stopLoadingQuery);
  builder
   .addCase(fetchRankingCompany.pending, startLoadingQuery)
   .addCase(fetchRankingCompany.fulfilled, (state, action) => {
    state.list = action.payload;
    state.loading.query = false;
   })
   .addCase(fetchRankingCompany.rejected, stopLoadingQuery);
  builder
   .addCase(fetchOneGuardian.pending, startLoadingQuery)
   .addCase(fetchOneGuardian.rejected, stopLoadingQuery)
   .addCase(fetchOneGuardian.fulfilled, (state, action) => {
    state.loading.query = false;
    state.selected = action.payload;
   });
  builder
   .addCase(updateGuardian.pending, startLoadingQuery)
   .addCase(updateGuardian.rejected, stopLoadingQuery)
   .addCase(updateGuardian.fulfilled, (state, action) => {
    state.loading.query = false;
    state.selected = action.payload;
   });
  builder
   .addCase(deleteGuardian.pending, startLoadingMutation)
   .addCase(deleteGuardian.fulfilled, stopLoadingMutation)
   .addCase(deleteGuardian.rejected, stopLoadingMutation);
 },
});

export const { setSelectedRows, setAppliedSearchText } = Guardianslice.actions;

export default Guardianslice.reducer;
