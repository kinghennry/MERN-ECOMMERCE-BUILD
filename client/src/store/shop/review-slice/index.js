import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  isLoading: false,
  reviews: [],
}

export const addReview = createAsyncThunk(
  '/order/addReview',
  async (formdata) => {
    const { data } = await axios.post(
      `${import.meta.env.VITE_APP}/shop/review/add`,
      formdata
    )

    return data
  }
)

export const getReviews = createAsyncThunk('/order/getReviews', async (id) => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_APP}/shop/review/${id}`
  )

  return data
})

const reviewSlice = createSlice({
  name: 'reviewSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false
        state.reviews = action.payload.data
      })
      .addCase(getReviews.rejected, (state, action) => {
        console.log(action.payload)
        state.isLoading = false
        state.reviews = []
      })
  },
})

export default reviewSlice.reducer
