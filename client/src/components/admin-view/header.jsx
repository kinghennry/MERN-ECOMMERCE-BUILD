import { AlignJustify, LogOut } from 'lucide-react'
import { Button } from '../ui/button'
import { useDispatch } from 'react-redux'
import { logoutUser } from '@/store/auth-slice'

export default function AdminHeader({ setOpen }) {
  const dispatch = useDispatch()

  function handleLogout() {
    dispatch(logoutUser())
  }
  return (
    <header className='flex justify-between items-center px-4 py-3 bg-background border-b'>
      <Button className='lg:hidden sm:block' onClick={() => setOpen(true)}>
        <AlignJustify />
        <span className='sr-only'>Toggle Menu</span>
      </Button>
      <div className='flex flex-1 justify-end'>
        <Button
          onClick={handleLogout}
          className='gap-2 items-center rounded-md  px-4 py-2 text-sm font-medium shadow inline-flex'
        >
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  )
}
