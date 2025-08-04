import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import URLS from "redux/urls";
import request from "redux/utils/request";

export const fetchAllBills = createAsyncThunk("Bill/fetchAllBills", async (params, { rejectWithValue }) => {
 try {
  const response = await request("get", URLS.BILL, params);
  return response;
 } catch (error) {
  return rejectWithValue(error);
 }
});

export const fetchBillsummary = createAsyncThunk("Bill/fetchBillsummary", async (params, { rejectWithValue }) => {
 try {
  const response = await request("get", `${URLS.BILL}/summary`, params);
  return response;
 } catch (error) {
  return rejectWithValue(error);
 }
});

export const fetchRankingCompany = createAsyncThunk(
 "Bill/fetchRankingCompany",
 async (params, { rejectWithValue }) => {
  try {
   const response = await request("get", `${URLS.BILL}/get-ranking-companies`, params);
   return response;
  } catch (error) {
   return rejectWithValue(error);
  }
 }
);

export const addBill = createAsyncThunk("Bill/addBill", async (payload, { rejectWithValue }) => {
 try {
  const response = await request("post", URLS.BILL, payload);
  return response;
 } catch (error) {
  return rejectWithValue(error);
 }
});

export const updateBill = createAsyncThunk("Bill/updateBill", async (payload, { rejectWithValue }) => {
 try {
  const response = await request("patch", `${URLS.BILL}/${payload.id}`, payload);
  return response;
 } catch (error) {
  return rejectWithValue(error);
 }
});
export const fetchOneBill = createAsyncThunk("Bill/fetchOneBill", async (id, { rejectWithValue }) => {
 try {
  const response = await request("get", `${URLS.BILL}/${id}`);
  return response;
 } catch (error) {
  return rejectWithValue(error);
 }
});

export const deleteBill = createAsyncThunk("Bill/deleteBill", async (id, { rejectWithValue }) => {
 try {
  const response = await request("delete", `${URLS.BILL}/${id}`);
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

export const Billslice = createSlice({
 name: "Bill",
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
   .addCase(fetchAllBills.pending, startLoadingQuery)
   .addCase(fetchAllBills.fulfilled, (state, action) => {
    state.list = action.payload;
    state.loading.query = false;
   })
   .addCase(fetchBillsummary.rejected, stopLoadingQuery);
  builder
   .addCase(fetchBillsummary.pending, startLoadingQuery)
   .addCase(fetchBillsummary.fulfilled, (state, action) => {
    state.list = action.payload;
    state.loading.query = false;
   })
   .addCase(fetchAllBills.rejected, stopLoadingQuery);
  builder
   .addCase(fetchRankingCompany.pending, startLoadingQuery)
   .addCase(fetchRankingCompany.fulfilled, (state, action) => {
    state.list = action.payload;
    state.loading.query = false;
   })
   .addCase(fetchRankingCompany.rejected, stopLoadingQuery);
  builder
   .addCase(fetchOneBill.pending, startLoadingQuery)
   .addCase(fetchOneBill.rejected, stopLoadingQuery)
   .addCase(fetchOneBill.fulfilled, (state, action) => {
    state.loading.query = false;
    state.selected = action.payload;
   });
  builder
   .addCase(updateBill.pending, startLoadingQuery)
   .addCase(updateBill.rejected, stopLoadingQuery)
   .addCase(updateBill.fulfilled, (state, action) => {
    state.loading.query = false;
    state.selected = action.payload;
   });
  builder
   .addCase(deleteBill.pending, startLoadingMutation)
   .addCase(deleteBill.fulfilled, stopLoadingMutation)
   .addCase(deleteBill.rejected, stopLoadingMutation);
 },
});

export const { setSelectedRows, setAppliedSearchText } = Billslice.actions;

export default Billslice.reducer;
