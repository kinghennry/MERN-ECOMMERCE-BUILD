import { useState } from 'react'
import CommonForm from '@/components/common/form'
import { registerFormControls } from '@/config'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import { registerUser } from '@/store/auth-slice'
import { useDispatch } from 'react-redux'

export default function AuthRegister() {
  const initialState = {
    userName: '',
    email: '',
    password: '',
  }

  const [formData, setFormData] = useState(initialState)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { toast } = useToast()
  const onSubmit = (e) => {
    e.preventDefault()
    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: data?.payload?.message,
        })
        navigate('/auth')
      } else {
        toast({
          title: data?.payload?.message,
          variant: 'destructive',
        })
      }
    })
  }
  return (
    <div className='mx-auto w-full max-w-md space-y-6'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold tracking-tight text-foreground'>
          Create new account
        </h1>
        <p className='mt-2'>
          Already have an account
          <Link
            className='font-medium ml-2 text-primary hover:underline'
            to='/auth/login'
          >
            Login
          </Link>
        </p>
      </div>
      <CommonForm
        formData={formData}
        setFormData={setFormData}
        formControls={registerFormControls}
        buttonText={'Sign Up'}
        onSubmit={onSubmit}
      />
    </div>
  )
}
