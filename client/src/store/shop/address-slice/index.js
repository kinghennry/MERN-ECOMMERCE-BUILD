import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  isLoading: false,
  addressList: [],
}

//addNewAddress
export const addNewAddress = createAsyncThunk(
  '/addresses/addNewAddress',
  async (formData) => {
    const { data } = await axios.post(
      `${import.meta.env.VITE_APP}/shop/address/add`,
      formData
    )

    return data
  }
)

//fetch address
export const fetchAllAddresses = createAsyncThunk(
  '/addresses/fetchAllAddresses',
  async (userId) => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_APP}/shop/address/get/${userId}`
    )

    return data
  }
)

//edit address
export const editAddress = createAsyncThunk(
  '/addresses/editAddress',
  async ({ userId, addressId, formData }) => {
    const { data } = await axios.put(
      `${import.meta.env.VITE_APP}/shop/address/update/${userId}/${addressId}`,
      formData
    )

    return data
  }
)

//deleteAddress
export const deleteAddress = createAsyncThunk(
  '/addresses/deleteAddress',
  async ({ userId, addressId }) => {
    const { data } = await axios.delete(
      `${import.meta.env.VITE_APP}/shop/address/delete/${userId}/${addressId}`
    )

    return data
  }
)

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addNewAddress.pending, (state) => {
        state.isLoading = true
      })
      .addCase(addNewAddress.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(addNewAddress.rejected, (state) => {
        state.isLoading = false
      })
      .addCase(fetchAllAddresses.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchAllAddresses.fulfilled, (state, action) => {
        state.isLoading = false
        state.addressList = action.payload.data
      })
      .addCase(fetchAllAddresses.rejected, (state) => {
        state.isLoading = false
        state.addressList = []
      })
  },
})

export default addressSlice.reducer
