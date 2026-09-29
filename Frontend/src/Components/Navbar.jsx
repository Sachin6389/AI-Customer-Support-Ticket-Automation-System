import React from 'react'
import { Assest } from '../assets/Assest'

function Navbar({settoken}) {
  return (
    <div className="flex justify-between items-center bg-white shadow-md px-6 py-3 sm:px-1.5">
      {/* Logo */}
      <img 
        src={Assest.logo} 
        alt="Logo" 
        className="h-16 w-auto cursor-pointer hover:scale-105 transition-transform duration-200" 
      />
      <h1 className='lg:text-7xl  sm:text-2xl  md:text-4xlfont-bold '>Himanshu Computer Services</h1>

      {/* Logout Button */}
      <button  onClick = {()=>settoken("")}className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 active:scale-95 transition">
        Logout
      </button>
    </div>
  )
}

export default Navbar