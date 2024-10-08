const paypal = require('paypal-rest-sdk')

//configure paypal
paypal.configure({
  mode: 'sandbox',
  client_id: process.env.PAYPAL_CLIENT,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
})

module.exports = paypal
