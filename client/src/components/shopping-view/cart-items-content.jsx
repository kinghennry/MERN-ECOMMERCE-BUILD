import { Minus, Plus, Trash } from 'lucide-react'
import { Button } from '../ui/button'
import { useDispatch, useSelector } from 'react-redux'
import { deleteCartItem, updateCartQuantity } from '@/store/shop/cart-slice'
import { useToast } from '@/hooks/use-toast'

export default function UserCartItemsContent({ cartItem }) {
  const { user } = useSelector((state) => state.auth)
  const { cartItems } = useSelector((state) => state.shopCart)
  const { productList } = useSelector((state) => state.shopProducts)
  const dispatch = useDispatch()
  const { toast } = useToast()

  //updateCartQuantity
  function handleUpdateQuantity(getCartItem, typeOfAction) {
    //code to disable increase cart when totalStock is 0
    if (typeOfAction == 'plus') {
      let getCartItems = cartItems.items || []

      //find id of the currentCart
      if (getCartItems.length) {
        const indexOfCurrentCartItem = getCartItems.findIndex(
          (item) => item.productId === getCartItem?.productId
        )
        //get currentProductInDex too
        const getCurrentProductIndex = productList.findIndex(
          (product) => product._id === getCartItem?.productId
        )
        //get totalStock
        const getTotalStock = productList[getCurrentProductIndex].totalStock

        //if this item is already added to cart
        if (indexOfCurrentCartItem > -1) {
          const getQuantity = getCartItems[indexOfCurrentCartItem].quantity
          //if quantity is > than totalStock return this error
          if (getQuantity + 1 > getTotalStock) {
            toast({
              title: `Only ${getQuantity} quantity can be added for this item`,
              variant: 'destructive',
            })

            return
          }
        }
      }
    }
    dispatch(
      updateCartQuantity({
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity:
          typeOfAction === 'plus'
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: 'Cart item is updated successfully',
        })
      }
    })
  }

  //deleteCart
  function handleCartItemDelete(getCartItem) {
    dispatch(
      deleteCartItem({
        userId: user?.id,
        productId: getCartItem?.productId,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: 'Cart item is deleted successfully',
        })
      }
    })
  }

  return (
    <div className='flex items-center space-x-4' key={cartItem?.id}>
      <img
        src={cartItem?.image}
        alt={cartItem?.title}
        className='w-20 h-20 rounded object-cover'
      />
      <div className='flex-1'>
        <h3 className='font-extrabold'>{cartItem?.title}</h3>
        <div className='flex items-center gap-2 mt-1'>
          <Button
            variant='outline'
            className='h-8 w-8 rounded-full'
            size='icon'
            disabled={cartItem?.quantity === 1}
            onClick={() => handleUpdateQuantity(cartItem, 'minus')}
          >
            <Minus className='w-4 h-4' />
            <span className='sr-only'>Decrease</span>
          </Button>
          <span className='font-semibold'>{cartItem?.quantity}</span>
          <Button
            variant='outline'
            className='h-8 w-8 rounded-full'
            size='icon'
            onClick={() => handleUpdateQuantity(cartItem, 'plus')}
          >
            <Plus className='w-4 h-4' />
            <span className='sr-only'>Decrease</span>
          </Button>
        </div>
      </div>
      <div className='flex flex-col items-end'>
        <p className='font-semibold'>
          $
          {(
            (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
            cartItem?.quantity
          ).toFixed(2)}
        </p>
        <Trash
          onClick={() => handleCartItemDelete(cartItem)}
          className='cursor-pointer mt-1'
          size={20}
        />
      </div>
    </div>
  )
}
