import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import URLS from 'redux/urls'
import request from 'redux/utils/request'

export const fetchAllVendor = createAsyncThunk(
    'Project/fetchAllVendor',
    async (_, { rejectWithValue }) => {
        try {
            const response = await request('get', URLS.VENDOR)
            return response
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const addProject = createAsyncThunk(
    'Project/addProject',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await request('post', URLS.VENDOR, payload)
            return response
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const updateProject = createAsyncThunk(
    'Project/updateProject',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await request('patch', `${URLS.VENDOR}/${payload.id}`, payload)
            return response
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)
export const fetchOneProject = createAsyncThunk(
    'Project/fetchOneProject',
    async (id, { rejectWithValue }) => {
        try {
            const response = await request('get', `${URLS.VENDOR}/${id}`)
            return response
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const deleteProject = createAsyncThunk(
    'Project/deleteProject',
    async (id, { rejectWithValue }) => {
        try {
            const response = await request('delete', `${URLS.VENDOR}/${id}`)
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

export const Vendorlice = createSlice({
    name: 'Project',
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
            .addCase(fetchAllVendor.pending, startLoadingQuery)
            .addCase(fetchAllVendor.fulfilled, (state, action) => {
                state.list = action.payload
                state.loading.query = false
            })
            .addCase(fetchAllVendor.rejected, stopLoadingQuery)
        builder
            .addCase(fetchOneProject.pending, startLoadingQuery)
            .addCase(fetchOneProject.rejected, stopLoadingQuery)
            .addCase(fetchOneProject.fulfilled, (state, action) => {
                state.loading.query = false
                state.selected = action.payload
            })
        builder
            .addCase(updateProject.pending, startLoadingQuery)
            .addCase(updateProject.rejected, stopLoadingQuery)
            .addCase(updateProject.fulfilled, (state, action) => {
                state.loading.query = false
                state.selected = action.payload
            })
        builder
            .addCase(deleteProject.pending, startLoadingMutation)
            .addCase(deleteProject.fulfilled, stopLoadingMutation)
            .addCase(deleteProject.rejected, stopLoadingMutation)
    }
});


export const { setSelectedRows, setAppliedSearchText } = Vendorlice.actions;

export default Vendorlice.reducer;