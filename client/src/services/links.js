import { MdDashboard,MdEvent,MdReviews } from "react-icons/md";
import { TbBrandBooking } from "react-icons/tb";
import { IoIosCreate } from "react-icons/io";
import { FaRegEdit,FaUser } from "react-icons/fa";

{/* USER */}
export const LINKS1 = [
     {name : "Dashboard",path:'/dashboard/user', icon:MdDashboard},
     {name : "Bookings",path:'/dashboard/user/bookings', icon:TbBrandBooking},
     {name : "Reviews",path:'/dashboard/user/reviews', icon:MdReviews},
]
{/* ORGANIZER */}

export const LINKS2 = [
   {name:"Dashboard",path:'/dashboard/organizer',icon:MdDashboard},
    {name:"My Event",path:'/dashboard/organizer/my-events',icon:MdEvent},
    {name:"Create Event",path:'/dashboard/organizer/create-event',icon:IoIosCreate},
    {name : "Edit Event",path:'/dashboard/organizer/edit-event/:id',icon:FaRegEdit},
    {name:"Booking",path:'/dashboard/organizer/event-bookings/:id',icon:TbBrandBooking}
]

{/* ADMIN */}
export const LINKS3 = [
    {name:"Dashboard",path:'/dashboard/admin',icon:MdDashboard },
    {name:"Event",path:'/dashboard/admin/all-events',icon:MdEvent},
    {name : "Booking",path:'/dashboard/admin/all-bookings',icon:TbBrandBooking},
    {name:"Booking",path:'/dashboard/admin/manage-users',icon:FaUser}
]

