import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import URLS from "redux/urls";
import request from "redux/utils/request";

export const fetchAllStudents = createAsyncThunk("Student/fetchAllStudents", async (params, { rejectWithValue }) => {
 try {
  const response = await request("get", URLS.STUDENT, params);
  return response;
 } catch (error) {
  return rejectWithValue(error);
 }
});

export const fetchStudentsummary = createAsyncThunk("Student/fetchStudentsummary", async (params, { rejectWithValue }) => {
 try {
  const response = await request("get", `${URLS.STUDENT}/summary`, params);
  return response;
 } catch (error) {
  return rejectWithValue(error);
 }
});

export const fetchRankingCompany = createAsyncThunk(
 "Student/fetchRankingCompany",
 async (params, { rejectWithValue }) => {
  try {
   const response = await request("get", `${URLS.STUDENT}/get-ranking-companies`, params);
   return response;
  } catch (error) {
   return rejectWithValue(error);
  }
 }
);

export const addStudent = createAsyncThunk("Student/addStudent", async (payload, { rejectWithValue }) => {
 try {
  const response = await request("post", URLS.STUDENT, payload);
  return response;
 } catch (error) {
  return rejectWithValue(error);
 }
});

export const updateStudent = createAsyncThunk("Student/updateStudent", async (payload, { rejectWithValue }) => {
 try {
  const response = await request("patch", `${URLS.STUDENT}/${payload.id}`, payload);
  return response;
 } catch (error) {
  return rejectWithValue(error);
 }
});
export const fetchOneStudent = createAsyncThunk("Student/fetchOneStudent", async (id, { rejectWithValue }) => {
 try {
  const response = await request("get", `${URLS.STUDENT}/${id}`);
  return response;
 } catch (error) {
  return rejectWithValue(error);
 }
});

export const deleteStudent = createAsyncThunk("Student/deleteStudent", async (id, { rejectWithValue }) => {
 try {
  const response = await request("delete", `${URLS.STUDENT}/${id}`);
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

export const Studentslice = createSlice({
 name: "Student",
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
   .addCase(fetchAllStudents.pending, startLoadingQuery)
   .addCase(fetchAllStudents.fulfilled, (state, action) => {
    state.list = action.payload;
    state.loading.query = false;
   })
   .addCase(fetchStudentsummary.rejected, stopLoadingQuery);
  builder
   .addCase(fetchStudentsummary.pending, startLoadingQuery)
   .addCase(fetchStudentsummary.fulfilled, (state, action) => {
    state.list = action.payload;
    state.loading.query = false;
   })
   .addCase(fetchAllStudents.rejected, stopLoadingQuery);
  builder
   .addCase(fetchRankingCompany.pending, startLoadingQuery)
   .addCase(fetchRankingCompany.fulfilled, (state, action) => {
    state.list = action.payload;
    state.loading.query = false;
   })
   .addCase(fetchRankingCompany.rejected, stopLoadingQuery);
  builder
   .addCase(fetchOneStudent.pending, startLoadingQuery)
   .addCase(fetchOneStudent.rejected, stopLoadingQuery)
   .addCase(fetchOneStudent.fulfilled, (state, action) => {
    state.loading.query = false;
    state.selected = action.payload;
   });
  builder
   .addCase(updateStudent.pending, startLoadingQuery)
   .addCase(updateStudent.rejected, stopLoadingQuery)
   .addCase(updateStudent.fulfilled, (state, action) => {
    state.loading.query = false;
    state.selected = action.payload;
   });
  builder
   .addCase(deleteStudent.pending, startLoadingMutation)
   .addCase(deleteStudent.fulfilled, stopLoadingMutation)
   .addCase(deleteStudent.rejected, stopLoadingMutation);
 },
});

export const { setSelectedRows, setAppliedSearchText } = Studentslice.actions;

export default Studentslice.reducer;
