import React from 'react'

const Notification = ({message}) => {
  return (
    <div className='w-full h-20 bg-gray-400 mb-3 flex items-center justify-center'>
      <p className='text-xl text-center font-bold'>{message}</p>
    </div>
  )
}

export default Notification
