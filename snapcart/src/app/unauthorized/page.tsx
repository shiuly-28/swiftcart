import React from 'react'

function page() {
  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
      <h1 className='text-red-600 text-2xl font-semibold'>Access Denied 🚫 </h1>
      <p className='mt-2 text-gray-700'>You cannot access this page.</p>
    </div>
  )
}

export default page
