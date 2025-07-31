import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import URLS from 'redux/urls'
import request from 'redux/utils/request'

export const fetchAllCategory = createAsyncThunk(
    'Category/fetchAllCategory',
    async (_, { rejectWithValue }) => {
        try {
            const response = await request('get', URLS.CATEGORY)
            return response
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const addCategory = createAsyncThunk(
    'Category/addCategory',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await request('post', URLS.CATEGORY, payload)
            return response
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const updateCategory = createAsyncThunk(
    'Category/updateCategory',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await request('patch', `${URLS.CATEGORY}/${payload.id}`, payload)
            return response
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)
export const fetchOneCategory = createAsyncThunk(
    'Category/fetchOneCategory',
    async (id, { rejectWithValue }) => {
        try {
            const response = await request('get', `${URLS.CATEGORY}/${id}`)
            return response
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const deleteCategory = createAsyncThunk(
    'Category/deleteCategory',
    async (id, { rejectWithValue }) => {
        try {
            const response = await request('delete', `${URLS.CATEGORY}/${id}`)
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

export const CategorySlice = createSlice({
    name: 'Category',
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
            .addCase(fetchAllCategory.pending, startLoadingQuery)
            .addCase(fetchAllCategory.fulfilled, (state, action) => {
                state.list = action.payload
                state.loading.query = false
            })
            .addCase(fetchAllCategory.rejected, stopLoadingQuery)
        builder
            .addCase(fetchOneCategory.pending, startLoadingQuery)
            .addCase(fetchOneCategory.rejected, stopLoadingQuery)
            .addCase(fetchOneCategory.fulfilled, (state, action) => {
                state.loading.query = false
                state.selected = action.payload
            })
        builder
            .addCase(updateCategory.pending, startLoadingQuery)
            .addCase(updateCategory.rejected, stopLoadingQuery)
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.loading.query = false
                state.selected = action.payload
            })
        builder
            .addCase(deleteCategory.pending, startLoadingMutation)
            .addCase(deleteCategory.fulfilled, stopLoadingMutation)
            .addCase(deleteCategory.rejected, stopLoadingMutation)
    }
});


export const { setSelectedRows, setAppliedSearchText } = CategorySlice.actions;

export default CategorySlice.reducer;