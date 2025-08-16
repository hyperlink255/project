import { useContext, useState } from "react";
import IMG from '../assets/cross_icon.svg'
import { AppContext } from "../context/AppContext";
import { toast } from 'react-hot-toast'
import { useNavigate } from "react-router-dom";
import { createAxiosInstance } from "../services/axiosInstance";

export default function PopupForm() {
  
  const { toggle, setToggle,BACKEND_URL,setUser,setToken} = useContext(AppContext)
  const axios = createAxiosInstance(BACKEND_URL)
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    image: null,
    // adminOnly : "",
    organizerOnly: ""
    

  });
  const navigate = useNavigate()
  const [SignIn, setSignIn] = useState("SignIn")

const handleChange = (e) => {
  const { name, value, files } = e.target;
  if (name === "image") {
    setFormData({ ...formData, image: files[0] });
  } else {
    setFormData({ ...formData, [name]: value });
  }
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataNew = new FormData();
    formDataNew.append('name', formData.name);
    formDataNew.append('password', formData.password);
    formDataNew.append('email', formData.email);
    formDataNew.append('image', formData.image);
    // formDataNew.append('adminOnly', formData.adminOnly);
    formDataNew.append('organizerOnly', formData.organizerOnly);


    try {
      if (SignIn === "SignIn") {
        const res = await axios.post('/api/users/register', formDataNew, {
          headers: { 'Content-Type': 'multipart/form-data' }

        }); // ✅ FIXED
        if (res.status === 201) {
          setUser(res.data.newData);
          setFormData({name:"",email:"",password:"",image:null,organizerOnly:""})
          setToken(res.data.token);
          toast.success(res.data.message);
          navigate("/");

        }
      } else {
        const res = await axios.post('/api/users/login', {
          email: formData.email,
          password: formData.password
        });
        if (res.status === 200) {
          setUser(res.data.newData);
          setToken(res.data.token);
          toast.success(res.data.message);
          navigate("/");
          setToggle(false)
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };


  return (
    <>
      <div className="flex justify-center items-center bg-gray-100">
        {toggle && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg relative">
              <button
                className="absolute top-3 cursor-pointer right-3 text-gray-600 hover:text-red-500"
                onClick={() => setToggle(false)}
              >
                <img src={IMG} alt="" />
              </button>

              <h2 className="text-2xl font-semibold mb-4 text-center">
                {SignIn === "SignIn" ? "Signup Form" : "Login Form"}
              </h2>
              <form className="space-y-4" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
                {SignIn === "SignIn" && (
                  <div>
                    <label className="block mb-1 font-medium">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <label className="block mb-1 font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label className="block mb-1 font-medium">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                {
                  SignIn === "SignIn" && (
                    <div className="flex gap-2">
                      <div className="w-1/2">
                        <label className="block mb-1 font-medium">Upload Image</label>
                        <input
                          type="file"
                          name="image"
                          accept="image/*"
                          onChange={handleChange}
                          className="w-full border rounded-lg px-3 py-2"
                        />
                      </div>
                      <div className="w-1/2">
                        <label className="block mb-1 font-medium">Admin</label>
                        <input
                          type="text"
                          name="organizerOnly"
                          value={formData.organizerOnly}
                          onChange={handleChange}
                          className="w-full border rounded-lg px-3 py-2"
                        />
                      </div>

                    </div>
                  )}

                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 cursor-pointer rounded-lg hover:bg-blue-600 transition"
                >
                  {SignIn === "SignIn" ? "Register" : "Login"}
                </button>
                <div className='w-full flex  text-sm mt-[-8px]'>
                  <p className='cursor-pointer'>Forgot your password?</p>
                  {
                    SignIn === "SignIn" ?
                      <>
                        <p onClick={() => setSignIn("SignUp")} className="text-blue-400 cursor-pointer">Create account</p>
                      </>
                      :
                      <>
                        <p onClick={() => setSignIn("SignIn")} className="text-blue-400 cursor-pointer">Login Here</p>
                      </>
                  }
                </div>

              </form>
            </div>

          </div>
        )}


      </div>
    </>

  );
}
