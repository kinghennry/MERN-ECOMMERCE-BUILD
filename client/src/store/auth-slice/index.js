import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
const initialState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
  token: null,
}

export const registerUser = createAsyncThunk(
  '/auth/register',

  async (formData) => {
    const { data } = await axios.post(
      `${import.meta.env.VITE_APP}/auth/register`,
      formData,
      {
        withCredentials: true,
      }
    )

    return data
  }
)

export const loginUser = createAsyncThunk('auth/login', async (formData) => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_APP}/auth/login`,
    formData,
    {
      withCredentials: true,
    }
  )

  return data
})

export const checkAuth = createAsyncThunk(
  '/auth/checkauth',

  async () => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_APP}/auth/check-auth`,
      {
        withCredentials: true,
        headers: {
          'Cache-Control':
            'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    )

    return data
  }
)
// if we have dont any issues with hosting, use this code fix
// export const checkAuth = createAsyncThunk(
//   '/auth/checkauth',

//   async (token) => {
//     const { data } = await axios.get(
//       `${import.meta.env.VITE_APP}/auth/check-auth`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Cache-Control':
//             'no-store, no-cache, must-revalidate, proxy-revalidate',
//         },
//       }
//     )

//     return data
//   }
// )

export const logoutUser = createAsyncThunk(
  '/auth/logout',

  async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_APP}/auth/logout`,
      {},
      {
        withCredentials: true,
      }
    )

    return response.data
  }
)

const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    setUser: (state, action) => {},
    resetTokenAndCredentials: (state) => {
      // if we have don't any issues with hosting, use this code fix
      state.isAuthenticated = false
      state.user = null
      state.token = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false
        state.user = null
        state.isAuthenticated = false
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false
        state.user = null
        state.isAuthenticated = false
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.success ? action.payload.user : null
        state.isAuthenticated = action.payload.success
        // if we have don't any issues with hosting, use this code fix
        // state.token = action.payload.token
        // sessionStorage.setItem('token', JSON.stringify(action.payload.token))
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false
        state.user = null
        state.isAuthenticated = false
        state.token = null
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.success ? action.payload.user : null
        state.isAuthenticated = action.payload.success
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false
        state.user = null
        state.isAuthenticated = false
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false
        state.user = null
        state.isAuthenticated = false
      })
  },
})

export const { setUser, resetTokenAndCredentials } = authSlice.actions
export default authSlice.reducer
