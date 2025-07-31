import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import URLS from 'redux/urls'
import request from 'redux/utils/request'

export const fetchAllTags = createAsyncThunk(
    'Tags/fetchAllTags',
    async (params, { rejectWithValue }) => {
        try {
            const response = await request('get', URLS.TAG, params)
            return response
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const addTags = createAsyncThunk(
    'Tags/addTags',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await request('post', URLS.TAG, payload)
            return response
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const updateTags = createAsyncThunk(
    'Tags/updateTags',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await request('patch', `${URLS.TAG}/${payload.id}`, payload)
            return response
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)
export const fetchOneTags = createAsyncThunk(
    'Tags/fetchOneTags',
    async (id, { rejectWithValue }) => {
        try {
            const response = await request('get', `${URLS.TAG}/${id}`)
            return response
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const deleteTags = createAsyncThunk(
    'Tags/deleteTags',
    async (id, { rejectWithValue }) => {
        try {
            const response = await request('delete', `${URLS.TAG}/${id}`)
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

export const TagsSlice = createSlice({
    name: 'Tags',
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
            .addCase(fetchAllTags.pending, startLoadingQuery)
            .addCase(fetchAllTags.fulfilled, (state, action) => {
                state.list = action.payload
                state.loading.query = false
            })
            .addCase(fetchAllTags.rejected, stopLoadingQuery)
        builder
            .addCase(fetchOneTags.pending, startLoadingQuery)
            .addCase(fetchOneTags.rejected, stopLoadingQuery)
            .addCase(fetchOneTags.fulfilled, (state, action) => {
                state.loading.query = false
                state.selected = action.payload
            })
        builder
            .addCase(updateTags.pending, startLoadingQuery)
            .addCase(updateTags.rejected, stopLoadingQuery)
            .addCase(updateTags.fulfilled, (state, action) => {
                state.loading.query = false
                state.selected = action.payload
            })
        builder
            .addCase(deleteTags.pending, startLoadingMutation)
            .addCase(deleteTags.fulfilled, stopLoadingMutation)
            .addCase(deleteTags.rejected, stopLoadingMutation)
    }
});


export const { setSelectedRows, setAppliedSearchText } = TagsSlice.actions;

export default TagsSlice.reducer;