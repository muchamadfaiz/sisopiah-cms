import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import URLS from 'redux/urls'
import request from 'redux/utils/request'

export const fetchAllContent = createAsyncThunk(
    'Content/fetchAllContent',
    async (params, { rejectWithValue }) => {
        try {
            const response = await request('get', URLS.CONTENT, params)
            return response
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const addContent = createAsyncThunk(
    'Content/addContent',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await request('post', URLS.CONTENT, payload)
            return response
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const updateContent = createAsyncThunk(
    'Content/updateContent',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await request('patch', `${URLS.CONTENT}/${payload.id}`, payload)
            return response
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)
export const fetchOneContent = createAsyncThunk(
    'Content/fetchOneContent',
    async (id, { rejectWithValue }) => {
        try {
            const response = await request('get', `${URLS.CONTENT}/${id}`)
            return response
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const deleteContent = createAsyncThunk(
    'Content/deleteContent',
    async (id, { rejectWithValue }) => {
        try {
            const response = await request('delete', `${URLS.CONTENT}/${id}`)
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
    count: {},
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

export const ContentSlice = createSlice({
    name: 'Content',
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
            .addCase(fetchAllContent.pending, startLoadingQuery)
            .addCase(fetchAllContent.fulfilled, (state, action) => {
                state.list = action.payload
                state.loading.query = false
            })
            .addCase(fetchAllContent.rejected, stopLoadingQuery)
        builder
            .addCase(fetchOneContent.pending, startLoadingQuery)
            .addCase(fetchOneContent.rejected, stopLoadingQuery)
            .addCase(fetchOneContent.fulfilled, (state, action) => {
                state.loading.query = false
                state.selected = action.payload
            })
        builder
            .addCase(updateContent.pending, startLoadingQuery)
            .addCase(updateContent.rejected, stopLoadingQuery)
            .addCase(updateContent.fulfilled, (state, action) => {
                state.loading.query = false
                state.selected = action.payload
            })
        builder
            .addCase(deleteContent.pending, startLoadingMutation)
            .addCase(deleteContent.fulfilled, stopLoadingMutation)
            .addCase(deleteContent.rejected, stopLoadingMutation)
    }
});


export const { setSelectedRows, setAppliedSearchText } = ContentSlice.actions;

export default ContentSlice.reducer;