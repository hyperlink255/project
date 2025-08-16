import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import IMG from '../assets/profile_img_2.png'
import { ChevronDown } from 'lucide-react';
import { SquareMenu } from 'lucide-react';  
import SignIn from '../pages/SignIn'
import { AppContext } from '../context/AppContext';
const Navbar = () => {
  const {toggle,setToggle,user,token,setToken,setUser} = useContext(AppContext)
  const [model,setModel] = useState(false)
  const useFixed = useRef(null)
 
  useEffect(() => {
    function scrollFixed(){
      if(useFixed.current){
        if(document.body.scrollTop > 80 || document.documentElement.scrollTop > 80){
          useFixed.current.classList.add('active')
        }else{
           useFixed.current.classList.remove('active')
        }
      }
    }
    window.addEventListener('scroll',scrollFixed)
    return () => window.removeEventListener('scroll',scrollFixed)
  },[])

  
  const handleLogout = () => {
    setUser(null)
    setToggle(true)
    setToken(null)
    
  }
  
  return (
    <div className='bg-white w-full' ref={useFixed}>
       <div className='max-w-6xl mx-auto md:py-0 py-4 px-8'>
        <nav className='flex items-center justify-between'>
        <h2 className='text-3xl font-semibold'>Events</h2>
       <button className='md:hidden flex text-3xl cursor-pointer'>
            <SquareMenu />
       </button>
      <div className="md:flex hidden">
        <ul className="flex items-center gap-5 ">
          <li className='text-sm font-[600] menu-item'>
            <Link to="/">Home</Link>
          </li>
            <li className='text-sm font-[600] menu-item'>
            <Link to="/booking">Booking</Link>
          </li>
          <li className='text-sm font-[600] menu-item'>
            <Link to="/events">Events</Link>
          </li>
          <li className='text-sm font-[600] flex items-center cursor-pointer gap-2 menu-item'>
            <Link to="/checkout">Checkout</Link>
          </li>
          {
            user && 
          <li onClick={() => setModel(!model)} className='flex items-center cursor-pointer relative gap-2 menu-item'>
            <img  src={`http://localhost:5000${user.image}`}  className={`w-10 h-10 rounded-full ${model ? 'border-green-300' : 'border-gray-300/100'} border-3  border-gray-300/100`} alt="" />
             <ChevronDown  className='w-[15px]'/>
             <div className={`absolute top-[100%] ${model ? 'block' : 'hidden'} right-0  bg-white shadow-lg  w-80 group-hover:block`}>
               <ul className='py-2'>
                
                <li>
                  <div className='text-center border-b border-gray-300 pb-3 '>
                  <img src={`http://localhost:5000${user.image}`} className='w-15 h-15 rounded-full border-3 m-auto  border-gray-300/100' alt="" />
                     <div className='mt-2'>
                      <h4>{user.name}</h4>
                      <p>{user.email}</p>
                    </div>
                  
                  </div>
                </li>
                
                 <li className='px-4 py-2 text-sm hover:bg-blue-600'>
                   <Link>Profile</Link>
                 </li>
                 <li className='px-4 py-2 text-sm hover:bg-blue-600'>
                   <Link>Settings</Link>
                 </li>
                 <li onClick={handleLogout} className='px-4 py-2 text-sm hover:bg-blue-600'>
                   <Link >Logout</Link>
                 </li>
               </ul>
             </div>
          </li>
          }
          <li className='text-sm font-[600] menu-item'>
              <button onClick={() => setToggle(true)} className='bg-[#7AD254] px-5 py-2 text-white rounded cursor-pointer'>
                 SignIn
              </button>
          </li>
        </ul>
      </div>
        </nav>
      </div>
      {toggle && <SignIn/>}
    </div>
  
  )
}

export default Navbar