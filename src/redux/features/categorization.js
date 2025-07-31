import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import URLS from 'redux/urls'
import request from 'redux/utils/request'

export const fetchAllCategorization = createAsyncThunk(
    'Categorization/fetchAllCategorization',
    async (_, { rejectWithValue }) => {
        try {
            const response = await request('get', URLS.CATEGORIZATION)
            return response
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const addCategorization = createAsyncThunk(
    'Categorization/addCategorization',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await request('post', URLS.CATEGORIZATION, payload)
            return response.data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const updateCategorization = createAsyncThunk(
    'Categorization/updateCategorization',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await request('put', URLS.CATEGORIZATION, payload)
            return response.data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)
export const fetchOneCategorization = createAsyncThunk(
    'Categorization/fetchOneCategorization',
    async (id, { rejectWithValue }) => {
        try {
            const response = await request('get', `${URLS.CATEGORIZATION}/${id}`)
            return response.data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const deleteCategorization = createAsyncThunk(
    'Categorization/deleteCategorization',
    async (id, { rejectWithValue }) => {
        try {
            const response = await request('delete', `${URLS.CATEGORIZATION}/${id}`)
            return response.data
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

export const CategorizationSlice = createSlice({
    name: 'Categorization',
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
            .addCase(fetchAllCategorization.pending, startLoadingQuery)
            .addCase(fetchAllCategorization.fulfilled, (state, action) => {
                state.list = action.payload
                state.loading.query = false
            })
            .addCase(fetchAllCategorization.rejected, stopLoadingQuery)
        builder
            .addCase(fetchOneCategorization.pending, startLoadingQuery)
            .addCase(fetchOneCategorization.rejected, stopLoadingQuery)
            .addCase(fetchOneCategorization.fulfilled, (state, action) => {
                state.loading.query = false
                state.selected = action.payload
            })
        builder
            .addCase(updateCategorization.pending, startLoadingQuery)
            .addCase(updateCategorization.rejected, stopLoadingQuery)
            .addCase(updateCategorization.fulfilled, (state, action) => {
                state.loading.query = false
                state.selected = action.payload
            })
        builder
            .addCase(deleteCategorization.pending, startLoadingMutation)
            .addCase(deleteCategorization.fulfilled, stopLoadingMutation)
            .addCase(deleteCategorization.rejected, stopLoadingMutation)
    }
});


export const { setSelectedRows, setAppliedSearchText } = CategorizationSlice.actions;

export default CategorizationSlice.reducer;