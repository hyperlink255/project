import React from 'react'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <div className='bg-[#D0EFF4] flex items-center text-center  justify-center h-[400px] w-full'>
         <div className='w-[600px] m-auto'>
            <h1 className='md:text-3xl font-semibold text-center text-2xl'>The Easiest and Most Powerful Online Event Booking and Ticketing System</h1>
            <p className='md:text-[19px] text-[16px] text-center mt-5'>Barren is an all-in-one event ticketing platform for event organisers, promoters, and managers. Easily create, promote and manage your events of any type and size.</p>
            <button className='bg-[#7AD254] py-2 px-5 w-[180px] mx-auto h-[50px] d-block text-white  mt-5 rounded'>
                   <Link to="/events">Create Event</Link>
            </button>
         </div>
    </div>
  )
}

export default Hero