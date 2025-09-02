import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import URLS from "redux/urls";
import request from "redux/utils/request";

export const fetchAllSalaries = createAsyncThunk("Salary/fetchAllSalaries", async (params, { rejectWithValue }) => {
  try {
    const response = await request("get", URLS.SALARY, params);
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const fetchSalariesummary = createAsyncThunk(
  "Salary/fetchSalariesummary",
  async (params, { rejectWithValue }) => {
    try {
      const response = await request("get", `${URLS.SALARY}/summary`, params);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchRankingCompany = createAsyncThunk(
  "Salary/fetchRankingCompany",
  async (params, { rejectWithValue }) => {
    try {
      const response = await request("get", `${URLS.SALARY}/get-ranking-companies`, params);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const addSalary = createAsyncThunk("Salary/addSalary", async (payload, { rejectWithValue }) => {
  try {
    const response = await request("post", URLS.SALARY, payload);
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const updateSalary = createAsyncThunk("Salary/updateSalary", async (payload, { rejectWithValue }) => {
  try {
    const response = await request("patch", `${URLS.SALARY}/${payload.id}`, payload);
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});
export const fetchOneSalary = createAsyncThunk("Salary/fetchOneSalary", async (id, { rejectWithValue }) => {
  try {
    const response = await request("get", `${URLS.SALARY}/${id}`);
    return response;
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const deleteSalary = createAsyncThunk("Salary/deleteSalary", async (id, { rejectWithValue }) => {
  try {
    const response = await request("delete", `${URLS.SALARY}/${id}`);
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

export const Salarieslice = createSlice({
  name: "Salary",
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
      .addCase(fetchAllSalaries.pending, startLoadingQuery)
      .addCase(fetchAllSalaries.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading.query = false;
      })
      .addCase(fetchSalariesummary.rejected, stopLoadingQuery);
    builder
      .addCase(fetchSalariesummary.pending, startLoadingQuery)
      .addCase(fetchSalariesummary.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading.query = false;
      })
      .addCase(fetchAllSalaries.rejected, stopLoadingQuery);
    builder
      .addCase(fetchRankingCompany.pending, startLoadingQuery)
      .addCase(fetchRankingCompany.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading.query = false;
      })
      .addCase(fetchRankingCompany.rejected, stopLoadingQuery);
    builder
      .addCase(fetchOneSalary.pending, startLoadingQuery)
      .addCase(fetchOneSalary.rejected, stopLoadingQuery)
      .addCase(fetchOneSalary.fulfilled, (state, action) => {
        state.loading.query = false;
        state.selected = action.payload;
      });
    builder
      .addCase(updateSalary.pending, startLoadingQuery)
      .addCase(updateSalary.rejected, stopLoadingQuery)
      .addCase(updateSalary.fulfilled, (state, action) => {
        state.loading.query = false;
        state.selected = action.payload;
      });
    builder
      .addCase(deleteSalary.pending, startLoadingMutation)
      .addCase(deleteSalary.fulfilled, stopLoadingMutation)
      .addCase(deleteSalary.rejected, stopLoadingMutation);
  },
});

export const { setSelectedRows, setAppliedSearchText } = Salarieslice.actions;

export default Salarieslice.reducer;
