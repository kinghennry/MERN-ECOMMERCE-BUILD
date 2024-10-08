// import dependencies
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')

//import routes
const authRouter = require('./routes/auth/auth-routes')
const adminProductsRouter = require('./routes/admin/product-routes')
const shopProductsRouter = require('./routes/shop/products-routes')
const adminOrderRouter = require('./routes/admin/order-routes')
const shopCartRouter = require('./routes/shop/cart-routes')
const shopAddressRouter = require('./routes/shop/address-routes')
const shopOrderRouter = require('./routes/shop/order-routes')
const shopSearchRouter = require('./routes/shop/search-routes')
const shopReviewRouter = require('./routes/shop/review-routes')
const commonFeatureRouter = require('./routes/common/feature-routes')

// you can also create a separate file for this and import the file here
const app = express()

// dotenv config
dotenv.config()

//create a database connection -> u can also
//create a separate file for this and then import/use that file here

mongoose
  .connect(process.env.MONGO)
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.log(error))

//important configuration in cors
app.use(
  cors({
    origin: process.env.CLIENT_BASE_URL,
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Cache-Control',
      'Expires',
      'Pragma',
    ],
    credentials: true,
  })
)
const PORT = process.env.PORT || 5000

// cookie parsers & express
app.use(cookieParser())
app.use(express.json())

//call all routes
app.use('/api/auth', authRouter)
app.use('/api/admin/products', adminProductsRouter)
app.use('/api/shop/products', shopProductsRouter)
app.use('/api/admin/orders', adminOrderRouter)
app.use('/api/shop/address', shopAddressRouter)
app.use('/api/shop/cart', shopCartRouter)
app.use('/api/shop/order', shopOrderRouter)
app.use('/api/shop/search', shopSearchRouter)
app.use('/api/shop/review', shopReviewRouter)
app.use('/api/common/feature', commonFeatureRouter)

app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`))
