import React from 'react'
import Navbar from '../../../components/dashboard/Navbar'
import Footer from '../../../components/dashboard/Footer'
import Sidebar from '../../../components/dashboard/SideMenu'
import { Outlet } from 'react-router-dom'

const OrganizerDashboard = () => {
  return (
    <div className='text-default min-h-screen bg-white'>
      <Navbar/>
      <div className='flex'>
        <Sidebar/>
        <div className='flex-1 '>
        {<Outlet/>}
        </div>
      </div>
      <Footer/>
    </div>

  )
}

export default OrganizerDashboard