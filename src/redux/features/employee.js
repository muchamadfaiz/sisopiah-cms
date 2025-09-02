import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import URLS from "redux/urls";
import request from "redux/utils/request";

export const fetchAllEmployees = createAsyncThunk("Employee/fetchAllEmployees", async (params, { rejectWithValue }) => {
  try {
    const response = await request("get", URLS.EMPLOYEE, params);
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const fetchEmployeesummary = createAsyncThunk(
  "Employee/fetchEmployeesummary",
  async (params, { rejectWithValue }) => {
    try {
      const response = await request("get", `${URLS.EMPLOYEE}/summary`, params);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchRankingCompany = createAsyncThunk(
  "Employee/fetchRankingCompany",
  async (params, { rejectWithValue }) => {
    try {
      const response = await request("get", `${URLS.EMPLOYEE}/get-ranking-companies`, params);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const addEmployee = createAsyncThunk("Employee/addEmployee", async (payload, { rejectWithValue }) => {
  try {
    const response = await request("post", URLS.EMPLOYEE, payload);
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const updateEmployee = createAsyncThunk("Employee/updateEmployee", async (payload, { rejectWithValue }) => {
  try {
    const response = await request("patch", `${URLS.EMPLOYEE}/${payload.id}`, payload);
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});
export const fetchOneEmployee = createAsyncThunk("Employee/fetchOneEmployee", async (id, { rejectWithValue }) => {
  try {
    const response = await request("get", `${URLS.EMPLOYEE}/${id}`);
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const deleteEmployee = createAsyncThunk("Employee/deleteEmployee", async (id, { rejectWithValue }) => {
  try {
    const response = await request("delete", `${URLS.EMPLOYEE}/${id}`);
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

export const Employeeslice = createSlice({
  name: "Employee",
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
      .addCase(fetchAllEmployees.pending, startLoadingQuery)
      .addCase(fetchAllEmployees.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading.query = false;
      })
      .addCase(fetchEmployeesummary.rejected, stopLoadingQuery);
    builder
      .addCase(fetchEmployeesummary.pending, startLoadingQuery)
      .addCase(fetchEmployeesummary.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading.query = false;
      })
      .addCase(fetchAllEmployees.rejected, stopLoadingQuery);
    builder
      .addCase(fetchRankingCompany.pending, startLoadingQuery)
      .addCase(fetchRankingCompany.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading.query = false;
      })
      .addCase(fetchRankingCompany.rejected, stopLoadingQuery);
    builder
      .addCase(fetchOneEmployee.pending, startLoadingQuery)
      .addCase(fetchOneEmployee.rejected, stopLoadingQuery)
      .addCase(fetchOneEmployee.fulfilled, (state, action) => {
        state.loading.query = false;
        state.selected = action.payload;
      });
    builder
      .addCase(updateEmployee.pending, startLoadingQuery)
      .addCase(updateEmployee.rejected, stopLoadingQuery)
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.loading.query = false;
        state.selected = action.payload;
      });
    builder
      .addCase(deleteEmployee.pending, startLoadingMutation)
      .addCase(deleteEmployee.fulfilled, stopLoadingMutation)
      .addCase(deleteEmployee.rejected, stopLoadingMutation);
  },
});

export const { setSelectedRows, setAppliedSearchText } = Employeeslice.actions;

export default Employeeslice.reducer;
