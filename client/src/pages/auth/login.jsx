import { Link } from 'react-router-dom'
import { loginFormControls } from '@/config'
import CommonForm from '@/components/common/form'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { loginUser } from '@/store/auth-slice'
import { useDispatch } from 'react-redux'

const initialState = {
  email: '',
  password: '',
}

export default function AuthLogin() {
  const [formData, setFormData] = useState(initialState)
  const { toast } = useToast()
  const dispatch = useDispatch()
  const onSubmit = (e) => {
    e.preventDefault()
    dispatch(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        })
      } else {
        toast({
          title: data?.payload?.message,
          variant: 'destructive',
        })
      }
    })
  }

  //insane code to check if formData is valid for all inputs
  function isFormValid() {
    return Object.keys(formData)
      .map((key) => formData[key] !== '')
      .every((item) => item)
  }
  return (
    <div className='mx-auto w-full max-w-md space-y-6'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold tracking-tight text-foreground'>
          Sign in to your account
        </h1>
        <p className='mt-2'>
          Don't have an account
          <Link
            className='font-medium ml-2 text-primary hover:underline'
            to='/auth/register'
          >
            Register
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText={'Sign In'}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  )
}
