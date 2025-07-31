import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import URLS from 'redux/urls'
import request from 'redux/utils/publicRequest'
import privateRequest from 'redux/utils/request2'

const AUTH_TOKEN = 'auth_token'

export const login = createAsyncThunk(
	'auth/signIn',
	async (credentials) => {
		try {
			const response = await request('post', URLS.LOGIN, credentials)
			return response
		} catch (err) {
			console.log(err)
			return err
		}
	}
)

export const getUserProfile = createAsyncThunk(
	'auth/getUserProfile',
	async (data) => {
		const response = await privateRequest('get', `/auth/me`)
		return response
	}
)

export const register = createAsyncThunk(
	'auth/register',
	async (data) => {
		const response = await request('post', URLS.REGISTER, data)
		return response
	}
)

export const sendActivation = createAsyncThunk(
	'auth/sendActivation',
	async (data) => {
		const response = await request('get', `${URLS.ACTIVATION}/${data.id}/${data.email}`)
		return response
	}
)

export const storeGoogleAccountToken = createAsyncThunk(
	'auth/storeGoogleAccountToken',
	async (tokenId) => {
		const response = await request('post', URLS.STORE_GOOGLE_ACCOUNT, { tokenId })
		return response
	}
)

export const resetPassword = createAsyncThunk(
	'auth/resetPassword',
	async (email, { rejectWithValue }) => {
		try {
			const response = await request('post', URLS.RESET_PASSWORD, { email })
			return response
		} catch (error) {
			return rejectWithValue(error)
		}
	}
)

export const resendActivation = createAsyncThunk(
	'auth/resendActivation',
	async (email, { rejectWithValue }) => {
		try {
			const response = await request('post', URLS.RESEND_ACTIVATION, { email })
			return response
		} catch (error) {
			return rejectWithValue(error)
		}
	}
)

const initialState = {
	loading: false,
	message: '',
	showMessage: false,
	redirect: '',
	token: localStorage.getItem(AUTH_TOKEN),
	user: {}
}

const loadingReducer = (status) => (state) => {
	state.loading = status
}

const startLoading = loadingReducer(true)
const stopLoading = loadingReducer(false)

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		authenticated: (state, action) => {
			state.loading = false;
			state.redirect = '/';
			state.token = action.payload.token;
			state.user = action.payload.user;
		},
		showAuthMessage: (state, action) => {
			state.message = action.payload;
			state.showMessage = true;
			state.loading = false;
		},
		hideAuthMessage: (state) => {
			state.message = '';
			state.showMessage = false;
		},
		signOutSuccess: (state) => {
			state.token = null;
			state.redirect = '/';
			state.loading = false;
			state.user = {};
		},
		signUpSuccess: (state, action) => {
			state.loading = false;
			state.token = action.payload;
		},
		showLoading: (state) => {
			state.loading = true;
		},
		signInWithGoogleAuthenticated: (state, action) => {
			state.loading = false;
			state.token = action.payload;
		},
		signInWithFacebookAuthenticated: (state, action) => {
			state.loading = false;
			state.token = action.payload;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(register.pending, startLoading)
			.addCase(register.fulfilled, stopLoading)
			.addCase(register.rejected, stopLoading)
		builder
			.addCase(sendActivation.pending, startLoading)
			.addCase(sendActivation.fulfilled, stopLoading)
			.addCase(sendActivation.rejected, stopLoading)
		builder
			.addCase(getUserProfile.pending, startLoading)
			.addCase(getUserProfile.fulfilled, (state, action) => {
				state.user = action.payload
			})
			.addCase(getUserProfile.rejected, stopLoading)
		builder
			.addCase(resetPassword.pending, startLoading)
			.addCase(resetPassword.fulfilled, stopLoading)
			.addCase(resetPassword.rejected, stopLoading)
		builder
			.addCase(resendActivation.pending, startLoading)
			.addCase(resendActivation.fulfilled, stopLoading)
			.addCase(resendActivation.rejected, stopLoading)
	}
});

export const {
	authenticated,
	showAuthMessage,
	hideAuthMessage,
	signOutSuccess,
	signUpSuccess,
	showLoading,
	signInWithGoogleAuthenticated,
	signInWithFacebookAuthenticated
} = authSlice.actions;

export default authSlice.reducer;