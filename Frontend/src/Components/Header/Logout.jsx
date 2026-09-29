import React from 'react'
import { useDispatch } from 'react-redux'
import { logout } from '../../Storage/User.js'
import { clearCart } from '../../Storage/Product.js'


function Logout() {
  const dispatch = useDispatch()
  const handleLogout = () => {
    dispatch(logout())
    dispatch(clearCart())
    
  }

    return (
        <button className='px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-200'
        onClick={handleLogout}
        >Logout</button>
    )
}

export default Logout