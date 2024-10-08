const Cart = require('../../models/Cart')
const Product = require('../../models/Product')

// create all the methods
const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body

    //check if the details don't match!
    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data provided!',
      })
    }

    const product = await Product.findById(productId)

    //if there is no product
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    let cart = await Cart.findOne({ userId })

    //if there is no cart then create a new one
    if (!cart) {
      cart = new Cart({ userId, items: [] })
    }

    //find current product
    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    )

    if (findCurrentProductIndex === -1) {
      //if theres is no item, add the first one to cart
      cart.items.push({ productId, quantity })
    } else {
      //if cart is present, increase the quantity
      cart.items[findCurrentProductIndex].quantity += quantity
    }

    await cart.save()
    res.status(200).json({
      success: true,
      data: cart,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: 'Error',
    })
  }
}

const fetchCartItems = async (req, res) => {
  try {
    //get the userID we are fetching the cart items
    const { userId } = req.params

    // if userId is absent
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User id is manadatory!',
      })
    }
    //populate does two things, get the productInfo based on productId, and the data u need from that product
    const cart = await Cart.findOne({ userId }).populate({
      path: 'items.productId',
      select: 'image title price salePrice',
    })

    //if there is no cart
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found!',
      })
    }

    //valid items(check if the product item you clicked has not yet been deleted by admin)
    const validItems = cart.items.filter((productItem) => productItem.productId)

    if (validItems.length < cart.items.length) {
      cart.items = validItems
      await cart.save()
    }

    //uploadCartItems

    const populateCartItems = validItems.map((item) => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
    }))

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: 'Error',
    })
  }
}

const updateCartItemQty = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body

    //check if the details don't match!
    if (!userId || !productId || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data provided!',
      })
    }

    //find cart and check if its not present
    const cart = await Cart.findOne({ userId })
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found!',
      })
    }

    //get currentItemPresent & if there is not currentItemPresent

    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    )

    if (findCurrentProductIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not present !',
      })
    }

    //if all is good,then update cartItem
    cart.items[findCurrentProductIndex].quantity = quantity
    await cart.save()

    await cart.populate({
      path: 'items.productId',
      select: 'image title price salePrice',
    })

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : 'Product not found',
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }))

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: 'Error',
    })
  }
}

const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params
    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data provided!',
      })
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: 'items.productId',
      select: 'image title price salePrice',
    })

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found!',
      })
    }

    cart.items = cart.items.filter(
      (item) => item.productId._id.toString() !== productId
    )

    await cart.save()

    await cart.populate({
      path: 'items.productId',
      select: 'image title price salePrice',
    })

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : 'Product not found',
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }))

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: 'Error',
    })
  }
}

module.exports = {
  addToCart,
  updateCartItemQty,
  deleteCartItem,
  fetchCartItems,
}
