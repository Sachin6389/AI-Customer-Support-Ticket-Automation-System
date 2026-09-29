import React from 'react'

function CommonButton({children,
     type='button',
     bgColor='bg-blue-600',
     textcolor='text-white',
     classname='',
     ...props
}) {
    return (
        <button className={`px-4 py-2 rounded-lg ${bgColor} ${textcolor} ${classname}`}{...props}>{children}</button>
    )
}

export default CommonButton