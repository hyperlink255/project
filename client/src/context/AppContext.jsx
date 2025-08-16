import React, { createContext,useContext,useEffect,useState } from 'react'
export const AppContext = createContext(null)
import {useNavigate} from 'react-router-dom'
import { createAxiosInstance } from '../services/axiosInstance'
import toast from 'react-hot-toast'

const AppProvider = ({children}) => {
  const BACKEND_URL = import.meta.env.VITE_API_BACKEND
  const [toggle,setToggle] = useState(false)
  const [user,setUser] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null)
  const [token,setToken] = useState(localStorage.getItem('token') || null)
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page,setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1);
  const axios = createAxiosInstance(BACKEND_URL)
  const [category,setCategory] = useState('')
  const navigate = useNavigate()


  useEffect(() => {
    fetchEvents(page,category);
  }, [page,category]);

  const fetchEvents = async (page,category) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/events?page=${page}&category=${category}&limit=5`);
      setEvents(res.data.events);
      setTotalPages(res.data.totalPage)
    } catch (err) {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      let url = `/api/events/${id}`;
      if (action === "approve") url += "/approve";
      if (action === "reject") url += "/reject";
      await axios.put(url, {});
      if (action === "cancel") url += "/cancel";
      await axios.delete(url);
      toast.success(`Event ${action}d successfully`);
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  useEffect(() => {
    localStorage.setItem('user',JSON.stringify(user))
    localStorage.setItem('token',token)
  },[user,token])
  
  const value = {
    BACKEND_URL,toggle,setToggle,user,setUser,token,setToken,handleAction,
    category,setCategory,
    events,setEvents,loading,setLoading,navigate,handleAction,page,setPage,totalPages,setTotalPages,
    
  }
  return (
    <div>
      <AppContext.Provider value={value}>
        {children}
      </AppContext.Provider>
    </div>
  )
}

export default AppProvider