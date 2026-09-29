import React from 'react'
import { assets } from '../assets/Assets.js'

function Logo() {
    return (
        <div className='cursor-pointer w-20 '>
        <img className='w-full rounded-full' src={assets.logo} alt="" />
      </div>)
}

export default Logo