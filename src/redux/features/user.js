import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import URLS from 'redux/urls'
import request from 'redux/utils/request'

export const fetchAllUser = createAsyncThunk(
    'User/fetchAllUser',
    async (params, { rejectWithValue }) => {
        try {
            const response = await request('get', URLS.USER, params)
            return response
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const addUser = createAsyncThunk(
    'User/addUser',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await request('post', URLS.USER, payload)
            return response
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const updateUser = createAsyncThunk(
    'User/updateUser',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await request('patch', `${URLS.USER}/${payload.id}`, payload)
            return response
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)
export const fetchOneUser = createAsyncThunk(
    'User/fetchOneUser',
    async (id, { rejectWithValue }) => {
        try {
            const response = await request('get', `${URLS.USER}/${id}`)
            return response
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const deleteUser = createAsyncThunk(
    'User/deleteUser',
    async (id, { rejectWithValue }) => {
        try {
            const response = await request('delete', `${URLS.USER}/${id}`)
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

export const UserSlice = createSlice({
    name: 'User',
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
            .addCase(fetchAllUser.pending, startLoadingQuery)
            .addCase(fetchAllUser.fulfilled, (state, action) => {
                state.list = action.payload
                state.loading.query = false
            })
            .addCase(fetchAllUser.rejected, stopLoadingQuery)
        builder
            .addCase(fetchOneUser.pending, startLoadingQuery)
            .addCase(fetchOneUser.rejected, stopLoadingQuery)
            .addCase(fetchOneUser.fulfilled, (state, action) => {
                state.loading.query = false
                state.selected = action.payload
            })
        builder
            .addCase(updateUser.pending, startLoadingQuery)
            .addCase(updateUser.rejected, stopLoadingQuery)
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading.query = false
                state.selected = action.payload
            })
        builder
            .addCase(deleteUser.pending, startLoadingMutation)
            .addCase(deleteUser.fulfilled, stopLoadingMutation)
            .addCase(deleteUser.rejected, stopLoadingMutation)
    }
});


export const { setSelectedRows, setAppliedSearchText } = UserSlice.actions;

export default UserSlice.reducer;