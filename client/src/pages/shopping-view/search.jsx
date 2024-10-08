import ProductDetailsDialog from '@/components/shopping-view/product-details'
import ShoppingProductTile from '@/components/shopping-view/product-tile'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { getSearchResults, resetSearchResults } from '@/store/shop/search-slice'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductDetails } from '@/store/shop/product-slice'
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice'
import { useSearchParams } from 'react-router-dom'

export default function SearchProducts() {
  const [keyword, setKeyword] = useState('')
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const dispatch = useDispatch()

  //Get Selectors
  const { searchResults } = useSelector((state) => state.shopSearch)
  const { productDetails } = useSelector((state) => state.shopProducts)
  const { user } = useSelector((state) => state.auth)
  const { cartItems } = useSelector((state) => state.shopCart)
  const { toast } = useToast()

  //bring back some reusable code like productDetailsPopup,handleAddToCart
  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId))
  }

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    console.log(cartItems)
    let getCartItems = cartItems.items || []

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      )
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: 'destructive',
          })

          return
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id))
        toast({
          title: 'Product is added to cart',
        })
      }
    })
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true)
  }, [productDetails])

  //we are basically rendering already created pages here, so we simply use this
  useEffect(() => {
    //if keyword is trimmed and more than 3
    if (keyword && keyword.trim() !== '' && keyword.trim().length > 3) {
      setTimeout(() => {
        //set searchParams and this new keyword
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`))
        dispatch(getSearchResults(keyword))
      }, 1000)
    } else {
      // set it as the keyword from data and reset the input search
      setSearchParams(new URLSearchParams(`?keyword=${keyword}`))
      dispatch(resetSearchResults())
    }
  }, [keyword])

  console.log(searchResults, 'searchResults')

  return (
    <div className='container mx-auto md:px-6 px-4 py-8'>
      <div className='flex justify-center mb-8'>
        <div className='w-full flex items-center'>
          <Input
            value={keyword}
            name='keyword'
            onChange={(event) => setKeyword(event.target.value)}
            className='py-6'
            placeholder='Search Products...'
          />
        </div>
      </div>
      {!searchResults.length ? (
        <h1 className='text-5xl font-extrabold'>No result found!</h1>
      ) : null}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
        {searchResults &&
          searchResults.map((item) => (
            <ShoppingProductTile
              handleAddtoCart={handleAddtoCart}
              product={item}
              handleGetProductDetails={handleGetProductDetails}
            />
          ))}
      </div>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  )
}
