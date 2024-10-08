import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
}

export const fetchAllFilteredProducts = createAsyncThunk(
  '/products/fetchAllProducts',
  async ({ filterParams, sortParams }) => {
    //create a query
    const query = new URLSearchParams({
      ...filterParams,
      sortBy: sortParams,
    })

    const { data } = await axios.get(
      `${import.meta.env.VITE_APP}/shop/products/get?${query}`
    )
    return data
  }
)

export const fetchProductDetails = createAsyncThunk(
  '/products/fetchProductDetails',
  async (id) => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_APP}/shop/products/get/${id}`
    )

    return data
  }
)

const shoppingProductSlice = createSlice({
  name: 'shoppingProducts',
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false
        state.productList = action.payload.data
      })
      .addCase(fetchAllFilteredProducts.rejected, (state) => {
        state.isLoading = false
        state.productList = []
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false
        state.productDetails = action.payload.data
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.isLoading = false
        state.productDetails = null
      })
  },
})

export const { setProductDetails } = shoppingProductSlice.actions

export default shoppingProductSlice.reducer
