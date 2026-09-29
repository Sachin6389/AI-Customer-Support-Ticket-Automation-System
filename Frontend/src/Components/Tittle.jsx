import React from 'react'

function Tittle({text1,text2}) {
    return (
        <div className='inline-flex gap-2 mb-2 items-center'>
        <p className='text-black-500 font-medium'>{text1}
        <span className='text-black-500 font-medium px-2' >{text2}</span></p>
        <p className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-900'></p>
        </div>
    )
}

export default Tittle