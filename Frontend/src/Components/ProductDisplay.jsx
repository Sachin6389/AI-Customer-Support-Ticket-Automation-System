import React, { useContext } from 'react'

import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
function ProductDisplay({id,image,name,price,company} ) {
    const currency= useSelector((state) => state.product.currency);
    
    
   
   
    return (
        <div className='cursor-pointer bg-cream p-3 rounded-lg shadow hover:shadow-lg duration-200 px-4 py-3'>
        <Link className='text-gray-500 cursor-pointer' to={`/product/${id}`}>
        <div className='overflow-hidden rounded-lg shadow-md h-48 flex justify-center items-center'>  
            <img className='hover:scale-110 transition ease-in-out' src={image} alt="" /></div>
        <p className='pt-3 pb-1  text-sm text-gray-800'> {name}</p>
        <p className=' text-sm font-medium text-gray-800'>{currency}{price}</p>
        <p className=' text-sm font-medium text-gray-800'>{company}</p>
        </Link>
        </div>
        
        
        
        
        
        
        
        
        
        
        
        
        



    )
}

export default ProductDisplay
 