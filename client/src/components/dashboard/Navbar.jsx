import React from 'react'
import { Link } from 'react-router-dom'
import IMG from '../../assets/profile_img_1.png'
const Navbar = () => {

  return (
    <div className='flex items-center justify-between px-4 md:px-8 border-b border-gray-500 py-3'>
      <Link to="/">
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      </Link>
      <div className='flex gap-3 items-center'>
        <p>Hi! </p>
        <img className='w-[40px] h-[40px] object-cover rounded-full' src={IMG}/>
      </div>
    </div>
  )
}

export default Navbar