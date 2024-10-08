import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  isLoading: false,
  cartItems: [],
}

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ userId, productId, quantity }) => {
    const response = await axios.post(
      `${import.meta.env.VITE_APP}/shop/cart/add`,
      {
        userId,
        productId,
        quantity,
      }
    )
    return response.data
  }
)

export const fetchCartItems = createAsyncThunk(
  'cart/fetchCartItems',
  async (userId) => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_APP}/shop/cart/get/${userId}`
    )

    return data
  }
)

export const deleteCartItem = createAsyncThunk(
  'cart/deleteCartItem',
  async ({ userId, productId }) => {
    const { data } = await axios.delete(
      `${import.meta.env.VITE_APP}/shop/cart/${userId}/${productId}`
    )

    return data
  }
)

export const updateCartQuantity = createAsyncThunk(
  'cart/updateCartQuantity',
  async ({ userId, productId, quantity }) => {
    const { data } = await axios.put(
      `${import.meta.env.VITE_APP}/shop/cart/update-cart`,
      {
        userId,
        productId,
        quantity,
      }
    )

    return data
  }
)

const shoppingCartSlice = createSlice({
  name: 'createSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false
        state.cartItems = action.payload.data
      })
      .addCase(addToCart.rejected, (state) => {
        state.isLoading = false
        state.cartItems = []
      })
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false
        state.cartItems = action.payload.data
      })
      .addCase(fetchCartItems.rejected, (state) => {
        state.isLoading = false
        state.cartItems = []
      })
      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false
        state.cartItems = action.payload.data
      })
      .addCase(updateCartQuantity.rejected, (state) => {
        state.isLoading = false
        state.cartItems = []
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false
        state.cartItems = action.payload.data
      })
      .addCase(deleteCartItem.rejected, (state) => {
        state.isLoading = false
        state.cartItems = []
      })
  },
})

export default shoppingCartSlice.reducer
