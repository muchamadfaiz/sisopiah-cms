import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import URLS from 'redux/urls'
import request from 'redux/utils/request'

export const fetchAllProjects = createAsyncThunk(
    'Project/fetchAllProjects',
    async (params, { rejectWithValue }) => {
        try {
            const response = await request('get', URLS.PROJECT, params)
            return response
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const fetchProjectSummary = createAsyncThunk(
    'Project/fetchProjectSummary',
    async (params, { rejectWithValue }) => {
        try {
            const response = await request('get', `${URLS.PROJECT}/summary`, params)
            return response
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const fetchRankingCompany = createAsyncThunk(
    'Project/fetchRankingCompany',
    async (params, { rejectWithValue }) => {
        try {
            const response = await request('get', `${URLS.PROJECT}/get-ranking-companies`, params)
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
            const response = await request('post', URLS.PROJECT, payload)
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
            const response = await request('patch', `${URLS.PROJECT}/${payload.id}`, payload)
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
            const response = await request('get', `${URLS.PROJECT}/${id}`)
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
            const response = await request('delete', `${URLS.PROJECT}/${id}`)
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

export const ProjectSlice = createSlice({
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
            .addCase(fetchAllProjects.pending, startLoadingQuery)
            .addCase(fetchAllProjects.fulfilled, (state, action) => {
                state.list = action.payload
                state.loading.query = false
            })
            .addCase(fetchProjectSummary.rejected, stopLoadingQuery)
        builder
            .addCase(fetchProjectSummary.pending, startLoadingQuery)
            .addCase(fetchProjectSummary.fulfilled, (state, action) => {
                state.list = action.payload
                state.loading.query = false
            })
            .addCase(fetchAllProjects.rejected, stopLoadingQuery)
        builder
            .addCase(fetchRankingCompany.pending, startLoadingQuery)
            .addCase(fetchRankingCompany.fulfilled, (state, action) => {
                state.list = action.payload
                state.loading.query = false
            })
            .addCase(fetchRankingCompany.rejected, stopLoadingQuery)
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


export const { setSelectedRows, setAppliedSearchText } = ProjectSlice.actions;

export default ProjectSlice.reducer;