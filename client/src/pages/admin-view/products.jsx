import { Fragment, useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { addProductFormElements } from '@/config'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import CommonForm from '@/components/common/form'
import AdminProductTile from '@/components/admin-view/product-tile'
import ProductImageUpload from '@/components/admin-view/image-upload'
import {
  addProducts,
  deleteProduct,
  editProduct,
  fetchAllProducts,
} from '@/store/admin/products-slice'
import { useDispatch, useSelector } from 'react-redux'

const initialFormData = {
  image: null,
  title: '',
  description: '',
  category: '',
  brand: '',
  price: '',
  salePrice: '',
  totalStock: '',
  // averageReview: 0,
}

export default function AdminProducts() {
  // state for productDialogModal
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false)
  const [currentEditedId, setCurrentEditedId] = useState(null)
  const [formData, setFormData] = useState(initialFormData)
  const [imageLoadingState, setImageLoadingState] = useState(false)

  //image file & uploadedImageUrl from cloudinary
  const [imageFile, setImageFile] = useState(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState('')
  const { toast } = useToast()
  const { productList } = useSelector((state) => state.adminProducts)
  const dispatch = useDispatch()

  //delete and then display all remaining products
  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts())
      }
    })
  }

  //insane code to check if formData is valid for all inputs
  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key] !== '')
      .every((item) => item)
  }

  //submitForm
  function onSubmit(e) {
    e.preventDefault()
    // check if edit is valid

    currentEditedId !== null
      ? dispatch(
          editProduct({
            id: currentEditedId,
            formData,
          })
        ).then((data) => {
          console.log(data)
          if (data?.payload?.success) {
            dispatch(fetchAllProducts())
            setFormData(initialFormData)
            setOpenCreateProductsDialog(false)
            setCurrentEditedId(null)
            toast({
              title: 'Product edited!',
            })
          }
        })
      : dispatch(
          addProducts({
            ...formData,
            image: uploadedImageUrl,
          })
        ).then((data) => {
          console.log(data)
          if (data?.payload?.success) {
            dispatch(fetchAllProducts())
            setImageFile(null)
            setFormData(initialFormData)
            setOpenCreateProductsDialog(false)
            toast({
              title: 'Product added!',
            })
          }
        })
  }

  useEffect(() => {
    dispatch(fetchAllProducts())
  }, [dispatch])

  console.log(productList, 'productList')
  return (
    <Fragment>
      <div className='mb-5 w-full flex justify-end'>
        <Button onClick={() => setOpenCreateProductsDialog(true)}>
          Add New Product
        </Button>
      </div>
      <div className='grid gap-4 md:grid-cols-3 lg:grid-cols-4'>
        {productList && productList.length > 0
          ? productList.map((productItem) => (
              <AdminProductTile
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setCurrentEditedId={setCurrentEditedId}
                product={productItem}
                key={productItem?._id}
                handleDelete={handleDelete}
              />
            ))
          : null}
      </div>
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false)
          setFormData(initialFormData)
        }}
      >
        <SheetContent side='right' className='overflow-auto'>
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? 'Edit Product' : 'Add New Product'}
            </SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />
          <div className='py-6'>
            <CommonForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={onSubmit}
              formControls={addProductFormElements}
              buttonText={currentEditedId !== null ? 'Edit' : 'Add'}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  )
}
