import { useRef, useEffect } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Skeleton } from '../ui/skeleton'
import { FileIcon, UploadCloudIcon, XIcon } from 'lucide-react'
import axios from 'axios'

export default function ProductImageUpload({
  imageFile,
  setImageFile,
  uploadedImageUrl,
  setUploadedImageUrl,
  imageLoadingState,
  setImageLoadingState,
  isEditMode,
  isCustomStyling,
}) {
  const inputRef = useRef(null)

  //handleImageFileChange
  function handleImageFileChange(e) {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setImageFile(selectedFile)
    }
  }
  //handle Drag&Drop functionality
  function handleDragOver(e) {
    e.preventDefault()
  }
  function handleDrop(e) {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) setImageFile(droppedFile)
  }
  //remove image
  function handleRemoveImage() {
    setImageFile(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  async function uploadImageToCloudinary() {
    setImageLoadingState(true)
    const data = new FormData()
    data.append('my_file', imageFile)
    const response = await axios.post(
      'http://localhost:5000/api/admin/products/upload-image',
      data
    )
    if (response?.data?.success) {
      setUploadedImageUrl(response.data.result.url)
      setImageLoadingState(false)
    }
  }

  //check if the image file is available then we have already uploaded the image
  useEffect(() => {
    if (imageFile !== null) uploadImageToCloudinary()
  }, [imageFile])

  return (
    <div className={`mt-4 ${isCustomStyling ? 'w-full' : 'max-w-md mx-auto'}`}>
      <Label className='text-lg font-semibold mb-2 block'>Upload Image</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${
          isEditMode ? 'opacity-60' : ''
        } border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          id='image-upload'
          type='file'
          className='hidden'
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode}
        />
        {/* check if user has already selected an image,then show image related info or else drag and drop */}
        {!imageFile ? (
          <Label
            htmlFor='image-upload'
            className={`${
              isEditMode ? 'cursor-not-allowed' : ''
            } flex flex-col items-center justify-center h-32 cursor-pointer`}
          >
            <UploadCloudIcon className='w-10 h-10 text-muted-foreground mb-2' />
            <span>Drag & drop or click to upload image</span>
          </Label>
        ) : imageLoadingState ? (
          <Skeleton className='h-10 bg-gray-100' />
        ) : (
          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <FileIcon className='w-8 text-primary mr-2 h-8' />
            </div>
            <p className='text-sm font-medium'>{imageFile.name}</p>
            <Button
              variant='ghost'
              size='icon'
              className='text-muted-foreground hover:text-foreground'
              onClick={handleRemoveImage}
            >
              <XIcon className='w-4 h-4' />
              <span className='sr-only'>Remove File</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
