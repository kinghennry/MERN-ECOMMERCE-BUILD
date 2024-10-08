import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  isLoading: false,
  orderList: [],
  approvalURL: null,
  orderDetails: null,
  orderId: null,
}

export const createNewOrder = createAsyncThunk(
  '/order/createNewOrder',
  async (orderData) => {
    const { data } = await axios.post(
      `${import.meta.env.VITE_APP}/shop/order/create`,
      orderData
    )

    return data
  }
)

export const getOrderDetails = createAsyncThunk(
  '/order/getOrderDetails',

  async (id) => {
    const response = await axios.get(
      `${import.meta.env.VITE_APP}/shop/order/details/${id}`
    )

    return response.data
  }
)

export const capturePayment = createAsyncThunk(
  '/order/capturePayment',
  async ({ paymentId, payerId, orderId }) => {
    const { data } = await axios.post(
      `${import.meta.env.VITE_APP}/shop/order/capture`,
      {
        paymentId,
        payerId,
        orderId,
      }
    )

    return data
  }
)

export const getAllOrdersByUserId = createAsyncThunk(
  '/order/getAllOrdersByUserId',
  async (userId) => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_APP}/shop/order/list/${userId}`
    )

    return data
  }
)

const shoppingOrderSlice = createSlice({
  name: 'shoppingOrderSlice',
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false
        state.orderDetails = action.payload.data
      })
      .addCase(getOrderDetails.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(getAllOrdersByUserId.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
        state.isLoading = false
        state.orderList = action.payload.data
      })
      .addCase(getAllOrdersByUserId.rejected, (state) => {
        state.isLoading = false
        state.orderList = []
      })
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false
        state.approvalURL = action.payload.approvalURL
        state.orderId = action.payload.orderId
        sessionStorage.setItem(
          'currentOrderId',
          JSON.stringify(action.payload.orderId)
        )
      })
      .addCase(createNewOrder.rejected, (state) => {
        state.isLoading = false
        state.approvalURL = null
        state.orderId = null
      })
  },
})
export const { resetOrderDetails } = shoppingOrderSlice.actions

export default shoppingOrderSlice.reducer
