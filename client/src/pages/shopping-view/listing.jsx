import { ArrowUpDownIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import ProductFilter from '@/components/shopping-view/filter'
import ShoppingProductTile from '@/components/shopping-view/product-tile'
import ProductDetailsDialog from '@/components/shopping-view/product-details'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import { sortOptions } from '@/config'
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from '@/store/shop/product-slice'
import { useSearchParams } from 'react-router-dom'
import { addToCart } from '@/store/shop/cart-slice'

function createSearchParamsHelper(filterParams) {
  const queryParams = []

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(',')

      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`)
    }
  }

  return queryParams.join('&')
}

export default function ShoppingListing() {
  const dispatch = useDispatch()
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  )
  const { user } = useSelector((state) => state.auth)
  const { toast } = useToast()
  const { cartItems, fetchCartItems } = useSelector((state) => state.shopCart)

  //handle sort and filters
  const [filters, setFilters] = useState({})
  const [sort, setSort] = useState(null)
  //write code to display sort and filter options as param links
  const [searchParams, setSearchParams] = useSearchParams()
  const categorySearchParam = searchParams.get('category')

  //handle Sorting
  function handleSort(value) {
    console.log(value)
    setSort(value)
  }

  //handle filter
  function handleFilter(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters }
    //check if the current index of filter(category or brand) is present or not.
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId)
    // check if no filter is added(meaning its -1) in that category or brand
    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption],
      }
      console.log(cpyFilters)
    } else {
      //makes sure when you add another category it adds up wih the one before
      const indexOfCurrentOption =
        cpyFilters[getSectionId].indexOf(getCurrentOption)

      //if this is not present i.e if == -1
      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption)
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1)
    }

    setFilters(cpyFilters)
    //we extract the data anytime we refresh page
    sessionStorage.setItem('filters', JSON.stringify(cpyFilters))
  }

  //handle getProductId on popup
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

  //on page load we extract the sort and filters from session storage
  useEffect(() => {
    //set price-lowtohigh as default value on payload
    setSort('price-lowtohigh')
    setFilters(JSON.parse(sessionStorage.getItem('filters')) || {})
  }, [categorySearchParam])

  //if filter is selected on render create a filterquerystring
  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters)
      setSearchParams(new URLSearchParams(createQueryString))
    }
  }, [filters])

  useEffect(() => {
    if (filters !== null && sort !== null)
      dispatch(
        fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
      )
  }, [dispatch, sort, filters])

  //once there is a productDetail, set the dialog box as true
  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true)
  }, [productDetails])

  return (
    <div className='grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6'>
      <ProductFilter filters={filters} handleFilter={handleFilter} />
      <div className='bg-background w-full rounded-lg shadow-sm'>
        <div className='p-4 border-b flex items-center justify-between'>
          <h2 className='text-lg font-extrabold'>All Products</h2>
          <div className='flex items-center gap-3'>
            <span className='text-muted-foreground'>
              {productList?.length} Products
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='outline'
                  size='sm'
                  className='flex items-center gap-1'
                >
                  <ArrowUpDownIcon className='h-4 w-4' />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-[200px]'>
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4'>
          {productList && productList.length > 0
            ? productList.map((productItem) => (
                <ShoppingProductTile
                  handleGetProductDetails={handleGetProductDetails}
                  product={productItem}
                  handleAddtoCart={handleAddtoCart}
                />
              ))
            : null}
        </div>
      </div>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  )
}
