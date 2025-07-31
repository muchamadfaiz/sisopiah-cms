import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import URLS from 'redux/urls'
import request from 'redux/utils/request'

export const fetchAllWajib = createAsyncThunk(
    'Wajib/fetchAllWajib',
    async (params, { rejectWithValue }) => {
        try {
            const response = await request('get', URLS.WAJIB, params)
            return response
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const fetchWajibSummary = createAsyncThunk(
    'Wajib/fetchWajibSummary',
    async (_, { rejectWithValue }) => {
        try {
            const response = await request('get', `${URLS.WAJIB}/summary`)
            return response
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const addWajib = createAsyncThunk(
    'Wajib/addWajib',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await request('post', URLS.WAJIB, payload)
            return response
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const updateWajib = createAsyncThunk(
    'Wajib/updateWajib',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await request('patch', `${URLS.WAJIB}/${payload.id}`, payload)
            return response
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)
export const fetchOneWajib = createAsyncThunk(
    'Wajib/fetchOneWajib',
    async (id, { rejectWithValue }) => {
        try {
            const response = await request('get', `${URLS.WAJIB}/${id}`)
            return response
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const deleteWajib = createAsyncThunk(
    'Wajib/deleteWajib',
    async (id, { rejectWithValue }) => {
        try {
            const response = await request('delete', `${URLS.WAJIB}/${id}`)
            return response
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

const initialState = {
    loading: {
        query: false,
        mutation: false
    },
    filter: {
        q: ''
    },
    list: [],
    selected: {},
    selectedRows: []
}

const loadingReducer = (fieldName, status) => (state) => {
    state.loading[fieldName] = status
}

const startLoadingQuery = loadingReducer('query', true)
const stopLoadingQuery = loadingReducer('query', false)
const startLoadingMutation = loadingReducer('mutation', true)
const stopLoadingMutation = loadingReducer('mutation', false)

export const Wajiblice = createSlice({
    name: 'Wajib',
    initialState,
    reducers: {
        setAppliedSearchText: (state, action) => {
            state.filter.q = action.payload
        },
        setSelectedRows: (state, action) => {
            state.selectedRows = action.payload
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchAllWajib.pending, startLoadingQuery)
            .addCase(fetchAllWajib.fulfilled, (state, action) => {
                state.list = action.payload
                state.loading.query = false
            })
            .addCase(fetchAllWajib.rejected, stopLoadingQuery)
        builder
            .addCase(fetchWajibSummary.pending, startLoadingQuery)
            .addCase(fetchWajibSummary.fulfilled, (state, action) => {
                state.list = action.payload
                state.loading.query = false
            })
            .addCase(fetchWajibSummary.rejected, stopLoadingQuery)
        builder
            .addCase(fetchOneWajib.pending, startLoadingQuery)
            .addCase(fetchOneWajib.rejected, stopLoadingQuery)
            .addCase(fetchOneWajib.fulfilled, (state, action) => {
                state.loading.query = false
                state.selected = action.payload
            })
        builder
            .addCase(updateWajib.pending, startLoadingQuery)
            .addCase(updateWajib.rejected, stopLoadingQuery)
            .addCase(updateWajib.fulfilled, (state, action) => {
                state.loading.query = false
                state.selected = action.payload
            })
        builder
            .addCase(deleteWajib.pending, startLoadingMutation)
            .addCase(deleteWajib.fulfilled, stopLoadingMutation)
            .addCase(deleteWajib.rejected, stopLoadingMutation)
    }
});


export const { setSelectedRows, setAppliedSearchText } = Wajiblice.actions;

export default Wajiblice.reducer;