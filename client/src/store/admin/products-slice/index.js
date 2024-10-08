import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  isLoading: false,
  productList: [],
}

//addProducts
export const addProducts = createAsyncThunk(
  'products/addProducts',
  async (formData) => {
    const { data } = await axios.post(
      `${import.meta.env.VITE_APP}/admin/products/add`,
      formData,
      { headers: { 'Content-Type': 'application/json' } }
    )
    return data
  }
)
//fetch all products
export const fetchAllProducts = createAsyncThunk(
  '/products/fetchAllProducts',
  async () => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_APP}/admin/products/get`
    )
    return data
  }
)

//delete product
export const deleteProduct = createAsyncThunk(
  '/products/deleteProduct',
  async (id) => {
    const result = await axios.delete(
      `${import.meta.env.VITE_APP}/admin/products/delete/${id}`
    )
    return result?.data
  }
)

//edit product
export const editProduct = createAsyncThunk(
  '/products/editProduct',
  async ({ id, formData }) => {
    const result = await axios.put(
      `${import.meta.env.VITE_APP}/admin/products/edit/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    return result?.data
  }
)

const AdminProductsSlice = createSlice({
  name: 'adminProduct',
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false
        state.productList = action.payload.data
      })
      .addCase(fetchAllProducts.rejected, (state) => {
        state.isLoading = false
        state.productList = []
      }),
})

export default AdminProductsSlice.reducer
